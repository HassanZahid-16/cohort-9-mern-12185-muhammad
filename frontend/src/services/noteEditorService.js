const API_URL =
  import.meta.env.VITE_AUTH_API_URL?.replace("/auth", "/notes") ||
  "http://localhost:5000/api/notes";

async function getNote(noteId) {
  let response;
  try {
    response = await fetch(`${API_URL}/${noteId}`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });
  } catch (error) {
    throw new Error("Unable to load the note.");
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || "Unable to load the note.");
  }
  return data.note;
}

async function saveNote(noteId, noteDetails) {
  const isEditing = Boolean(noteId);
  const url = isEditing ? `${API_URL}/${noteId}` : API_URL;
  let response;
  try {
    response = await fetch(url, {
      method: isEditing ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(noteDetails),
    });
  } catch (error) {
    throw new Error("Unable to save the note.");
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || "Unable to save the note.");
  }
  return data.note;
}

export { getNote, saveNote };