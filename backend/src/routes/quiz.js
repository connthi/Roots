import { Router } from 'express';
import { scorePersonality } from '../services/personalityScore.js';

const router = Router();

router.post('/score', (req, res) => {
  try {
    const { answers } = req.body;
    const result = scorePersonality(answers);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
