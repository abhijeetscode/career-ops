#!/usr/bin/env node

/**
 * compile-latex-resume.mjs — LaTeX resume compiler for career-ops
 *
 * Compiles a .tex resume file to PDF using pdflatex. The .cls class file
 * is never modified — a read-only copy is used during compilation and its
 * integrity is verified before and after.
 *
 * Usage:
 *   node compile-latex-resume.mjs --tex resume/resume.tex
 *   node compile-latex-resume.mjs --tex resume/resume.tex --output output/
 *   node compile-latex-resume.mjs --tex resume/resume-template.tex --var JOBTITLE="ML Engineer" --var COMPANY="Anthropic"
 *   node compile-latex-resume.mjs --tex resume/resume-template.tex --vars-file resume/vars-anthropic.json
 *   node compile-latex-resume.mjs --tex resume/resume.tex --dry-run
 *
 * Requirements:
 *   - pdflatex or xelatex must be installed and available in PATH
 *   - .cls file must be in the same directory as the .tex file (auto-detected)
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync, rmSync, readdirSync } from 'fs';
import { createHash } from 'crypto';
import { resolve, dirname, basename, join, extname } from 'path';
import { mkdtempSync } from 'fs';
import { tmpdir } from 'os';

// ── Utilities ────────────────────────────────────────────────────────────────

function hashFile(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex');
}

function escapeLatex(value) {
  // Escape LaTeX special characters in user-supplied substitution values.
  // Order matters: backslash must be first.
  return String(value)
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/[&%$#_{}]/g, '\\$&')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

// ── Phase 2: Foundational ────────────────────────────────────────────────────

/** T003: Verify LaTeX is installed and return the compiler binary name. */
function checkLatexInstalled() {
  for (const compiler of ['pdflatex', 'xelatex']) {
    try {
      execSync(`which ${compiler}`, { stdio: 'pipe' });
      return compiler;
    } catch {
      // try next
    }
  }
  console.error('❌  LaTeX compiler not found.');
  console.error('    Install TeX Live: https://tug.org/texlive/');
  console.error('    macOS: brew install --cask mactex');
  console.error('    Ubuntu: sudo apt install texlive-full');
  process.exit(1);
}

/** T004: Verify the .cls file hash matches the stored hash (call before AND after compilation). */
function guardClsReadOnly(clsPath, expectedHash) {
  const currentHash = hashFile(clsPath);
  if (currentHash !== expectedHash) {
    console.error(`❌  .cls file was modified during compilation: ${clsPath}`);
    console.error('    This should never happen. Report this bug.');
    process.exit(1);
  }
}

/** T005: Remove LaTeX compilation artifacts from a directory. */
function cleanupArtifacts(baseName, dir) {
  const extensions = ['.aux', '.log', '.out', '.toc', '.fls', '.fdb_latexmk', '.synctex.gz', '.bbl', '.blg'];
  for (const ext of extensions) {
    const file = join(dir, baseName + ext);
    if (existsSync(file)) {
      rmSync(file, { force: true });
    }
  }
}

// ── Phase 3: User Story 1 — Core Compilation ────────────────────────────────

/** T006: Validate that .tex and .cls files exist and are readable. */
function validateInputs(texPath, clsPath) {
  if (!existsSync(texPath)) {
    console.error(`❌  .tex file not found: ${texPath}`);
    process.exit(1);
  }
  if (!existsSync(clsPath)) {
    console.error(`❌  .cls file not found: ${clsPath}`);
    console.error(`    Place your .cls file in the same directory as the .tex file, or specify with --cls`);
    process.exit(1);
  }
  // verify readable
  try { readFileSync(texPath); } catch (e) {
    console.error(`❌  Cannot read .tex file: ${e.message}`); process.exit(1);
  }
  try { readFileSync(clsPath); } catch (e) {
    console.error(`❌  Cannot read .cls file: ${e.message}`); process.exit(1);
  }
}

