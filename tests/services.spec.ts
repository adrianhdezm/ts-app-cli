import * as fse from 'fs-extra';
import * as path from 'path';

import { CLI_ROOT_PATH } from '../src/constants';
import { validateProjectName, validateProjectPath, validateTemplate } from '../src/services';

describe('services', () => {
  describe('validateTemplate', () => {
    it('handels valid template name', async () => {
      const validTemplate = 'node';

      async function validateFunction() {
        await validateTemplate(validTemplate);
      }
      expect(validateFunction).not.toThrow();
    });

    it('handels invalid template name', async () => {
      const invalidTemplate = 'this-is-an-invalid-template-name';

      try {
        await validateTemplate(invalidTemplate);
      } catch (e) {
        expect(e.message).toMatch(new RegExp(`The template "${invalidTemplate}" is not supported yet.`));
      }
    });
  });
  describe('validateProjectName', () => {
    it('handels valid project name', async () => {
      const validProjectName = 'example';

      async function validateFunction() {
        await validateProjectName(validProjectName);
      }
      expect(validateFunction).not.toThrow();
    });

    it('handels invalid template name', async () => {
      const invalidTemplate = 'crazy!';

      try {
        await validateProjectName(invalidTemplate);
      } catch (e) {
        expect(e.message).toMatch(new RegExp(`Name can no longer contain special characters`));
      }
    });
  });

  describe('validateProjectPath', () => {
    it('handels valid project path', async () => {
      const projectPath = path.join(CLI_ROOT_PATH, `temp-directory-${new Date().getTime()}`);

      async function validateFunction() {
        await validateProjectPath(projectPath);
      }
      expect(validateFunction).not.toThrow();
    });

    it('handels invalid project path', async () => {
      const projectPath = path.join(CLI_ROOT_PATH, `temp-directory-${new Date().getTime()}`);
      fse.ensureDirSync(projectPath);

      try {
        await validateProjectPath(projectPath);
      } catch (e) {
        expect(e.message).toMatch(new RegExp(`The path: "${projectPath}" is not empty`));
      } finally {
        fse.removeSync(projectPath);
      }
    });
  });
});
