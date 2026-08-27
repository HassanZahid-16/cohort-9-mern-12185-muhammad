import { fireEvent, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NoteCard from "../../src/components/NoteCard";

function renderNoteCard(note, onDelete = jest.fn()) {
  return render(
    <MemoryRouter>
      <NoteCard note={note} onDelete={onDelete} />
    </MemoryRouter>
  );
}

describe("NoteCard", () => {
  const note = {
    id: "note-123",
    title: "My first note",
    content: "<p>This is the note content.</p>",
  };

  it("shows the note title and content", () => {
    const { getByRole, getByText } = renderNoteCard(note);
    expect(getByRole("heading", { name: "My first note" })).toBeInTheDocument();
    expect(getByText("This is the note content.")).toBeInTheDocument();
  });

  it("removes unsafe markup from note content", () => {
    const unsafeNote = {...note, content:
        '<p>Safe content</p><script>alert("not safe")</script>',
    };
    const { container, getByText } = renderNoteCard(unsafeNote);
    expect(getByText("Safe content")).toBeInTheDocument();
    expect(container.querySelector("script")).toBeNull();
  });

  it("links the edit action to the selected note", () => {
    const { getByRole } = renderNoteCard(note);
    expect(getByRole("link", { name: "Edit note" })).toHaveAttribute(
      "href",
      "/notes/note-123"
    );
  });

  it("passes the note id to the delete handler", () => {
    const onDelete = jest.fn();
    const { getByRole } = renderNoteCard(note, onDelete);
    fireEvent.click(getByRole("button", { name: "Delete note" }));
    expect(onDelete).toHaveBeenCalledWith("note-123");
  });
});