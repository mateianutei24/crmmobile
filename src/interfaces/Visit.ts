interface VisitScreen {
  visit_id : string;
  companie: string;
  tip_vizita: string;
  efectuata: boolean; // e.g. "egal cu"
  data_limita: string;
  locatie_verificata: boolean;
  locatie:string | null;

}

export default VisitScreen