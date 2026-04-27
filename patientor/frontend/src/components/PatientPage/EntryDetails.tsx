import { Entry, Diagnosis } from "../../types";
import { assertNever } from "../../utils";

import HospitalEntryView from "./HospitalEntryView";
import OccupationalHealthcareEntryView from "./OccupationalHealthcareEntryView";
import HealthCheckEntryView from "./HealthCheckEntryView";

interface Props {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const EntryDetails = ({ entry, diagnoses }: Props) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntryView entry={entry} diagnoses={diagnoses} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntryView entry={entry} diagnoses={diagnoses} />;
    case "HealthCheck":
      return <HealthCheckEntryView entry={entry} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;