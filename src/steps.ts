import os from 'os';
import path from 'path';
import fse from 'fs-extra';
import validateProjectName from 'validate-npm-package-name';
import {
  delay,
  isProjectNameValid,
  isTemplateValid,
  isPathValid,
  getTemplateManifest
} from './helpers';
import { Step } from './types';

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
      await delay(5000);
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
      await delay(5000);
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
      await delay(5000);
    }
  }
];
