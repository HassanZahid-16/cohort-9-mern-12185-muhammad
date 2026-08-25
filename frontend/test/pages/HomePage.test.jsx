import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "../../src/pages/HomePage";
import { deleteNote, getNotes } from "../../src/services/noteService";

jest.mock("../../src/services/noteService", () => ({
  deleteNote: jest.fn(),
  getNotes: jest.fn(),
}));

jest.mock("../../src/components/NotesList", () => {
  function FakeNotesList({ notes, onDelete }) {
    return (
      <div>
        {notes.map((note) => (
          <div key={note.id}>
            <span>{note.title}</span>
            <button type="button" onClick={() => onDelete(note.id)}>
              Delete {note.title}
            </button>
          </div>
        ))}
      </div>
    );
  }
  return FakeNotesList;
});

function renderHomePage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  );
}

describe("HomePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads and displays the user's notes", async () => {
    getNotes.mockResolvedValueOnce([
      {
        id: "note-1",
        title: "Shopping list",
        content: "<p>Milk and bread</p>",
      },
      {
        id: "note-2",
        title: "Work notes",
        content: "<p>Finish the report</p>",
      },
    ]);
    renderHomePage();

    try {
      expect(screen.getByText("Loading your notes...")).toBeInTheDocument();
      expect(await screen.findByText("Shopping list")).toBeInTheDocument();
      expect(screen.getByText("Work notes")).toBeInTheDocument();
      expect(getNotes).toHaveBeenCalledTimes(1);
    } catch (error) {
      throw new Error("Failed during notes loading and display flow.", {
        cause: error,
      });
    }
  });

  it("shows the server error when notes cannot be loaded", async () => {
    getNotes.mockRejectedValueOnce(
      new Error("Unable to load your notes.")
    );
    renderHomePage();
    try {
      expect(
        await screen.findByRole("alert")
      ).toHaveTextContent("Unable to load your notes.");
    } catch (error) {
      throw new Error("Failed during notes loading error flow.", {
        cause: error,
      });
    }
  });

  it("removes a note after confirming deletion", async () => {
    getNotes.mockResolvedValueOnce([
      {
        id: "note-1",
        title: "Shopping list",
        content: "<p>Milk and bread</p>",
      },
    ]);
    deleteNote.mockResolvedValueOnce({
      message: "Note deleted successfully.",
    });
    jest.spyOn(window, "confirm").mockReturnValue(true);
    renderHomePage();
    try {
      expect(await screen.findByText("Shopping list")).toBeInTheDocument();
      fireEvent.click(
        screen.getByRole("button", { name: "Delete Shopping list" })
      );

      await waitFor(() => {
        expect(deleteNote).toHaveBeenCalledWith("note-1");
      });

      await waitFor(() => {
        expect(screen.queryByText("Shopping list")).not.toBeInTheDocument();
      });
    } catch (error) {
      throw new Error("Failed during note deletion flow.", {
        cause: error,
      });
    }
  });

  it("does not delete a note when deletion is cancelled", async () => {
    getNotes.mockResolvedValueOnce([
      {
        id: "note-1",
        title: "Shopping list",
        content: "<p>Milk and bread</p>",
      },
    ]);
    jest.spyOn(window, "confirm").mockReturnValue(false);
    renderHomePage();

    try {
      expect(await screen.findByText("Shopping list")).toBeInTheDocument();
      fireEvent.click(
        screen.getByRole("button", { name: "Delete Shopping list" })
      );
      expect(deleteNote).not.toHaveBeenCalled();
      expect(screen.getByText("Shopping list")).toBeInTheDocument();
    } catch (error) {
      throw new Error("Failed during cancelled note deletion flow.", {
        cause: error,
      });
    }
  });
});