import { NextResponse } from "next/server";
import { saveBookMetadata } from "@/lib/books";

export async function POST(
  request: Request,
  context: { params: Promise<{ bookId: string }> }
) {
  const { bookId } = await context.params;
  const formData = await request.formData();

  await saveBookMetadata({
    bookId,
    genre: String(formData.get("genre") ?? ""),
    logline: String(formData.get("logline") ?? ""),
    targetWordCount: Number(formData.get("targetWordCount") ?? 0) || undefined
  });

  return NextResponse.redirect(new URL(`/books/${bookId}`, request.url));
}
