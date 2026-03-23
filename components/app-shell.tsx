import Link from "next/link";

export function AppShell({
  children,
  title,
  subtitle
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <div className="brand">Book AI Copilot</div>
          <p className="muted">{subtitle}</p>
        </div>
        <div className="row">
          <Link className="ghost-button" href="/dashboard">
            Dashboard
          </Link>
          <Link className="ghost-button" href="/books/demo-book/editor">
            Editor
          </Link>
          <Link className="button-primary" href="/auth/sign-in">
            Demo account
          </Link>
        </div>
      </header>
      <section className="panel" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
        <h1 style={{ margin: 0, fontFamily: "var(--font-body)" }}>{title}</h1>
        <p className="muted" style={{ marginBottom: 0 }}>
          {subtitle}
        </p>
      </section>
      {children}
    </main>
  );
}
