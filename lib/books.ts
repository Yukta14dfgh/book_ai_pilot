import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getBookById as getMockBookById, getDashboardSnapshot as getMockDashboardSnapshot } from "@/lib/mock-data";

export type DashboardBook = {
  id: string;
  title: string;
  genre: string;
  chapters: number;
  status: string;
  lastEdited: string;
};

export type DashboardSnapshot = {
  stats: {
    books: number;
    words: number;
    aiSessions: number;
  };
  books: DashboardBook[];
  feed: Array<{
    tag: string;
    title: string;
    copy: string;
  }>;
};

export type EditorBook = {
  id: string;
  title: string;
  genre: string;
  status: string;
  description: string;
  logline: string;
  targetWordCount: number;
  chapters: Array<{
    id: string;
    title: string;
    status: string;
    sceneCount: number;
    wordCount: number;
    excerpt: string;
    content: string;
  }>;
};

const demoFeed = [
  {
    tag: "Resume",
    title: "Continue Chapter 2",
    copy: "You left off in a scene about the ledger room. The last AI action was a tone-tightening rewrite."
  },
  {
    tag: "Export",
    title: "Prepare a clean manuscript",
    copy: "DOCX and PDF export helpers are wired for manuscript handoff and review copies."
  },
  {
    tag: "AI",
    title: "Sharper sentence options ready",
    copy: "The copilot can rewrite for intimacy, tension, clarity, or brevity without replacing text automatically."
  }
];

type BookWithRelations = Prisma.BookGetPayload<{
  include: {
    chapters: {
      include: {
        document: true;
      };
      orderBy: {
        orderIndex: "asc";
      };
    };
    conversations: true;
  };
}>;

export async function getDashboardSnapshot() {
  try {
    const [books, aiSessions] = await Promise.all([
      prisma.book.findMany({
        include: {
          chapters: true
        },
        orderBy: {
          updatedAt: "desc"
        }
      }),
      prisma.aIConversation.count()
    ]);

    if (books.length === 0) {
      return getMockDashboardSnapshot();
    }

    return {
      stats: {
        books: books.length,
        words: books.reduce(
          (sum, book) => sum + book.chapters.reduce((chapterSum, chapter) => chapterSum + chapter.wordCount, 0),
          0
        ),
        aiSessions
      },
      books: books.map((book) => ({
        id: book.id,
        title: book.title,
        genre: book.genre ?? "Uncategorized",
        chapters: book.chapters.length,
        status: book.status,
        lastEdited: formatRelativeDate(book.updatedAt)
      })),
      feed: demoFeed
    } satisfies DashboardSnapshot;
  } catch {
    return getMockDashboardSnapshot();
  }
}

export async function getBookById(id: string) {
  try {
    const book = await prisma.book.findFirst({
      where: {
        OR: [{ id }, { slug: id }]
      },
      include: {
        chapters: {
          include: {
            document: true
          },
          orderBy: {
            orderIndex: "asc"
          }
        },
        conversations: true
      }
    });

    if (!book) {
      return getMockBookById(id);
    }

    return mapBook(book);
  } catch {
    return getMockBookById(id);
  }
}

export async function createBook(input: {
  title: string;
  genre?: string;
  description?: string;
  logline?: string;
}) {
  const owner = await ensureDemoUser();
  const slug = slugify(input.title);

  const book = await prisma.book.create({
    data: {
      ownerId: owner.id,
      title: input.title,
      slug: slug || `book-${Date.now()}`,
      genre: input.genre,
      description: input.description,
      logline: input.logline,
      chapters: {
        create: {
          title: "Chapter 1",
          orderIndex: 1,
          status: "Drafting",
          sceneCount: 1,
          document: {
            create: {
              richText: {
                type: "doc",
                content: [{ type: "paragraph", content: [{ type: "text", text: "Start writing..." }] }]
              },
              plainText: "Start writing..."
            }
          }
        }
      }
    }
  });

  return book;
}

export async function saveBookMetadata(input: {
  bookId: string;
  genre?: string;
  logline?: string;
  targetWordCount?: number;
}) {
  return prisma.book.update({
    where: { id: input.bookId },
    data: {
      genre: input.genre,
      logline: input.logline,
      targetWordCount: input.targetWordCount
    }
  });
}

export async function autosaveChapter(input: {
  bookId: string;
  chapterId: string;
  content: Record<string, unknown>;
}) {
  const plainText = extractPlainText(input.content);
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;

  await prisma.chapter.update({
    where: { id: input.chapterId },
    data: {
      wordCount,
      updatedAt: new Date(),
      document: {
        upsert: {
          create: {
            richText: input.content,
            plainText,
            revision: 1
          },
          update: {
            richText: input.content,
            plainText,
            revision: {
              increment: 1
            }
          }
        }
      }
    }
  });

  await prisma.book.update({
    where: { id: input.bookId },
    data: {
      updatedAt: new Date()
    }
  });

  return {
    ok: true,
    savedAt: new Date().toISOString()
  };
}

async function ensureDemoUser() {
  return prisma.user.upsert({
    where: { email: "author@example.com" },
    update: {},
    create: {
      email: "author@example.com",
      name: "Demo Author"
    }
  });
}

function mapBook(book: BookWithRelations): EditorBook {
  return {
    id: book.id,
    title: book.title,
    genre: book.genre ?? "Uncategorized",
    status: book.status,
    description: book.description ?? "No description yet.",
    logline: book.logline ?? "",
    targetWordCount: book.targetWordCount ?? 80000,
    chapters: book.chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      status: chapter.status,
      sceneCount: chapter.sceneCount,
      wordCount: chapter.wordCount,
      excerpt: chapter.excerpt ?? "",
      content: richTextToHtml(chapter.document?.richText, chapter.document?.plainText ?? chapter.excerpt ?? "")
    }))
  };
}

function richTextToHtml(richText: unknown, plainText: string) {
  if (!richText || typeof richText !== "object") {
    return `<p>${escapeHtml(plainText || "Start writing here.")}</p>`;
  }

  const maybeDocument = richText as {
    content?: Array<{
      type?: string;
      content?: Array<{ type?: string; text?: string }>;
    }>;
  };

  if (!Array.isArray(maybeDocument.content)) {
    return `<p>${escapeHtml(plainText || "Start writing here.")}</p>`;
  }

  return maybeDocument.content
    .map((node) => {
      const text = node.content?.map((child) => child.text ?? "").join("") ?? "";

      if (node.type === "heading") {
        return `<h2>${escapeHtml(text)}</h2>`;
      }

      return `<p>${escapeHtml(text)}</p>`;
    })
    .join("");
}

function extractPlainText(content: Record<string, unknown>) {
  const root = content as {
    content?: Array<{
      content?: Array<{ text?: string }>;
    }>;
  };

  return (
    root.content
      ?.map((node) => node.content?.map((child) => child.text ?? "").join("") ?? "")
      .join("\n") ?? ""
  );
}

function formatRelativeDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
