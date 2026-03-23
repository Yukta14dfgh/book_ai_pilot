import Link from "next/link";
import type { EditorBook } from "@/lib/books";

export function EditorSidebar({ book }: { book: EditorBook }) {
  return (
    <aside className="sidebar-card">
      <h3>Manuscript outline</h3>
      <p className="muted">
        Keep chapter status, scene counts, and quick jumps visible while drafting.
      </p>
      <div className="assistant-feed">
        {book.chapters.map((chapter, index) => (
          <article className="template-card" key={chapter.id}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <strong>
                {index + 1}. {chapter.title}
              </strong>
              <span className="status-pill">{chapter.status}</span>
            </div>
            <p className="tiny">
              {chapter.sceneCount} scenes • {chapter.wordCount.toLocaleString()} words
            </p>
          </article>
        ))}
      </div>
      <div className="row" style={{ marginTop: "1rem" }}>
        <button className="button-primary">New chapter</button>
        <Link className="button-secondary" href={`/books/${book.id}`}>
          Outline view
        </Link>
      </div>
    </aside>
  );
}
