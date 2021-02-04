const path = require('path');

module.exports = {
  verbose: true,
  rootDir: path.resolve(__dirname, 'src'),
  collectCoverage: false,
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/$1',
    '^@assets/(.*)$': '<rootDir>/assets/$1'
  }
};
