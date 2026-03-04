import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PatientCase {
    sNo: bigint;
    sex: string;
    birthWeightGrams: string;
    screen2Data: string;
    babysName: string;
    sepsisScreensTable: string;
    dateOfBirth: string;
    dateOfEnrollment: string;
    area: string;
    clinicalFeatures: string;
    gestationalAgeWeeks: string;
    sepsisConfirmed: string;
    crNumber: string;
    maternalRiskFactors: string;
    screen1Data: string;
    modeOfDelivery: string;
    antibioticsAtScreen: string;
    dischargeStatus: string;
    indicationCesarean: string;
    dateOfDischargeOrDeath: string;
    screen3Data: string;
    finalDiagnosisAdjudication: string;
    finalDiagnosisTreatingTeam: string;
    isComplete: boolean;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCase(crNumber: string, dateOfEnrollment: string, babysName: string, dateOfBirth: string, sex: string, gestationalAgeWeeks: string, birthWeightGrams: string, modeOfDelivery: string, indicationCesarean: string, area: string, maternalRiskFactors: string, clinicalFeatures: string, antibioticsAtScreen: string, sepsisScreensTable: string, screen1Data: string, screen2Data: string, screen3Data: string, finalDiagnosisTreatingTeam: string, finalDiagnosisAdjudication: string, sepsisConfirmed: string, dischargeStatus: string, dateOfDischargeOrDeath: string, isComplete: boolean): Promise<bigint>;
    deleteCase(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCase(id: bigint): Promise<PatientCase | null>;
    getCaseCount(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listCases(offset: bigint, limit: bigint): Promise<Array<PatientCase>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchCases(queryTerm: string): Promise<Array<PatientCase>>;
    updateCase(id: bigint, crNumber: string, dateOfEnrollment: string, babysName: string, dateOfBirth: string, sex: string, gestationalAgeWeeks: string, birthWeightGrams: string, modeOfDelivery: string, indicationCesarean: string, area: string, maternalRiskFactors: string, clinicalFeatures: string, antibioticsAtScreen: string, sepsisScreensTable: string, screen1Data: string, screen2Data: string, screen3Data: string, finalDiagnosisTreatingTeam: string, finalDiagnosisAdjudication: string, sepsisConfirmed: string, dischargeStatus: string, dateOfDischargeOrDeath: string, isComplete: boolean): Promise<void>;
}
