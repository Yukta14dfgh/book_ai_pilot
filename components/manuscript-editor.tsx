"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Download,
  FileDown,
  Focus,
  Italic,
  List,
  Quote,
  Redo2,
  Search,
  Undo2
} from "lucide-react";
import type { EditorBook } from "@/lib/books";
import { exportAsDocx, exportAsPdf, exportAsTxt } from "@/lib/exporters";

export function ManuscriptEditor({ book }: { book: EditorBook }) {
  const [wordCount, setWordCount] = useState(book.chapters[0]?.wordCount ?? 0);
  const [saveState, setSaveState] = useState("Saved just now");
  const [focusMode, setFocusMode] = useState(false);
  const initialContent = book.chapters[0]?.content ?? "<p>Start writing here.</p>";

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: "Begin your next chapter, scene, or revision pass..."
      })
    ],
    content: initialContent,
    onUpdate({ editor: currentEditor }) {
      const words = currentEditor.getText().trim().split(/\s+/).filter(Boolean).length;
      setWordCount(words);
      setSaveState("Saving...");
    }
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const timeout = window.setTimeout(async () => {
      setSaveState("Saved just now");

      await fetch("/api/books/autosave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: book.id,
          chapterId: book.chapters[0]?.id,
          content: editor.getJSON()
        })
      });
    }, 900);

    return () => window.clearTimeout(timeout);
  }, [book.id, book.chapters, editor, wordCount]);

  if (!editor) {
    return <section className="editor-panel">Loading editor...</section>;
  }

  return (
    <section className="editor-panel" style={{ background: focusMode ? "white" : undefined }}>
      <div className="editor-toolbar">
        <button className="chip-button" onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={16} />
        </button>
        <button className="chip-button" onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={16} />
        </button>
        <button className="chip-button" onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={16} />
        </button>
        <button className="chip-button" onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={16} />
        </button>
        <button className="chip-button">
          <Search size={16} /> Find
        </button>
        <div className="toolbar-spacer" />
        <button className="chip-button" onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 size={16} />
        </button>
        <button className="chip-button" onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 size={16} />
        </button>
        <button className="chip-button" onClick={() => setFocusMode((current) => !current)}>
          <Focus size={16} /> {focusMode ? "Exit focus" : "Focus mode"}
        </button>
      </div>

      <div className="row" style={{ justifyContent: "space-between", marginTop: "1rem" }}>
        <div className="row">
          <span className="status-pill">Drafting</span>
          <span className="muted">{wordCount.toLocaleString()} words</span>
          <span className="muted">{saveState}</span>
        </div>
        <div className="row">
          <button className="chip-button" onClick={() => void exportAsDocx(book.title, editor.getText())}>
            <FileDown size={16} /> DOCX
          </button>
          <button className="chip-button" onClick={() => exportAsPdf(book.title, editor.getText())}>
            <Download size={16} /> PDF
          </button>
          <button className="chip-button" onClick={() => exportAsTxt(book.title, editor.getText())}>
            TXT
          </button>
        </div>
      </div>

      <EditorContent editor={editor} />
    </section>
  );
}
