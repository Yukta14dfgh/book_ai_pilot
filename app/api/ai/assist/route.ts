import { NextResponse } from "next/server";
import { generateAssistance } from "@/lib/ai";

const sessionUsage = new Map<string, number>();
const SESSION_LIMIT = 30;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const sessionId = request.headers.get("x-forwarded-for") ?? "local-demo";
    const used = sessionUsage.get(sessionId) ?? 0;

    if (used >= SESSION_LIMIT) {
      return NextResponse.json(
        { error: "Session rate limit reached. Please wait before requesting more AI help." },
        { status: 429 }
      );
    }

    const result = await generateAssistance(body);
    sessionUsage.set(sessionId, used + 1);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to generate AI assistance for this request."
      },
      { status: 400 }
    );
  }
}
