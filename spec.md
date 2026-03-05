# Neonatal Sepsis CRF

## Current State
Full CRF app with 5 sections (Demographics, Maternal Risk, Clinical, Screens, Outcome). Dashboard with search. Backend has `createCase` and `updateCase` functions that require the user to be registered via access control. The backend currently traps if `babysName` or `dateOfBirth` is empty, blocking draft saves.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- Backend `createCase`: remove the validation that requires `babysName` and `dateOfBirth` to be non-empty. Drafts must be saveable with any field values including empty strings.
- Backend `updateCase`: same -- no required-field validation. All fields are optional content.
- Frontend CRFForm: simplify draft save logic -- remove placeholder injection since backend no longer requires those fields. Show a clear inline prompt to log in if the user clicks Save Draft without being logged in.

### Remove
- The `babysName`/`dateOfBirth` required-field check from the backend

## Implementation Plan
1. Regenerate Motoko backend without the required-field trap in createCase/updateCase
2. Update frontend CRFForm handleSave to remove placeholder logic and show a better login prompt
