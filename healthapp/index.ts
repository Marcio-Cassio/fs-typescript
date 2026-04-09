import express from 'express';
import type { Request, Response } from 'express';
import { calculateBmi } from './bmiCalculator.ts';
import { calculateExercises } from './exerciseCalculator.ts';

const app = express();
app.use(express.json());

app.get('/hello', (_req: Request, res: Response) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req: Request, res: Response) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight)) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  res.json({ weight, height, bmi: calculateBmi(height, weight) });
});

app.post('/exercises', (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    res.status(400).json({ error: 'parameters missing' });
    return;
  }

  if (!Array.isArray(daily_exercises) || isNaN(Number(target))) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (daily_exercises.some((h: any) => isNaN(Number(h)))) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = calculateExercises(daily_exercises.map((h: any) => Number(h)), Number(target));
  res.json(result);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});