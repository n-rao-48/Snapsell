import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the main heading of the application', () => {
  render(<App />);
  const headingElement = screen.getByText(/Available Auctions/i);
  expect(headingElement).toBeInTheDocument();
});