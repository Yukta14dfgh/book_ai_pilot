export type BookSummary = {
  id: string;
  title: string;
  genre: string;
  chapters: number;
  status: string;
  lastEdited: string;
};

export type Chapter = {
  id: string;
  title: string;
  status: string;
  sceneCount: number;
  wordCount: number;
  excerpt: string;
  content: string;
};

export type BookDetail = {
  id: string;
  title: string;
  genre: string;
  status: string;
  description: string;
  logline: string;
  targetWordCount: number;
  chapters: Chapter[];
};

const books: BookDetail[] = [
  {
    id: "demo-book",
    title: "The Orchard of Quiet Fires",
    genre: "Literary fantasy",
    status: "Draft 2",
    description:
      "A mother returns to the orchard town she fled and finds that every tree remembers what the town tried to bury.",
    logline:
      "When Mira inherits a decaying orchard from the grandmother she betrayed, she must choose whether to expose the town's old violence or let memory burn out in silence.",
    targetWordCount: 85000,
    chapters: [
      {
        id: "chapter-1",
        title: "Chapter 1: The Return Road",
        status: "Needs polish",
        sceneCount: 3,
        wordCount: 2148,
        excerpt:
          "Mira turned off the highway at dawn, carrying the town in her mouth like a word she had not forgiven herself for forgetting.",
        content:
          "<h1>The Return Road</h1><p>Mira turned off the highway at dawn, carrying the town in her mouth like a word she had not forgiven herself for forgetting.</p><p>The orchard appeared slowly, one branch at a time, through the weather-thinned fog. The old packing house leaned toward the road as if it had spent the last decade listening for her tires.</p><p>She parked with the engine running. Rain ticked against the windshield. Somewhere beyond the rows of sleeping trees, a bell rang once and then was quiet.</p><blockquote>She had not expected the place to remember her.</blockquote><p>When she stepped out, the cold smelled of wet bark, iron keys, and the paper dust of ledgers left too long unopened.</p>"
      },
      {
        id: "chapter-2",
        title: "Chapter 2: Ledger Dust",
        status: "Drafting",
        sceneCount: 2,
        wordCount: 1633,
        excerpt:
          "The office still held her grandmother's habits: penciled dates, folded invoices, a tea cup with the stain of long patience.",
        content:
          "<h2>Ledger Dust</h2><p>The office still held her grandmother's habits: penciled dates, folded invoices, a tea cup with the stain of long patience.</p>"
      },
      {
        id: "chapter-3",
        title: "Chapter 3: The Trees Answer",
        status: "Outline only",
        sceneCount: 4,
        wordCount: 0,
        excerpt:
          "Outline: Mira discovers the trees respond to names spoken aloud after midnight.",
        content:
          "<h2>The Trees Answer</h2><p>Scene placeholder. Use AI to brainstorm a sensory opening and deepen the tension between Mira and the town archivist.</p>"
      }
    ]
  }
];

export function getDashboardSnapshot() {
  return {
    stats: {
      books: books.length,
      words: books.reduce(
        (sum, book) => sum + book.chapters.reduce((chapterSum, chapter) => chapterSum + chapter.wordCount, 0),
        0
      ),
      aiSessions: 12
    },
    books: books.map((book) => ({
      id: book.id,
      title: book.title,
      genre: book.genre,
      chapters: book.chapters.length,
      status: book.status,
      lastEdited: "today"
    })),
    feed: [
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
    ]
  };
}

export function getBookById(id: string) {
  return books.find((book) => book.id === id) ?? books[0];
}

export const aiPromptTemplates = [
  {
    title: "Find a stronger word",
    description: "Swap vague wording for something sharper without changing the feeling.",
    prompt: "Suggest stronger word choices for the current sentence and explain the tonal difference."
  },
  {
    title: "Reframe this line",
    description: "Rewrite a sentence with more emotional texture and rhythm.",
    prompt: "Rewrite the selected sentence in a more intimate and literary way."
  },
  {
    title: "Continue writing",
    description: "Draft the next 2-3 paragraphs while matching the existing voice.",
    prompt: "Continue this scene in the same voice and escalate the tension slightly."
  },
  {
    title: "Summarize chapter",
    description: "Compress the current chapter into a useful revision summary.",
    prompt: "Summarize this chapter in 5 bullet points and note any unresolved tension."
  }
];
