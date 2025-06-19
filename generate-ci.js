#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function parseArgs() {
  const args = process.argv.slice(2);
  const result = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].replace(/^--/, '');
      result[key] = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
      if (result[key] !== true) i++;
    }
  }
  return result;
}

function getAllApps() {
  // Get all projects, filter for apps
  const output = execSync('npx nx show projects --type=app', { encoding: 'utf8' });
  return output.split('\n').map(x => x.trim()).filter(Boolean);
}

function getAffectedApps(base, head) {
  let cmd = 'npx nx show projects --type=app';
  if (base && head) {
    cmd = `npx nx show projects --affected --type=app --base=${base} --head=${head}`;
  } else if (base) {
    cmd = `npx nx show projects --affected --type=app --base=${base}`;
  }
  const output = execSync(cmd, { encoding: 'utf8' });
  return output.split('\n').map(x => x.trim()).filter(Boolean);
}

function main() {
  const { app, domain, affected, base, head } = parseArgs();
  let apps = [];
  if (affected) {
    apps = getAffectedApps(base, head);
    if (apps.length === 0) {
      console.log('No affected apps found.');
      return;
    }
  } else if (app) {
    apps = [app];
  } else {
    apps = getAllApps();
  }

  const templatePath = path.join(__dirname, '.github', 'workflow-templates', 'ci-template.yml');
  const outputDir = path.join(__dirname, '.github', 'workflows');
  if (!fs.existsSync(templatePath)) {
    console.error('Template file not found:', templatePath);
    process.exit(1);
  }
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  apps.forEach(appName => {
    let template = fs.readFileSync(templatePath, 'utf8');
    template = template.replace(/\{\{APP_NAME\}\}/g, appName);
    template = template.replace(/\{\{CUSTOM_DOMAIN\}\}/g, domain || '');
    const outputPath = path.join(outputDir, `${appName}-ci.yml`);
    fs.writeFileSync(outputPath, template);
    console.log(`Generated workflow: ${outputPath}`);
  });
}

main(); 