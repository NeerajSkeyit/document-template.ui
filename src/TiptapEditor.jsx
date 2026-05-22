import React from "react";
import { EditorContent } from "@tiptap/react";

export default function TiptapEditor({ editor }) {
  if (!editor) return null;

  return (
    <div>
      {/* Toolbar */}
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => editor.chain().focus().toggleBold().run()}>
          Bold
        </button>

        <button onClick={() => editor.chain().focus().toggleItalic().run()}>
          Italic
        </button>

        <button onClick={() => editor.chain().focus().toggleUnderline().run()}>
          Underline
        </button>

        <button onClick={() => editor.chain().focus().setColor("red").run()}>
          Red
        </button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        style={{
          border: "1px solid gray",
          borderRadius: 4,
          paddingLeft: 10,
          paddingRight: 10,
        }}
      />
    </div>
  );
}
