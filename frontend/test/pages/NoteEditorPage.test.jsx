import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import NoteEditorPage from "../../src/pages/NoteEditorPage";
import { getNote, saveNote } from "../../src/services/noteEditorService";

jest.mock("../../src/services/noteEditorService", () => ({
  getNote: jest.fn(),
  saveNote: jest.fn(),
}));

jest.mock("../../src/components/RichTextEditor", () => {
  function FakeRichTextEditor({ value, onChange }) {
    return (
      <textarea
        aria-label="Content"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }
  return FakeRichTextEditor;
});

function renderNewNote() {
  return render(
    <MemoryRouter initialEntries={["/notes/new"]}>
      <Routes>
        <Route path="/notes/new" element={<NoteEditorPage />} />
        <Route path="/" element={<p>Notes home</p>} />
      </Routes>
    </MemoryRouter>
  );
}

function renderExistingNote(noteId = "note-42") {
  return render(
    <MemoryRouter initialEntries={[`/notes/${noteId}`]}>
      <Routes>
        <Route path="/notes/:noteId" element={<NoteEditorPage />} />
        <Route path="/" element={<p>Notes home</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("NoteEditorPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows the new-note form without loading a note", () => {
    renderNewNote();
    expect(
      screen.getByRole("heading", { name: "New note" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Content")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save note" })
    ).toBeInTheDocument();
    expect(getNote).not.toHaveBeenCalled();
  });

  it("does not save when the title or content is empty", async () => {
    renderNewNote();
    fireEvent.click(screen.getByRole("button", { name: "Save note" }));
    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent("Title and content are required.");
    expect(saveNote).not.toHaveBeenCalled();
  });

  it("saves a new note and returns to the notes page", async () => {
    saveNote.mockResolvedValueOnce({});
    renderNewNote();
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Weekend ideas" },
    });
    fireEvent.change(screen.getByLabelText("Content"), {
      target: { value: "<p>Things I want to work on this weekend.</p>" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save note" }));

    await waitFor(() => {
      expect(saveNote).toHaveBeenCalledWith(undefined, {
        title: "Weekend ideas",
        content: "<p>Things I want to work on this weekend.</p>",
      });
    });
    expect(await screen.findByText("Notes home")).toBeInTheDocument();
  });

  it("loads an existing note for editing", async () => {
    getNote.mockResolvedValueOnce({
      id: "note-42",
      title: "Things to remember",
      content: "<p>Call the client before Friday.</p>",
    });
    renderExistingNote();
    expect(
      screen.getByText("Loading your note...")
    ).toBeInTheDocument();
    expect(
      await screen.findByDisplayValue("Things to remember")
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(
        "<p>Call the client before Friday.</p>"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Edit note" })
    ).toBeInTheDocument();
    expect(getNote).toHaveBeenCalledWith("note-42");
  });

  it("saves changes to an existing note", async () => {
    getNote.mockResolvedValueOnce({
      id: "note-42",
      title: "Old title",
      content: "<p>Old content</p>",
    });
    saveNote.mockResolvedValueOnce({});
    renderExistingNote();
    const titleInput = await screen.findByDisplayValue("Old title");
    const contentInput = screen.getByDisplayValue("<p>Old content</p>");
    fireEvent.change(titleInput, {
      target: { value: "Updated title" },
    });
    fireEvent.change(contentInput, {
      target: { value: "<p>Updated content</p>" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Edit note" })
    );

    await waitFor(() => {
      expect(saveNote).toHaveBeenCalledWith("note-42", {
        title: "Updated title",
        content: "<p>Updated content</p>",
      });
    });
    expect(await screen.findByText("Notes home")).toBeInTheDocument();
  });

  it("shows the server error when loading an existing note fails", async () => {
    getNote.mockRejectedValueOnce(
      new Error("Unable to load the note.")
    );
    renderExistingNote();
    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent("Unable to load the note.");
  });

  it("shows the server error when saving fails", async () => {
    saveNote.mockRejectedValueOnce(
      new Error("Unable to save the note.")
    );
    renderNewNote();
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "A note that fails" },
    });
    fireEvent.change(screen.getByLabelText("Content"), {
      target: { value: "<p>This will not be saved.</p>" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save note" }));
    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent("Unable to save the note.");
    expect(
      screen.getByRole("button", { name: "Save note" })
    ).toBeInTheDocument();
  });
});