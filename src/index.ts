#!/usr/bin/env node

import * as chalk from 'chalk';
import { exec } from 'child_process';
import * as program from 'commander';
import * as figlet from 'figlet';
import * as fse from 'fs-extra';
import * as ora from 'ora';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util';

import { CLI_ROOT_PATH, TEMPLATES_PATH } from './constants';
import { checkNameIsValid, checkPathIsValid, checkTemplateIsValid } from './helpers';
import { getDependencies, getDevDependencies, getPackageScripts } from './resolvers';

const execAsync = util.promisify(exec);
const pkgJSONPath = path.join(CLI_ROOT_PATH, 'package.json');
const pkgJSON = JSON.parse(fse.readFileSync(pkgJSONPath, 'utf8'));

const { name: pkgName, description, version } = pkgJSON;
const appBanner = figlet.textSync(pkgName, { horizontalLayout: 'full' });

console.clear();
console.log(chalk.green(appBanner));
console.log('\n');

let projectName = '';

program.name(pkgName);
program.version(version);
program.description(description);
program.arguments('<project-directory>');
program.usage(`${chalk.green('<project-directory>')} [options]`);
program.action((name: string) => {
  projectName = name;
});
program.option('-t, --template <template-name>', 'Specify the template for the app', 'node');
program.parse(process.argv);

if (projectName === '') {
  console.error('Please specify the project directory:');
  console.log(`  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`);
  console.log();
  console.log('For example:');
  console.log(`  ${chalk.cyan(program.name())} ${chalk.green('my-app')}`);
  console.log();
  console.log(`Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`);
  process.exit(1);
}

(async () => {
  try {
    const templateName = program.template;
    const appPath = path.resolve(projectName);
    const appName = path.basename(appPath);

    checkTemplateIsValid(templateName);
    checkPathIsValid(appPath);
    checkNameIsValid(appName);

    fse.ensureDirSync(appPath);
    console.log(`Creating a new App in ${chalk.green(appPath)}.`);
    console.log();

    const packageInfo = {
      name: appName,
      version: '0.1.0',
      private: true
    };

    const packageJson = { ...packageInfo, scripts: getPackageScripts(templateName) };

    fse.writeFileSync(
      path.join(appPath, 'package.json'),
      JSON.stringify(packageJson, null, 2) + os.EOL
    );

    const templatePath = path.join(TEMPLATES_PATH, templateName);
    fse.copySync(templatePath, appPath);

    const spinner = ora({ color: 'yellow' });
    spinner.start(`Installing packages for ${chalk.green(templateName)} template...`);
    process.chdir(appPath);
    const devDependencies = getDevDependencies(templateName);
    if (devDependencies.length > 0) {
      await execAsync(`npm i -D ${devDependencies.join(' ')}`);
    }

    const dependencies = getDependencies(templateName);
    if (dependencies.length > 0) {
      await execAsync(`npm i ${dependencies.join(' ')}`);
    }
    spinner.succeed(`Installed packages for ${chalk.green(templateName)} template.`);

    spinner.start('Initializing a git repository...');
    await execAsync(`git init`);
    spinner.succeed('Initialized a git repository.');

    console.log();
    console.log(
      `${chalk.green('Success!')} Created ${chalk.green(appName)} at ${chalk.green(appPath)}`
    );
  } catch (error) {
    console.error(`${chalk.red('Error!')} ${error}`);
  }
})();
