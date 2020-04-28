import os from 'os';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
import fse from 'fs-extra';
import validateProjectName from 'validate-npm-package-name';
import {
  isProjectNameValid,
  isTemplateValid,
  isPathValid,
  getTemplateManifest,
  getTemplateBasePath
} from './helpers';
import { Step } from './types';

const execAsync = util.promisify(exec);

export const getSteps = (name: string, template: string, appPath: string): Step[] => [
  {
    name: 'checkParameters',
    messages: {
      active: `Checking the name: ${name}, template:${template}, and path:${appPath}`,
      completed: '',
      error: ''
    },
    action: async () => {
      if (!isProjectNameValid(name)) {
        const { errors, warnings } = validateProjectName(name);
        const messages: string[] = [
          `Could not create a project called "${name}" because of npm naming restrictions:`
        ];

        if (errors) {
          errors.forEach((error) => {
            messages.push(`  *  ${error}`);
          });
        }
        if (warnings) {
          warnings.forEach((warning) => {
            messages.push(`  *  ${warning}`);
          });
        }
        throw messages.join('\n');
      }

      if (!isTemplateValid(template)) {
        throw `The template "${template}" is not supported yet! Please use "node" or "web"`;
      }

      if (!isPathValid(appPath)) {
        const messages = [
          `Creating the project in "${appPath}" failed!`,
          'Please ensure you are not creating the project in an existing directory'
        ];
        throw messages.join('\n');
      }
    }
  },
  {
    name: 'createApp',
    messages: {
      active: `Creating a new project in "${appPath}"`,
      completed: `The project was initialized in "${appPath}"`,
      error: ''
    },
    action: async () => {
      fse.ensureDirSync(appPath);
    }
  },
  {
    name: 'generatePkgJSON',
    messages: {
      active: `Generating the package.json for "${template}" template`,
      completed: `The package.json for "${template}" template was generated`,
      error: ''
    },
    action: async () => {
      const packageInfo = {
        name,
        version: '0.1.0',
        private: true
      };
      const { scripts } = getTemplateManifest(template);
      const packageJson = { ...packageInfo, scripts };
      fse.writeFileSync(
        path.join(appPath, 'package.json'),
        JSON.stringify(packageJson, null, 2) + os.EOL
      );
    }
  },
  {
    name: 'copyTemplateFiles',
    messages: {
      active: `Copying files from template "${template}" to "${appPath}"`,
      completed: `The files from "${template}" template were copied to "${appPath}"`,
      error: ''
    },
    action: async () => {
      const { files } = getTemplateManifest(template);
      const templateBasePath = getTemplateBasePath(template);

      files.forEach((file: string) => {
        const filePath = path.join(templateBasePath, file);
        const fileExists = fse.pathExistsSync(filePath);
        if (!fileExists) {
          throw `The file: "${path.basename(
            file
          )}" was not found in the "${template}" template files  `;
        }
        // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
        // See: https://github.com/npm/npm/issues/1862
        const fileName = file === 'gitignore' ? '.gitignore' : file;
        const destPath = path.join(appPath, fileName);
        fse.ensureDirSync(path.dirname(destPath));
        fse.copyFileSync(filePath, destPath);
      });
    }
  },
  {
    name: 'intallPkgs',
    messages: {
      active: `Installing packages for "${template}" template`,
      completed: `The "${template}" template packages were installed`,
      error: ''
    },
    action: async () => {
      const { dependencies } = getTemplateManifest(template);
      process.chdir(appPath);
      if (dependencies.dev.length > 0) {
        await execAsync(`npm i -D ${dependencies.dev.join(' ')}`);
      }

      if (dependencies.prod.length > 0) {
        await execAsync(`npm i ${dependencies.prod.join(' ')}`);
      }
    }
  },
  {
    name: 'initializeGit',
    messages: {
      active: `Initializing a git repository in "${appPath}"`,
      completed: `The git repository in "${appPath}" was initialized`,
      error: ''
    },
    action: async () => {
      process.chdir(appPath);
      await execAsync(`git init`);
    }
  }
];
