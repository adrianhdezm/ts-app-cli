import Ajv from 'ajv';
import chalk from 'chalk';
import { exec } from 'child_process';
import fse from 'fs-extra';
import minimist from 'minimist';
import os from 'os';
import path from 'path';
import util from 'util';
import nameValidator from 'validate-npm-package-name';

import { MANIFEST_SCHEMA, PKG_JSON_PATH, TEMPLATES_PATH } from './constants';
import { ProgramArgs } from './types';

const execAsync = util.promisify(exec);

export function isUnicodeSupported() {
  if (process.platform !== 'win32') {
    return process.env.TERM !== 'linux'; // Linux console (kernel)
  }

  return (
    Boolean(process.env.CI) ||
    Boolean(process.env.WT_SESSION) || // Windows Terminal
    process.env.ConEmuTask === '{cmd::Cmder}' || // ConEmu and cmder
    process.env.TERM_PROGRAM === 'vscode' ||
    process.env.TERM === 'xterm-256color' ||
    process.env.TERM === 'alacritty'
  );
}

export function logSymbols(symbol: string) {
  const main: Record<string, string> = {
    info: chalk.blue('ℹ'),
    success: chalk.green('✔'),
    warning: chalk.yellow('⚠'),
    error: chalk.red('✖')
  };

  const fallback: Record<string, string> = {
    info: chalk.blue('i'),
    success: chalk.green('√'),
    warning: chalk.yellow('‼'),
    error: chalk.red('×')
  };

  return isUnicodeSupported() ? main[symbol] : fallback[symbol];
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function capitalize(message: string) {
  if (typeof message !== 'string') return '';
  return message.charAt(0).toUpperCase() + message.slice(1);
}

export const getPkgJSON = () => {
  return JSON.parse(fse.readFileSync(PKG_JSON_PATH, 'utf8'));
};

export const parseProgramArgs = (args: string[]): ProgramArgs => {
  const parsedArgs = minimist(args, {
    string: ['template'],
    boolean: ['version', 'help'],
    alias: { h: 'help', v: 'version', t: 'template' },
    default: { template: 'node' }
  });

  const help = parsedArgs._.length > 1 || Object.keys(parsedArgs).length > 7 ? true : (parsedArgs.help as boolean);
  const name = parsedArgs._.length > 0 ? parsedArgs._[0] : '';
  const version = parsedArgs.version as boolean;
  const template = parsedArgs.template as string;

  return {
    help,
    name,
    version,
    template
  };
};

export const validateProjectName = async (name: string) => {
  const results = nameValidator(name);

  if (!results.validForNewPackages) {
    const { errors, warnings } = results;
    let messages: string[] = [];

    if (errors) {
      messages = [...messages, ...errors];
    }
    if (warnings) {
      messages = [...messages, ...warnings];
    }
    throw new Error(capitalize(messages.join(', ')));
  }
};

export const validateTemplate = async (template: string) => {
  const ajv = new Ajv();
  const validate = ajv.compile(MANIFEST_SCHEMA);
  const templateFolders = fse
    .readdirSync(TEMPLATES_PATH)
    .filter((file) => {
      const filePath = `${TEMPLATES_PATH}/${file}`;
      return fse.statSync(filePath).isDirectory() && fse.existsSync(`${filePath}/manifest.json`);
    })
    .filter((templateFolder) => {
      const manifest = JSON.parse(fse.readFileSync(`${TEMPLATES_PATH}/${templateFolder}/manifest.json`, 'utf8'));
      return validate(manifest);
    });

  const avaliableTemplates = templateFolders.map((templateFolder) => {
    const manifestPath = path.join(TEMPLATES_PATH, templateFolder, 'manifest.json');
    const manifest = JSON.parse(fse.readFileSync(manifestPath, 'utf8'));
    return manifest.name;
  });

  if (!avaliableTemplates.includes(template)) {
    const templates = avaliableTemplates
      .map((t, index) => (index === avaliableTemplates.length - 1 ? `or "${t}"` : `"${t}"`))
      .join(', ');
    throw new Error(`The template "${template}" is not supported yet. Please use ${templates}`);
  }
};

export const validateProjectPath = async (appPath: string) => {
  if (fse.existsSync(appPath)) {
    throw new Error(`The path: "${appPath}" is not empty`);
  }
};

export const bootstrapProject = async (appPath: string) => {
  fse.ensureDirSync(appPath);
};

export const generatePackageJSONfile = async (name: string, template: string, appPath: string) => {
  const packageInfo = {
    name,
    version: '0.1.0',
    private: true
  };

  const manifestPath = path.join(TEMPLATES_PATH, template, 'manifest.json');
  const { scripts } = JSON.parse(fse.readFileSync(manifestPath, 'utf8'));
  const packageJson = { ...packageInfo, scripts };
  fse.writeFileSync(path.join(appPath, 'package.json'), JSON.stringify(packageJson, null, 2) + os.EOL);
};

export const copyTemplateFiles = async (template: string, appPath: string) => {
  const manifestPath = path.join(TEMPLATES_PATH, template, 'manifest.json');
  const { files, basePath } = JSON.parse(fse.readFileSync(manifestPath, 'utf8'));
  const templateBasePath = path.join(TEMPLATES_PATH, template, basePath);

  files.forEach((file: string) => {
    const filePath = path.join(templateBasePath, file);
    const fileExists = fse.pathExistsSync(filePath);
    if (!fileExists) {
      throw `The file: "${path.basename(file)}" was not found in the "${template}" template files  `;
    }
    // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
    // See: https://github.com/npm/npm/issues/1862
    const fileName = file === 'gitignore' ? '.gitignore' : file;
    const destPath = path.join(appPath, fileName);
    fse.ensureDirSync(path.dirname(destPath));
    fse.copyFileSync(filePath, destPath);
  });
};

export const installPackageDependencies = async (template: string, appPath: string) => {
  const manifestPath = path.join(TEMPLATES_PATH, template, 'manifest.json');
  const { dependencies } = JSON.parse(fse.readFileSync(manifestPath, 'utf8'));

  process.chdir(appPath);
  if (dependencies.dev.length > 0) {
    await execAsync(`npm i -D ${dependencies.dev.join(' ')}`);
  }

  if (dependencies.prod.length > 0) {
    await execAsync(`npm i ${dependencies.prod.join(' ')}`);
  }
};

export const initializeGitRepository = async (appPath: string) => {
  process.chdir(appPath);
  await execAsync(`git init`);
};
