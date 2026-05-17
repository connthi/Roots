import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import authRouter from './routes/auth.js';
import quizRouter from './routes/quiz.js';
import analyzeRouter from './routes/analyze.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'roots-api' });
});

app.use('/api/auth', authRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/analyze', analyzeRouter);

app.listen(PORT, () => {
  console.log(`Roots API listening on http://localhost:${PORT}`);
});
