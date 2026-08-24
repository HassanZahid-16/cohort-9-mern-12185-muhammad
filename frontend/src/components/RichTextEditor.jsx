import { useEffect, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const toolbarOptions = [
  ["bold", "italic", "underline"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link"],
  ["clean"],
];

const formats = ["header","bold","italic","underline","list","bullet","link",];

function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    const editor = editorRef.current?.getEditor();
    if (editor) {
      editor.root.setAttribute("aria-label", "Content");
    }
  }, []);

  function handleChange(nextValue) {
    if (nextValue === "<p><br></p>") {
      onChange("");
      return;
    }
    onChange(nextValue);
  }

  function handleHeaderChange(event) {
    const editor = editorRef.current?.getEditor();
    if (!editor) {
      return;
    }
    const selection = editor.getSelection();
    if (!selection) {
      return;
    }
    const header = event.target.value === "normal" ? false : Number(event.target.value);
    editor.formatLine(selection.index, selection.length, "header", header);
    editor.focus();
  }
  
  return (
    <div className="rich-text-editor">
      <div className="rich-text-header-picker">
        <select
          defaultValue="normal"
          onChange={handleHeaderChange}
          aria-label="Text style">
          <option value="normal">Normal</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
        </select>
      </div>

      <ReactQuill
        ref={editorRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={{ toolbar: toolbarOptions }}
        formats={formats}
        placeholder="Write something..."
      />
    </div>
  );
}

export default RichTextEditor;