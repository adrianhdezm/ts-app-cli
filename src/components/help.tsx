import React from 'react';
import { Text, Box } from 'ink';
import { HighlightedText } from './highlighted-text';

interface HeaderProps {
  name: string;
}

export const Help: React.FC<HeaderProps> = ({ name }) => {
  return (
    <Box paddingLeft={2} marginTop={2} marginBottom={2} flexDirection="column">
      <HighlightedText text={`Usage: ${name} [options] "<project-name>"`} color="green" />
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
    </Box>
  );
};
