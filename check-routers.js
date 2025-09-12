#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname);
const controllersDir = path.join(root, 'controllers');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const p = path.join(dir, file);
    const stat = fs.statSync(p);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(p));
    } else {
      results.push(p);
    }
  });
  return results;
}

function checkFiles() {
  const files = walk(root).filter(f => f.endsWith('.js') || f.endsWith('.env'));
  const issues = [];
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split(/\r?\n/);
    lines.forEach((line, idx) => {
      // 1) router.<method>(
      if (/router\.(get|post|put|delete|patch|use)\s*\(/i.test(line)) {
        issues.push({file, line: idx+1, type: 'route_def', text: line.trim()});
      }
      // 2) suspicious '/:' patterns (param without name)
      if (/\/:((?!(?:[A-Za-z0-9_])).)/.test(line) || /\/:\s*['"]/ .test(line) || /\/:\s*\)/.test(line)) {
        issues.push({file, line: idx+1, type: 'bad_param', text: line.trim()});
      }
      // 3) use(...) with http in the same line
      if (/use\s*\([^)]*https?:\/\//i.test(line)) {
        issues.push({file, line: idx+1, type: 'use_http', text: line.trim()});
      }
      // 4) raw http occurrences
      if (/https?:\/\//i.test(line) && /router|app|use|mount/i.test(line)) {
        issues.push({file, line: idx+1, type: 'http_mount', text: line.trim()});
      }
    });
  });
  return issues;
}

function checkControllers() {
  const results = [];
  if (!fs.existsSync(controllersDir)) return results;
  const files = fs.readdirSync(controllersDir).filter(f => f.endsWith('.js'));
  files.forEach(file => {
    const p = path.join(controllersDir, file);
    try {
      const exp = require(p);
      const info = { file: p, type: typeof exp };
      if (exp && typeof exp === 'function' && exp.stack) info.isRouter = true;
      results.push(info);
    } catch (err) {
      results.push({ file: p, error: err.message });
    }
  });
  return results;
}

function checkEnv() {
  const p = path.join(root, '.env');
  if (!fs.existsSync(p)) return null;
  const content = fs.readFileSync(p, 'utf8');
  const lines = content.split(/\r?\n/);
  const issues = [];
  lines.forEach((line, idx) => {
    if (/^\s*DB_PASSWORD\s*=/.test(line)) {
      const val = line.split('=')[1] || '';
      if (/[\u0080-\uFFFF]/.test(val) || /[@%# ]/.test(val)) {
        issues.push({ line: idx+1, value: val, reason: 'DB_PASSWORD contains non-ascii or special chars that should be URL-encoded for a connection string' });
      }
    }
  });
  return issues;
}

function main() {
  console.log('Running project checks...');
  const issues = checkFiles();
  if (issues.length === 0) {
    console.log('No simple textual issues found in files.');
  } else {
    console.log('\nPotential issues found (file:line, type):');
    issues.forEach(i => {
      console.log(`${i.file}:${i.line} [${i.type}] -> ${i.text}`);
    });
  }

  console.log('\nChecking controllers exports...');
  const ctr = checkControllers();
  if (ctr.length === 0) console.log('No controllers found.');
  ctr.forEach(c => {
    if (c.error) {
      console.log(`- ${c.file} => require error: ${c.error}`);
    } else {
      console.log(`- ${c.file} => export type: ${c.type}` + (c.isRouter ? ' (looks like Router)' : ''));
    }
  });

  console.log('\nChecking .env for DB_PASSWORD issues...');
  const envIssues = checkEnv();
  if (!envIssues) console.log('No .env file found');
  else if (envIssues.length === 0) console.log('No DB_PASSWORD issues found.');
  else {
    envIssues.forEach(e => {
      console.log(`.env:${e.line} -> ${e.reason} (value=${e.value})`);
    });
  }

  console.log('\nDone.\n\nIf you see lines flagged as [bad_param] or [use_http] or controllers that do not export a Router, open those files and look for routes like \'/:\' without a name, or app.use(...) with an http URL, or a controller that exports something other than an Express router.');
}

main();
