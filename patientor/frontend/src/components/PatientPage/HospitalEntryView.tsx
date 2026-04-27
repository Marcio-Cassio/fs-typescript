import { Box, Typography } from "@mui/material";
import { LocalHospital } from "@mui/icons-material";

import { HospitalEntry, Diagnosis } from "../../types";

interface Props {
  entry: HospitalEntry;
  diagnoses: Diagnosis[];
}

const HospitalEntryView = ({ entry, diagnoses }: Props) => {
  return (
    <Box sx={{ border: "1px solid #ccc", borderRadius: 1, padding: 1, marginBottom: 1 }}>
      <Typography>
        {entry.date} <LocalHospital />
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
      <Typography>
        discharge {entry.discharge.date}: {entry.discharge.criteria}
      </Typography>
      <Typography>diagnose by {entry.specialist}</Typography>
    </Box>
  );
};

export default HospitalEntryView;