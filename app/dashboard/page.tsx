import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { getDashboardSnapshot } from "@/lib/books";

export default async function DashboardPage() {
  const dashboard = await getDashboardSnapshot();

  return (
    <AppShell
      title="Your writing desk"
      subtitle="Recent books, progress stats, and quick entry points back into active manuscripts."
    >
      <div className="dashboard-grid">
        <section className="panel" style={{ padding: "1.25rem" }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div>
              <h2 style={{ margin: 0, fontFamily: "var(--font-body)" }}>Recent books</h2>
              <p className="muted">Jump back into the chapters you were shaping last.</p>
            </div>
            <form action="/api/books" method="post">
              <input name="title" type="hidden" value="Untitled Book" />
              <button className="button-primary" type="submit">
                Create book
              </button>
            </form>
          </div>

          <div className="stats-grid">
            <article className="stat-card">
              <strong>{dashboard.stats.books}</strong>
              <span className="muted">Books in progress</span>
            </article>
            <article className="stat-card">
              <strong>{dashboard.stats.words.toLocaleString()}</strong>
              <span className="muted">Words drafted</span>
            </article>
            <article className="stat-card">
              <strong>{dashboard.stats.aiSessions}</strong>
              <span className="muted">AI assists this week</span>
            </article>
          </div>

          <div className="chapter-list">
            {dashboard.books.map((book) => (
              <article className="chapter-card" key={book.id}>
                <div>
                  <span className="status-pill">{book.status}</span>
                  <h3>{book.title}</h3>
                  <p className="muted">
                    {book.genre} • {book.chapters} chapters • Last edited {book.lastEdited}
                  </p>
                </div>
                <div className="row">
                  <Link className="chip-button" href={`/books/${book.id}`}>
                    View outline
                  </Link>
                  <Link className="button-primary" href={`/books/${book.id}/editor`}>
                    Resume writing
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel" style={{ padding: "1.25rem" }}>
          <h2 style={{ marginTop: 0, fontFamily: "var(--font-body)" }}>This week</h2>
          <div className="assistant-feed">
            {dashboard.feed.map((item) => (
              <article className="assistant-card" key={item.title}>
                <span className="status-pill">{item.tag}</span>
                <h3>{item.title}</h3>
                <p className="muted">{item.copy}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
