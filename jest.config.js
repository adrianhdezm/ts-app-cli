const path = require('path');

module.exports = {
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: path.resolve(__dirname, 'src', '__tests__'),
  collectCoverage: false,
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
