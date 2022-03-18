import { Box, Text } from 'ink';
import Divider from 'ink-divider';
import React, { PropsWithChildren, useMemo } from 'react';
import { getBigText } from '../utils';

interface PageLayoutProps {
  name: string;
  version: string;
  description: string;
}

export const PageLayout: React.FC<PropsWithChildren<PageLayoutProps>> = ({ name, version, description, children }) => {
  const bigText = useMemo(() => {
    return getBigText(name);
  }, [name]);

  return (
    <>
      <Text>{bigText}</Text>
      <Box justifyContent="flex-end" marginTop={-2} width={82} marginBottom={1}>
        <Text>version: </Text>
        <Text color="green">{version}</Text>
      </Box>
      <Divider title={description} width={82} />
      <Box flexDirection="column" marginBottom={2} marginTop={2} paddingLeft={2}>
        {children}
      </Box>
    </>
  );
};
