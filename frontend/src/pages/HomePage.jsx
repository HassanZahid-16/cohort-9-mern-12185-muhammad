import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { deleteNote, getNotes } from "../services/noteService";
import NotesList from "../components/NotesList";

function HomePage() {
  const [notes, setNotes] = useState([]);
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

      {errorMessage && (<p className="page-error" role="alert">{errorMessage} </p>
      )}

      {isLoading ? ( <p className="notes-status">Loading your notes...</p>) : 
        (
        <NotesList notes={notes} onDelete={handleDelete} />
      )}
    </section>
  );
}

export default HomePage;