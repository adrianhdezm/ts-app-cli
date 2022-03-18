import chalk from 'chalk';
import fse from 'fs-extra';
import minimist from 'minimist';
import CFonts from 'cfonts';
import { PKG_JSON_PATH } from './constants';
import { ProgramArgs } from './types';

export function getBigText(text: string) {
  const output = CFonts.render(text, {
    font: 'block', // define the font face
    align: 'left', // define text alignment
    colors: ['system'], // define all colors
    background: 'transparent', // define the background color, you can also use `backgroundColor` here as key
    letterSpacing: 1, // define letter spacing
    lineHeight: 1, // define the line height
    space: true, // define if the output text should have empty lines on top and on the bottom
    maxLength: '0' // define how many character can be on one line
  });
  return output.string;
}

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
