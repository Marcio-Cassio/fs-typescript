import { Box, Typography } from "@mui/material";
import { MedicalServices, Favorite } from "@mui/icons-material";

import { HealthCheckEntry, HealthCheckRating } from "../../types";

interface Props {
  entry: HealthCheckEntry;
}

const ratingColor = (rating: HealthCheckRating): string => {
  switch (rating) {
    case HealthCheckRating.Healthy:
      return "green";
    case HealthCheckRating.LowRisk:
      return "yellow";
    case HealthCheckRating.HighRisk:
      return "orange";
    case HealthCheckRating.CriticalRisk:
      return "red";
  }
};

const HealthCheckEntryView = ({ entry }: Props) => {
  return (
    <Box sx={{ border: "1px solid #ccc", borderRadius: 1, padding: 1, marginBottom: 1 }}>
      <Typography>
        {entry.date} <MedicalServices />
      </Typography>
      <Typography sx={{ fontStyle: "italic" }}>{entry.description}</Typography>
      <Favorite sx={{ color: ratingColor(entry.healthCheckRating) }} />
      <Typography>diagnose by {entry.specialist}</Typography>
    </Box>
  );
};

export default HealthCheckEntryView;