import path from 'path';
import React, { useMemo } from 'react';
import { Text } from 'ink';
import { Help } from './help';
import { getPkgJSON, parseProgramArgs } from '../helpers';
import { getSteps } from '../steps';
import { Header } from './header';
import { CLISteps } from './cli-steps';

interface CLIParams {
  params: string[];
}

export const CLI: React.FC<CLIParams> = ({ params }) => {
  const { name: pkgName, version: cliVersion, description } = useMemo(() => getPkgJSON(), [params]);
  const { help, name, version, template } = useMemo(() => parseProgramArgs(params), [params]);
  const appPath = useMemo(() => path.resolve(name), [name]);
  const steps = useMemo(() => getSteps(name, template, appPath), [appPath, template]);

  if (version) {
    return <Text>{cliVersion}</Text>;
  }
  return (
    <>
      <Header version={cliVersion} name={pkgName} description={description} />
      {help ? <Help name={pkgName} /> : <CLISteps steps={steps} name={name} appPath={appPath} />}
    </>
  );
};
