---
name: html-cv-preference
description: User prefers the HTML template (not LaTeX) for career-ops CV/PDF generation
metadata:
  type: feedback
---

When generating CVs/resumes in career-ops `pdf` mode, the user wants the **HTML template flow** (`templates/cv-template.html` → `generate-pdf.mjs`), not the LaTeX `.cls` compile. They have a LaTeX setup too (`resume/*.tex`), but on both the Deep.Meta and Seamflow roles they asked for the HTML version after the LaTeX one.

**Why:** HTML output is the ATS-optimized one (single-column, standard headers, keyword competency grid, unicode normalization) and is the format they actually send.

**How to apply:** Default to the HTML/PDF flow for CV generation. Output A4 for UK/EU roles (London). Tight CSS that fits one page: header margin-bottom 10px, section 12px, section-title margin-bottom 7px, summary line-height 1.5, job li line-height 1.45. Keep to ~2 projects and 4 skill lines so it stays one page. Only use LaTeX if explicitly asked. See [[user_profile]].
