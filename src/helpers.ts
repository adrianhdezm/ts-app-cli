import path from 'path';
import fs from 'fs';
import minimist from 'minimist';
import Ajv from 'ajv';
import validateProjectName from 'validate-npm-package-name';
import { ProgramArgs } from './types';
import { PKG_JSON_PATH, TEMPLATES_PATH, MANIFEST_SCHEMA } from './constants';

export const getPkgJSON = () => {
  return JSON.parse(fs.readFileSync(PKG_JSON_PATH, 'utf8'));
};

export const isProjectNameValid = (name: string) => {
  const projectNameValidationResult = validateProjectName(name);
  return projectNameValidationResult.validForNewPackages;
};

export const isPathValid = (appPath: string) => {
  return !fs.existsSync(appPath);
};

export const parseProgramArgs = (args: string[]): ProgramArgs => {
  const parsedArgs = minimist(args, {
    string: ['template'],
    boolean: ['version', 'help'],
    alias: { h: 'help', v: 'version', t: 'template' },
    default: { template: 'node' }
  });

  const help =
    parsedArgs._.length !== 1 || Object.keys(parsedArgs).length > 7
      ? true
      : (parsedArgs.help as boolean);
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

export const isManifestValid = (manifest: string) => {
  const ajv = new Ajv();
  const validate = ajv.compile(MANIFEST_SCHEMA);
  return validate(manifest);
};

export const getAllAvaliableTemplates = (templateRootPath: string): string[] => {
  const templateFolders = fs.readdirSync(templateRootPath).filter((file) => {
    const filePath = `${templateRootPath}/${file}`;
    return (
      fs.statSync(filePath).isDirectory() &&
      fs.existsSync(`${filePath}/manifest.json`) &&
      isManifestValid(JSON.parse(fs.readFileSync(`${filePath}/manifest.json`, 'utf8')))
    );
  });

  return templateFolders.map((templateFolder) => {
    const manifestPath = path.join(templateRootPath, templateFolder, 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    return manifest.name;
  });
};

export const isTemplateValid = (template: string) => {
  return getAllAvaliableTemplates(TEMPLATES_PATH).includes(template);
};

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getAnnotatedText(text: string) {
  const tokens = String(text).split('"');
  return tokens.map((token, index) => {
    const colored =
      text.includes(` "${token}" `) ||
      (index === 1 && text.includes(`"${token}" `)) ||
      (index === tokens.length - 2 && text.includes(` "${token}"`));
    return { text: token, colored };
  });
}

export function getTemplateManifest(template: string) {
  const manifestPath = path.join(TEMPLATES_PATH, template, 'manifest.json');
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

export function getTemplateFilesPath(template: string) {
  const { files } = getTemplateManifest(template);
  return files.map((file: string) => path.join(TEMPLATES_PATH, template, file));
}
