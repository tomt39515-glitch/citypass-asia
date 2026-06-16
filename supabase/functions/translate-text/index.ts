import "@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  try {
    const { text, targetLanguage } = await req.json();

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
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
          messages: [
            {
              role: "system",
              content: `You are a translation API.

Always detect the source language.
Always translate the text into the target language.
Return ONLY valid JSON.

Example:
{
  "sourceLanguage": "ru",
  "translated": "Xin chào"
}

Do not return markdown.
Do not return explanations.
Do not return code fences.`,
            },
            {
              role: "user",
              content: JSON.stringify({
                text,
                targetLanguage,
              }),
            },
          ],
          temperature: 0,
        }),
      }
    );

    const data = await response.json();

    const content =
      data?.choices?.[0]?.message?.content || "{}";

    let parsed;

    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = null;
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
        sourceLanguage:
          parsed.sourceLanguage || "unknown",
        translated:
          parsed.translated || text,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});
