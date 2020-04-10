import * as fse from 'fs-extra';
import * as path from 'path';

import { CLI_ROOT_PATH } from '../src/constants';
import { checkNameIsValid, checkPathIsValid, checkTemplateIsValid } from '../src/helpers';

describe('Helpers', () => {
  it('throws on invalid template name', () => {
    expect(() => {
      checkTemplateIsValid('notvalid');
    }).toThrow();
  });

  it('throws on invalid project path', () => {
    const projectPath = path.join(CLI_ROOT_PATH, 'temp-directory');

    fse.ensureDirSync(projectPath);
    expect(() => {
      checkPathIsValid(projectPath);
    }).toThrow();

    fse.removeSync(projectPath);
  });

  it('throws on invalid project name', () => {
    const nameWithUppercaseLetters = 'myNiceProject';
    const nameStartWithDot = '.myproject';
    const nameStartWithUnderscore = '_myproject';

    expect(() => {
      checkNameIsValid(nameWithUppercaseLetters);
    }).toThrow();

    expect(() => {
      checkNameIsValid(nameStartWithDot);
    }).toThrow();

    expect(() => {
      checkNameIsValid(nameStartWithUnderscore);
    }).toThrow();
  });
});