/** T007: Run pdflatex twice in workDir (required for cross-references/ToC). */
function runLatexCompile(compiler, texFilename, workDir) {
  const opts = { cwd: workDir, stdio: 'pipe', encoding: 'utf-8' };
  const cmd = `${compiler} -interaction=nonstopmode -halt-on-error "${texFilename}"`;

  for (let pass = 1; pass <= 2; pass++) {
    try {
      execSync(cmd, opts);
    } catch (e) {
      // LaTeX exits non-zero on errors. We'll parse the log for details.
      const logPath = join(workDir, texFilename.replace(/\.tex$/, '.log'));
      const errorSummary = parseLatexErrors(logPath);
      console.error(`\n❌  LaTeX compilation failed (pass ${pass}):`);
      if (errorSummary) {
        console.error(errorSummary);
      } else {
        console.error(e.stdout || e.message);
      }
      process.exit(1);
    }
  }
}

/** T008: Parse LaTeX .log file and return human-readable error summary. */
function parseLatexErrors(logFilePath) {
  if (!existsSync(logFilePath)) return null;
  const lines = readFileSync(logFilePath, 'utf-8').split('\n');
  const errors = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('! ')) {
      // Collect the error line and up to 4 following lines for context
      const context = lines.slice(i, i + 5).join('\n');
      errors.push(context);
      i += 4;
    }
  }
  if (errors.length === 0) return null;
  return errors.map((e, idx) => `  Error ${idx + 1}:\n${e}`).join('\n\n');
}

/** T009: Copy the compiled PDF from workDir to outputDir. */
function copyPdfToOutput(workDir, baseName, outputDir) {
  const src = join(workDir, baseName + '.pdf');
  if (!existsSync(src)) {
    console.error(`❌  Compilation produced no PDF at: ${src}`);
    console.error('    Check the LaTeX log for errors.');
    process.exit(1);
  }
  mkdirSync(outputDir, { recursive: true });
  const dest = join(outputDir, baseName + '.pdf');
  copyFileSync(src, dest);
  return dest;
}

// ── Phase 4: User Story 2 — Dynamic Content Editing ────────────────────────

/** T013: Replace {{KEY}} placeholders in .tex content with escaped values. */
function applyTemplateVars(texContent, vars) {
  let result = texContent;
  for (const [key, value] of Object.entries(vars)) {
    const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(placeholder, escapeLatex(value));
  }
  return result;
}

/** T014: Write substituted .tex content to a temp file (original is never touched). */
function writeTempTex(originalFilename, substitutedContent, workDir) {
  const tempPath = join(workDir, originalFilename);
  writeFileSync(tempPath, substitutedContent, 'utf-8');
  return tempPath;
}

// ── CLI Argument Parsing ─────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {
    tex: null,
    cls: null,
    output: 'output',
    vars: {},
    varsFile: null,
    dryRun: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else if (arg === '--tex' && argv[i + 1]) {
      args.tex = argv[++i];
    } else if (arg === '--cls' && argv[i + 1]) {
      args.cls = argv[++i];
    } else if (arg === '--output' && argv[i + 1]) {
      args.output = argv[++i];
    } else if (arg === '--vars-file' && argv[i + 1]) {
      args.varsFile = argv[++i];
    } else if (arg === '--var' && argv[i + 1]) {
      const pair = argv[++i];
      const eq = pair.indexOf('=');
      if (eq === -1) {
        console.error(`❌  Invalid --var format: "${pair}". Expected KEY=VALUE`);
        process.exit(1);
      }
      args.vars[pair.slice(0, eq)] = pair.slice(eq + 1);
    } else if (arg === '--dry-run') {
      args.dryRun = true;
    }
  }

  return args;
}

function printHelp() {
  console.log(`
compile-latex-resume.mjs — LaTeX resume compiler for career-ops

Usage:
  node compile-latex-resume.mjs --tex <file.tex> [options]

Options:
  --tex <path>          Path to .tex resume file (required)
  --cls <path>          Path to .cls class file (auto-detected from --tex dir)
  --output <dir>        Output directory for PDF (default: output/)
  --var KEY=VALUE       Template variable substitution (repeatable)
  --vars-file <path>    JSON file with template variables
  --dry-run             Validate inputs without compiling
  --help                Show this help

Examples:
  node compile-latex-resume.mjs --tex resume/resume.tex
  node compile-latex-resume.mjs --tex resume/resume-template.tex --var JOBTITLE="ML Engineer" --var COMPANY="Anthropic"
  node compile-latex-resume.mjs --tex resume/resume-template.tex --vars-file resume/vars-anthropic.json
  node compile-latex-resume.mjs --tex resume/resume.tex --output output/ --dry-run
`);
}

