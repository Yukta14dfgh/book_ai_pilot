import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">AUTHOR ACCESS</p>
        <h1>Sign in to your writing workspace</h1>
        <p className="muted">
          This scaffold includes the UI and data model for authenticated cloud sync. Hook the
          form to your production auth provider to activate real accounts.
        </p>
        <form className="auth-form">
          <div className="field">
            <label>Email</label>
            <input placeholder="author@example.com" type="email" />
          </div>
          <div className="field">
            <label>Password</label>
            <input placeholder="Your password" type="password" />
          </div>
          <button className="button-primary" type="submit">
            Sign in
          </button>
          <button className="button-secondary" type="button">
            Email me a magic link
          </button>
        </form>
        <p className="tiny">
          Need a workspace? <Link href="/">Return to the home page</Link>.
        </p>
      </section>
    </main>
  );
}
