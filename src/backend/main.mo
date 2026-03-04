import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  var nextId = 1;

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

  module PatientCase {
    public func compareBySNo(case1 : PatientCase, case2 : PatientCase) : Order.Order {
      Nat.compare(case1.sNo, case2.sNo);
    };
  };

  let cases = Map.empty<Nat, PatientCase>();

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createCase(
    crNumber : Text,
    dateOfEnrollment : Text,
    babysName : Text,
    dateOfBirth : Text,
    sex : Text,
    gestationalAgeWeeks : Text,
    birthWeightGrams : Text,
    modeOfDelivery : Text,
    indicationCesarean : Text,
    area : Text,
    maternalRiskFactors : Text,
    clinicalFeatures : Text,
    antibioticsAtScreen : Text,
    sepsisScreensTable : Text,
    screen1Data : Text,
    screen2Data : Text,
    screen3Data : Text,
    finalDiagnosisTreatingTeam : Text,
    finalDiagnosisAdjudication : Text,
    sepsisConfirmed : Text,
    dischargeStatus : Text,
    dateOfDischargeOrDeath : Text,
    isComplete : Bool,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create cases");
    };
    if (cases.size() >= 300) {
      Runtime.trap("Max patient case limit reached! (300)");
    };
    if (Text.equal(babysName, "") or Text.equal(dateOfBirth, "")) {
      Runtime.trap("Baby's name and date of birth are required");
    };

    let patientCase : PatientCase = {
      sNo = nextId;
      crNumber;
      dateOfEnrollment;
      babysName;
      dateOfBirth;
      sex;
      gestationalAgeWeeks;
      birthWeightGrams;
      modeOfDelivery;
      indicationCesarean;
      area;
      maternalRiskFactors;
      clinicalFeatures;
      antibioticsAtScreen;
      sepsisScreensTable;
      screen1Data;
      screen2Data;
      screen3Data;
      finalDiagnosisTreatingTeam;
      finalDiagnosisAdjudication;
      sepsisConfirmed;
      dischargeStatus;
      dateOfDischargeOrDeath;
      isComplete;
    };

    cases.add(nextId, patientCase);
    nextId += 1;
    patientCase.sNo;
  };

  public shared ({ caller }) func updateCase(
    id : Nat,
    crNumber : Text,
    dateOfEnrollment : Text,
    babysName : Text,
    dateOfBirth : Text,
    sex : Text,
    gestationalAgeWeeks : Text,
    birthWeightGrams : Text,
    modeOfDelivery : Text,
    indicationCesarean : Text,
    area : Text,
    maternalRiskFactors : Text,
    clinicalFeatures : Text,
    antibioticsAtScreen : Text,
    sepsisScreensTable : Text,
    screen1Data : Text,
    screen2Data : Text,
    screen3Data : Text,
    finalDiagnosisTreatingTeam : Text,
    finalDiagnosisAdjudication : Text,
    sepsisConfirmed : Text,
    dischargeStatus : Text,
    dateOfDischargeOrDeath : Text,
    isComplete : Bool,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update cases");
    };
    if (not cases.containsKey(id)) {
      Runtime.trap("Case not found with id " # id.toText());
    };

    let updatedCase : PatientCase = {
      sNo = id;
      crNumber;
      dateOfEnrollment;
      babysName;
      dateOfBirth;
      sex;
      gestationalAgeWeeks;
      birthWeightGrams;
      modeOfDelivery;
      indicationCesarean;
      area;
      maternalRiskFactors;
      clinicalFeatures;
      antibioticsAtScreen;
      sepsisScreensTable;
      screen1Data;
      screen2Data;
      screen3Data;
      finalDiagnosisTreatingTeam;
      finalDiagnosisAdjudication;
      sepsisConfirmed;
      dischargeStatus;
      dateOfDischargeOrDeath;
      isComplete;
    };

    cases.add(id, updatedCase);
  };

  public query ({ caller }) func getCase(id : Nat) : async ?PatientCase {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cases");
    };
    cases.get(id);
  };

  public query ({ caller }) func listCases(offset : Nat, limit : Nat) : async [PatientCase] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list cases");
    };
    let totalCases = cases.size();
    if (offset >= totalCases or limit == 0) {
      return [];
    };

    let allCases = cases.values().toArray().sort(PatientCase.compareBySNo);
    let start = offset;
    let end = offset + limit;

    let actualEnd = if (end > totalCases) { totalCases } else { end };
    Array.tabulate<PatientCase>(actualEnd - start, func(i) { allCases[start + i] });
  };

  public query ({ caller }) func searchCases(queryTerm : Text) : async [PatientCase] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can search cases");
    };
    let searchTerm = queryTerm.toLower();
    cases.values().toArray().filter(
      func(c) {
        let nameMatch = c.babysName.toLower().contains(#text searchTerm);
        let sNoMatch = c.sNo.toText().contains(#text queryTerm);

        nameMatch or sNoMatch;
      }
    );
  };

  public shared ({ caller }) func deleteCase(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete cases");
    };
    if (not cases.containsKey(id)) {
      Runtime.trap("Case not found with id " # id.toText());
    };
    cases.remove(id);
  };

  public query ({ caller }) func getCaseCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view case count");
    };
    cases.size();
  };
};
