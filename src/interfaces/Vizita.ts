export interface Vizita {
  vizita_id: string;
  companie_id: string;
  efectuata: boolean;
  data_emitere_initiala: string; // format: YYYY-MM-DD
  data_limita: string; // format: YYYY-MM-DD
  data_efectuare: string; // format: YYYY-MM-DD
  vizita_tip: string;
  adaugata_de: string;
  angajat_responsabil: string;
  observatii: string;
  raport: string;
  vizualizat_receptor: boolean;
  formular_valori: FormularValori;
  gama_promovata: GamaPromovata;
  locatie_verificata: boolean;
  locatie_valoare: string | null;
  AngajatResponsabil: {
    angajat_denumire: string;
  };
  Companie: {
    companie_denumire: string;
    companie_adresa_livrare: string;
    companie_numar_telefon: string | null;
    Nisa: {
      nisa_denumire: string;
    };
    PunctDeLucru: {
      punct_lucru_nume: string;
    };
  };
  TipVizita: {
    nume_tip_vizita: string;
  };
  AdaugatDe: {
    angajat_denumire: string;
  };
}

export interface FormularValori {
  lead: boolean;
  oferta: boolean;
  comanda: boolean;
  incasare: boolean;
  negociere: boolean;
  lipsa_interes: boolean;
  livrare_marfa: boolean;
}

export interface GamaPromovata {
  FULII: boolean;
  CUPLAJE: boolean;
  RULMENTI: boolean;
  REDUCTOARE: boolean;
  "ALTE PRODUSE": boolean;
  "LANTURI GALL": boolean;
  MOTOREDUCTOARE: boolean;
  "TEHNICA LINIARA": boolean;
  "MOTOARE ELECTRICE": boolean;
  "BENZI TRANSPORTOARE": boolean;
  "LAGARE DE ALUNECARE": boolean;
  "CURELE DE TRANSMISIE": boolean;
  "ELEMENTE DE ETANSARE": boolean;
  "MENTENANTA: HIDRAULICA": boolean;
  "MENTENANTA: PNEUMATICA": boolean;
  "RULMENTI+COMPONENTE LAGARE": boolean;
  "LAGARE ASAMBLATE CU RULMENTI": boolean;
  "RULMENTI+COMPONENTE RULMENTI": boolean;
  "SERVICII DE MENTENANTA PROPRII": boolean;
  "SERVICII DE MENTENANTA CU TERTI": boolean;
  "MENTENANTA: ALTE PRODUSE DE MENTENANTA": boolean;
  "MENTENANTA: LUBRIFIANTI SI SISTEME DE UNGERE": boolean;
  "MENTENANTA: ECHIPAMENTE DE PROTECTIE SI LUCRU": boolean;
  "MENTENANTA: INSTRUMENTE SI SCULE PENTRU MONTARE/DEMONTARE": boolean;
  "MENTENANTA: ECHIPAMENTE ELECTRICE, ELECTRONICE SI DE AUTOMATIZARI": boolean;
  "MENTENANTA: INSTRUMENTE PENTRU MONITORIZAREA CONDITIEI DE FUNCTIONARE": boolean;
  "MENTENANTA: INSTRUMENTE PENTRU ALINIERI DE ARBORI SI MASURATORI GEOMETRICE": boolean;
  "MENTENANTA: ADEZIVI, ETANSANTI SPECIALI, SPRAY-URI TEHNICE, PASTE DE ASAMBLARE": boolean;
}
