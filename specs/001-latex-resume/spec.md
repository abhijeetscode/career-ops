# Feature Specification: LaTeX Resume Compiler

**Feature Branch**: `001-latex-resume`  
**Created**: 2026-04-17  
**Status**: Draft  
**Input**: User description: "Add a LaTeX resume compiler tool that: takes a resume .tex file and .cls file, edits the resume .tex file (never touches .cls), compiles using LaTeX (already installed), generates PDF, and uses it for job applications"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Compile resume and generate PDF (Priority: P1)

A user has a resume in LaTeX format (.tex file) with a custom class file (.cls). They want to generate a PDF of their resume to attach to job applications. The tool reads both files, processes the .tex content, compiles using LaTeX, and outputs a PDF without modifying the .cls file.

**Why this priority**: This is the core value proposition - enabling users to generate polished resume PDFs from LaTeX sources for immediate use in job applications. It's the foundation upon which all other features depend.

**Independent Test**: Can be fully tested by providing a .tex/.cls pair, running the compiler, and verifying that a valid PDF is produced and the .cls file remains unchanged.

**Acceptance Scenarios**:

1. **Given** a valid .tex resume file and .cls class file exist, **When** user triggers compilation, **Then** a PDF is generated with correct formatting
2. **Given** a compilation is triggered, **When** the process completes, **Then** the .cls file is unchanged and only the PDF is produced
3. **Given** LaTeX is installed on the system, **When** compilation executes, **Then** all LaTeX output artifacts are properly cleaned up, leaving only the PDF

---

### User Story 2 - Edit resume content dynamically (Priority: P2)

A user wants to tailor their resume for a specific job application. The tool supports editing resume content (modifying the .tex file content like job descriptions, skills, dates) before compilation, allowing users to customize their resume for each application without modifying the class/formatting.

**Why this priority**: High - enables targeted applications where resume content is adapted to match job requirements, but secondary to basic compilation functionality.

**Independent Test**: Can be fully tested by providing a .tex file, editing specific content fields (e.g., job title, company name), recompiling, and verifying the PDF reflects the changes.

**Acceptance Scenarios**:

1. **Given** a .tex resume file, **When** user modifies content sections, **Then** changes are reflected in the compiled PDF
2. **Given** resume content is edited, **When** compilation occurs, **Then** formatting (controlled by .cls) remains consistent
3. **Given** multiple edits are made, **When** the resume is compiled, **Then** all changes appear in the final PDF

---

### User Story 3 - Integration with career-ops application workflow (Priority: P3)

The LaTeX resume compiler integrates with career-ops' existing `/career-ops pdf` workflow. When a user evaluates a job or prepares to apply, they can generate a tailored resume PDF using the compiler, which then becomes available for use in applications alongside other CV formats.

**Why this priority**: Medium-High - integrating with the existing career-ops ecosystem multiplies the tool's value by embedding it in the natural job application flow.

**Independent Test**: Can be fully tested by verifying the tool outputs a PDF that can be referenced in the career-ops application tracker and used in follow-ups.

**Acceptance Scenarios**:

1. **Given** the LaTeX compiler is available, **When** a user evaluates a job and needs a PDF, **Then** they can generate it and it's available in their applications tracker
2. **Given** a PDF has been generated, **When** the user applies, **Then** the PDF is ready for attachment
3. **Given** multiple resumes are compiled, **When** the user reviews their tracker, **Then** each application can reference the appropriate resume version

---

### Edge Cases

- What happens when the .tex file has syntax errors that LaTeX can't compile?
- How does the tool handle very large .tex files or complex LaTeX packages?
- What if the user has multiple .tex files in the same directory - which one is compiled?
- How are temporary compilation artifacts (e.g., .aux, .log files) cleaned up if LaTeX fails partway through?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST read both .tex (resume content) and .cls (formatting class) files from specified directories
- **FR-002**: System MUST NOT modify the .cls file under any circumstances (read-only)
- **FR-003**: System MUST support editing/templating of .tex resume content before compilation
- **FR-004**: System MUST execute LaTeX compilation (assumed installed and available on user's system)
- **FR-005**: System MUST generate a valid PDF output file from the compiled LaTeX
- **FR-006**: System MUST handle LaTeX compilation errors gracefully and report them to the user
- **FR-007**: System MUST clean up temporary LaTeX artifacts (.aux, .log, .out, etc.) after compilation
- **FR-008**: System MUST integrate with career-ops application tracking (store PDF reference, link to job evaluations)
- **FR-009**: System MUST support multiple resume versions (e.g., "resume-full.tex", "resume-skills.tex")

### Key Entities

- **Resume TeX File**: LaTeX source document containing resume content (job history, skills, education, etc.) - mutable
- **Resume Class File**: LaTeX class file (.cls) containing formatting rules and styling - immutable during compilation
- **Resume PDF Output**: Compiled PDF output ready for job applications - generated artifact
- **Compilation State**: Track which .tex file produced which PDF, for linking in application tracker

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can compile a resume and generate a PDF in under 15 seconds from command execution
- **SC-002**: 100% of .cls files remain unmodified after any compilation attempt (read-only enforcement)
- **SC-003**: Generated PDFs are valid, viewable, and print correctly in standard PDF readers
- **SC-004**: LaTeX compilation errors are reported with clear, actionable error messages to the user
- **SC-005**: The tool successfully integrates with career-ops' existing application tracker workflow
- **SC-006**: Multiple resume versions can be maintained and compiled independently without conflicts
- **SC-007**: Users successfully attach compiled PDFs to job applications in their first attempt (no manual file management required)

## Assumptions

- **LaTeX Environment**: LaTeX compiler (pdflatex or xelatex) is already installed and available in the user's PATH
- **File Organization**: .tex and .cls files are located in the same directory or a known relative location
- **File Permissions**: User has read permissions on .tex/.cls files and write permissions for PDF output directory
- **Scope**: Integration focuses on single-resume-per-job workflow; batch compilation of multiple resumes is out of scope for v1
- **Error Handling**: Users can troubleshoot LaTeX compilation errors with standard error messages; complex LaTeX debugging is out of scope
- **Output Format**: PDF is the primary output format; no other output formats (SVG, PNG, etc.) are required
- **Existing Career-Ops Integration**: Career-ops already has infrastructure for storing and referencing PDF files in applications
