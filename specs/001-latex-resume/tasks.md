# Tasks: LaTeX Resume Compiler

**Input**: Design documents from `/specs/001-latex-resume/`
**Prerequisites**: spec.md (user stories), existing career-ops .mjs conventions
**Branch**: `001-latex-resume`

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

## Path Conventions

Career-ops uses Node.js `.mjs` scripts at the repository root. New files follow this same pattern.
New directories: `resume/` for .tex/.cls source files, `output/` already exists for PDFs.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the new script scaffold and source file directory

- [x] T001 Create `resume/` directory with a `.gitkeep` file for storing .tex and .cls source files
- [x] T002 Scaffold `compile-latex-resume.mjs` at repository root with shebang, top-level JSDoc comment, and import block (child_process, fs/promises, path, crypto)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure required before any user story can function

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Implement `checkLatexInstalled()` function in `compile-latex-resume.mjs` — runs `which pdflatex || which xelatex`, throws with install instructions if missing
- [x] T004 [P] Implement `guardClsReadOnly(clsPath, hash)` function in `compile-latex-resume.mjs` — computes SHA-256 hash before/after compilation, throws if .cls content changed
- [x] T005 Implement `cleanupArtifacts(baseName, dir)` function in `compile-latex-resume.mjs` — removes `.aux`, `.log`, `.out`, `.toc`, `.fls`, `.fdb_latexmk` files after compile

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 - Compile Resume and Generate PDF (Priority: P1) 🎯 MVP

**Goal**: Read .tex + .cls files, compile with LaTeX, output PDF to `output/`, never touch the .cls

**Independent Test**: `node compile-latex-resume.mjs --tex resume/resume.tex` produces `output/resume.pdf` and .cls file hash is unchanged before and after

### Implementation for User Story 1

- [x] T006 [US1] Implement `validateInputs(texPath, clsPath)` in `compile-latex-resume.mjs` — checks both files exist and are readable, throws descriptive errors
- [x] T007 [US1] Implement `runLatexCompile(texPath, workDir)` in `compile-latex-resume.mjs` — runs pdflatex twice (for references/TOC), captures stdout/stderr, throws on non-zero exit
- [x] T008 [US1] Implement `parseLatexErrors(logFilePath)` in `compile-latex-resume.mjs` — reads `.log` file, extracts `! Error:` lines and surrounding context, returns human-readable summary
- [x] T009 [US1] Implement `copyPdfToOutput(workDir, baseName, outputDir)` in `compile-latex-resume.mjs` — copies compiled `.pdf` from work dir to `output/`, creates output dir if missing
- [x] T010 [US1] Wire up main compilation pipeline in `compile-latex-resume.mjs`: checkLatex → validateInputs → hashCls → runLatex → parseErrors → copyPdf → cleanup → guardCls
- [x] T011 [US1] Add CLI argument parsing in `compile-latex-resume.mjs` — supports `--tex <path>`, `--cls <path>` (optional, auto-detect from same dir), `--output <dir>` (default: `output/`), `--help`

**Checkpoint**: `node compile-latex-resume.mjs --tex resume/resume.tex` fully functional

---

## Phase 4: User Story 2 - Edit Resume Content Dynamically (Priority: P2)

**Goal**: Allow users to pass template variables that get substituted into the .tex before compilation, enabling tailored resume versions per job

**Independent Test**: `node compile-latex-resume.mjs --tex resume/resume-template.tex --var JOBTITLE="ML Engineer" --var COMPANY="Anthropic"` generates a PDF reflecting the substitutions

### Implementation for User Story 2

- [x] T012 [US2] Create `resume/resume-template.tex` — sample LaTeX resume template using `{{PLACEHOLDER}}` syntax for dynamic fields (e.g., `{{JOBTITLE}}`, `{{COMPANY}}`, `{{SKILLS}}`, `{{SUMMARY}}`)
- [x] T013 [US2] Implement `applyTemplateVars(texContent, vars)` in `compile-latex-resume.mjs` — replaces all `{{KEY}}` occurrences with provided values, escapes LaTeX special chars in values
- [x] T014 [US2] Implement `writeTempTex(originalPath, substitutedContent, workDir)` in `compile-latex-resume.mjs` — writes substituted .tex to a temp file for compilation without modifying original
- [x] T015 [US2] Add `--var KEY=VALUE` CLI argument support (repeatable) and `--vars-file <json>` support in `compile-latex-resume.mjs` — reads a JSON file of key-value pairs as substitution variables

**Checkpoint**: Template-based compilation works; original .tex file and .cls both remain unmodified

