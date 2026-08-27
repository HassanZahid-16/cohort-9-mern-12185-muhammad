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
      try {
        await expect(getNotes()).resolves.toEqual(notes);
      } catch (error) {
        throw new Error("Failed during notes loading flow.", {
          cause: error,
        });
      }
    });

    it("throws the server message when loading notes fails", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        json: async () => ({
          message: "Unable to load your notes.",
        }),
      });
      try {
        await expect(getNotes()).rejects.toThrow(
          "Unable to load your notes."
        );
      } catch (error) {
        throw new Error("Failed during rejected notes loading flow.", {
          cause: error,
        });
      }
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
      try {
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
      } catch (error) {
        throw new Error("Failed during note deletion flow.", {
          cause: error,
        });
      }
    });

    it("throws the server message when deleting a note fails", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        json: async () => ({
          message: "Note not found.",
        }),
      });
      try {
        await expect(deleteNote("missing-note")).rejects.toThrow(
          "Note not found."
        );
      } catch (error) {
        throw new Error("Failed during rejected note deletion flow.", {
          cause: error,
        });
      }
    });
  });
});