import * as React from 'react'
import '@testing-library/jest-dom'
import {render, fireEvent, screen} from '@testing-library/react'
import {App} from './App';
import {BrowserRouter} from 'react-router-dom'

test('renders login when user not logged in', () => {
  render(<BrowserRouter><App /></BrowserRouter>);
  const usernameField = screen.getByPlaceholderText(/username/i);
  const passwordField = screen.getByPlaceholderText(/password/i);
  expect(usernameField).toBeInTheDocument();
  expect(passwordField).toBeInTheDocument();
});