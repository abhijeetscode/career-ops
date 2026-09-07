# Custom Instructions -- career-ops

<!-- ============================================================
     THIS FILE IS YOURS. It will NEVER be auto-updated.

     Put your own house rules, custom workflows, and automations
     here -- anything you want the agent to ALWAYS do (or never do).

     This is for PROCEDURAL rules ("HOW I want things done").
     For WHO you are (archetypes, narrative, comp, negotiation),
     use modes/_profile.md instead. Keeping the two separate keeps
     each one readable.

     The agent reads this file alongside the system instructions;
     your rules here take precedence over the defaults, as long as
     they don't break the Data Contract (your files are never
     touched, and we never auto-submit an application for you).

     Because this is a user-layer file, anything you write here
     survives `node update-system.mjs`. Put customizations HERE,
     not in CLAUDE.md / modes/_shared.md / other system files --
     those get overwritten on update.
     ============================================================ -->

## House Rules

<!-- Rules the agent should always follow. Examples:
     - Always write evaluation summaries in British English.
     - Never include a photo in my CV (US / ATS-first market).
     - Cap each batch run at 20 listings unless I say otherwise.
     - If a report scores below 6, skip the cover letter. -->

### Resumes: always the colourful LaTeX template

**Always generate my resume with the colourful LaTeX template.** This is the default for
every resume, whether I invoke `latex`, `pdf`, `auto-pipeline`, or just ask for a CV.
Do not fall back to the plain HTML flow unless I explicitly ask for it in that message
(e.g. "give me the ATS HTML one", or an employer demands a specific format).

Which template:

- Resolve it, never hardcode: `node cv-templates.mjs resolve cv modern --format=tex`
  → `templates/cv-template.modern.tex`.
- It is the teal + purple one: accent teal `#117A8B`, company purple `#6C2BB3`,
  Source Sans Pro. **Never Fira Sans** (I find it childish).
- Build the payload and run `node build-cv-latex.mjs` (see `modes/latex.md`), the LaTeX
  twin of `build-cv-html.mjs`. Never emit raw `.tex` markup by hand.
- Compile with `pdflatex -output-directory=output <file>.tex` run **twice**, then delete
  the `.aux` / `.log` / `.out` files.
- Page format: **A4** for UK/EU roles (letter only for US/Canada). Note that
  `templates/cv-template.modern.tex` hardcodes `\documentclass[letterpaper,11pt]` and
  `build-cv-latex.mjs` takes no page-format option, so after generating the `.tex` and
  before compiling, patch the line to `\documentclass[a4paper,10pt]` for UK/EU roles.
  Do not edit the template itself: `templates/` is System Layer and gets overwritten on
  `node update-system.mjs`.
- Target one page; if it spills, trim the weakest bullets rather than shrinking the
  template's margins.
- `.tex` source lives in `resume/`, rendered PDF goes to `output/`.

Existing hand-tuned resumes in `resume/` already follow this house style. When a role is a
close match to one of them, start from that file rather than from scratch.

**Check live GitHub repos before selecting projects for any resume/PDF.** Before Step 11 of
`pdf.md` / Step 8 of `latex.md` (selecting the top 3-4 relevant projects), pull the current
repo list from `https://api.github.com/users/abhijeetscode/repos?per_page=100&sort=updated`
(non-fork repos) and cross-check it against `cv.md`'s Open Source Contributions section.
GitHub itself is not an approved content source (see the Data Contract's Source-of-Truth
Boundary), so this is discovery only, never direct drafting:

- A repo already documented in `cv.md` with a real description/README → treat as a normal
  candidate project, select it when it best matches the JD.
- A repo NOT yet in `cv.md` that has a real description or README → surface it to me by name
  with its verified description/README text and ask before adding it to `cv.md`. Once I
  confirm, add it there first, then it becomes eligible for the resume being generated.
- A repo with no description and no README → never guess what it does or invent a bullet for
  it. Ask me directly what it is, or leave it out.
- Never fabricate metrics, stack, or outcomes for a repo beyond what its own README/description
  states.

Everything else still applies: no em dashes, no raw URLs (clickable label text via `href`,
coloured teal), no "X+ years of experience" phrasing in the summary, X-Y-Z bullets, and the
`verify-cv-facts.mjs` gate before any PDF is rendered.

**Project section title:** Use **"Relevant Open Source Projects"** rather than
"Personal Projects" in every generated resume.

**Project links:** Add clickable project links when the project has a verified
public URL in `cv.md` or `article-digest.md`.

**Flagship project:** Always include **PII Detection LLMs** in generated
resumes as a relevant open source project, with its verified Hugging Face link.

**Built AI preview gate:** Before changing the Built AI experience in `cv.md`,
first show an impactful, recruiter readable rewrite in the chat and wait for
explicit approval. Emphasise ownership, system scope, measurable outcome, and
production credibility, while preserving accurate attribution.

## Custom Workflows

<!-- Multi-step routines you run often, given a short name. Examples:
     - "weekly review": scan my saved portals, evaluate the new roles,
       then give me a one-paragraph summary of the top 3.
     - "prep <company>": pull the JD, generate STAR stories from
       article-digest.md, and draft 5 likely interview questions. -->

(none yet -- add yours above)

## Output Preferences

<!-- How you like results formatted. Examples:
     - Reports: lead with the score and the one-line verdict.
     - Show the per-step token breakdown after a batch run.
     - Save PDFs date-first: YYYY-MM-DD-company.pdf -->

(none yet -- add yours above)

## Off-Limits

<!-- Things the agent must never do for you. Examples:
     - Never auto-fill or submit an application without showing me first.
     - Never edit a system file to customize my setup -- put it here. -->

(none yet -- add yours above)
