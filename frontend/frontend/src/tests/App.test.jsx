// src/tests/App.test.jsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

function renderWithRouter(initialEntries = ["/"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  );
}

describe("App component", () => {
  it("renders the hero header title", () => {
    renderWithRouter();

    // This will select the <h1> "Portfolio Tracker — with personality"
    const heroHeading = screen.getByRole("heading", {
      name: /portfolio tracker/i,
    });

    expect(heroHeading).toBeInTheDocument();
  });

  it("shows the Dashboard page on the root route (/)", () => {
    renderWithRouter(["/"]);
    // This is already passing for you
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  it("shows the Politicians page when visiting /politicians", () => {
    renderWithRouter(["/politicians"]);
    // Also already passing
    expect(screen.getByText(/politicians/i)).toBeInTheDocument();
  });
});
