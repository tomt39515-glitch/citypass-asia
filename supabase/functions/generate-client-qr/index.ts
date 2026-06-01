import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.json();

    console.log("BODY =", body);

    const telegram_id = Number(body.telegram_id);

    console.log("TELEGRAM_ID =", telegram_id);

    if (!telegram_id) {
      throw new Error("telegram_id is required");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let { data: client, error: clientError } =
      await supabase
        .from("clients")
        .select("*")
        .eq("telegram_id", String(telegram_id))
        .maybeSingle();

    console.log("CLIENT =", client);
    console.log("CLIENT_ERROR =", clientError);

    if (!client) {
      console.log("CREATE NEW CLIENT");

      const {
        data: newClient,
        error: createError,
      } = await supabase
        .from("clients")
        .insert({
          telegram_id: String(telegram_id),
          full_name: "New Client",
          phone: null,
          bonus_balance: 0,
          status: "active",
          total_spent: 0,
        })
        .select()
        .single();

      console.log(
        "CREATE CLIENT ERROR =",
        createError
      );

      if (createError) {
        throw createError;
      }

      client = newClient;
    }

    console.log("DELETE OLD TOKENS START");

    const { error: deleteError } =
      await supabase
        .from("active_qr_tokens")
        .delete()
        .eq("client_id", client.id);

    console.log(
      "DELETE OLD TOKENS ERROR =",
      deleteError
    );

    if (deleteError) {
      throw deleteError;
    }

    const token = crypto.randomUUID();

    console.log("TOKEN =", token);

    const expiresAt = new Date(
      Date.now() + 60 * 1000
    ).toISOString();

    console.log("EXPIRES =", expiresAt);

    const {
      data: inserted,
      error: insertError,
    } = await supabase
      .from("active_qr_tokens")
      .insert({
        client_id: client.id,
        token,
        expires_at: expiresAt,
      })
      .select();

    console.log("INSERTED =", inserted);
    console.log(
      "INSERT_ERROR =",
      insertError
    );

    if (insertError) {
      throw insertError;
    }

    console.log("SUCCESS");

    return new Response(
      JSON.stringify({
        success: true,
        client_id: client.id,
        token,
        expires_at: expiresAt,
        ttl_seconds: 60,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type":
            "application/json",
        },
      }
    );
  } catch (err) {
    console.error(
      "QR ERROR =",
      err
    );

    return new Response(
      JSON.stringify({
        success: false,
        error:
          err?.message ||
          String(err),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type":
            "application/json",
        },
      }
    );
  }
});