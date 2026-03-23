import { NextResponse } from "next/server";
import { createBook } from "@/lib/books";

export async function POST(request: Request) {
  const formData = await request.formData();
  const title = String(formData.get("title") ?? "Untitled Book");
  const genre = String(formData.get("genre") ?? "");
  const description = String(formData.get("description") ?? "");
  const logline = String(formData.get("logline") ?? "");

  const book = await createBook({
    title,
    genre: genre || undefined,
    description: description || undefined,
    logline: logline || undefined
  });

  return NextResponse.redirect(new URL(`/books/${book.id}`, request.url));
}
