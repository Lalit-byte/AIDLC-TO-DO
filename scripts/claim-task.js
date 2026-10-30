#!/usr/bin/env node

/**
 * scripts/claim-task.js
 *
 * Automated task claiming for multi-developer AI-DLC workflow.
 * 
 * Usage:
 *   node scripts/claim-task.js <TASK_ID> [DEVELOPER_NAME]
 * 
 * Example:
 *   node scripts/claim-task.js B3
 *   node scripts/claim-task.js B3 "Lalit"
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const TASKS_PATH = path.join(REPO_ROOT, 'docs', 'TASKS.md');

function run(cmd, options = {}) {
  try {
    return execSync(cmd, { cwd: REPO_ROOT, encoding: 'utf8', stdio: 'pipe', ...options }).trim();
  } catch (error) {
    throw new Error(`Command failed: ${cmd}\n${error.stderr || error.message}`);
  }
}

function getGitUser() {
  try {
    return run('git config user.name') || process.env.USERNAME || process.env.USER || 'Developer';
  } catch {
    return process.env.USERNAME || process.env.USER || 'Developer';
  }
}

function parseTasksTable(content) {
  const lines = content.split('\n');
  const tasks = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith('|')) continue;

    const parts = line.split('|').map((p) => p.trim()).slice(1, -1);
    if (parts.length >= 6) {
      const [id, task, req, files, dependsOn, status] = parts;
      if (id === 'ID' || id.startsWith('---')) continue;

      tasks.push({
        lineIndex: i,
        rawLine: lines[i],
        id,
        task,
        req,
        files,
        dependsOn,
        status,
      });
    }
  }

  return { lines, tasks };
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 30);
}

function main() {
  const targetId = process.argv[2]?.trim();
  const customName = process.argv[3]?.trim();

  if (!fs.existsSync(TASKS_PATH)) {
    console.error(`❌ Error: docs/TASKS.md not found at ${TASKS_PATH}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(TASKS_PATH, 'utf8');
  const { lines, tasks } = parseTasksTable(fileContent);

  if (!targetId) {
    console.log('📋 Usage: node scripts/claim-task.js <TASK_ID> [DEVELOPER_NAME]\n');
    console.log('Available tasks:');
    for (const t of tasks) {
      const indicator = t.status === 'done' ? '✅' : t.status.startsWith('in-progress') ? '⏳' : '⬜';
      console.log(`  ${indicator} [${t.id.padEnd(3)}] ${t.task.slice(0, 50).padEnd(52)} (Status: ${t.status})`);
    }
    process.exit(0);
  }

  const matched = tasks.find((t) => t.id.toLowerCase() === targetId.toLowerCase());

  if (!matched) {
    console.error(`❌ Task with ID "${targetId}" not found in docs/TASKS.md.`);
    process.exit(1);
  }

  // 1. Check current status
  if (matched.status.toLowerCase() === 'done') {
    console.error(`❌ Task "${matched.id}" is ALREADY completed (done).`);
    process.exit(1);
  }

  if (matched.status.toLowerCase().startsWith('in-progress')) {
    console.error(`❌ Task "${matched.id}" is ALREADY in-progress: "${matched.status}".`);
    console.error(`   To avoid conflicts, coordinate with the developer before reassigning.`);
    process.exit(1);
  }

  // 2. Check dependencies
  if (matched.dependsOn && matched.dependsOn !== '-') {
    const deps = matched.dependsOn.split(',').map((d) => d.trim());
    const unmet = [];
    for (const depId of deps) {
      const dep = tasks.find((t) => t.id.toLowerCase() === depId.toLowerCase());
      if (dep && dep.status !== 'done') {
        unmet.push(`${dep.id} (${dep.status})`);
      }
    }
    if (unmet.length > 0) {
      console.warn(`⚠️ Warning: Task "${matched.id}" depends on unfinished tasks: ${unmet.join(', ')}`);
      console.warn(`   It is recommended to wait for dependencies to finish.\n`);
    }
  }

  const devName = customName || getGitUser();
  const currentBranch = run('git rev-parse --abbrev-ref HEAD');

  console.log(`🔍 Checking remote status on GitHub...`);
  try {
    run('git fetch origin');
  } catch (err) {
    console.warn(`⚠️ Could not reach remote repository (offline?). Proceeding locally.`);
  }

  // 3. Update the task row in TASKS.md
  const oldLine = lines[matched.lineIndex];
  // Replace the status column with in-progress (<devName>)
  const parts = oldLine.split('|');
  // Expected parts: ['', id, task, req, files, dependsOn, status, '']
  if (parts.length >= 8) {
    parts[6] = ` in-progress (${devName}) `;
    lines[matched.lineIndex] = parts.join('|');
  } else {
    // Fallback regex replacement
    lines[matched.lineIndex] = oldLine.replace(/\|\s*todo\s*\|/, `| in-progress (${devName}) |`);
  }

  fs.writeFileSync(TASKS_PATH, lines.join('\n'), 'utf8');
  console.log(`✍️ Updated docs/TASKS.md: Task ${matched.id} marked in-progress (${devName}).`);

  // 4. Git commit and push claim
  try {
    run('git add docs/TASKS.md');
    run(`git commit -m "docs: claim task ${matched.id} (${devName})"`);
    console.log(`📦 Committed claim to git.`);

    console.log(`🚀 Pushing claim to GitHub (branch: ${currentBranch})...`);
    run(`git push origin ${currentBranch}`);
    console.log(`✅ Claim pushed to GitHub successfully! Other developers now see your claim.`);
  } catch (err) {
    console.error(`❌ Failed to commit/push claim to remote:\n${err.message}`);
    process.exit(1);
  }

  // 5. Create feature branch if currently on master/main
  if (currentBranch === 'master' || currentBranch === 'main') {
    const slug = slugify(matched.task);
    const branchName = `${matched.id.toLowerCase()}-${slug}`;
    try {
      run(`git checkout -b ${branchName}`);
      console.log(`🌿 Created and checked out new feature branch: "${branchName}"`);
    } catch (err) {
      console.warn(`⚠️ Could not switch to new branch "${branchName}": ${err.message}`);
    }
  }

  console.log('\n========================================');
  console.log(`🎉 READY TO WORK ON TASK ${matched.id}!`);
  console.log(`   Task:        ${matched.task}`);
  console.log(`   Files:       ${matched.files}`);
  console.log(`   Requirement: ${matched.req}`);
  console.log('========================================\n');
}

main();
