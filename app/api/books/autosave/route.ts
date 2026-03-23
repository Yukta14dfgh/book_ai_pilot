import { NextResponse } from "next/server";
import { z } from "zod";
import { autosaveChapter } from "@/lib/books";

const autosaveSchema = z.object({
  bookId: z.string(),
  chapterId: z.string(),
  content: z.record(z.any())
});

export async function POST(request: Request) {
  const payload = autosaveSchema.parse(await request.json());

  const result = await autosaveChapter(payload);

  return NextResponse.json(result);
}
