import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { deleteNote, getNotes } from "../services/noteService";
import NotesList from "../components/NotesList";

function HomePage() {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadNotes() {
      try {
        const userNotes = await getNotes();
        if (isMounted) {
          setNotes(userNotes);
          setErrorMessage("");
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadNotes();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleDelete(noteId) {
    const shouldDelete = window.confirm(
      "Delete this note? This action cannot be undone."
    );
    if (!shouldDelete) {
      return;
    }
    try {
      await deleteNote(noteId);
      setNotes((currentNotes) =>
        currentNotes.filter((note) => note.id !== noteId)
      );
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredNotes = notes.filter((note) => {
    if (!normalizedSearchTerm) {
      return true;
    }
    const noteDocument = new DOMParser().parseFromString(
      note.content || "",
      "text/html"
    );
    noteDocument.body.querySelectorAll("br").forEach((element) => {
      element.replaceWith(" ");
    });
    noteDocument.body
      .querySelectorAll(
        "p, div, li, h1, h2, h3, h4, h5, h6, blockquote, pre"
      )
      .forEach((element) => {
        element.before(" ");
        element.after(" ");
      });
    const noteContent = noteDocument.body.textContent
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
    return (
      note.title.toLowerCase().includes(normalizedSearchTerm) ||
      noteContent.includes(normalizedSearchTerm)
    );
  });

  let notesContent;
  if (isLoading) {
    notesContent = <p className="notes-status">Loading your notes...</p>;
  } else if (normalizedSearchTerm && filteredNotes.length === 0) {
    notesContent = <p className="notes-status">No notes found.</p>;
  } else {
    notesContent = <NotesList notes={filteredNotes} onDelete={handleDelete} />;
  }

  return (
    <section className="notes-page">
      <div className="notes-heading">
        <Link
          to="/notes/new"
          className="add-note-button"
          aria-label="Add new note"
          title="Add new note">
          <Plus size={20} strokeWidth={2} />
        </Link>
      </div>

      {errorMessage && (
        <p className="page-error" role="alert">
          {errorMessage}
        </p>
      )}

      {!isLoading && notes.length > 0 && (
        <div className="notes-search">
          <label htmlFor="notes-search-input">Search notes</label>

          <div className="notes-search-field">
            <Search
              className="notes-search-icon"
              size={18}
              strokeWidth={2}
              aria-hidden="true"/>

            <input
              id="notes-search-input"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by title or content..."/>
          </div>
        </div>
      )}
      {notesContent}
    </section>
  );
}

export default HomePage;