import express, { type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import patientService from '../services/patientService.ts';
import { NewPatientSchema, NewEntrySchema } from '../types.ts';
import type { NewPatient, Patient, NonSensitivePatient, Entry, EntryWithoutId } from '../types.ts';

const router = express.Router();

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
  res.send(patientService.getNonSensitiveEntries());
});

router.get('/:id', (req: Request<{ id: string }>, res: Response<Patient>) => {
  const patient = patientService.findById(req.params.id);
  if (patient) {
    res.send(patient);
  } else {
    res.status(404).end();
  }
});

router.post(
  '/',
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const addedPatient = patientService.addPatient(req.body);
    res.json(addedPatient);
  }
);

router.post(
  '/:id/entries',
  newEntryParser,
  (req: Request<{ id: string }, unknown, EntryWithoutId>, res: Response<Entry>) => {
    const newEntry = patientService.addEntry(req.params.id, req.body);
    if (newEntry) {
      res.json(newEntry);
    } else {
      res.status(404).end();
    }
  }
);

router.use(errorMiddleware);

export default router;