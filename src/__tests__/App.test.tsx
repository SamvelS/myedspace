import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

beforeEach(() => {
  window.localStorage.clear();
});

test("renders login button", () => {
  render(<App />);
  const loginButton = screen.getByRole("button", { name: /log in/i });
  expect(loginButton).toBeInTheDocument();
});

test("renders please log in text", () => {
  render(<App />);
  const loginElement = screen.getByText(/Please log in/i);
  expect(loginElement).toBeInTheDocument();
});

test("does not render video player when logged out", () => {
  render(<App />);
  const youtubePlayer = screen.queryByTestId("youtube-player");
  expect(youtubePlayer).not.toBeInTheDocument();
});

test("renders log out button login", () => {
  render(<App />);
  const loginButton = screen.getByRole("button", { name: /log in/i });
  act(() => {
    loginButton.click();
  });
  const logoutButton = screen.getByRole("button", { name: /log out/i });
  expect(logoutButton).toBeInTheDocument();
});

test("renders log in button after log out", () => {
  render(<App />);
  const loginButton = screen.getByRole("button", { name: /log in/i });
  act(() => {
    loginButton.click();
  });
  const logoutButton = screen.getByRole("button", { name: /log out/i });
  act(() => {
    logoutButton.click();
  });

  const newLoginButton = screen.getByRole("button", { name: /log in/i });
  expect(newLoginButton).toBeInTheDocument();
});

test("renders video after login", () => {
  render(<App />);
  const loginButton = screen.getByRole("button", { name: /log in/i });
  act(() => {
    loginButton.click();
  });
  const youtubePlayer = screen.getByTestId("youtube-player");
  expect(youtubePlayer).toBeInTheDocument();
});
