interface FilterCondition {
  column: string;
  objectId: string;
  operation: string; // e.g. "egal cu"
  joinKey: String[] | null;
  value: string | number | boolean | null; // depending on your use case
  type: "text" | "number" | "date" | "boolean" | string;
  error: boolean;
  helperText: string;
}

export default FilterCondition