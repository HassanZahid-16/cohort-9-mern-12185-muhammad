import { getNote, saveNote } from "../../src/services/noteEditorService";

describe("noteEditorService", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe("getNote", () => {
    it("returns the requested note when the server responds successfully", async () => {
      const note = {
        id: "note-42",
        title: "Things to remember",
        content: "<p>Call the client before Friday.</p>",
      };
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ note }),
      });
      await expect(getNote("note-42")).resolves.toEqual(note);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/note-42"),
        expect.objectContaining({
          method: "GET",
          credentials: "include",
          cache: "no-store",
        })
      );
    });

    it("throws the server message when loading the note fails", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        json: async () => ({
          message: "Unable to load the note.",
        }),
      });
      await expect(getNote("missing-note")).rejects.toThrow(
        "Unable to load the note."
      );
    });
  });

  describe("saveNote", () => {
    it("creates a note with a POST request", async () => {
      const note = {
        id: "note-42",
        title: "Weekend ideas",
        content: "<p>Things I want to work on.</p>",
      };
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ note }),
      });
      await expect(
        saveNote(undefined, {
          title: "Weekend ideas",
          content: "<p>Things I want to work on.</p>",
        })
      ).resolves.toEqual(note);
      expect(fetch).toHaveBeenCalledWith(
        expect.not.stringContaining("/undefined"),
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "Weekend ideas",
            content: "<p>Things I want to work on.</p>",
          }),
        })
      );
    });

    it("updates an existing note with a PUT request", async () => {
      const note = {
        id: "note-42",
        title: "Updated title",
        content: "<p>Updated content.</p>",
      };
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ note }),
      });
      await expect(
        saveNote("note-42", {
          title: "Updated title",
          content: "<p>Updated content.</p>",
        })
      ).resolves.toEqual(note);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/note-42"),
        expect.objectContaining({
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "Updated title",
            content: "<p>Updated content.</p>",
          }),
        })
      );
    });

    it("throws the server message when saving the note fails", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        json: async () => ({
          message: "Unable to save the note.",
        }),
      });
      await expect(
        saveNote("note-42", {
          title: "Updated title",
          content: "<p>Updated content.</p>",
        })
      ).rejects.toThrow("Unable to save the note.");
    });
  });
});