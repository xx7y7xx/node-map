import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('mapbox-gl/dist/mapbox-gl', () => {
  function Map() {
    return {};
  }
  return ({ Map });
});

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/React Flow/i);
  expect(linkElement).toBeInTheDocument();
});
