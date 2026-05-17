import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const storePath = process.env.DATABASE_PATH
  ? path.resolve(process.env.DATABASE_PATH)
  : path.join(__dirname, '../../data/store.json');

function defaultStore() {
  return { users: [], progress: {} };
}

function readStore() {
  try {
    if (!fs.existsSync(storePath)) return defaultStore();
    return { ...defaultStore(), ...JSON.parse(fs.readFileSync(storePath, 'utf8')) };
  } catch {
    return defaultStore();
  }
}

function writeStore(data) {
  fs.mkdirSync(path.dirname(storePath), { recursive: true });
  fs.writeFileSync(storePath, JSON.stringify(data, null, 2), 'utf8');
}

export function findUserByEmail(email) {
  const store = readStore();
  const normalized = email.trim().toLowerCase();
  return store.users.find((u) => u.email === normalized) ?? null;
}

export function findUserById(id) {
  const store = readStore();
  const user = store.users.find((u) => u.id === id);
  if (!user) return null;
  const { password_hash, ...safe } = user;
  return safe;
}

export function createUser({ email, password_hash, name }) {
  const store = readStore();
  const normalized = email.trim().toLowerCase();
  if (store.users.some((u) => u.email === normalized)) {
    throw new Error('EMAIL_EXISTS');
  }
  const user = {
    id: store.users.length ? Math.max(...store.users.map((u) => u.id)) + 1 : 1,
    email: normalized,
    password_hash,
    name: name.trim(),
    created_at: new Date().toISOString(),
  };
  store.users.push(user);
  store.progress[user.id] = {
    onboarding_step: 'none',
    profile_json: '{}',
    updated_at: user.created_at,
  };
  writeStore(store);
  const { password_hash: _, ...safe } = user;
  return safe;
}

export function getProgress(userId) {
  const store = readStore();
  return store.progress[userId] ?? null;
}

export function setProgress(userId, onboarding_step, profile) {
  const store = readStore();
  store.progress[userId] = {
    onboarding_step,
    profile_json: JSON.stringify(profile ?? {}),
    updated_at: new Date().toISOString(),
  };
  writeStore(store);
  return store.progress[userId];
}
