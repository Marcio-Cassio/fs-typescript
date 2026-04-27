import { useState, type SyntheticEvent } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";

import { EntryWithoutId, HealthCheckRating, Diagnosis } from "../../types";

interface Props {
  onSubmit: (entry: EntryWithoutId) => Promise<void>;
  error?: string;
  diagnoses: Diagnosis[];
}

type EntryType = "HealthCheck" | "Hospital" | "OccupationalHealthcare";

const AddEntryForm = ({ onSubmit, error, diagnoses }: Props) => {
  const [entryType, setEntryType] = useState<EntryType>("HealthCheck");

  // shared fields
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  // HealthCheck
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(
    HealthCheckRating.Healthy
  );

  // Hospital
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");

  // OccupationalHealthcare
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState("");

  const handleDiagnosisCodesChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setDiagnosisCodes(typeof value === "string" ? value.split(",") : value);
  };

  const buildEntry = (): EntryWithoutId => {
    const base = {
      description,
      date,
      specialist,
      diagnosisCodes: diagnosisCodes.length > 0 ? diagnosisCodes : undefined,
    };

    switch (entryType) {
      case "HealthCheck":
        return {
          ...base,
          type: "HealthCheck",
          healthCheckRating,
        };
      case "Hospital":
        return {
          ...base,
          type: "Hospital",
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria,
          },
        };
      case "OccupationalHealthcare":
        return {
          ...base,
          type: "OccupationalHealthcare",
          employerName,
          sickLeave:
            sickLeaveStart || sickLeaveEnd
              ? { startDate: sickLeaveStart, endDate: sickLeaveEnd }
              : undefined,
        };
    }
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    void onSubmit(buildEntry());
  };

  return (
    <Box sx={{ border: "1px dashed #888", borderRadius: 1, padding: 2, marginTop: 2 }}>
      <Typography variant="h6">New entry</Typography>

      {error && (
        <Typography sx={{ color: "red", marginY: 1 }}>{error}</Typography>
      )}

      <form onSubmit={handleSubmit}>
        <InputLabel sx={{ marginTop: 1 }}>Entry type</InputLabel>
        <Select
          fullWidth
          value={entryType}
          onChange={(e) => setEntryType(e.target.value as EntryType)}
          sx={{ marginBottom: 1 }}
        >
          <MenuItem value="HealthCheck">HealthCheck</MenuItem>
          <MenuItem value="Hospital">Hospital</MenuItem>
          <MenuItem value="OccupationalHealthcare">OccupationalHealthcare</MenuItem>
        </Select>

        <TextField
          label="Description"
          fullWidth
          margin="dense"
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />

        <TextField
          label="Date"
          type="date"
          fullWidth
          margin="dense"
          value={date}
          onChange={({ target }) => setDate(target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <TextField
          label="Specialist"
          fullWidth
          margin="dense"
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />

        <InputLabel sx={{ marginTop: 1 }}>Diagnosis codes</InputLabel>
        <Select
          multiple
          fullWidth
          value={diagnosisCodes}
          onChange={handleDiagnosisCodesChange}
          input={<OutlinedInput label="Diagnosis codes" />}
          renderValue={(selected) => selected.join(", ")}
        >
          {diagnoses.map((d) => (
            <MenuItem key={d.code} value={d.code}>
              <Checkbox checked={diagnosisCodes.includes(d.code)} />
              <ListItemText primary={`${d.code} ${d.name}`} />
            </MenuItem>
          ))}
        </Select>

        {entryType === "HealthCheck" && (
          <>
            <InputLabel sx={{ marginTop: 1 }}>Health check rating</InputLabel>
            <Select
              fullWidth
              value={healthCheckRating}
              onChange={(e) =>
                setHealthCheckRating(Number(e.target.value) as HealthCheckRating)
              }
            >
              <MenuItem value={HealthCheckRating.Healthy}>Healthy (0)</MenuItem>
              <MenuItem value={HealthCheckRating.LowRisk}>LowRisk (1)</MenuItem>
              <MenuItem value={HealthCheckRating.HighRisk}>HighRisk (2)</MenuItem>
              <MenuItem value={HealthCheckRating.CriticalRisk}>CriticalRisk (3)</MenuItem>
            </Select>
          </>
        )}

        {entryType === "Hospital" && (
          <>
            <InputLabel sx={{ marginTop: 1 }}>Discharge date</InputLabel>
            <TextField
              type="date"
              fullWidth
              margin="dense"
              value={dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
            />
            <TextField
              label="Discharge criteria"
              fullWidth
              margin="dense"
              value={dischargeCriteria}
              onChange={({ target }) => setDischargeCriteria(target.value)}
            />
          </>
        )}

        {entryType === "OccupationalHealthcare" && (
          <>
            <TextField
              label="Employer name"
              fullWidth
              margin="dense"
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
            />
            <InputLabel sx={{ marginTop: 1 }}>Sick leave start</InputLabel>
            <TextField
              type="date"
              fullWidth
              margin="dense"
              value={sickLeaveStart}
              onChange={({ target }) => setSickLeaveStart(target.value)}
            />
            <InputLabel sx={{ marginTop: 1 }}>Sick leave end</InputLabel>
            <TextField
              type="date"
              fullWidth
              margin="dense"
              value={sickLeaveEnd}
              onChange={({ target }) => setSickLeaveEnd(target.value)}
            />
          </>
        )}

        <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
          Add
        </Button>
      </form>
    </Box>
  );
};

export default AddEntryForm;