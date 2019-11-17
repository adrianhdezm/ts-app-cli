export const getDevDependencies = (templateName: string): string[] => {
  const common = [
    '@types/jest',
    'jest',
    'prettier',
    'ts-jest',
    'tslint-config-prettier',
    'tslint',
    'typescript'
  ];
  let dependencies: string[] = [];
  if (templateName === 'web') {
    dependencies = [
      ...common,
      '@types/core-js',
      'clean-webpack-plugin',
      'css-loader',
      'file-loader',
      'fork-ts-checker-notifier-webpack-plugin',
      'fork-ts-checker-webpack-plugin',
      'html-loader',
      'html-webpack-plugin',
      'mini-css-extract-plugin',
      'optimize-css-assets-webpack-plugin',
      'style-loader',
      'terser-webpack-plugin',
      'ts-loader',
      'tsconfig-paths-webpack-plugin',
      'webpack-cli',
      'webpack-dev-server',
      'webpack'
    ];
  } else if (templateName === 'node') {
    dependencies = [...common, '@types/node', 'cross-env', 'nodemon', 'rimraf'];
  }

  return dependencies;
};

export const getDependencies = (templateName: string): string[] => {
  let dependencies: string[] = [];
  if (templateName === 'web') {
    dependencies = ['core-js', 'whatwg-fetch', 'regenerator-runtime'];
  } else if (templateName === 'node') {
    dependencies = [];
  }

  return dependencies;
};

export const getPackageScripts = (templateName: string) => {
  const common = {
    format: `prettier --write \"./src/**/*.ts\" README.md ts*.json`,
    test: 'jest --passWithNoTests',
    lint: 'npm run format && tslint -p tsconfig.json -c tslint.json'
  };

  let scripts = {};
  if (templateName === 'node') {
    scripts = {
      ...common,
      clean: 'rimraf dist',
      build: 'npm run clean && npm run lint && tsc',
      start: 'npm run build && nodemon dist/index.js & tsc --watch --incremental',
      'start:prod': 'cross-env NODE_ENV=production node dist/index.js'
    };
  } else if (templateName === 'web') {
    scripts = {
      ...common,
      build: 'webpack --env.production',
      start: 'webpack-dev-server --env.development'
    };
  }

  return scripts;
};
