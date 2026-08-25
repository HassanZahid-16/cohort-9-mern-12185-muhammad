const API_URL =
  import.meta.env.VITE_AUTH_API_URL?.replace("/auth", "/notes") ||
  "http://localhost:5000/api/notes";

async function getNotes() {
  let response;
  try {
    response = await fetch(API_URL, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    throw new Error("Unable to load your notes.");
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || "Unable to load your notes.");
  }
  return data.notes || [];
}

async function deleteNote(noteId) {
  let response;
  try {
    response = await fetch(`${API_URL}/${noteId}`, {
      method: "DELETE",
      credentials: "include",
    });
  } catch {
    throw new Error("Unable to delete the note.");
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || "Unable to delete the note.");
  }
  return data;
}

export { getNotes, deleteNote };