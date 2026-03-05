// ── JSON-serialized field types ─────────────────────────────

export type PresentAbsent = "Present" | "Absent" | "";

export interface MaternalRiskFactors {
  maternalFever: PresentAbsent;
  foulSmellingLiquor: PresentAbsent;
  meconiumStainedLiquor: PresentAbsent;
  promOver18Hours: PresentAbsent;
  prolongedLabor: PresentAbsent;
  suspectedChorioamnionitis: PresentAbsent;
  maternalAntibiotics: PresentAbsent;
}

export interface ClinicalFeaturesData {
  lethargyPoorActivity: PresentAbsent;
  temperatureInstability: PresentAbsent;
  feedingIntolerance: PresentAbsent;
  respiratoryDistress: PresentAbsent;
  apneaOrSeizures: PresentAbsent;
  others1: PresentAbsent;
  others2: PresentAbsent;
  othersText1: string;
  othersText2: string;
}

export interface AntibioticAtScreen {
  antibioticName: string;
  startDate: string;
  noAntibiotic: boolean;
}

export interface SepsisScreenTableRow {
  screenNo: number;
  date: string;
  testsListed: string;
  indication: string;
  bloodCultureSent: "Yes" | "No" | "";
  adjudicatorsOpinion: string;
  adjudicator1Opinion: string;
  adjudicator2Opinion: string;
  adjudicator3Opinion: string;
}

export interface ScreenParameter {
  value: string;
  treatingTeamInterpretation: "Positive" | "Negative" | "";
  investigatorsInterpretation: "Positive" | "Negative" | "";
}

export interface AntibioticDuration {
  antibioticName: string;
  startDate: string;
  stopDate: string;
  duration: string;
  reason: string;
}

export interface ScreenData {
  date: string;
  anc: ScreenParameter;
  crp: ScreenParameter;
  procal: ScreenParameter;
  bloodCulture: ScreenParameter;
  antibioticsDecision: string;
  antibioticDurations: AntibioticDuration[];
  clinicalCourse: string;
}

// ── Default factories ───────────────────────────────────────

export function defaultMaternalRiskFactors(): MaternalRiskFactors {
  return {
    maternalFever: "",
    foulSmellingLiquor: "",
    meconiumStainedLiquor: "",
    promOver18Hours: "",
    prolongedLabor: "",
    suspectedChorioamnionitis: "",
    maternalAntibiotics: "",
  };
}

export function defaultClinicalFeatures(): ClinicalFeaturesData {
  return {
    lethargyPoorActivity: "",
    temperatureInstability: "",
    feedingIntolerance: "",
    respiratoryDistress: "",
    apneaOrSeizures: "",
    others1: "",
    others2: "",
    othersText1: "",
    othersText2: "",
  };
}

export function defaultAntibioticAtScreen(): AntibioticAtScreen {
  return { antibioticName: "", startDate: "", noAntibiotic: false };
}

export function defaultSepsisScreenTableRow(n: number): SepsisScreenTableRow {
  return {
    screenNo: n,
    date: "",
    testsListed: "",
    indication: "",
    bloodCultureSent: "",
    adjudicatorsOpinion: "",
    adjudicator1Opinion: "",
    adjudicator2Opinion: "",
    adjudicator3Opinion: "",
  };
}

export function defaultScreenParameter(): ScreenParameter {
  return {
    value: "",
    treatingTeamInterpretation: "",
    investigatorsInterpretation: "",
  };
}

export function defaultAntibioticDuration(): AntibioticDuration {
  return {
    antibioticName: "",
    startDate: "",
    stopDate: "",
    duration: "",
    reason: "",
  };
}

export function defaultScreenData(): ScreenData {
  return {
    date: "",
    anc: defaultScreenParameter(),
    crp: defaultScreenParameter(),
    procal: defaultScreenParameter(),
    bloodCulture: defaultScreenParameter(),
    antibioticsDecision: "",
    antibioticDurations: [
      defaultAntibioticDuration(),
      defaultAntibioticDuration(),
      defaultAntibioticDuration(),
    ],
    clinicalCourse: "",
  };
}

// ── Flat form state ─────────────────────────────────────────

export interface CRFFormState {
  // Section A
  crNumber: string;
  dateOfEnrollment: string;
  babysName: string;
  dateOfBirth: string;
  sex: string;
  gestationalAgeWeeks: string;
  birthWeightGrams: string;
  modeOfDelivery: string;
  indicationCesarean: string;
  area: string;
  // Section B
  maternalRiskFactors: MaternalRiskFactors;
  // Section C
  clinicalFeatures: ClinicalFeaturesData;
  antibioticsAtScreen: AntibioticAtScreen[];
  // Section D
  sepsisScreensTable: SepsisScreenTableRow[];
  screen1Data: ScreenData;
  screen2Data: ScreenData;
  screen3Data: ScreenData;
  // Section E
  finalDiagnosisTreatingTeam: string;
  finalDiagnosisAdjudication: string;
  sepsisConfirmed: string;
  dischargeStatus: string;
  dateOfDischargeOrDeath: string;
}

export function defaultCRFFormState(): CRFFormState {
  return {
    crNumber: "",
    dateOfEnrollment: "",
    babysName: "",
    dateOfBirth: "",
    sex: "",
    gestationalAgeWeeks: "",
    birthWeightGrams: "",
    modeOfDelivery: "",
    indicationCesarean: "",
    area: "NICU",
    maternalRiskFactors: defaultMaternalRiskFactors(),
    clinicalFeatures: defaultClinicalFeatures(),
    antibioticsAtScreen: [
      defaultAntibioticAtScreen(),
      defaultAntibioticAtScreen(),
      defaultAntibioticAtScreen(),
    ],
    sepsisScreensTable: [
      defaultSepsisScreenTableRow(1),
      defaultSepsisScreenTableRow(2),
      defaultSepsisScreenTableRow(3),
    ],
    screen1Data: defaultScreenData(),
    screen2Data: defaultScreenData(),
    screen3Data: defaultScreenData(),
    finalDiagnosisTreatingTeam: "",
    finalDiagnosisAdjudication: "",
    sepsisConfirmed: "",
    dischargeStatus: "",
    dateOfDischargeOrDeath: "",
  };
}
