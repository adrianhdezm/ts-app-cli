import React from 'react';
import { Box } from 'ink';
import Spinner from 'ink-spinner';
import symbols from 'log-symbols';
import { Step } from '../types';
import { HighlightedText } from './highlighted-text';

interface CLIStepsItemParams {
  isActive: boolean;
  step: Step;
  completed: string[];
}

export const CLIStepsItem: React.FC<CLIStepsItemParams> = ({ isActive, step, completed }) => {
  if (isActive) {
    return (
      <Box paddingLeft={3}>
        <Spinner type="clock" />
        <HighlightedText text={step.messages.active} />
      </Box>
    );
  } else if (completed.includes(step.name) && step.messages.completed !== '') {
    return (
      <Box paddingLeft={3}>
        <Box paddingRight={3}>{symbols.success}</Box>
        <HighlightedText text={step.messages.completed} color="green" />
      </Box>
    );
  } else {
    return null;
  }
};