// ── Main Pipeline ────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || !args.tex) {
    printHelp();
    process.exit(args.help ? 0 : 1);
  }

  const texPath = resolve(args.tex);
  const texDir = dirname(texPath);
  const texBase = basename(texPath, '.tex');

  // Auto-detect .cls if not provided
  let clsPath = args.cls ? resolve(args.cls) : null;
  if (!clsPath) {
    const clsFiles = readdirSync(texDir).filter(f => f.endsWith('.cls'));
    if (clsFiles.length === 0) {
      console.error(`❌  No .cls file found in ${texDir}. Use --cls to specify one.`);
      process.exit(1);
    }
    if (clsFiles.length > 1) {
      console.error(`❌  Multiple .cls files found in ${texDir}: ${clsFiles.join(', ')}`);
      console.error('    Specify which one to use with --cls <path>');
      process.exit(1);
    }
    clsPath = join(texDir, clsFiles[0]);
  }

  const outputDir = resolve(args.output);

  // Load template vars from file if provided
  if (args.varsFile) {
    const varsFilePath = resolve(args.varsFile);
    if (!existsSync(varsFilePath)) {
      console.error(`❌  Vars file not found: ${varsFilePath}`);
      process.exit(1);
    }
    const fileVars = JSON.parse(readFileSync(varsFilePath, 'utf-8'));
    Object.assign(args.vars, fileVars);
  }

  const hasVars = Object.keys(args.vars).length > 0;

  console.log(`\n📄  LaTeX Resume Compiler`);
  console.log(`    .tex : ${texPath}`);
  console.log(`    .cls : ${clsPath}`);
  console.log(`    out  : ${outputDir}`);
  if (hasVars) {
    console.log(`    vars : ${Object.entries(args.vars).map(([k, v]) => `${k}="${v}"`).join(', ')}`);
  }

  // Phase 2: Foundation checks
  console.log('\n🔍  Checking environment...');
  const compiler = checkLatexInstalled();
  console.log(`    LaTeX: ${compiler} ✓`);

  validateInputs(texPath, clsPath);
  console.log(`    Files: validated ✓`);

  const clsHashBefore = hashFile(clsPath);
  console.log(`    .cls hash: ${clsHashBefore.slice(0, 12)}... ✓`);

  if (args.dryRun) {
    console.log('\n✅  Dry run complete — all inputs valid. No compilation performed.\n');
    process.exit(0);
  }

  // Create isolated temp working directory
  const workDir = mkdtempSync(join(tmpdir(), 'latex-resume-'));

  try {
    // Determine the .tex content to compile (with or without substitutions)
    let texContent = readFileSync(texPath, 'utf-8');
    if (hasVars) {
      console.log('\n✏️   Applying template variables...');
      texContent = applyTemplateVars(texContent, args.vars);
      const missing = [...texContent.matchAll(/\{\{(\w+)\}\}/g)].map(m => m[1]);
      if (missing.length > 0) {
        console.warn(`    ⚠️  Unreplaced placeholders: {{${missing.join('}}, {{')}}}`);
      }
    }

    // Write .tex to work dir (either original or substituted)
    writeTempTex(texBase + '.tex', texContent, workDir);

    // Copy .cls to work dir (needed by LaTeX, but original is never touched)
    const clsFilename = basename(clsPath);
    copyFileSync(clsPath, join(workDir, clsFilename));

    // Compile
    console.log('\n⚙️   Compiling (2 passes)...');
    runLatexCompile(compiler, texBase + '.tex', workDir);
    console.log('    Pass 1 ✓');
    console.log('    Pass 2 ✓');

    // Copy PDF to output
    const pdfDest = copyPdfToOutput(workDir, texBase, outputDir);
    console.log(`\n✅  PDF generated: ${pdfDest}`);

  } finally {
    // Always clean up temp dir
    rmSync(workDir, { recursive: true, force: true });
  }

  // Guard: verify the ORIGINAL .cls was never touched
  guardClsReadOnly(clsPath, clsHashBefore);
  console.log('    .cls integrity: verified ✓\n');
}

main().catch(err => {
  console.error(`\n❌  Unexpected error: ${err.message}`);
  process.exit(1);
});
