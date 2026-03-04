import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Save,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useCreateCase,
  useGetCase,
  useGetCaseCount,
  useUpdateCase,
} from "../hooks/useQueries";
import {
  type CRFFormState,
  type PresentAbsent,
  defaultCRFFormState,
} from "../types/crf";
import {
  formStateToPatientCase,
  patientCaseToFormState,
} from "../utils/crfSerialize";

const SECTIONS = [
  "A: Demographics",
  "B: Maternal Risk",
  "C: Clinical",
  "D: Screens",
  "E: Outcome",
];

interface CRFFormProps {
  caseId: bigint | null;
  onBack: () => void;
  onSaved: () => void;
}

export function CRFForm({ caseId, onBack, onSaved }: CRFFormProps) {
  const isNew = caseId === null;
  const [activeSection, setActiveSection] = useState(0);
  const [form, setForm] = useState<CRFFormState>(defaultCRFFormState());
  const [initialized, setInitialized] = useState(false);

  const { data: existingCase, isLoading: caseLoading } = useGetCase(caseId);
  const { data: caseCount = BigInt(0) } = useGetCaseCount();
  const createMutation = useCreateCase();
  const updateMutation = useUpdateCase();

  // Initialize form
  useEffect(() => {
    if (isNew && !initialized) {
      setForm(defaultCRFFormState());
      setInitialized(true);
    } else if (!isNew && existingCase && !initialized) {
      setForm(patientCaseToFormState(existingCase));
      setInitialized(true);
    }
  }, [isNew, existingCase, initialized]);

  const set = useCallback(
    <K extends keyof CRFFormState>(key: K, value: CRFFormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleSave = async (complete: boolean) => {
    const caseData = formStateToPatientCase(
      form,
      isNew ? BigInt(0) : (caseId as bigint),
      complete,
    );

    try {
      if (isNew) {
        await createMutation.mutateAsync({
          crNumber: caseData.crNumber,
          dateOfEnrollment: caseData.dateOfEnrollment,
          babysName: caseData.babysName,
          dateOfBirth: caseData.dateOfBirth,
          sex: caseData.sex,
          gestationalAgeWeeks: caseData.gestationalAgeWeeks,
          birthWeightGrams: caseData.birthWeightGrams,
          modeOfDelivery: caseData.modeOfDelivery,
          indicationCesarean: caseData.indicationCesarean,
          area: caseData.area,
          maternalRiskFactors: caseData.maternalRiskFactors,
          clinicalFeatures: caseData.clinicalFeatures,
          antibioticsAtScreen: caseData.antibioticsAtScreen,
          sepsisScreensTable: caseData.sepsisScreensTable,
          screen1Data: caseData.screen1Data,
          screen2Data: caseData.screen2Data,
          screen3Data: caseData.screen3Data,
          finalDiagnosisTreatingTeam: caseData.finalDiagnosisTreatingTeam,
          finalDiagnosisAdjudication: caseData.finalDiagnosisAdjudication,
          sepsisConfirmed: caseData.sepsisConfirmed,
          dischargeStatus: caseData.dischargeStatus,
          dateOfDischargeOrDeath: caseData.dateOfDischargeOrDeath,
          isComplete: caseData.isComplete,
        });
        toast.success(
          complete
            ? "Case saved and marked complete!"
            : "Draft saved successfully.",
        );
        onSaved();
      } else {
        await updateMutation.mutateAsync(caseData);
        toast.success(
          complete
            ? "Case updated and marked complete!"
            : "Draft saved successfully.",
        );
        onSaved();
      }
    } catch {
      toast.error("Failed to save. Please try again.");
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const displaySNo = isNew
    ? Number(caseCount) + 1
    : existingCase
      ? Number(existingCase.sNo)
      : "—";

  if (!isNew && caseLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto" data-ocid="crf.loading_state">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-4 w-72 mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_el, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows have no stable id
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-card border-b border-border px-4 md:px-6 py-3 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-1.5 flex-shrink-0"
            data-ocid="crf.back.button"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Cases</span>
          </Button>
          <div className="h-5 w-px bg-border" />
          <div className="min-w-0">
            <h1 className="font-bold text-base truncate">
              {isNew ? "New Case" : "Edit Case"}
            </h1>
            <p className="text-xs text-muted-foreground">
              S.No:{" "}
              <span className="font-mono font-semibold">{displaySNo}</span>
              {" · "}
              Area: <span className="font-semibold">{form.area}</span>
            </p>
          </div>
        </div>
        {/* Area selector inline */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {(["NICU", "NNN", "CLR", "CEN"] as const).map((a) => (
            <button
              type="button"
              key={a}
              onClick={() => set("area", a)}
              className={cn(
                "px-2.5 py-1 rounded text-xs font-semibold border transition-colors",
                form.area === a
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/50",
              )}
              data-ocid={`crf.area_${a.toLowerCase()}.toggle`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
        {/* Section stepper */}
        <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
          {SECTIONS.map((s, i) => (
            <button
              type="button"
              key={s}
              onClick={() => setActiveSection(i)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors",
                i === activeSection
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
              data-ocid={`crf.section_${i + 1}.tab`}
            >
              <span
                className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold",
                  i === activeSection ? "bg-primary-foreground/20" : "bg-muted",
                )}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className="hidden sm:inline">{s}</span>
              <span className="sm:hidden">{s.split(":")[0]}</span>
            </button>
          ))}
        </div>

        {/* Section content */}
        <div className="animate-fade-in">
          {activeSection === 0 && <SectionA form={form} set={set} />}
          {activeSection === 1 && <SectionB form={form} set={set} />}
          {activeSection === 2 && <SectionC form={form} set={set} />}
          {activeSection === 3 && <SectionD form={form} set={set} />}
          {activeSection === 4 && <SectionE form={form} set={set} />}
        </div>

        {/* Navigation + Save */}
        <div className="mt-8 flex items-center justify-between gap-3 pt-6 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            disabled={activeSection === 0}
            onClick={() => setActiveSection((s) => s - 1)}
            className="gap-1"
            data-ocid="crf.prev_section.button"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="gap-2"
              data-ocid="crf.save_draft.button"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Draft
            </Button>
            <Button
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="gap-2"
              data-ocid="crf.save_complete.primary_button"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              Save & Complete
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={activeSection === SECTIONS.length - 1}
            onClick={() => setActiveSection((s) => s + 1)}
            className="gap-1"
            data-ocid="crf.next_section.button"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Section A: Demographics ─────────────────────────────────

function SectionA({ form, set }: SectionProps) {
  return (
    <SectionCard
      title="Section A: Demographics"
      subtitle="Patient identification and birth details"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label="CR Number / NICU No." required>
          <Input
            placeholder="e.g. CR-2024-001"
            value={form.crNumber}
            onChange={(e) => set("crNumber", e.target.value)}
            data-ocid="demographics.cr_number.input"
          />
        </FormField>

        <FormField label="Date of Enrollment" required>
          <Input
            type="date"
            value={form.dateOfEnrollment}
            onChange={(e) => set("dateOfEnrollment", e.target.value)}
            data-ocid="demographics.enrollment_date.input"
          />
        </FormField>

        <FormField label="Baby's Name (B/O ...)" required>
          <div className="flex gap-2 items-center">
            <span className="text-sm font-semibold text-muted-foreground bg-muted px-3 py-2 rounded-md border border-border whitespace-nowrap">
              B/O
            </span>
            <Input
              placeholder="Mother's name"
              value={form.babysName}
              onChange={(e) => set("babysName", e.target.value)}
              data-ocid="demographics.babys_name.input"
            />
          </div>
        </FormField>

        <FormField label="Date of Birth" required>
          <Input
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => set("dateOfBirth", e.target.value)}
            data-ocid="demographics.dob.input"
          />
        </FormField>

        <FormField label="Sex" required>
          <RadioGroup
            value={form.sex}
            onChange={(v) => set("sex", v)}
            options={["Male", "Female"]}
            name="sex"
            ocidPrefix="demographics.sex"
          />
        </FormField>

        <FormField label="Gestational Age at Birth (weeks)">
          <Input
            type="number"
            min={20}
            max={45}
            placeholder="e.g. 34"
            value={form.gestationalAgeWeeks}
            onChange={(e) => set("gestationalAgeWeeks", e.target.value)}
            data-ocid="demographics.gestational_age.input"
          />
        </FormField>

        <FormField label="Birth Weight (grams)">
          <Input
            type="number"
            min={300}
            max={5000}
            placeholder="e.g. 2500"
            value={form.birthWeightGrams}
            onChange={(e) => set("birthWeightGrams", e.target.value)}
            data-ocid="demographics.birth_weight.input"
          />
        </FormField>

        <FormField label="Mode of Delivery">
          <Input
            placeholder="e.g. Normal vaginal, LSCS"
            value={form.modeOfDelivery}
            onChange={(e) => set("modeOfDelivery", e.target.value)}
            data-ocid="demographics.mode_of_delivery.input"
          />
        </FormField>

        <FormField label="Indication (if Cesarean)" className="md:col-span-2">
          <Input
            placeholder="e.g. Fetal distress, Failed induction"
            value={form.indicationCesarean}
            onChange={(e) => set("indicationCesarean", e.target.value)}
            data-ocid="demographics.cesarean_indication.input"
          />
        </FormField>
      </div>
    </SectionCard>
  );
}

// ── Section B: Maternal Risk Factors ───────────────────────

function SectionB({ form, set }: SectionProps) {
  const mrf = form.maternalRiskFactors;
  const updateMRF = (key: keyof typeof mrf, value: PresentAbsent) => {
    set("maternalRiskFactors", { ...mrf, [key]: value });
  };

  const rows: { key: keyof typeof mrf; label: string }[] = [
    { key: "maternalFever", label: "Maternal fever >100.4°F" },
    { key: "foulSmellingLiquor", label: "Foul-smelling liquor" },
    { key: "meconiumStainedLiquor", label: "Meconium-stained liquor" },
    { key: "promOver18Hours", label: "PROM >18 hours" },
    { key: "prolongedLabor", label: "Prolonged labor" },
    { key: "suspectedChorioamnionitis", label: "Suspected chorioamnionitis" },
    { key: "maternalAntibiotics", label: "Maternal antibiotics" },
  ];

  return (
    <SectionCard
      title="Section B: Maternal Risk Factors for Sepsis"
      subtitle="Indicate whether each risk factor was present or absent"
    >
      <div className="overflow-x-auto">
        <table className="w-full crf-table">
          <thead>
            <tr>
              <th className="w-8 text-center">#</th>
              <th>Risk Factor</th>
              <th className="w-28 text-center">Present</th>
              <th className="w-28 text-center">Absent</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.key} data-ocid={`maternal.item.${idx + 1}`}>
                <td className="text-center text-muted-foreground text-sm">
                  {idx + 1}
                </td>
                <td className="font-medium text-sm">{row.label}</td>
                <td className="text-center">
                  <input
                    type="radio"
                    name={`mrf_${row.key}`}
                    value="Present"
                    checked={mrf[row.key] === "Present"}
                    onChange={() => updateMRF(row.key, "Present")}
                    className="w-4 h-4 accent-primary"
                    data-ocid={`maternal.present_${idx + 1}.radio`}
                  />
                </td>
                <td className="text-center">
                  <input
                    type="radio"
                    name={`mrf_${row.key}`}
                    value="Absent"
                    checked={mrf[row.key] === "Absent"}
                    onChange={() => updateMRF(row.key, "Absent")}
                    className="w-4 h-4 accent-primary"
                    data-ocid={`maternal.absent_${idx + 1}.radio`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

// ── Section C: Clinical Features ───────────────────────────

function SectionC({ form, set }: SectionProps) {
  const cf = form.clinicalFeatures;
  const abs = form.antibioticsAtScreen;

  const updateCF = (key: keyof typeof cf, value: PresentAbsent | string) => {
    set("clinicalFeatures", { ...cf, [key]: value });
  };

  const updateAbsRow = (
    idx: number,
    field: string,
    value: string | boolean,
  ) => {
    const updated = abs.map((row, i) =>
      i === idx ? { ...row, [field]: value } : row,
    );
    set("antibioticsAtScreen", updated);
  };

  type FeatureKey =
    | "lethargyPoorActivity"
    | "temperatureInstability"
    | "feedingIntolerance"
    | "respiratoryDistress"
    | "apneaOrSeizures";

  const featureRows: { key: FeatureKey; label: string }[] = [
    { key: "lethargyPoorActivity", label: "Lethargy / Poor activity" },
    { key: "temperatureInstability", label: "Temperature instability" },
    { key: "feedingIntolerance", label: "Feeding intolerance" },
    { key: "respiratoryDistress", label: "Respiratory distress" },
    { key: "apneaOrSeizures", label: "Apnea or seizures" },
  ];

  return (
    <div className="space-y-6">
      <SectionCard
        title="Section C: Clinical Features at Time of Screen"
        subtitle="Presence or absence at time of sending sepsis screen"
      >
        <div className="overflow-x-auto">
          <table className="w-full crf-table">
            <thead>
              <tr>
                <th className="w-8 text-center">#</th>
                <th>Feature</th>
                <th className="w-28 text-center">Present</th>
                <th className="w-28 text-center">Absent</th>
              </tr>
            </thead>
            <tbody>
              {featureRows.map((row, idx) => (
                <tr key={row.key} data-ocid={`clinical.item.${idx + 1}`}>
                  <td className="text-center text-muted-foreground text-sm">
                    {idx + 1}
                  </td>
                  <td className="font-medium text-sm">{row.label}</td>
                  <td className="text-center">
                    <input
                      type="radio"
                      name={`cf_${row.key}`}
                      value="Present"
                      checked={cf[row.key] === "Present"}
                      onChange={() => updateCF(row.key, "Present")}
                      className="w-4 h-4 accent-primary"
                      data-ocid={`clinical.present_${idx + 1}.radio`}
                    />
                  </td>
                  <td className="text-center">
                    <input
                      type="radio"
                      name={`cf_${row.key}`}
                      value="Absent"
                      checked={cf[row.key] === "Absent"}
                      onChange={() => updateCF(row.key, "Absent")}
                      className="w-4 h-4 accent-primary"
                      data-ocid={`clinical.absent_${idx + 1}.radio`}
                    />
                  </td>
                </tr>
              ))}
              {/* Others 1 */}
              <tr data-ocid="clinical.item.6">
                <td className="text-center text-muted-foreground text-sm">6</td>
                <td>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Others:
                    </span>
                    <Input
                      className="h-7 text-sm"
                      placeholder="Describe..."
                      value={cf.othersText1}
                      onChange={(e) => updateCF("othersText1", e.target.value)}
                      data-ocid="clinical.others1.input"
                    />
                  </div>
                </td>
                <td className="text-center">
                  <input
                    type="radio"
                    name="cf_others1"
                    value="Present"
                    checked={cf.others1 === "Present"}
                    onChange={() => updateCF("others1", "Present")}
                    className="w-4 h-4 accent-primary"
                    data-ocid="clinical.others1_present.radio"
                  />
                </td>
                <td className="text-center">
                  <input
                    type="radio"
                    name="cf_others1"
                    value="Absent"
                    checked={cf.others1 === "Absent"}
                    onChange={() => updateCF("others1", "Absent")}
                    className="w-4 h-4 accent-primary"
                    data-ocid="clinical.others1_absent.radio"
                  />
                </td>
              </tr>
              {/* Others 2 */}
              <tr data-ocid="clinical.item.7">
                <td className="text-center text-muted-foreground text-sm">7</td>
                <td>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Others:
                    </span>
                    <Input
                      className="h-7 text-sm"
                      placeholder="Describe..."
                      value={cf.othersText2}
                      onChange={(e) => updateCF("othersText2", e.target.value)}
                      data-ocid="clinical.others2.input"
                    />
                  </div>
                </td>
                <td className="text-center">
                  <input
                    type="radio"
                    name="cf_others2"
                    value="Present"
                    checked={cf.others2 === "Present"}
                    onChange={() => updateCF("others2", "Present")}
                    className="w-4 h-4 accent-primary"
                    data-ocid="clinical.others2_present.radio"
                  />
                </td>
                <td className="text-center">
                  <input
                    type="radio"
                    name="cf_others2"
                    value="Absent"
                    checked={cf.others2 === "Absent"}
                    onChange={() => updateCF("others2", "Absent")}
                    className="w-4 h-4 accent-primary"
                    data-ocid="clinical.others2_absent.radio"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard
        title="Antibiotics at Time of Screen"
        subtitle="List antibiotics given when screen was sent"
      >
        <div className="overflow-x-auto">
          <table className="w-full crf-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Antibiotic Name</th>
                <th>Start Date</th>
                <th className="w-20 text-center">No</th>
              </tr>
            </thead>
            <tbody>
              {abs.map((row, idx) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length array with positional semantics
                <tr key={idx} data-ocid={`antibiotics.item.${idx + 1}`}>
                  <td className="text-center text-muted-foreground text-sm">
                    {idx + 1}
                  </td>
                  <td>
                    <Input
                      className="h-7 text-sm"
                      placeholder="Drug name"
                      value={row.antibioticName}
                      onChange={(e) =>
                        updateAbsRow(idx, "antibioticName", e.target.value)
                      }
                      data-ocid={`antibiotics.name_${idx + 1}.input`}
                    />
                  </td>
                  <td>
                    <Input
                      type="date"
                      className="h-7 text-sm"
                      value={row.startDate}
                      onChange={(e) =>
                        updateAbsRow(idx, "startDate", e.target.value)
                      }
                      data-ocid={`antibiotics.start_date_${idx + 1}.input`}
                    />
                  </td>
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={row.noAntibiotic}
                      onChange={(e) =>
                        updateAbsRow(idx, "noAntibiotic", e.target.checked)
                      }
                      className="w-4 h-4 accent-primary"
                      data-ocid={`antibiotics.no_${idx + 1}.checkbox`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

// ── Section D: Sepsis Screens ───────────────────────────────

function SectionD({ form, set }: SectionProps) {
  const sst = form.sepsisScreensTable;
  const screens = [
    form.screen1Data,
    form.screen2Data,
    form.screen3Data,
  ] as const;
  const screenKeys = ["screen1Data", "screen2Data", "screen3Data"] as const;
  const [activeScreen, setActiveScreen] = useState(0);

  const updateSST = (idx: number, field: string, value: string) => {
    const updated = sst.map((row, i) =>
      i === idx ? { ...row, [field]: value } : row,
    );
    set("sepsisScreensTable", updated);
  };

  const updateScreen = (
    screenIdx: number,
    updates: Partial<typeof form.screen1Data>,
  ) => {
    const current = screens[screenIdx];
    const key = screenKeys[screenIdx];
    set(key, { ...current, ...updates });
  };

  const updateScreenParam = (
    screenIdx: number,
    param: "anc" | "crp" | "procal" | "bloodCulture",
    field: string,
    value: string,
  ) => {
    const current = screens[screenIdx];
    const key = screenKeys[screenIdx];
    set(key, {
      ...current,
      [param]: { ...current[param], [field]: value },
    });
  };

  const updateAntibioticDuration = (
    screenIdx: number,
    rowIdx: number,
    field: string,
    value: string,
  ) => {
    const current = screens[screenIdx];
    const key = screenKeys[screenIdx];
    const updated = current.antibioticDurations.map((row, i) =>
      i === rowIdx ? { ...row, [field]: value } : row,
    );
    set(key, { ...current, antibioticDurations: updated });
  };

  return (
    <div className="space-y-6">
      {/* Overview table */}
      <SectionCard
        title="Section D: Sepsis Screens Overview"
        subtitle="Summary of all screens sent"
      >
        <div className="overflow-x-auto">
          <table className="w-full crf-table">
            <thead>
              <tr>
                <th className="w-20">Screen No.</th>
                <th className="w-32">Date</th>
                <th>Tests Listed</th>
                <th>Indication</th>
                <th className="w-32 text-center">Blood Culture Sent</th>
                <th>Adjudicator Opinion</th>
              </tr>
            </thead>
            <tbody>
              {sst.map((row, idx) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length screens array
                <tr key={idx} data-ocid={`screens.overview.item.${idx + 1}`}>
                  <td className="font-semibold text-center">{row.screenNo}</td>
                  <td>
                    <Input
                      type="date"
                      className="h-7 text-sm"
                      value={row.date}
                      onChange={(e) => updateSST(idx, "date", e.target.value)}
                      data-ocid={`screens.date_${idx + 1}.input`}
                    />
                  </td>
                  <td>
                    <Input
                      className="h-7 text-sm"
                      placeholder="ANC, CRP, Procal..."
                      value={row.testsListed}
                      onChange={(e) =>
                        updateSST(idx, "testsListed", e.target.value)
                      }
                      data-ocid={`screens.tests_${idx + 1}.input`}
                    />
                  </td>
                  <td>
                    <Input
                      className="h-7 text-sm"
                      placeholder="Indication"
                      value={row.indication}
                      onChange={(e) =>
                        updateSST(idx, "indication", e.target.value)
                      }
                      data-ocid={`screens.indication_${idx + 1}.input`}
                    />
                  </td>
                  <td className="text-center">
                    <Select
                      value={row.bloodCultureSent || ""}
                      onValueChange={(v) =>
                        updateSST(idx, "bloodCultureSent", v)
                      }
                    >
                      <SelectTrigger
                        className="h-7 text-sm w-24 mx-auto"
                        data-ocid={`screens.blood_culture_${idx + 1}.select`}
                      >
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td>
                    <Input
                      className="h-7 text-sm"
                      placeholder="Opinion"
                      value={row.adjudicatorsOpinion}
                      onChange={(e) =>
                        updateSST(idx, "adjudicatorsOpinion", e.target.value)
                      }
                      data-ocid={`screens.opinion_${idx + 1}.input`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Screen tabs */}
      <div className="flex gap-2 border-b border-border pb-0">
        {[1, 2, 3].map((n, i) => (
          <button
            type="button"
            key={n}
            onClick={() => setActiveScreen(i)}
            className={cn(
              "px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors",
              i === activeScreen
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
            data-ocid={`screen_detail.tab_${n}.tab`}
          >
            Screen {n}
          </button>
        ))}
      </div>

      {/* Active screen details */}
      <SectionCard
        title={`Screen ${activeScreen + 1} Details`}
        subtitle="Parameter values and interpretations"
      >
        <div className="mb-4">
          <FormField label="Screen Date">
            <Input
              type="date"
              className="max-w-xs"
              value={screens[activeScreen].date}
              onChange={(e) =>
                updateScreen(activeScreen, { date: e.target.value })
              }
              data-ocid={`screen${activeScreen + 1}.date.input`}
            />
          </FormField>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="w-full crf-table">
            <thead>
              <tr>
                <th className="w-32">Parameter</th>
                <th className="w-32">Value</th>
                <th>Treating Team Interpretation</th>
                <th>Investigator Interpretation</th>
              </tr>
            </thead>
            <tbody>
              {(["anc", "crp", "procal", "bloodCulture"] as const).map(
                (param, pIdx) => {
                  const labels: Record<string, string> = {
                    anc: "ANC",
                    crp: "CRP",
                    procal: "Procalcitonin",
                    bloodCulture: "Blood Culture",
                  };
                  const paramData = screens[activeScreen][param];
                  return (
                    <tr
                      key={param}
                      data-ocid={`screen${activeScreen + 1}.param.item.${pIdx + 1}`}
                    >
                      <td className="font-semibold text-sm">{labels[param]}</td>
                      <td>
                        <Input
                          className="h-7 text-sm"
                          placeholder="Value"
                          value={paramData.value}
                          onChange={(e) =>
                            updateScreenParam(
                              activeScreen,
                              param,
                              "value",
                              e.target.value,
                            )
                          }
                          data-ocid={`screen${activeScreen + 1}.${param}_value.input`}
                        />
                      </td>
                      <td>
                        <Select
                          value={paramData.treatingTeamInterpretation || ""}
                          onValueChange={(v) =>
                            updateScreenParam(
                              activeScreen,
                              param,
                              "treatingTeamInterpretation",
                              v,
                            )
                          }
                        >
                          <SelectTrigger
                            className="h-7 text-sm"
                            data-ocid={`screen${activeScreen + 1}.${param}_treating.select`}
                          >
                            <SelectValue placeholder="—" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Positive">Positive</SelectItem>
                            <SelectItem value="Negative">Negative</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td>
                        <Select
                          value={paramData.investigatorsInterpretation || ""}
                          onValueChange={(v) =>
                            updateScreenParam(
                              activeScreen,
                              param,
                              "investigatorsInterpretation",
                              v,
                            )
                          }
                        >
                          <SelectTrigger
                            className="h-7 text-sm"
                            data-ocid={`screen${activeScreen + 1}.${param}_investigator.select`}
                          >
                            <SelectValue placeholder="—" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Positive">Positive</SelectItem>
                            <SelectItem value="Negative">Negative</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  );
                },
              )}
              {/* Antibiotics decision row */}
              <tr>
                <td className="font-semibold text-sm text-xs leading-tight">
                  Antibiotics decision (treating team)
                </td>
                <td colSpan={3}>
                  <Select
                    value={screens[activeScreen].antibioticsDecision || ""}
                    onValueChange={(v) =>
                      updateScreen(activeScreen, { antibioticsDecision: v })
                    }
                  >
                    <SelectTrigger
                      className="h-7 text-sm"
                      data-ocid={`screen${activeScreen + 1}.antibiotic_decision.select`}
                    >
                      <SelectValue placeholder="Select decision" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Start">Start</SelectItem>
                      <SelectItem value="Stop">Stop</SelectItem>
                      <SelectItem value="Upgrade">Upgrade</SelectItem>
                      <SelectItem value="Continue same">
                        Continue same
                      </SelectItem>
                      <SelectItem value="No decision">No decision</SelectItem>
                      <SelectItem value="Predecided to start or upgrade">
                        Predecided to start or upgrade
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Antibiotic durations */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-2">
            Final Duration of Antibiotics
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full crf-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Antibiotic</th>
                  <th>Start Date</th>
                  <th>Stop Date</th>
                  <th>Duration</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {screens[activeScreen].antibioticDurations.map((row, rIdx) => (
                  <tr
                    key={["dur-a", "dur-b", "dur-c"][rIdx]}
                    data-ocid={`screen${activeScreen + 1}.duration.item.${rIdx + 1}`}
                  >
                    <td className="text-center text-muted-foreground text-sm">
                      {rIdx + 1}
                    </td>
                    <td>
                      <Input
                        className="h-7 text-sm"
                        placeholder="Drug"
                        value={row.antibioticName}
                        onChange={(e) =>
                          updateAntibioticDuration(
                            activeScreen,
                            rIdx,
                            "antibioticName",
                            e.target.value,
                          )
                        }
                        data-ocid={`screen${activeScreen + 1}.dur_name_${rIdx + 1}.input`}
                      />
                    </td>
                    <td>
                      <Input
                        type="date"
                        className="h-7 text-sm"
                        value={row.startDate}
                        onChange={(e) =>
                          updateAntibioticDuration(
                            activeScreen,
                            rIdx,
                            "startDate",
                            e.target.value,
                          )
                        }
                        data-ocid={`screen${activeScreen + 1}.dur_start_${rIdx + 1}.input`}
                      />
                    </td>
                    <td>
                      <Input
                        type="date"
                        className="h-7 text-sm"
                        value={row.stopDate}
                        onChange={(e) =>
                          updateAntibioticDuration(
                            activeScreen,
                            rIdx,
                            "stopDate",
                            e.target.value,
                          )
                        }
                        data-ocid={`screen${activeScreen + 1}.dur_stop_${rIdx + 1}.input`}
                      />
                    </td>
                    <td>
                      <Input
                        className="h-7 text-sm"
                        placeholder="Days"
                        value={row.duration}
                        onChange={(e) =>
                          updateAntibioticDuration(
                            activeScreen,
                            rIdx,
                            "duration",
                            e.target.value,
                          )
                        }
                        data-ocid={`screen${activeScreen + 1}.dur_duration_${rIdx + 1}.input`}
                      />
                    </td>
                    <td>
                      <Input
                        className="h-7 text-sm"
                        placeholder="Reason"
                        value={row.reason}
                        onChange={(e) =>
                          updateAntibioticDuration(
                            activeScreen,
                            rIdx,
                            "reason",
                            e.target.value,
                          )
                        }
                        data-ocid={`screen${activeScreen + 1}.dur_reason_${rIdx + 1}.input`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Clinical course */}
        <FormField label="Clinical Course">
          <Textarea
            placeholder="Describe the clinical course during this screen period..."
            rows={4}
            value={screens[activeScreen].clinicalCourse}
            onChange={(e) =>
              updateScreen(activeScreen, { clinicalCourse: e.target.value })
            }
            data-ocid={`screen${activeScreen + 1}.clinical_course.textarea`}
          />
        </FormField>
      </SectionCard>
    </div>
  );
}

// ── Section E: Outcome ──────────────────────────────────────

function SectionE({ form, set }: SectionProps) {
  return (
    <SectionCard
      title="Section E: Outcome"
      subtitle="Final diagnosis and patient outcome"
    >
      <div className="overflow-x-auto mb-6">
        <table className="w-full crf-table">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Treating Team</th>
              <th>Adjudication</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-semibold text-sm">Final Diagnosis</td>
              <td>
                <Input
                  placeholder="Treating team diagnosis"
                  value={form.finalDiagnosisTreatingTeam}
                  onChange={(e) =>
                    set("finalDiagnosisTreatingTeam", e.target.value)
                  }
                  data-ocid="outcome.final_diagnosis_treating.input"
                />
              </td>
              <td>
                <Input
                  placeholder="Adjudication diagnosis"
                  value={form.finalDiagnosisAdjudication}
                  onChange={(e) =>
                    set("finalDiagnosisAdjudication", e.target.value)
                  }
                  data-ocid="outcome.final_diagnosis_adjudication.input"
                />
              </td>
            </tr>
            <tr>
              <td className="font-semibold text-sm">Sepsis Confirmed</td>
              <td colSpan={2}>
                <RadioGroup
                  value={form.sepsisConfirmed}
                  onChange={(v) => set("sepsisConfirmed", v)}
                  options={["Yes", "No"]}
                  name="sepsisConfirmed"
                  ocidPrefix="outcome.sepsis_confirmed"
                />
              </td>
            </tr>
            <tr>
              <td className="font-semibold text-sm">Discharge Status</td>
              <td colSpan={2}>
                <RadioGroup
                  value={form.dischargeStatus}
                  onChange={(v) => set("dischargeStatus", v)}
                  options={["Alive", "Expired"]}
                  name="dischargeStatus"
                  ocidPrefix="outcome.discharge_status"
                />
              </td>
            </tr>
            <tr>
              <td className="font-semibold text-sm">
                Date of Discharge / Death
              </td>
              <td colSpan={2}>
                <Input
                  type="date"
                  className="max-w-xs"
                  value={form.dateOfDischargeOrDeath}
                  onChange={(e) =>
                    set("dateOfDischargeOrDeath", e.target.value)
                  }
                  data-ocid="outcome.discharge_date.input"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-muted/40 rounded-lg border border-border p-4 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground mb-1">Ready to submit?</p>
        <p>
          Use "Save Draft" to save progress, or "Save & Complete" to mark this
          case as fully completed. Completed cases appear with a green badge in
          the case list.
        </p>
      </div>
    </SectionCard>
  );
}

// ── Shared helpers ──────────────────────────────────────────

type SectionProps = {
  form: CRFFormState;
  set: <K extends keyof CRFFormState>(key: K, value: CRFFormState[K]) => void;
};

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-card p-5">
      <div className="mb-4">
        <h2 className="text-base font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function FormField({
  label,
  required,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-sm font-semibold">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

function RadioGroup({
  value,
  onChange,
  options,
  name,
  ocidPrefix,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  name: string;
  ocidPrefix: string;
}) {
  return (
    <div className="flex items-center gap-6">
      {options.map((opt, idx) => (
        <label key={opt} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="w-4 h-4 accent-primary"
            data-ocid={`${ocidPrefix}_${idx + 1}.radio`}
          />
          <span className="text-sm font-medium">{opt}</span>
        </label>
      ))}
    </div>
  );
}
