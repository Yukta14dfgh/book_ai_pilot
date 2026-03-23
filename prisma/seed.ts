import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "author@example.com" },
    update: {},
    create: {
      email: "author@example.com",
      name: "Demo Author"
    }
  });

  const book = await prisma.book.upsert({
    where: { slug: "the-orchard-of-quiet-fires" },
    update: {},
    create: {
      ownerId: user.id,
      title: "The Orchard of Quiet Fires",
      slug: "the-orchard-of-quiet-fires",
      genre: "Literary fantasy",
      status: "Draft 2",
      description:
        "A mother returns to the orchard town she fled and finds that every tree remembers what the town tried to bury.",
      logline:
        "When Mira inherits a decaying orchard from the grandmother she betrayed, she must choose whether to expose the town's old violence or let memory burn out in silence."
    }
  });

  const chapterCount = await prisma.chapter.count({ where: { bookId: book.id } });

  if (chapterCount === 0) {
    await prisma.chapter.createMany({
      data: [
        {
          bookId: book.id,
          title: "Chapter 1: The Return Road",
          orderIndex: 1,
          status: "Needs polish",
          sceneCount: 3,
          wordCount: 2148,
          excerpt:
            "Mira turned off the highway at dawn, carrying the town in her mouth like a word she had not forgiven herself for forgetting."
        },
        {
          bookId: book.id,
          title: "Chapter 2: Ledger Dust",
          orderIndex: 2,
          status: "Drafting",
          sceneCount: 2,
          wordCount: 1633
        }
      ]
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
