import React from "react";
import { render, screen } from "@testing-library/react";
import Board from "../components/Board";
import { BoardProvider } from "../context/BoardProvider";
import * as useBoardStateModule from "../hooks/useBoardState";

// Mock the useBoardState hook
jest.mock("../hooks/useBoardState");

const mockState = {
  lists: [
    {
      id: "list1",
      title: "To Do",
      cards: [
        { id: "card1", title: "Task 1", description: "" },
        { id: "card2", title: "Task 2", description: "" },
      ],
      archived: false,
    },
    {
      id: "list2",
      title: "Done",
      cards: [],
      archived: false,
    },
  ],
  history: [],
  future: [],
};

beforeEach(() => {
  useBoardStateModule.useBoardState.mockReturnValue({
    state: mockState,
    moveCard: jest.fn(),
    renameList: jest.fn(),
    addCard: jest.fn(),
    archiveList: jest.fn(),
    addList: jest.fn(),
    updateCard: jest.fn(),
    deleteCard: jest.fn(),
    undo: jest.fn(),
    redo: jest.fn(),
  });
});

test("renders board container", () => {
  const { container } = render(
    <BoardProvider>
      <Board />
    </BoardProvider>
  );

  const boardDiv = container.querySelector(".flex.gap-4.p-4.overflow-x-auto");
  expect(boardDiv).toBeInTheDocument();
});

test("renders non-archived lists", () => {
  render(
    <BoardProvider>
      <Board />
    </BoardProvider>
  );

  expect(screen.getByDisplayValue("To Do")).toBeInTheDocument();
  expect(screen.getByDisplayValue("Done")).toBeInTheDocument();
});

test("does not render archived lists", () => {
  const stateWithArchived = {
    ...mockState,
    lists: [
      ...mockState.lists,
      {
        id: "list3",
        title: "Archived List",
        cards: [],
        archived: true,
      },
    ],
  };

  useBoardStateModule.useBoardState.mockReturnValue({
    state: stateWithArchived,
    moveCard: jest.fn(),
    renameList: jest.fn(),
    addCard: jest.fn(),
    archiveList: jest.fn(),
    addList: jest.fn(),
    updateCard: jest.fn(),
    deleteCard: jest.fn(),
    undo: jest.fn(),
    redo: jest.fn(),
  });

  render(
    <BoardProvider>
      <Board />
    </BoardProvider>
  );

  expect(screen.queryByDisplayValue("Archived List")).not.toBeInTheDocument();
});

test("renders cards in lists", () => {
  render(
    <BoardProvider>
      <Board />
    </BoardProvider>
  );

  expect(screen.getByText("Task 1")).toBeInTheDocument();
  expect(screen.getByText("Task 2")).toBeInTheDocument();
});

test("renders DndContext component", () => {
  const { container } = render(
    <BoardProvider>
      <Board />
    </BoardProvider>
  );

  // DndContext adds accessibility elements
  const dndElement = container.querySelector('[id^="DndDescribedBy"]');
  expect(dndElement).toBeInTheDocument();
});