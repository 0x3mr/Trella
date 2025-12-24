import React from "react";
import { render, screen } from "@testing-library/react";
import CardDetailModal from "../components/CardDetailModal";

test("renders modal with title and description", () => {
  const card = { title: "Test", description: "Desc" };
  render(<CardDetailModal card={card} />);

  expect(screen.getByDisplayValue("Test")).toBeInTheDocument();
  expect(screen.getByDisplayValue("Desc")).toBeInTheDocument();
});
