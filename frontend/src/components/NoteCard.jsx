import DOMPurify from "dompurify";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

function NoteCard({ note, onDelete }) {
  function handleDelete() {
    onDelete(note.id);
  }
  
  return (
    <article className="note-card">
      <div className="note-card-content">
        <h2>{note.title}</h2>
        <div
          className="note-rich-text"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(note.content),
          }}
        />
      </div>

      <div className="note-card-footer">
        <Link
          to={`/notes/${note.id}`}
          className="edit-note"
          aria-label="Edit note"
          title="Edit note">
          <Pencil size={18} strokeWidth={2} />
        </Link>

        <button
          type="button"
          className="delete-note"
          onClick={handleDelete}
          aria-label="Delete note"
          title="Delete note">
          <Trash2 size={18} strokeWidth={2} />
        </button>
      </div>
    </article>
  );
}

export default NoteCard;