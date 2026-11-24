#!/usr/bin/env node
// Carga el backlog común del curso en TU repositorio de GitHub:
//   1. Etiquetas (labels): una por épica, más "historia", "bonus" y "bug".
//   2. Hitos (milestones): Sprint 0 … Sprint 6, con su fecha de entrega.
//   3. Un Issue por historia, con su épica, sprint y criterios de aceptación.
//   4. Un GitHub Project "<repo> · Backlog" con todos los Issues.
//
// Requisitos: GitHub CLI instalado (https://cli.github.com) y sesión iniciada:
//   gh auth login
//   gh auth refresh -s project     ← permiso para crear el Project
//
// Uso (desde la carpeta de tu repositorio):
//   npm run backlog                    hace todo
//   npm run backlog -- --dry-run       solo muestra lo que haría, sin crear nada
//   npm run backlog -- --sin-project   crea etiquetas, hitos e Issues, pero no el Project
//
// Se puede ejecutar varias veces: lo que ya existe no se duplica.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');
const WITH_PROJECT = !args.has('--sin-project');

const backlog = JSON.parse(readFileSync(path.join(import.meta.dirname, 'backlog.json'), 'utf8'));
const epics = new Map(backlog.epics.map((epic) => [epic.id, epic]));

// ── utilidades ──────────────────────────────────────────────────────────────────
function gh(argv) {
  return execFileSync('gh', argv, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function ghWrite(argv, description) {
  if (DRY_RUN) {
    console.log(`  [dry-run] ${description}`);
    return '';
  }
  return gh(argv);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

// ── 0. Comprobaciones ───────────────────────────────────────────────────────────
try {
  gh(['--version']);
} catch {
  fail('No encuentro GitHub CLI (gh). Instálalo desde https://cli.github.com y vuelve a intentar.');
}
try {
  gh(['auth', 'status']);
} catch {
  fail('No has iniciado sesión en GitHub CLI. Ejecuta:  gh auth login');
}

let repo;
try {
  repo = JSON.parse(gh(['repo', 'view', '--json', 'nameWithOwner,name,owner,url']));
} catch {
  fail('Esta carpeta no está conectada a un repositorio de GitHub. Ejecuta el script dentro de tu repositorio clonado.');
}
const owner = repo.owner.login;
console.log(`\nRepositorio: ${repo.nameWithOwner}${DRY_RUN ? '   (modo dry-run: no se crea nada)' : ''}\n`);

// ── 1. Etiquetas ────────────────────────────────────────────────────────────────
console.log('1/4 Etiquetas');
const labels = [
  { name: 'historia', color: '0e8a16', description: 'Historia de usuario' },
  { name: 'bonus', color: 'fbca04', description: 'Opcional: suma puntos extra' },
  { name: 'bug', color: 'd73a4a', description: 'Algo no funciona' },
  ...backlog.epics.map((epic) => ({
    name: `epica:${epic.id}`,
    color: epic.color,
    description: `${epic.id} · ${epic.name}`,
  })),
];
for (const label of labels) {
  ghWrite(
    ['label', 'create', label.name, '--color', label.color, '--description', label.description, '--force'],
    `etiqueta ${label.name}`,
  );
}
console.log(`  ✓ ${labels.length} etiquetas listas`);

// ── 2. Hitos (milestones) ───────────────────────────────────────────────────────
console.log('2/4 Hitos (un hito por sprint)');
const existingMilestones = new Set(
  JSON.parse(gh(['api', `repos/${repo.nameWithOwner}/milestones?state=all&per_page=100`])).map((m) => m.title),
);
for (const sprint of backlog.sprints) {
  if (existingMilestones.has(sprint.title)) continue;
  ghWrite(
    [
      'api', '-X', 'POST', `repos/${repo.nameWithOwner}/milestones`,
      '-f', `title=${sprint.title}`,
      '-f', `description=${sprint.weeks} · ${sprint.goal}`,
      ...(sprint.due ? ['-f', `due_on=${sprint.due}T12:00:00Z`] : []),
    ],
    `hito ${sprint.title}`,
  );
}
console.log(`  ✓ ${backlog.sprints.length} hitos listos`);

// ── 3. Issues ───────────────────────────────────────────────────────────────────
console.log('3/4 Issues (uno por historia)');
const existingIssues = JSON.parse(
  gh(['issue', 'list', '--state', 'all', '--limit', '500', '--json', 'title,url']),
);
const urlById = new Map();
for (const issue of existingIssues) {
  const id = issue.title.split(' · ')[0];
  urlById.set(id, issue.url);
}

function issueBody(story) {
  const epic = epics.get(story.epic);
  const criteria = story.criteria.map((c) => `- [ ] ${c}`).join('\n');
  return [
    `**Épica:** ${epic.id} · ${epic.name}`,
    `**Unidad del programa:** ${epic.unit}`,
    `**Sprint:** ${story.sprint}${story.bonus ? '  ·  **Bonus**' : ''}`,
    '',
    '## Historia',
    '',
    story.story,
    '',
    '## Criterios de aceptación',
    '',
    criteria,
    '',
    '## Definición de terminado',
    '',
    '- [ ] Cerrado por un PR con descripción y bitácora de IA',
    '- [ ] Tipos, pruebas e integración continua en verde',
    '- [ ] Revisado y aprobado por mi compañero',
    '- [ ] Desplegado',
    '',
    '> Adapta esta historia a tu producto: escribe en un comentario cómo se aplica en tu caso',
    '> (por ejemplo, qué es "la cola" en tu dominio) antes de empezar a programar.',
  ].join('\n');
}

let created = 0;
for (const story of backlog.stories) {
  if (urlById.has(story.id)) continue;
  const title = `${story.id} · ${story.title}`;
  const argv = [
    'issue', 'create',
    '--title', title,
    '--body', issueBody(story),
    '--label', 'historia',
    '--label', `epica:${story.epic}`,
    '--milestone', story.sprint,
  ];
  if (story.bonus) argv.push('--label', 'bonus');
  const url = ghWrite(argv, `issue ${title}`);
  if (url) urlById.set(story.id, url);
  created++;
  if (!DRY_RUN) await sleep(800); // pausa corta para no chocar con los límites de GitHub
}
console.log(`  ✓ ${created} issues nuevos (${backlog.stories.length - created} ya existían)`);

// ── 4. GitHub Project ───────────────────────────────────────────────────────────
if (!WITH_PROJECT) {
  console.log('4/4 Project omitido (--sin-project)\n');
  process.exit(0);
}
console.log('4/4 GitHub Project');
const projectTitle = `${repo.name} · Backlog`;
let projects;
try {
  projects = JSON.parse(gh(['project', 'list', '--owner', owner, '--format', 'json', '--limit', '100'])).projects;
} catch {
  fail(
    'Tu sesión de gh no tiene permiso para Projects. Ejecuta:\n\n    gh auth refresh -s project\n\n' +
      'y vuelve a correr  npm run backlog  (los Issues ya creados no se duplican).',
  );
}

let project = projects.find((p) => p.title === projectTitle);
if (!project) {
  if (DRY_RUN) {
    console.log(`  [dry-run] crear el Project "${projectTitle}" y agregarle ${backlog.stories.length} issues\n`);
    process.exit(0);
  }
  project = JSON.parse(gh(['project', 'create', '--owner', owner, '--title', projectTitle, '--format', 'json']));
  console.log(`  ✓ Project creado: ${project.url}`);
}

try {
  ghWrite(['project', 'link', String(project.number), '--owner', owner, '--repo', repo.nameWithOwner], 'vincular Project al repositorio');
} catch {
  // Ya estaba vinculado.
}

let added = 0;
for (const story of backlog.stories) {
  const url = urlById.get(story.id);
  if (!url) continue;
  ghWrite(['project', 'item-add', String(project.number), '--owner', owner, '--url', url], `agregar ${story.id} al Project`);
  added++;
}
console.log(`  ✓ ${added} issues en el Project`);
console.log(`\nListo. Abre tu Project y sigue el tutorial de GitHub Projects para configurar las columnas:\n  ${project.url}\n`);
