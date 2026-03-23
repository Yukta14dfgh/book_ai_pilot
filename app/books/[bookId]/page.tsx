import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { getBookById } from "@/lib/books";

export default async function BookDetailPage({
  params
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  const book = await getBookById(bookId);

  return (
    <AppShell title={book.title} subtitle={book.description}>
      <div className="dashboard-grid">
        <section className="panel" style={{ padding: "1.25rem" }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div>
              <h2 style={{ margin: 0, fontFamily: "var(--font-body)" }}>Outline</h2>
              <p className="muted">
                Reorder chapters, track status, and split long scenes into manageable drafting units.
              </p>
            </div>
            <Link className="button-primary" href={`/books/${book.id}/editor`}>
              Open editor
            </Link>
          </div>

          <div className="chapter-list">
            {book.chapters.map((chapter) => (
              <article className="chapter-card" key={chapter.id}>
                <div>
                  <span className="status-pill">{chapter.status}</span>
                  <h3>{chapter.title}</h3>
                  <p className="muted">
                    {chapter.sceneCount} scenes • {chapter.wordCount.toLocaleString()} words
                  </p>
                </div>
                <div className="row">
                  <button className="chip-button">Move</button>
                  <button className="chip-button">Split scene</button>
                  <button className="chip-button">Merge scenes</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel" style={{ padding: "1.25rem" }}>
          <h2 style={{ marginTop: 0, fontFamily: "var(--font-body)" }}>Book metadata</h2>
          <form action={`/api/books/${book.id}/metadata`} className="auth-form" method="post">
            <div className="field">
              <label>Logline</label>
              <textarea defaultValue={book.logline} name="logline" rows={4} />
            </div>
            <div className="field">
              <label>Genre</label>
              <input defaultValue={book.genre} name="genre" />
            </div>
            <div className="field">
              <label>Target word count</label>
              <input defaultValue={String(book.targetWordCount)} name="targetWordCount" />
            </div>
            <div className="row" style={{ marginTop: "1rem" }}>
              <button className="button-primary" type="submit">
                Save metadata
              </button>
              <button className="button-secondary" type="button">
                Export manuscript
              </button>
            </div>
          </form>
        </section>
      </div>
    </AppShell>
  );
}
