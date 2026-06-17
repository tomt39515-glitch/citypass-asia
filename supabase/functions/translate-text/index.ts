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
          temperature: 0,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: `You are a translation engine.
Return ONLY JSON:
{
  "sourceLanguage":"ru",
  "translated":"..."
}`,
            },
            {
              role: "user",
              content: `Translate into "${targetLanguage}": ${text}`,
            },
          ],
        }),
      }
    );

    const rawResponse = await response.text();
    console.log("OPENAI RAW:", rawResponse);

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.status} ${rawResponse}`);
    }

    let data;
    try {
      data = JSON.parse(rawResponse);
    } catch (e) {
      throw new Error(`Invalid OpenAI JSON: ${rawResponse}`);
    }

    const content =
      data?.choices?.[0]?.message?.content || "";

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = {
        sourceLanguage: "unknown",
        translated: content || text,
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
    console.error("TRANSLATE ERROR:", error);

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