---

## Phase 5: User Story 3 - Integration with Career-Ops Application Workflow (Priority: P3)

**Goal**: The LaTeX compiler becomes a first-class PDF generation option within career-ops, usable from the `/career-ops pdf` and `/career-ops apply` flows

**Independent Test**: Running `/career-ops pdf` prompts the user to choose between HTML template or LaTeX resume, and the generated PDF appears in `output/` ready for applications

### Implementation for User Story 3

- [x] T016 [US3] Add `latex` as a PDF generation option in `modes/oferta.md` pdf section — document that users can run `node compile-latex-resume.mjs` as an alternative to `generate-pdf.mjs`
- [x] T017 [US3] Update the `pdf` skill mode in `CLAUDE.md` modes table to include the LaTeX compiler command as a generation option alongside the Playwright HTML workflow
- [x] T018 [US3] Update `modes/_profile.md` template to include `latex_resume_tex` and `latex_resume_cls` file path fields so the career-ops agent knows where the user's .tex and .cls files are located
- [x] T019 [US3] Add `compile-latex-resume.mjs` to `test-all.mjs` health checks — verify file exists and pdflatex is available, output a pass/fail line consistent with existing checks

**Checkpoint**: Career-ops skill can invoke the LaTeX compiler; PDF is tracked in applications

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Hardening, documentation, and usability improvements across all stories

- [x] T020 [P] Add `resume/*.pdf` and `resume/*.aux` to `.gitignore` (keep .tex and .cls tracked; ignore compilation artifacts in the resume dir)
- [x] T021 [P] Add a `--dry-run` flag in `compile-latex-resume.mjs` — validates all inputs and prints what would be compiled without executing LaTeX
- [x] T022 Add a usage example block to the top of `compile-latex-resume.mjs` JSDoc comment covering basic and template-variable invocations

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — blocks all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational — the MVP
- **User Story 2 (Phase 4)**: Depends on Phase 3 (uses the compilation pipeline)
- **User Story 3 (Phase 5)**: Depends on Phase 3 (needs the working compiler)
- **Polish (Phase 6)**: Can begin after Phase 3; T019 requires Phase 5

### User Story Dependencies

- **US1 (P1)**: No story dependencies — core foundation
- **US2 (P2)**: Depends on US1 (wraps the compilation pipeline with templating)
- **US3 (P3)**: Depends on US1 (references the working compiler); US2 enhances it

### Within Each User Story

- Utility functions (T003–T005) before pipeline wiring (T010)
- Validation before compilation
- Compilation before output copy
- All functions before CLI wiring

### Parallel Opportunities

- T003 and T004 can run in parallel (independent functions)
- T006 and T012 can run in parallel (different concerns)
- T016 and T017 can run in parallel (different files)
- T020 and T021 can run in parallel (different files/features)

---

## Parallel Example: User Story 1

```bash
# Run in parallel after Foundational phase:
Task: "T003 — Implement checkLatexInstalled() in compile-latex-resume.mjs"
Task: "T004 — Implement guardClsReadOnly() in compile-latex-resume.mjs"
Task: "T005 — Implement cleanupArtifacts() in compile-latex-resume.mjs"

# Then wire up sequentially:
Task: "T006 — validateInputs()"
Task: "T007 — runLatexCompile()"
Task: "T008 — parseLatexErrors()"
Task: "T009 — copyPdfToOutput()"
Task: "T010 — Wire main pipeline"
Task: "T011 — CLI args"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: `node compile-latex-resume.mjs --tex resume/resume.tex` → PDF in `output/`, .cls unchanged
5. Ship MVP — users can compile their LaTeX resume immediately

### Incremental Delivery

1. Setup + Foundational → scaffolding ready
2. User Story 1 → working LaTeX compiler (MVP!)
3. User Story 2 → dynamic content tailoring per job
4. User Story 3 → embedded in career-ops workflow
5. Polish → production hardened

---

## Notes

- All code targets Node.js ESM (`.mjs`, `import`/`export`), no CommonJS
- LaTeX compilation uses `child_process.spawnSync` or `execSync` — keep it simple
- The .cls file MUST never be written to; enforce this with hash verification (T004, T009)
- Run pdflatex twice — required for correct cross-references and ToC generation
- Temporary compilation files live in a temp working directory; never pollute the `resume/` source dir
- The `output/` directory already exists in career-ops (used by generate-pdf.mjs)
- [P] tasks = different files or independent functions, no dependencies
- [Story] label maps tasks to specific user stories for traceability
