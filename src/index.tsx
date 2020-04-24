#!/usr/bin/env node

import React from 'react';
import { render } from 'ink';
import { CLI } from './components/cli';

render(<CLI params={process.argv.slice(2)} />);
