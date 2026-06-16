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
          messages: [
            {
              role: "system",
              content: `You are a professional translator.
Translate the text into ${targetLanguage}.
Return ONLY the translated text.
Do not explain anything.`,
            },
            {
              role: "user",
              content: text,
            },
          ],
          temperature: 0,
        }),
      }
    );

    const data = await response.json();

    const translated =
      data?.choices?.[0]?.message?.content?.trim() || text;

    return new Response(
      JSON.stringify({
        translated,
      }),
      {
        headers: {
          "Content-Type": "application/json",
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
        },
      }
    );
  }
});