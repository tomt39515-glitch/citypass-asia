import "@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  try {
    const { text, targetLanguage } = await req.json();

    if (!text || !targetLanguage) {
      return new Response(
        JSON.stringify({
          error: "text and targetLanguage are required"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "OPENAI_API_KEY not configured"
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    console.log("TRANSLATE REQUEST:", {
      text,
      targetLanguage
    });

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: {
            type: "json_object"
          },
          temperature: 0,
          messages: [
            {
              role: "system",
              content: `
You are a professional translation engine.

TASK:

1. Detect source language.
2. Translate text EXACTLY into the language specified by targetLanguage.
3. Never return the original text unless source and target languages are identical.
4. If targetLanguage is "vi", translated MUST be Vietnamese.
5. If targetLanguage is "en", translated MUST be English.
6. If targetLanguage is "ru", translated MUST be Russian.

STRICT RULES:

- sourceLanguage MUST be ISO-639-1 code.
- translated MUST contain ONLY translated text.
- No explanations.
- No comments.
- No markdown.
- No formatting.
- Preserve meaning.
- Preserve names.
- Preserve numbers.
- Return ONLY valid JSON.

Required format:

{
  "sourceLanguage": "ru",
  "translated": "Xin chào người bạn của tôi"
}
`
            },
            {
              role: "user",
              content:
                `Translate the following text into language code "${targetLanguage}".\n\nTEXT:\n${text}`
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("OPENAI RAW RESPONSE:", data);

    const content =
      data?.choices?.[0]?.message?.content ?? "{}";

    console.log("OPENAI CONTENT:", content);

    let parsed = null;

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
        translated: text
      };
    }

    console.log("FINAL RESULT:", parsed);

    return new Response(
      JSON.stringify({
        debugText: text,
        debugTargetLanguage: targetLanguage,
        sourceLanguage:
          parsed.sourceLanguage || "unknown",
        translated:
          parsed.translated || text
      }),
      {
        headers: {
          "Content-Type":
            "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  } catch (error) {
    console.error("TRANSLATE ERROR:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : String(error)
      }),
      {
        status: 500,
        headers: {
          "Content-Type":
            "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
});
