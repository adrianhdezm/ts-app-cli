import * as fse from 'fs-extra';
import * as path from 'path';

import { CLI_ROOT_PATH } from '../src/constants';
import { isProjectNameValid, isPathValid, isTemplateValid } from '../src/helpers';

describe('Helpers', () => {
  it('isTemplateValid returns false on invalid template name', () => {
    const invalid = 'this-is-an-invalid-template-name';
    expect(isTemplateValid(invalid)).toBe(false);
  });

  it('isPathValid returns false on invalid project path', () => {
    const projectPath = path.join(CLI_ROOT_PATH, 'temp-directory');

    fse.ensureDirSync(projectPath);
    expect(isPathValid(projectPath)).toBe(false);

    fse.removeSync(projectPath);
  });

  it('isProjectNameValid returns false on invalid project name', () => {
    const nameWithUppercaseLetters = 'myNiceProject';
    const nameStartWithDot = '.myproject';
    const nameStartWithUnderscore = '_myproject';

    expect(isProjectNameValid(nameWithUppercaseLetters)).toBe(false);
    expect(isProjectNameValid(nameStartWithDot)).toBe(false);
    expect(isProjectNameValid(nameStartWithUnderscore)).toBe(false);
  });
});
