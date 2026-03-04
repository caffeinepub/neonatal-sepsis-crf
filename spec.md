# Neonatal Sepsis CRF App

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full digital CRF replicating the paper form for the thesis: "Use and Misuse of Sepsis Screen in Neonates: An Observational Study of Clinical Practices"
- Case list screen: searchable by S.No (case number) and Baby's Name, showing all 300 cases
- New case / edit case screen with all 5 sections of the CRF
- Section A: Demographics (CR Number/NICU no., Date of Enrollment, Baby's Name, Date of Birth, Sex checkbox Male/Female, Gestational Age at Birth in weeks, Birth Weight in grams, Mode of Delivery, Indication in case of cesarean delivery, Area: NICU/NNN/CLR/CEN)
- Section B: Maternal Risk Factors for Sepsis (checkboxes Present/Absent for: Maternal fever >100.4°F, Foul-smelling liquor, Meconium-stained liquor, PROM >18 hours, Prolonged labor, Suspected chorioamnionitis, Maternal antibiotics)
- Section C: Clinical Features at time of sending screen (checkboxes Present/Absent for: Lethargy/Poor activity, Temperature instability, Feeding intolerance, Respiratory distress, Apnea or seizures, Others x2 free text) + Antibiotics at time of Screen table (Antibiotic name, If yes start date, No)
- Section D: Sepsis Screens table (Screen no., Date, List of Tests done, Indication, Blood culture sent Yes/No, Expert adjudicators' opinion) + For each screen (Screen 1, 2, 3): Parameter results table (ANC, CRP, Procal, Blood culture, Antibiotic decision of treating team), Final Duration of Antibiotics table (Antibiotic, Start date, Stop date, Duration, Reason for Antibiotic duration), Clinical Course field
- Section E: Outcome (Final diagnosis with Treating Team and Adjudication columns, Sepsis confirmed Yes/No, Discharge status Alive/Expired, Date of discharge/death)
- Adjudication Guide page: accessible from sidebar/nav, showing guidance notes for adjudication decisions
- Save and auto-save functionality for each case
- Case number auto-increments (S.No 1-300)
- Summary/dashboard showing total cases, completed vs incomplete

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend: Store CRF records as stable data with full schema matching all 5 sections. CRUD operations: createCase, updateCase, getCase, listCases, searchCases (by case number and baby name), deleteCase, getCaseCount.
2. Backend: Each case record holds all section data as nested records. Screens (1-3) stored as array of screen records.
3. Frontend: Case list page with search bar (by S.No and name), pagination, case status indicators.
4. Frontend: CRF form with tabbed/sectioned layout matching paper form sections A-E, with all fields, checkboxes, date pickers.
5. Frontend: Three sepsis screen sub-forms inside Section D (Screen 1, 2, 3), each with parameter table, antibiotic duration table, clinical course.
6. Frontend: Adjudication Guide page with explanatory content about adjudication criteria.
7. Frontend: Dashboard stats (total enrolled, cases complete, pending).
