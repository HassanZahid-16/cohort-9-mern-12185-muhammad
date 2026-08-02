const validateNote = ({ title, content }) => {
  if (
    typeof title !== "string" ||
    title.trim().length === 0
  ) {
    return "Title is required.";
  }
  if (title.trim().length > 120) {
    return "Title cannot exceed 120 characters.";
  }
  if (
    typeof content !== "string" ||
    content.trim().length === 0
  ) {
    return "Content is required.";
  }
  if (content.length > 10000) {
    return "Content cannot exceed 10000 characters.";
  }
  return null;
};

module.exports = {validateNote,};