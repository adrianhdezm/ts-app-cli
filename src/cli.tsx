import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import React, { useEffect } from 'react';

import { useMachine } from '@xstate/react';

import { cliMachine } from './cli-machine';
import { HighlightedText } from './components/highlighted-text';
import { PageLayout } from './components/page-layout';
import { logSymbols } from './services';

interface CLIParams {
  pkgName: string;
  cliVersion: string;
  description: string;
  help: boolean;
  version: boolean;
  name: string;
  template: string;
  appPath: string;
}

export const CLI: React.FC<CLIParams> = ({
  pkgName,
  cliVersion,
  description,
  help,
  version,
  name,
  template,
  appPath
}) => {
  const [state, send] = useMachine(cliMachine, {
    context: {
      name,
      template,
      path: appPath
    }
  });

  useEffect(() => {
    if (help) {
      send('SHOW_HELP');
    } else if (version) {
      send('SHOW_VERSION');
    } else {
      send('START');
    }
  }, [help, version, send]);

  if (state.matches('version')) {
    return <Text>{cliVersion}</Text>;
  } else if (state.matches('help')) {
    return (
      <PageLayout version={cliVersion} name={pkgName} description={description}>
        <HighlightedText text={`Usage: ${pkgName} [options] "<project-name>"`} color="green" />
        <Box flexDirection="column" marginTop={1}>
          <Box>Options:</Box>
          <Box flexDirection="column" marginLeft={1}>
            <Box>
              <Box width={32}>-h,--help</Box>
              <Text>Show Help</Text>
            </Box>
            <Box>
              <Box width={32}>-v,--version</Box>
              <Text>Show CLI Version</Text>
            </Box>
            <Box>
              <Box width={32}>{`-t,--template <template-name>`}</Box>
              <Text>Specify the project template (default: node)</Text>
            </Box>
          </Box>
        </Box>
      </PageLayout>
    );
  } else if (state.matches('executing')) {
    return (
      <PageLayout version={cliVersion} name={pkgName} description={description}>
        {state.context.completedStepMessages.map((message: string, index: number) => (
          <Box key={index} paddingLeft={3}>
            <Box paddingRight={3}>
              <Text>{logSymbols('success')}</Text>
            </Box>
            <HighlightedText text={message} color="green" />
          </Box>
        ))}
        {state.context.currentStepMessage ? (
          <Box paddingLeft={3}>
            <Spinner type="clock" />
            <HighlightedText text={state.context.currentStepMessage} color="yellow" />
          </Box>
        ) : null}
      </PageLayout>
    );
  } else if (state.matches('success')) {
    return (
      <PageLayout version={cliVersion} name={pkgName} description={description}>
        <HighlightedText text={`The project "${name}" has been successfully created in "${appPath}"`} color="green" />
      </PageLayout>
    );
  } else if (state.matches('error')) {
    return (
      <PageLayout version={cliVersion} name={pkgName} description={description}>
        <HighlightedText text={`Failed to create the project "${name}" in "${appPath}"`} color="red" />
        <Box paddingLeft={3}>
          <Box paddingRight={3}>
            <Text>{logSymbols('error')}</Text>
          </Box>
          <HighlightedText text={state.context?.error?.message ? state.context.error.message : ''} color="red" />
        </Box>
      </PageLayout>
    );
  } else {
    return null;
  }
};
