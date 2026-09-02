const mongoose = require("mongoose");
const AppError = require("../utils/AppError");
const Note = require("../models/Note");

const createNote = async ({ title, content, owner }) => {
  try {
    const note = await Note.create({
      title,
      content,
      owner,
    });
    return {
      id: note._id,
      title: note.title,
      content: note.content,
      owner: note.owner,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };
  } catch (error) {
    if (error.name === "ValidationError") {
      throw new AppError(
        "Unable to create note.",
        400
      );
    }
    throw error;
  }
};

const getUserNotes = async (owner) => {
  try {
    const notes = await Note.find({
      owner,
    })
      .sort({
        updatedAt: -1,
      })
      .lean();
    return notes.map((note) => ({
      id: note._id,
      title: note.title,
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    }));
  } catch (error) {
    if (error.name === "CastError") {
      throw new AppError(
        "Invalid user information.",
        400
      );
    }
    throw error;
  }
};

const getNoteById = async ({ noteId, owner }) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      throw new AppError(
        "Invalid note id.",
        400
      );
    }
    const note = await Note.findOne({
      _id: noteId,
      owner,
    }).lean();
    if (!note) {
      throw new AppError(
        "Note not found.",
        404
      );
    }
    return {
      id: note._id,
      title: note.title,
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };
  } catch (error) {
    if (error.name === "CastError") {
      throw new AppError(
        "Invalid user information.",
        400
      );
    }
    throw error;
  }
};

const updateNote = async ({ noteId, owner, title, content, }) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      throw new AppError(
        "Invalid note id.",
        400
      );
    }
    const note = await Note.findOne({
      _id: noteId,
      owner,
    });
    if (!note) {
      throw new AppError(
        "Note not found.",
        404
      );
    }
    note.title = title;
    note.content = content;
    await note.save();
    return {
      id: note._id,
      title: note.title,
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };
  } catch (error) {
    if (error.name === "VersionError") {
      throw new AppError(
        "The note was modified by another request.",
        409
      );
    }
    throw error;
  }
};

const deleteNote = async ({ noteId, owner, }) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      throw new AppError(
        "Invalid note id.",
        400
      );
    }
    const note = await Note.findOne({
      _id: noteId,
      owner,
    });
    if (!note) {
      throw new AppError(
        "Note not found.",
        404
      );
    }
    await note.deleteOne();
    return {
      message: "Note deleted successfully.",
    };
  } catch (error) {
    if (error.name === "CastError") {
      throw new AppError(
        "Invalid user information.",
        400
      );
    }
    throw error;
  }
};

module.exports = {createNote,getUserNotes,getNoteById,updateNote,deleteNote,};