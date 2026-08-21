import NoteCard from "./NoteCard";

function NotesList({ notes, onDelete }) {
  if (notes.length === 0) {
    return <p className="empty-notes-message">No notes yet.</p>;
  }
  
  return (
    <div className="notes-grid">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default NotesList;