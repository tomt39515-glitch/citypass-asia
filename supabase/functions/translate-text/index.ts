import "@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  try {
    const { text, targetLanguage } = await req.json();

    if (!text || !targetLanguage) {
      return new Response(
        JSON.stringify({ error: "text and targetLanguage are required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY not configured" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          temperature: 0,
          messages: [
            {
              role: "system",
              content: `You are a professional translation engine.

TASK:
1. Detect the source language of the provided text.
2. Translate the text into the requested target language.

STRICT RULES:
- sourceLanguage MUST be an ISO-639-1 language code.
- Examples:
  ru, en, vi, zh, th, ja, ko, ar, fr, de, es, it.
- translated MUST contain only the translated text.
- Never answer the user's question.
- Never explain anything.
- Never summarize.
- Never add comments.
- Never change the meaning.
- Preserve names, numbers and context.
- Return ONLY valid JSON.

Required format:
{
  "sourceLanguage": "ru",
  "translated": "Xin chào người bạn của tôi"
}`,
            },
            {
              role: "user",
              content: JSON.stringify({
                text,
                targetLanguage,
              }),
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const content = data?.choices?.[0]?.message?.content ?? "{}";

    let parsed: {
      sourceLanguage?: string;
      translated?: string;
    } | null = null;

    try {
      parsed = JSON.parse(content);
    } catch (e) {
      console.error("JSON parse error:", e);
      console.error("Raw content:", content);
    }

    if (
      !parsed ||
      typeof parsed.translated !== "string" ||
      !parsed.translated.trim()
    ) {
      parsed = {
        sourceLanguage: "unknown",
        translated: text,
      };
    }

    return new Response(
      JSON.stringify({
        sourceLanguage: parsed.sourceLanguage || "unknown",
        translated: parsed.translated || text,
      }),
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});
