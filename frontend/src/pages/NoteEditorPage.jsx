import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import RichTextEditor from "../components/RichTextEditor";
import { getNote, saveNote } from "../services/noteEditorService";

function NoteEditorPage() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(noteId);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isEditing) {
      return;
    }
    let isMounted = true;

    async function loadNote() {
      try {
        const note = await getNote(noteId);
        if (isMounted) {
          setTitle(note.title);
          setContent(note.content);
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
    loadNote();

    return () => {
      isMounted = false;
    };
  }, [isEditing, noteId]);

  async function handleSubmit(event) {
    event.preventDefault();
    const contentText = new DOMParser()
      .parseFromString(content, "text/html")
      .body.textContent.trim();
    if (!title.trim() || !contentText) {
      setErrorMessage("Title and content are required.");
      return;
    }
    try {
      setIsSaving(true);
      setErrorMessage("");
      await saveNote(noteId, {
        title: title.trim(),
        content: content.trim(),
      });
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  }
  if (isLoading) {
    return <p className="notes-status">Loading your note...</p>;
  }

  let submitButtonLabel;
  if (isSaving) {
    submitButtonLabel = "Saving...";
  } else if (isEditing) {
    submitButtonLabel = "Edit note";
  } else {
    submitButtonLabel = "Save note";
  }

  return (
    <section className="note-editor-page">
      <div className="note-editor-heading">
        <div>
  
          <h1>{isEditing ? "Edit note" : "New note"}</h1>
        </div>

        <Link to="/" className="secondary-action">
          Back to notes
        </Link>
      </div>

      {errorMessage && (<p className="page-error" role="alert">{errorMessage}
        </p>
      )}

      <form className="note-editor-form" onSubmit={handleSubmit}>
        <label>
          <span>Title</span>
          <input
            type="text"
            value={title}
            maxLength={120}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Give your note a title"/>
        </label>

        <label>
          Content
          <RichTextEditor value={content} onChange={setContent} />
        </label>

        <div className="note-editor-actions">
          <Link to="/" className="secondary-action">
            Cancel
          </Link>

          <button type="submit" className="primary-action" disabled={isSaving}>
            {submitButtonLabel}
          </button>
        </div>
      </form>
    </section>
  );
}

export default NoteEditorPage;