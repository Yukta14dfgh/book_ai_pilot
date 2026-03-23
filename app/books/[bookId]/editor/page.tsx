import { AppShell } from "@/components/app-shell";
import { AiAssistant } from "@/components/ai-assistant";
import { EditorSidebar } from "@/components/editor-sidebar";
import { ManuscriptEditor } from "@/components/manuscript-editor";
import { getBookById } from "@/lib/books";

export default async function EditorPage({
  params
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  const book = await getBookById(bookId);

  return (
    <AppShell
      title={`${book.title} editor`}
      subtitle="Draft chapters, keep structure close at hand, and use AI assist without losing authorship control."
    >
      <div className="editor-grid">
        <EditorSidebar book={book} />
        <ManuscriptEditor book={book} />
        <AiAssistant book={book} />
      </div>
    </AppShell>
  );
}
