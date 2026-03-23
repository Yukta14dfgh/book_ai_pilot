import Link from "next/link";
import { ArrowRight, Bot, FileText, Layers3, Sparkles } from "lucide-react";

const pillars = [
  {
    icon: FileText,
    title: "Write Like It Matters",
    copy: "A rich-text manuscript editor with structure, focus mode, autosave, and export paths for real book projects."
  },
  {
    icon: Layers3,
    title: "Organize Books Cleanly",
    copy: "Keep chapters, scenes, metadata, and draft states in one workspace designed for authors instead of generic docs."
  },
  {
    icon: Bot,
    title: "Use AI Without Losing Control",
    copy: "Ask for better words, stronger sentences, summaries, and rewrites, then preview before inserting anything."
  }
];

export default function HomePage() {
  return (
    <main className="landing-shell">
      <section className="hero-panel">
        <p className="eyebrow">BOOK WRITING STUDIO</p>
        <h1>Plan chapters, draft scenes, and get AI help without leaving the page.</h1>
        <p className="hero-copy">
          Book AI Copilot is a solo-author workspace for writing long-form projects with
          structure, exports, and a contextual assistant built into the editor.
        </p>
        <div className="hero-actions">
          <Link className="button-primary" href="/dashboard">
            Open workspace <ArrowRight size={18} />
          </Link>
          <Link className="button-secondary" href="/auth/sign-in">
            View sign in flow
          </Link>
        </div>
      </section>

      <section className="pillars-grid">
        {pillars.map(({ icon: Icon, title, copy }) => (
          <article className="pillar-card" key={title}>
            <Icon size={22} />
            <h2>{title}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </section>

      <section className="value-strip">
        <div>
          <Sparkles size={18} />
          <span>Inline AI commands for selection-based rewrites</span>
        </div>
        <div>
          <Sparkles size={18} />
          <span>Autosave and chapter status tracking</span>
        </div>
        <div>
          <Sparkles size={18} />
          <span>DOCX, PDF, and TXT export foundations</span>
        </div>
      </section>
    </main>
  );
}
