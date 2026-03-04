import type { PatientCase } from "../backend.d";
import {
  type CRFFormState,
  defaultAntibioticAtScreen,
  defaultClinicalFeatures,
  defaultMaternalRiskFactors,
  defaultScreenData,
  defaultSepsisScreenTableRow,
} from "../types/crf";

function safeParseJSON<T>(str: string, fallback: T): T {
  try {
    if (!str || str === "{}") return fallback;
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}

export function patientCaseToFormState(c: PatientCase): CRFFormState {
  const mrf = safeParseJSON(
    c.maternalRiskFactors,
    defaultMaternalRiskFactors(),
  );
  const cf = safeParseJSON(c.clinicalFeatures, defaultClinicalFeatures());
  const abs = safeParseJSON(c.antibioticsAtScreen, [
    defaultAntibioticAtScreen(),
    defaultAntibioticAtScreen(),
    defaultAntibioticAtScreen(),
  ]);
  const sst = safeParseJSON(c.sepsisScreensTable, [
    defaultSepsisScreenTableRow(1),
    defaultSepsisScreenTableRow(2),
    defaultSepsisScreenTableRow(3),
  ]);
  const s1 = safeParseJSON(c.screen1Data, defaultScreenData());
  const s2 = safeParseJSON(c.screen2Data, defaultScreenData());
  const s3 = safeParseJSON(c.screen3Data, defaultScreenData());

  return {
    crNumber: c.crNumber,
    dateOfEnrollment: c.dateOfEnrollment,
    babysName: c.babysName,
    dateOfBirth: c.dateOfBirth,
    sex: c.sex,
    gestationalAgeWeeks: c.gestationalAgeWeeks,
    birthWeightGrams: c.birthWeightGrams,
    modeOfDelivery: c.modeOfDelivery,
    indicationCesarean: c.indicationCesarean,
    area: c.area,
    maternalRiskFactors: mrf,
    clinicalFeatures: cf,
    antibioticsAtScreen: abs,
    sepsisScreensTable: sst,
    screen1Data: s1,
    screen2Data: s2,
    screen3Data: s3,
    finalDiagnosisTreatingTeam: c.finalDiagnosisTreatingTeam,
    finalDiagnosisAdjudication: c.finalDiagnosisAdjudication,
    sepsisConfirmed: c.sepsisConfirmed,
    dischargeStatus: c.dischargeStatus,
    dateOfDischargeOrDeath: c.dateOfDischargeOrDeath,
  };
}

export function formStateToPatientCase(
  form: CRFFormState,
  sNo: bigint,
  isComplete: boolean,
): PatientCase {
  return {
    sNo,
    crNumber: form.crNumber,
    dateOfEnrollment: form.dateOfEnrollment,
    babysName: form.babysName,
    dateOfBirth: form.dateOfBirth,
    sex: form.sex,
    gestationalAgeWeeks: form.gestationalAgeWeeks,
    birthWeightGrams: form.birthWeightGrams,
    modeOfDelivery: form.modeOfDelivery,
    indicationCesarean: form.indicationCesarean,
    area: form.area,
    maternalRiskFactors: JSON.stringify(form.maternalRiskFactors),
    clinicalFeatures: JSON.stringify(form.clinicalFeatures),
    antibioticsAtScreen: JSON.stringify(form.antibioticsAtScreen),
    sepsisScreensTable: JSON.stringify(form.sepsisScreensTable),
    screen1Data: JSON.stringify(form.screen1Data),
    screen2Data: JSON.stringify(form.screen2Data),
    screen3Data: JSON.stringify(form.screen3Data),
    finalDiagnosisTreatingTeam: form.finalDiagnosisTreatingTeam,
    finalDiagnosisAdjudication: form.finalDiagnosisAdjudication,
    sepsisConfirmed: form.sepsisConfirmed,
    dischargeStatus: form.dischargeStatus,
    dateOfDischargeOrDeath: form.dateOfDischargeOrDeath,
    isComplete,
  };
}
