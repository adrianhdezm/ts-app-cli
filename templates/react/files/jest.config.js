const path = require('path');

module.exports = {
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: path.resolve(__dirname, 'src'),
  collectCoverage: false,
  testRegex: '.spec.ts$',
  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/$1',
    '^@assets/(.*)$': '<rootDir>/assets/$1'
  }
};
