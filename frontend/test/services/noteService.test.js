import { deleteNote, getNotes } from "../../src/services/noteService";

describe("noteService", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe("getNotes", () => {
    it("returns the notes from a successful response", async () => {
      const notes = [
        {
          id: "note-1",
          title: "First note",
          content: "<p>Hello</p>",
        },
        {
          id: "note-2",
          title: "Second note",
          content: "<p>Another note</p>",
        },
      ];
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ notes }),
      });
      await expect(getNotes()).resolves.toEqual(notes);
    });

    it("throws the server message when loading notes fails", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        json: async () => ({
          message: "Unable to load your notes.",
        }),
      });
      await expect(getNotes()).rejects.toThrow(
        "Unable to load your notes."
      );
    });
  });

  describe("deleteNote", () => {
    it("sends a delete request for the selected note", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({
          message: "Note deleted successfully.",
        }),
      });
      await expect(deleteNote("note-123")).resolves.toEqual({
        message: "Note deleted successfully.",
      });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/note-123"),
        expect.objectContaining({
          method: "DELETE",
          credentials: "include",
        })
      );
    });

    it("throws the server message when deleting a note fails", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        json: async () => ({
          message: "Note not found.",
        }),
      });
      await expect(deleteNote("missing-note")).rejects.toThrow(
        "Note not found."
      );
    });
  });
});