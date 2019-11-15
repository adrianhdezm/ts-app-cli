export const getDevDependencies = (templateName: string): string[] => {
  let dependencies: string[] = [];

  if (templateName === 'web') {
    dependencies = [
      '@types/core-js',
      '@types/jest',
      'clean-webpack-plugin',
      'css-loader',
      'file-loader',
      'fork-ts-checker-notifier-webpack-plugin',
      'fork-ts-checker-webpack-plugin',
      'html-loader',
      'html-webpack-plugin',
      'jest',
      'mini-css-extract-plugin',
      'optimize-css-assets-webpack-plugin',
      'rimraf',
      'style-loader',
      'terser-webpack-plugin',
      'ts-jest',
      'ts-loader',
      'tsconfig-paths-webpack-plugin',
      'tslint',
      'tslint-config-prettier',
      'typescript',
      'webpack',
      'webpack-cli',
      'webpack-dev-server'
    ];
  } else if (templateName === 'node') {
    dependencies = [
      'typescript',
      'tslint',
      'rimraf',
      'prettier',
      'nodemon',
      'tslint-config-prettier',
      'cross-env',
      '@types/node'
    ];
  }

  return dependencies;
};

export const getDependencies = (templateName: string): string[] => {
  let dependencies: string[] = [];
  if (templateName === 'web') {
    dependencies = ['core-js', 'whatwg-fetch'];
  } else if (templateName === 'node') {
    dependencies = [];
  }

  return dependencies;
};

export const getPackageScripts = (templateName: string) => {
  let scripts = {};
  if (templateName === 'node') {
    scripts = {
      clean: 'rimraf dist',
      format: 'prettier --write ./src/**/*.ts README.md ts*.json',
      lint: 'npm run format && tslint -p tsconfig.json -c tslint.json',
      build: 'npm run clean && npm run lint && tsc',
      start: 'npm run build && nodemon dist/index.js & tsc --watch --incremental',
      'start:prod': 'cross-env NODE_ENV=production node dist/index.js'
    };
  } else if (templateName === 'web') {
    scripts = {
      test: 'jest --passWithNoTests',
      build: 'webpack --env.production',
      start: 'webpack-dev-server --env.development'
    };
  }

  return scripts;
};
