// src/tests/Header.test.jsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../components/Header";

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );
}

describe("Header component", () => {
  it("renders the brand name", () => {
    renderHeader();
    // Matches: <span class="brand">PortfolioTracker</span>
    expect(screen.getByText(/portfoliotracker/i)).toBeInTheDocument();
  });

  it("renders all main navigation links", () => {
    renderHeader();

    // These match your <a> link texts in the screenshot
    expect(
      screen.getByRole("link", { name: /home/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /dashboard/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /positions/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /timelines/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /politicians/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /reports & alerts/i })
    ).toBeInTheDocument();

    // And the "Set Token" button
    expect(
      screen.getByRole("button", { name: /set token/i })
    ).toBeInTheDocument();
  });
});
