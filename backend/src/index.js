import 'dotenv/config';
import cors from 'cors';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'roots-api' });
});

app.listen(PORT, () => {
  console.log(`Roots API listening on http://localhost:${PORT}`);
});
