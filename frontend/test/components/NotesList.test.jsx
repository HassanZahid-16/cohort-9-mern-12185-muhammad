import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotesList from "../../src/components/NotesList";

function renderNotesList(notes, onDelete = jest.fn()) {
  return render(
    <MemoryRouter>
      <NotesList notes={notes} onDelete={onDelete} />
    </MemoryRouter>
  );
}

describe("NotesList", () => {
  it("shows the empty state when there are no notes", () => {
    const { getByText } = renderNotesList([]);
    expect(getByText("No notes yet.")).toBeInTheDocument();
  });

  it("renders a card for each note", () => {
    const notes = [
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
    ];
    const { getByRole } = renderNotesList(notes);
    expect(
      getByRole("heading", { name: "Shopping list" })
    ).toBeInTheDocument();
    expect(
      getByRole("heading", { name: "Work notes" })
    ).toBeInTheDocument();
  });
});