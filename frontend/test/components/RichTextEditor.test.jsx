import { fireEvent, render, screen } from "@testing-library/react";
import RichTextEditor from "../../src/components/RichTextEditor";

const mockGetEditor = jest.fn();
const formatLine = jest.fn();
const getSelection = jest.fn();
const focus = jest.fn();

jest.mock("react-quill-new", () => {
  const React = require("react");

  const ReactQuill = React.forwardRef(({ onChange }, ref) => {
    React.useImperativeHandle(ref, () => ({
      getEditor: mockGetEditor,
    }));

    return (
      <textarea
        aria-label="Content"
        onChange={(event) => onChange(event.target.value)}
      />
    );
  });

  ReactQuill.displayName = "ReactQuill";

  return {
    __esModule: true,
    default: ReactQuill,
  };
});

describe("RichTextEditor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetEditor.mockReturnValue({
      root: {
        setAttribute: jest.fn(),
      },
      getSelection,
      formatLine,
      focus,
    });
    getSelection.mockReturnValue({
      index: 2,
      length: 5,
    });
  });

  it("passes normal editor changes to the parent", () => {
    const onChange = jest.fn();
    render(<RichTextEditor value="<p>Hello</p>" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Content"), {
      target: {
        value: "<p>Updated note</p>",
      },
    });
    expect(onChange).toHaveBeenCalledWith("<p>Updated note</p>");
  });

  it("converts an empty editor value to an empty string", () => {
    const onChange = jest.fn();
    render(<RichTextEditor value="<p>Hello</p>" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Content"), {
      target: {
        value: "<p><br></p>",
      },
    });
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("formats the selected text as the chosen heading", () => {
    const onChange = jest.fn();
    render(<RichTextEditor value="<p>Hello</p>" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Text style"), {
      target: {
        value: "2",
      },
    });
    expect(getSelection).toHaveBeenCalledTimes(1);
    expect(formatLine).toHaveBeenCalledWith(2, 5, "header", 2);
    expect(focus).toHaveBeenCalledTimes(1);
  });
});