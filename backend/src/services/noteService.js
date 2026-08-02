const AppError = require("../utils/AppError");
const Note = require("../models/Note");

const createNote = async ({ title, content, owner }) => {
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
};

const getUserNotes = async (owner) => {
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
};

const getNoteById = async ({ noteId, owner }) => {
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
};


const updateNote = async ({
  noteId,
  owner,
  title,
  content,
}) => {
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
};

const deleteNote = async ({
  noteId,
  owner,
}) => {
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
};

module.exports = {createNote, getUserNotes, getNoteById, updateNote, deleteNote,};