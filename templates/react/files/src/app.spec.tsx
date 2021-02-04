import '@testing-library/jest-dom/extend-expect';

import React from 'react';

import { App } from '@app/app';
import { render, screen } from '@testing-library/react';

describe('App', () => {
  it('renders correct default message', async () => {
    render(<App />);

    const message = await screen.findByText(/Hello World!/);

    expect(message).toBeInTheDocument();
  });

  it('renders correct welcome message', async () => {
    render(<App name="React" />);

    const message = await screen.findByText(/Hello React!/);

    expect(message).toBeInTheDocument();
  });
});
