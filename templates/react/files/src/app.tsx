import React from 'react';

interface AppProps {
  name?: string;
}

export const App = ({ name }: AppProps): JSX.Element => {
  const msg = `Hello ${name}!`;
  return (
    <>
      <p>{msg}</p>
    </>
  );
};

App.defaultProps = {
  name: 'World'
};
