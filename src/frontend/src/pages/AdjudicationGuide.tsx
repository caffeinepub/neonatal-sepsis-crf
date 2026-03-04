import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  BookOpen,
  ClipboardCheck,
  FlaskConical,
  Microscope,
  Pill,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";

interface GuideSection {
  id: string;
  icon: React.ReactNode;
  title: string;
  badge?: string;
  badgeVariant?: "default" | "outline" | "secondary";
  content: React.ReactNode;
}

const sections: GuideSection[] = [
  {
    id: "what",
    icon: <BookOpen className="w-4 h-4" />,
    title: "What is Adjudication?",
    content: (
      <div className="space-y-3 text-sm">
        <p>
          Adjudication is an <strong>independent expert review process</strong>{" "}
          in which a panel of investigators reviews the clinical and laboratory
          data from each patient case to assign a definitive classification,
          separate from the treating team's working diagnosis.
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
          <li>
            Evaluates whether the sepsis screen results justified antibiotic use
          </li>
          <li>
            Classifies antibiotic use as appropriate, inappropriate, or
            indeterminate
          </li>
          <li>Provides a consensus final diagnosis for research analysis</li>
          <li>Ensures study data quality and reduces observer bias</li>
        </ul>
        <p className="text-muted-foreground">
          The adjudicator's opinion is entered in the{" "}
          <strong>Adjudicators' Opinion</strong> column of the Sepsis Screens
          Overview table and the <strong>Adjudication</strong> field in the
          Outcome section.
        </p>
      </div>
    ),
  },
  {
    id: "criteria",
    icon: <ClipboardCheck className="w-4 h-4" />,
    title: "Criteria for Sepsis Diagnosis",
    badge: "Key Criteria",
    badgeVariant: "default",
    content: (
      <div className="space-y-4 text-sm">
        <p>
          Neonatal sepsis is suspected when <strong>≥2 clinical signs</strong>{" "}
          are present, particularly in the context of risk factors.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CriteriaBox
            title="Clinical Signs"
            items={[
              "Lethargy or poor activity",
              "Temperature instability",
              "Feeding intolerance",
              "Respiratory distress",
              "Apnea or seizures",
              "Bradycardia or tachycardia",
              "Hypotension",
            ]}
            color="blue"
          />
          <CriteriaBox
            title="Laboratory Markers"
            items={[
              "Abnormal ANC (high or low)",
              "Elevated CRP (≥10 mg/L)",
              "Elevated Procalcitonin",
              "Positive blood culture",
              "I/T ratio >0.2",
              "Thrombocytopenia",
            ]}
            color="teal"
          />
        </div>
        <div className="bg-muted/50 rounded-lg p-3 border border-border">
          <p className="font-semibold text-foreground mb-1">
            Confirmed Sepsis:
          </p>
          <p className="text-muted-foreground">
            Positive blood culture with organism(s) + clinical signs. All
            positive blood cultures must be evaluated for contamination.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "anc",
    icon: <TrendingUp className="w-4 h-4" />,
    title: "Interpreting ANC (Absolute Neutrophil Count)",
    content: (
      <div className="space-y-4 text-sm">
        <table className="w-full crf-table text-sm">
          <thead>
            <tr>
              <th>Age</th>
              <th>Normal ANC Range</th>
              <th>Significance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Birth – 12h</td>
              <td>6,000 – 26,000/μL</td>
              <td className="text-muted-foreground">
                Physiological leukocytosis
              </td>
            </tr>
            <tr>
              <td>12h – 60h</td>
              <td>7,800 – 14,500/μL</td>
              <td className="text-muted-foreground">Stabilizing</td>
            </tr>
            <tr>
              <td>Day 3 – 28</td>
              <td>1,800 – 7,000/μL</td>
              <td className="text-muted-foreground">Normal range</td>
            </tr>
          </tbody>
        </table>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CriteriaBox
            title="Neutropenia (Low ANC)"
            items={[
              "ANC <1800/μL after day 3",
              "More specific for sepsis",
              "Associated with gram-negative infections",
              "Bone marrow depletion sign",
            ]}
            color="red"
          />
          <CriteriaBox
            title="Neutrophilia (High ANC)"
            items={[
              "ANC >7000/μL after day 3",
              "Less specific, often physiological",
              "Consider I/T ratio if elevated",
              "Reassess with serial counts",
            ]}
            color="orange"
          />
        </div>
        <p className="text-muted-foreground text-xs">
          <strong>I/T Ratio:</strong> Immature-to-total neutrophil ratio &gt;0.2
          is more specific for sepsis than total ANC alone.
        </p>
      </div>
    ),
  },
  {
    id: "crp",
    icon: <FlaskConical className="w-4 h-4" />,
    title: "Interpreting CRP (C-Reactive Protein)",
    content: (
      <div className="space-y-3 text-sm">
        <div className="bg-muted/50 rounded-lg p-3 border border-border">
          <p className="font-semibold">
            Standard Cutoff:{" "}
            <span className="text-primary">≥10 mg/L = Positive</span>
          </p>
        </div>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-primary font-bold mt-0.5">→</span>
            <span>
              <strong className="text-foreground">CRP &lt;10 mg/L:</strong>{" "}
              Normal. Sepsis less likely if clinical signs are mild.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-bold mt-0.5">→</span>
            <span>
              <strong className="text-foreground">CRP 10–49 mg/L:</strong>{" "}
              Mildly elevated. Interpret in clinical context; serial CRP
              recommended.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-bold mt-0.5">→</span>
            <span>
              <strong className="text-foreground">CRP ≥50 mg/L:</strong>{" "}
              Significantly elevated. High suspicion for bacterial infection.
            </span>
          </li>
        </ul>
        <p className="text-xs text-muted-foreground border-l-2 border-primary/30 pl-3 mt-2">
          CRP peaks at 24–48 hours after onset of infection. Serial CRP (0h,
          24h, 48h) improves diagnostic accuracy. A falling CRP trend indicates
          response to treatment.
        </p>
        <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 text-xs">
          <strong>Note for adjudication:</strong> Single CRP at onset may be
          falsely normal early in infection. Combine with clinical presentation
          and other markers.
        </div>
      </div>
    ),
  },
  {
    id: "procal",
    icon: <Activity className="w-4 h-4" />,
    title: "Interpreting Procalcitonin (Procal)",
    content: (
      <div className="space-y-3 text-sm">
        <div className="bg-muted/50 rounded-lg p-3 border border-border">
          <p className="font-semibold">
            Cutoffs:{" "}
            <span className="text-primary">
              &lt;0.5 ng/mL = Low risk | ≥2 ng/mL = High suspicion
            </span>
          </p>
        </div>
        <table className="w-full crf-table text-sm">
          <thead>
            <tr>
              <th>Level</th>
              <th>Interpretation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>&lt;0.5 ng/mL</td>
              <td>Normal; sepsis unlikely</td>
            </tr>
            <tr>
              <td>0.5–2 ng/mL</td>
              <td>Mildly elevated; reassess clinically</td>
            </tr>
            <tr>
              <td>2–10 ng/mL</td>
              <td>Elevated; probable bacterial sepsis</td>
            </tr>
            <tr>
              <td>&gt;10 ng/mL</td>
              <td>Severely elevated; severe sepsis/septic shock</td>
            </tr>
          </tbody>
        </table>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-muted/40 rounded p-3 border border-border">
            <p className="font-semibold text-foreground mb-1">
              Early-onset Sepsis (EOS)
            </p>
            <p className="text-muted-foreground">
              PCT rises within 6–12h of birth in infected neonates.
              Physiologically elevated in first 48h — use age-specific cutoffs.
            </p>
          </div>
          <div className="bg-muted/40 rounded p-3 border border-border">
            <p className="font-semibold text-foreground mb-1">
              Late-onset Sepsis (LOS)
            </p>
            <p className="text-muted-foreground">
              After 72h, PCT &gt;0.5 ng/mL is more reliable. PCT falls faster
              than CRP when treatment is effective.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "bloodculture",
    icon: <Microscope className="w-4 h-4" />,
    title: "Blood Culture Interpretation",
    badge: "Gold Standard",
    badgeVariant: "secondary",
    content: (
      <div className="space-y-3 text-sm">
        <p>
          Positive blood culture is the <strong>gold standard</strong> for
          confirmed neonatal sepsis. However, culture results must be
          interpreted carefully.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <CriteriaBox
            title="True Positive"
            items={[
              "Pathogenic organism grown",
              "Consistent clinical picture",
              "Positive in ≥2 bottles or repeated",
              "e.g. E. coli, Klebsiella, GBS",
            ]}
            color="green"
          />
          <CriteriaBox
            title="Possible Contaminant"
            items={[
              "Coagulase-negative Staph",
              "Single bottle positive only",
              "No clinical correlation",
              "Evaluate collection technique",
            ]}
            color="orange"
          />
          <CriteriaBox
            title="Negative Culture"
            items={[
              "Does not exclude sepsis",
              "Culture-negative sepsis exists",
              "Prior antibiotic exposure",
              "Rely on clinical + lab data",
            ]}
            color="blue"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          <strong>Volume matters:</strong> Minimum 1 mL blood per bottle for
          neonates. Inadequate volume reduces sensitivity significantly.
        </p>
      </div>
    ),
  },
  {
    id: "appropriateness",
    icon: <Pill className="w-4 h-4" />,
    title: "Antibiotic Appropriateness Criteria",
    badge: "Core Decision",
    badgeVariant: "default",
    content: (
      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-success/8 border border-success/25 rounded-lg p-4">
            <h4 className="font-bold text-success mb-2">
              ✓ Appropriate Antibiotic Use
            </h4>
            <ul className="space-y-1.5 text-muted-foreground text-xs">
              <li>
                • Clinical features suggesting sepsis + abnormal lab markers
              </li>
              <li>• Positive blood culture with clinical correlation</li>
              <li>• High-risk maternal factors + symptomatic neonate</li>
              <li>• CRP ≥10 mg/L + ≥2 clinical signs</li>
              <li>• Procalcitonin ≥2 ng/mL + clinical deterioration</li>
              <li>
                • Antibiotic stopped/de-escalated based on culture sensitivity
              </li>
            </ul>
          </div>
          <div className="bg-destructive/8 border border-destructive/25 rounded-lg p-4">
            <h4 className="font-bold text-destructive mb-2">
              ✗ Inappropriate Antibiotic Use
            </h4>
            <ul className="space-y-1.5 text-muted-foreground text-xs">
              <li>• No clinical signs + normal labs</li>
              <li>
                • Antibiotic continued beyond 48–72h with negative culture +
                improving neonate
              </li>
              <li>• CRP &lt;10 mg/L + no significant clinical signs</li>
              <li>
                • Prophylactic antibiotics without clinical or lab indication
              </li>
              <li>
                • Broad-spectrum without de-escalation despite culture results
              </li>
              <li>
                • Duration significantly exceeds standard course without
                justification
              </li>
            </ul>
          </div>
        </div>
        <div className="bg-muted/40 border border-border rounded-lg p-3 text-xs">
          <p className="font-semibold text-foreground mb-1">Indeterminate:</p>
          <p className="text-muted-foreground">
            Cases where data is insufficient, borderline lab values with
            equivocal clinical picture, or when clinical context cannot be fully
            assessed from available records.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "steps",
    icon: <ClipboardCheck className="w-4 h-4" />,
    title: "Adjudication Decision Steps",
    content: (
      <div className="space-y-3 text-sm">
        <p className="text-muted-foreground">
          Follow these steps systematically for each screen:
        </p>
        {[
          {
            step: "1",
            title: "Review Clinical Features",
            desc: "Were clinical signs present at the time the screen was sent? Assess severity and number of signs.",
          },
          {
            step: "2",
            title: "Evaluate Maternal Risk Factors",
            desc: "Were significant risk factors present (fever, PROM >18h, chorioamnionitis)? Higher risk warrants lower threshold.",
          },
          {
            step: "3",
            title: "Assess Lab Results",
            desc: "Review ANC, CRP, Procalcitonin, and blood culture together. A single abnormal value is less significant than multiple abnormal values.",
          },
          {
            step: "4",
            title: "Evaluate Blood Culture",
            desc: "If positive, confirm it is a true pathogen vs. contaminant. Positive culture = confirmed sepsis (if true positive).",
          },
          {
            step: "5",
            title: "Assess Antibiotic Decision",
            desc: "Was the antibiotic decision (start/stop/upgrade/continue) justified by the totality of clinical + lab findings?",
          },
          {
            step: "6",
            title: "Record Opinion",
            desc: "Enter your interpretation in the Adjudicator's Opinion column. Use: Appropriate / Inappropriate / Indeterminate.",
          },
        ].map((item) => (
          <div key={item.step} className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
              {item.step}
            </div>
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "outcome",
    icon: <Activity className="w-4 h-4" />,
    title: "Outcome Classification",
    content: (
      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CriteriaBox
            title="Sepsis Confirmed: YES"
            items={[
              "Positive blood culture (true pathogen)",
              "OR ≥3 clinical signs + ≥2 abnormal lab markers",
              "OR strong clinical picture with marked lab abnormalities",
              "Treated appropriately and responded",
            ]}
            color="green"
          />
          <CriteriaBox
            title="Sepsis Confirmed: NO"
            items={[
              "Negative blood culture + normal or mildly abnormal labs",
              "Clinical signs resolved without antibiotics",
              "Alternative diagnosis explains the presentation",
              "Labs normalize within 24–48h without antibiotics",
            ]}
            color="blue"
          />
        </div>
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full crf-table text-sm">
            <thead>
              <tr>
                <th>Discharge Status</th>
                <th>Definition</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-semibold text-success">Alive</td>
                <td>Patient discharged from hospital alive</td>
              </tr>
              <tr>
                <td className="font-semibold text-destructive">Expired</td>
                <td>
                  Patient died during hospital admission; record date of death
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
];

/** Embeddable guide content — no header/footer, can be placed inside a Sheet or page */
export function AdjudicationGuideContent() {
  return (
    <div className="space-y-6">
      {/* Quick reference stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "ANC Cutoff", value: "1800/μL", sub: "day 3–28" },
          { label: "CRP Cutoff", value: "10 mg/L", sub: "positive" },
          { label: "Procal Cutoff", value: "0.5 ng/mL", sub: "low risk" },
          { label: "I/T Ratio", value: ">0.2", sub: "abnormal" },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-card border border-border rounded-lg p-3 text-center shadow-xs"
          >
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="text-lg font-bold font-mono text-primary">
              {item.value}
            </p>
            <p className="text-xs text-muted-foreground">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* Accordion sections */}
      <Accordion
        type="multiple"
        defaultValue={["what", "criteria"]}
        className="space-y-3"
      >
        {sections.map((section, idx) => (
          <AccordionItem
            key={section.id}
            value={section.id}
            className="bg-card border border-border rounded-xl overflow-hidden shadow-xs data-[state=open]:shadow-card"
            data-ocid={`guide.section_${idx + 1}.panel`}
          >
            <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30 transition-colors [&[data-state=open]]:bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  {section.icon}
                </div>
                <span className="font-semibold text-sm text-left">
                  {section.title}
                </span>
                {section.badge && (
                  <Badge
                    variant={section.badgeVariant || "outline"}
                    className="text-xs"
                  >
                    {section.badge}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 pt-3 border-t border-border">
              {section.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export function AdjudicationGuide() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 animate-fade-in">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Adjudication Guide
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Neonatal Sepsis Screen Study — Expert Reference for Adjudicators
            </p>
          </div>
        </div>

        <div className="mt-5 p-4 bg-primary/5 border border-primary/20 rounded-xl">
          <p className="text-sm text-foreground">
            This guide provides standardized criteria for independent
            adjudication of neonatal sepsis screen results in the study{" "}
            <strong>
              "Use and Misuse of Sepsis Screen in Neonates: An Observational
              Study of Clinical Practices"
            </strong>
            . All adjudicators should apply these criteria consistently.
          </p>
        </div>
      </motion.div>

      <AdjudicationGuideContent />

      {/* Footer */}
      <footer className="mt-10 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground transition-colors"
        >
          Built with love using caffeine.ai
        </a>
      </footer>
    </div>
  );
}

function CriteriaBox({
  title,
  items,
  color,
}: {
  title: string;
  items: string[];
  color: "blue" | "teal" | "red" | "orange" | "green";
}) {
  const classes = {
    blue: "border-blue-200 bg-blue-50/60 [.dark_&]:border-blue-800/30 [.dark_&]:bg-blue-950/20",
    teal: "border-teal-200 bg-teal-50/60 [.dark_&]:border-teal-800/30 [.dark_&]:bg-teal-950/20",
    red: "border-red-200 bg-red-50/60 [.dark_&]:border-red-800/30 [.dark_&]:bg-red-950/20",
    orange:
      "border-orange-200 bg-orange-50/60 [.dark_&]:border-orange-800/30 [.dark_&]:bg-orange-950/20",
    green:
      "border-green-200 bg-green-50/60 [.dark_&]:border-green-800/30 [.dark_&]:bg-green-950/20",
  };

  const titleClasses = {
    blue: "text-blue-700",
    teal: "text-teal-700",
    red: "text-red-700",
    orange: "text-orange-700",
    green: "text-green-700",
  };

  return (
    <div className={`rounded-lg border p-3 ${classes[color]}`}>
      <h5 className={`font-semibold text-xs mb-2 ${titleClasses[color]}`}>
        {title}
      </h5>
      <ul className="space-y-1 text-muted-foreground text-xs">
        {items.map((item, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static string array with no reordering
          <li key={i}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
