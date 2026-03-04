# Neonatal Sepsis CRF

## Current State
- Full CRF form with 5 sections (A-E), tabbed navigation, save/complete actions
- Section D has a Sepsis Screens Overview table with a single "Adjudicator Opinion" text input per row (3 rows for Screen 1, 2, 3)
- Section D also has per-screen detail sub-forms (Screen 1/2/3 tabs) with parameter values
- Separate Adjudication Guide page accessible from main navigation
- No guide reference available while filling in a CRF
- The overview table's "Adjudicators Opinion" field is a plain text input

## Requested Changes (Diff)

### Add
- In Section D (Screens Overview table), replace the plain "Adjudicators Opinion" text input for each screen row with a structured adjudication decision widget that includes:
  1. A dropdown/select for the adjudication classification: "Appropriate" / "Inappropriate" / "Indeterminate"
  2. A small "Guide" button (BookOpen icon) next to each dropdown that opens a Sheet panel showing the full Adjudication Guide content inline
- Each of the 3 screen rows gets its own independent adjudication decision + guide button
- Extract AdjudicationGuide content into a reusable `AdjudicationGuideContent` component so it can be rendered inside a Sheet without the page header/footer

### Modify
- AdjudicationGuide.tsx: export a standalone `AdjudicationGuideContent` component containing the quick-reference stats, sections accordion, and CriteriaBox helper
- CRFForm.tsx Section D overview table: change "Adjudicators Opinion" column to use a Select (Appropriate/Inappropriate/Indeterminate) + a Sheet trigger button per row
- The Sheet title should indicate which screen it belongs to (e.g. "Screen 1 — Adjudication Guide")

### Remove
- The plain text input for adjudicatorsOpinion in the overview table (replaced by Select dropdown)

## Implementation Plan
1. AdjudicationGuide.tsx: refactor to export `AdjudicationGuideContent` (the accordion + quick-ref stats + CriteriaBox). The existing `AdjudicationGuide` page wraps it with the page header/footer.
2. CRFForm.tsx: import Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, ScrollArea from shadcn/ui. Add `BookOpen` to lucide imports.
3. In Section D overview table, replace the "Adjudicators Opinion" Input with: a flex row containing a Select (Appropriate/Inappropriate/Indeterminate) bound to `row.adjudicatorsOpinion`, plus a small ghost Button with BookOpen icon that sets a local state `guideSheetScreen` to the screen index (1-3).
4. Render a single Sheet controlled by `guideSheetScreen !== null`, showing `AdjudicationGuideContent` in a ScrollArea. Close resets state to null.
