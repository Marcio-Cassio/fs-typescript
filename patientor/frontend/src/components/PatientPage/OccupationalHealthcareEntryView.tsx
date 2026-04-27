import { Box, Typography } from "@mui/material";
import { Work } from "@mui/icons-material";

import { OccupationalHealthcareEntry, Diagnosis } from "../../types";

interface Props {
  entry: OccupationalHealthcareEntry;
  diagnoses: Diagnosis[];
}

const OccupationalHealthcareEntryView = ({ entry, diagnoses }: Props) => {
  return (
    <Box sx={{ border: "1px solid #ccc", borderRadius: 1, padding: 1, marginBottom: 1 }}>
      <Typography>
        {entry.date} <Work /> <i>{entry.employerName}</i>
      </Typography>
      <Typography sx={{ fontStyle: "italic" }}>{entry.description}</Typography>
      {entry.diagnosisCodes && (
        <ul>
          {entry.diagnosisCodes.map((code) => {
            const diagnosis = diagnoses.find((d) => d.code === code);
            return (
              <li key={code}>
                {code} {diagnosis?.name}
              </li>
            );
          })}
        </ul>
      )}
      {entry.sickLeave && (
        <Typography>
          sick leave: {entry.sickLeave.startDate} – {entry.sickLeave.endDate}
        </Typography>
      )}
      <Typography>diagnose by {entry.specialist}</Typography>
    </Box>
  );
};

export default OccupationalHealthcareEntryView;