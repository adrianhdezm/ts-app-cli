#!/usr/bin/env node

import { render } from 'ink';
import path from 'path';
import React from 'react';

import { CLI } from './cli';
import { getPkgJSON, parseProgramArgs } from './utils';

const params = process.argv.slice(2);
const { name: pkgName, version: cliVersion, description } = getPkgJSON();
const { help, name, version, template } = parseProgramArgs(params);
const appPath = path.resolve(name);

render(
  <CLI
    pkgName={pkgName}
    cliVersion={cliVersion}
    description={description}
    help={help}
    name={name}
    version={version}
    template={template}
    appPath={appPath}
  />
);
