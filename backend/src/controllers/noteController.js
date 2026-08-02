const noteService = require("../services/noteService");
const { validateNote } = require("../validators/noteValidator");
const AppError = require("../utils/AppError");

const create = async (req, res, next) => {
  try {
    const validationMessage = validateNote(req.body);
    if (validationMessage) {
      throw new AppError(
        validationMessage,
        400
      );
    }
    const note = await noteService.createNote({
      title: req.body.title.trim(),
      content: req.body.content.trim(),
      owner: req.user.id,
    });
    return res.status(201).json({
      message: "Note created successfully.",
      note,
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const notes = await noteService.getUserNotes(
      req.user.id
    );
    return res.status(200).json({
      notes,
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const note = await noteService.getNoteById({
      noteId: req.params.id,
      owner: req.user.id,
    });
    return res.status(200).json({
      note,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validationMessage = validateNote(req.body);
    if (validationMessage) {
      throw new AppError(
        validationMessage,
        400
      );
    }
    const note = await noteService.updateNote({
      noteId: req.params.id,
      owner: req.user.id,
      title: req.body.title.trim(),
      content: req.body.content.trim(),
    });
    return res.status(200).json({
      message: "Note updated successfully.",
      note,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await noteService.deleteNote({
      noteId: req.params.id,
      owner: req.user.id,
    });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {create, getAll, getById, update, remove,};