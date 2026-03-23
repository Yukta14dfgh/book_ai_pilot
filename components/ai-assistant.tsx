"use client";

import { useState } from "react";
import { Bot, LoaderCircle, Sparkles } from "lucide-react";
import type { EditorBook } from "@/lib/books";
import { aiPromptTemplates } from "@/lib/mock-data";

type Message = {
  role: "assistant" | "user";
  content: string;
};

export function AiAssistant({ book }: { book: EditorBook }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "I can help rewrite a line, sharpen tone, summarize this chapter, or continue writing from the current scene."
    }
  ]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(template?: string) {
    const nextPrompt = template ?? prompt;

    if (!nextPrompt.trim()) {
      return;
    }

    setLoading(true);
    setMessages((current) => [...current, { role: "user", content: nextPrompt }]);

    try {
      const response = await fetch("/api/ai/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: book.id,
          chapterId: book.chapters[0]?.id,
          prompt: nextPrompt,
          selection: "The hallway smelled like rain and old paper.",
          chapterContext: book.chapters[0]?.excerpt ?? ""
        })
      });

      const data = (await response.json()) as { output?: string; error?: string };

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            data.output ??
            data.error ??
            "The AI response could not be generated, but the request wiring is ready."
        }
      ]);
      setPrompt("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="assistant-card">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <span className="eyebrow">AI COPILOT</span>
          <h3 style={{ marginTop: "0.5rem" }}>Context-aware help</h3>
        </div>
        <Bot size={22} />
      </div>

      <div className="template-grid">
        {aiPromptTemplates.map((template) => (
          <button
            className="template-card"
            key={template.title}
            onClick={() => void handleSubmit(template.prompt)}
            type="button"
          >
            <strong>{template.title}</strong>
            <p className="tiny">{template.description}</p>
          </button>
        ))}
      </div>

      <div className="chat-feed">
        {messages.map((message, index) => (
          <article className="chat-bubble" key={`${message.role}-${index}`}>
            <strong>{message.role === "assistant" ? "AI draft" : "You"}</strong>
            <span>{message.content}</span>
          </article>
        ))}
      </div>

      <div className="field" style={{ marginTop: "1rem" }}>
        <label>Ask about the active manuscript</label>
        <textarea
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Help me reframe this sentence so it sounds more intimate."
          rows={4}
          value={prompt}
        />
      </div>

      <div className="row" style={{ justifyContent: "space-between", marginTop: "1rem" }}>
        <span className="tiny">
          <Sparkles size={14} style={{ verticalAlign: "middle" }} /> Suggestions are previewed
          before insertion.
        </span>
        <button className="button-primary" disabled={loading} onClick={() => void handleSubmit()}>
          {loading ? <LoaderCircle className="spin" size={18} /> : "Send prompt"}
        </button>
      </div>
    </aside>
  );
}
