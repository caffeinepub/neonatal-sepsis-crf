import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PatientCase } from "../backend.d";
import { useActor } from "./useActor";

export function useGetCaseCount() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["caseCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getCaseCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListCases(offset: number, limit: number) {
  const { actor, isFetching } = useActor();
  return useQuery<PatientCase[]>({
    queryKey: ["cases", offset, limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCases(BigInt(offset), BigInt(limit));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchCases(query: string) {
  const { actor, isFetching } = useActor();
  return useQuery<PatientCase[]>({
    queryKey: ["cases", "search", query],
    queryFn: async () => {
      if (!actor || !query.trim()) return [];
      return actor.searchCases(query);
    },
    enabled: !!actor && !isFetching && query.trim().length > 0,
  });
}

export function useGetCase(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<PatientCase | null>({
    queryKey: ["case", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getCase(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreateCase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<PatientCase, "sNo">) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createCase(
        data.crNumber,
        data.dateOfEnrollment,
        data.babysName,
        data.dateOfBirth,
        data.sex,
        data.gestationalAgeWeeks,
        data.birthWeightGrams,
        data.modeOfDelivery,
        data.indicationCesarean,
        data.area,
        data.maternalRiskFactors,
        data.clinicalFeatures,
        data.antibioticsAtScreen,
        data.sepsisScreensTable,
        data.screen1Data,
        data.screen2Data,
        data.screen3Data,
        data.finalDiagnosisTreatingTeam,
        data.finalDiagnosisAdjudication,
        data.sepsisConfirmed,
        data.dischargeStatus,
        data.dateOfDischargeOrDeath,
        data.isComplete,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      queryClient.invalidateQueries({ queryKey: ["caseCount"] });
    },
  });
}

export function useUpdateCase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: PatientCase) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateCase(
        data.sNo,
        data.crNumber,
        data.dateOfEnrollment,
        data.babysName,
        data.dateOfBirth,
        data.sex,
        data.gestationalAgeWeeks,
        data.birthWeightGrams,
        data.modeOfDelivery,
        data.indicationCesarean,
        data.area,
        data.maternalRiskFactors,
        data.clinicalFeatures,
        data.antibioticsAtScreen,
        data.sepsisScreensTable,
        data.screen1Data,
        data.screen2Data,
        data.screen3Data,
        data.finalDiagnosisTreatingTeam,
        data.finalDiagnosisAdjudication,
        data.sepsisConfirmed,
        data.dischargeStatus,
        data.dateOfDischargeOrDeath,
        data.isComplete,
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      queryClient.invalidateQueries({
        queryKey: ["case", variables.sNo.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["caseCount"] });
    },
  });
}

export function useDeleteCase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteCase(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      queryClient.invalidateQueries({ queryKey: ["caseCount"] });
    },
  });
}
