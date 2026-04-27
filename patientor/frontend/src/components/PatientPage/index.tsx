import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import { Male, Female, Transgender } from "@mui/icons-material";
import axios from "axios";

import EntryDetails from "./EntryDetails";
import AddEntryForm from "./AddEntryForm";

import { Patient, Gender, Diagnosis, EntryWithoutId } from "../../types";
import patientService from "../../services/patients";

interface Props {
  diagnoses: Diagnosis[];
}

const PatientPage = ({ diagnoses }: Props) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const { id } = useParams<{ id: string }>();

  const [error, setError] = useState<string | undefined>();

  const [formVisible, setFormVisible] = useState<boolean>(false);

  const submitNewEntry = async (entry: EntryWithoutId) => {
    if (!id || !patient) return;

    try {
      const newEntry = await patientService.addEntry(id, entry);
      setPatient({ ...patient, entries: patient.entries.concat(newEntry) });
      setError(undefined);
      setFormVisible(false);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const data = e.response?.data;
        if (data && typeof data === "object" && "error" in data && Array.isArray(data.error)) {
          const messages = data.error
            .map((issue: { path?: (string | number)[]; message?: string }) => {
              const field = issue.path?.join(".") ?? "";
              return field ? `${field}: ${issue.message}` : issue.message;
            })
            .join(" • ");
          setError(messages);
        } else {
          setError(typeof data === "string" ? data : "Unrecognized axios error");
        }
      } else {
        setError("Unknown error");
      }
    }
  };

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const fetchedPatient = await patientService.getById(id);
        setPatient(fetchedPatient);
      }
    };
    void fetchPatient();
  }, [id]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  const genderIcon = () => {
    switch (patient.gender) {
      case Gender.Male:
        return <Male />;
      case Gender.Female:
        return <Female />;
      default:
        return <Transgender />;
    }
  };

 return (
  <div>
    <Typography variant="h5" sx={{ marginTop: "0.5em" }}>
      {patient.name} {genderIcon()}
    </Typography>
    <div>ssn: {patient.ssn}</div>
    <div>occupation: {patient.occupation}</div>

    <Typography variant="h6" sx={{ marginTop: "1em" }}>
      entries
    </Typography>
    {patient.entries.map((entry) => (
      <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
    ))}
    {formVisible ? (
      <AddEntryForm onSubmit={submitNewEntry} error={error} diagnoses={diagnoses} />
    ) : (
      <Button
        variant="contained"
        sx={{ marginTop: 2 }}
        onClick={() => setFormVisible(true)}
      >
        Add New Entry
      </Button>
    )}
  </div>
 );
};

export default PatientPage;