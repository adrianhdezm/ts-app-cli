import * as chalk from 'chalk';
import * as fse from 'fs-extra';
import * as validateProjectName from 'validate-npm-package-name';

export const checkTemplateIsValid = (templateName: string) => {
  if (!['node', 'web'].includes(templateName)) {
    throw new Error(
      `The template: ${chalk.red(templateName)} is not supported yet. Please use "node" or "web"`
    );
  }
};

export const checkNameIsValid = (appName: string) => {
  const validationResult = validateProjectName(appName);
  if (!validationResult.validForNewPackages) {
    const messages: string[] = [
      `Could not create a project called ${chalk.red(appName)} because of npm naming restrictions:`
    ];

    const { errors, warnings } = validationResult;
    if (errors) {
      errors.forEach((error) => {
        messages.push(chalk.red(`  *  ${error}`));
      });
    }
    if (warnings) {
      warnings.forEach((warning) => {
        messages.push(chalk.red(`  *  ${warning}`));
      });
    }
    throw new Error(`${messages.join('\n')}`);
  }
};

export const checkPathIsValid = (appPath: string) => {
  if (fse.existsSync(appPath)) {
    throw new Error(
      'Could not create a project in an existing directory, try using a different project name.'
    );
  }
};
