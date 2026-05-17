import { Router } from 'express';
import bcrypt from 'bcryptjs';
import {
  createUser,
  findUserByEmail,
  findUserById,
  getProgress,
  setProgress,
} from '../db/store.js';
import { requireAuth, signToken } from '../middleware/auth.js';

const router = Router();

function parseProfile(row) {
  if (!row) return { onboarding_step: 'none', profile: {} };
  try {
    return {
      onboarding_step: row.onboarding_step,
      profile: JSON.parse(row.profile_json || '{}'),
      updated_at: row.updated_at,
    };
  } catch {
    return { onboarding_step: row.onboarding_step, profile: {} };
  }
}

function userResponse(user, progressRow) {
  const { onboarding_step, profile } = parseProfile(progressRow);
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: user.created_at,
    },
    onboarding_step,
    profile,
  };
}

router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email?.trim() || !password || !name?.trim()) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    if (findUserByEmail(email)) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const user = createUser({ email, password_hash, name });
    const token = signToken(user);

    res.status(201).json({
      token,
      ...userResponse(user, getProgress(user.id)),
    });
  } catch (err) {
    console.error('[auth/signup]', err);
    if (err.message === 'EMAIL_EXISTS') {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    res.status(500).json({ error: 'Could not create account' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const safeUser = findUserById(user.id);
    const progress = getProgress(user.id);
    const token = signToken(safeUser);

    res.json({
      token,
      ...userResponse(safeUser, progress),
    });
  } catch (err) {
    console.error('[auth/login]', err);
    res.status(500).json({ error: 'Could not log in' });
  }
});

router.get('/me', requireAuth, (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const progress = getProgress(req.user.id);
  res.json(userResponse(user, progress));
});

router.patch('/progress', requireAuth, (req, res) => {
  try {
    const { onboarding_step, profile } = req.body;
    const allowed = ['none', 'personality', 'deep_dive', 'complete'];
    const step = allowed.includes(onboarding_step) ? onboarding_step : 'none';

    const row = setProgress(req.user.id, step, profile ?? {});
    res.json(parseProfile(row));
  } catch (err) {
    console.error('[auth/progress]', err);
    res.status(500).json({ error: 'Could not save progress' });
  }
});

export default router;
