import OpenAI from "openai";
import { z } from "zod";

const assistSchema = z.object({
  prompt: z.string().min(1),
  selection: z.string().optional(),
  chapterContext: z.string().optional(),
  chapterId: z.string().optional(),
  bookId: z.string().optional()
});

const model = "gpt-4.1-mini";

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new OpenAI({ apiKey });
}

export async function generateAssistance(input: unknown) {
  const parsed = assistSchema.parse(input);
  const client = getClient();

  if (!client) {
    return {
      output:
        "OpenAI is not configured yet. Add an OPENAI_API_KEY to enable live suggestions. The UI, route, and prompt flow are ready."
    };
  }

  const completion = await client.responses.create({
    model,
    input: [
      {
        role: "system",
        content:
          "You are an AI writing copilot for book authors. Preserve author intent, avoid cliches, and return concise, useful suggestions that are easy to insert into a manuscript."
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Author request: ${parsed.prompt}`
          },
          {
            type: "input_text",
            text: `Selected text: ${parsed.selection ?? "None provided"}`
          },
          {
            type: "input_text",
            text: `Chapter context: ${parsed.chapterContext ?? "None provided"}`
          }
        ]
      }
    ]
  });

  return {
    output: completion.output_text,
    usage: completion.usage
  };
}
