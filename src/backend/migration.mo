import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  public type PatientCase = {
    sNo : Nat;
    crNumber : Text;
    dateOfEnrollment : Text;
    babysName : Text;
    dateOfBirth : Text;
    sex : Text;
    gestationalAgeWeeks : Text;
    birthWeightGrams : Text;
    modeOfDelivery : Text;
    indicationCesarean : Text;
    area : Text;
    maternalRiskFactors : Text;
    clinicalFeatures : Text;
    antibioticsAtScreen : Text;
    sepsisScreensTable : Text;
    screen1Data : Text;
    screen2Data : Text;
    screen3Data : Text;
    finalDiagnosisTreatingTeam : Text;
    finalDiagnosisAdjudication : Text;
    sepsisConfirmed : Text;
    dischargeStatus : Text;
    dateOfDischargeOrDeath : Text;
    isComplete : Bool;
  };

  public type UserProfile = {
    name : Text;
  };

  public type OldActor = {
    cases : Map.Map<Nat, PatientCase>;
    userProfiles : Map.Map<Principal, UserProfile>;
    nextId : Nat;
  };

  public type NewActor = {
    cases : Map.Map<Nat, PatientCase>;
    userProfiles : Map.Map<Principal, UserProfile>;
    nextSNo : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      cases = old.cases;
      userProfiles = old.userProfiles;
      nextSNo = old.nextId;
    };
  };
};
