import React from 'react';
import { Text, Static, Box, Color } from 'ink';
import BigText from 'ink-big-text';
import Divider from 'ink-divider';

interface HeaderProps {
  name: string;
  version: string;
  description: string;
}

export const Header: React.FC<HeaderProps> = ({ name, version, description }) => {
  return (
    <Static>
      <Box width={82} key="header" flexDirection="column" marginBottom={1}>
        <BigText text={name} />
        <Box justifyContent="flex-end" marginTop={-2}>
          <Text>version: </Text>
          <Color green>{version}</Color>
        </Box>
      </Box>
      <Divider width={82} key="divider" title={description} />
    </Static>
  );
};
