import { Box, Color, Static, Text } from 'ink';
import BigText from 'ink-big-text';
import Divider from 'ink-divider';
import React, { PropsWithChildren } from 'react';

interface PageLayoutProps {
  name: string;
  version: string;
  description: string;
}

export const PageLayout: React.FC<PropsWithChildren<PageLayoutProps>> = ({ name, version, description, children }) => {
  return (
    <>
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
      <Box flexDirection="column" marginBottom={2} marginTop={2} paddingLeft={2}>
        {children}
      </Box>
    </>
  );
};
