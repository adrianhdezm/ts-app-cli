import React from 'react';
import { Step, StepAction } from '../types';
import { useMachine } from '@xstate/react';
import { Box } from 'ink';
import Divider from 'ink-divider';
import symbols from 'log-symbols';
import { cliMachineTemplate } from '../cli-machine';
import { CLIStepsItem } from './cli-steps-item';
import { HighlightedText } from './highlighted-text';

interface CLIStepsParams {
  steps: Step[];
  appPath: string;
  name: string;
}

export const CLISteps: React.FC<CLIStepsParams> = ({ steps, appPath, name }) => {
  const [state, send, service] = useMachine(cliMachineTemplate(steps), {
    services: steps.reduce<Record<string, StepAction>>((services, step) => {
      services[step.name] = step.action;
      return services;
    }, {})
  });

  if (state.matches('idle')) {
    service.start();
    send('START');
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      {steps.map((step) => (
        <CLIStepsItem
          key={step.name}
          isActive={state.matches(`${step.name}.active`)}
          step={step}
          completed={state.context.completed}
        />
      ))}
      <Box>
        {state.matches('completed') ? (
          <Box flexDirection="column" marginBottom={2}>
            <Divider width={82} key="divider" />
            <Box marginTop={2} paddingLeft={2}>
              <HighlightedText
                text={`The project "${name}" has been successfully created in "${appPath}"`}
                color="green"
              />
            </Box>
          </Box>
        ) : null}
        {state.matches('error') ? (
          <Box flexDirection="column" marginBottom={2} marginTop={2} paddingLeft={2}>
            <HighlightedText
              text={`Failed to create the project "${name}" in "${appPath}"`}
              color="red"
            />
            <Box paddingLeft={3}>
              <Box paddingRight={3}>{symbols.error}</Box>
              <HighlightedText text={state.context.error ? state.context.error : ''} />
            </Box>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};
