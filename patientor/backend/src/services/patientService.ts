import { v1 as uuid } from 'uuid';
import patients from '../../data/patients.ts';
import type { Patient, NonSensitivePatient, NewPatient, Entry, EntryWithoutId } from '../types.ts';

const getEntries = (): Patient[] => {
  return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    entries: [],
    ...entry,
  };

  patients.push(newPatient);
  return newPatient;
};

const findById = (id: string): Patient | undefined => {
  const patient = patients.find(p => p.id === id);
  return patient;
};

const addEntry = (patientId: string, entry: EntryWithoutId): Entry | undefined => {
  const patient = patients.find(p => p.id === patientId);
  if (!patient) {
    return undefined;
  }

  const newEntry: Entry = {
    id: uuid(),
    ...entry,
  };

  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addPatient,
  findById,
  addEntry,
};