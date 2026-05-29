import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  try {
    const body = await req.json();

    const {
      partner_id,
      user_id,
      original_amount,
    } = body;

    if (!partner_id || !user_id || !original_amount) {
      return new Response(
        JSON.stringify({ error: "Нет данных" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const CLIENT_DISCOUNT_PERCENT = 10;
    const CITYPASS_PERCENT = 5;

    const clientDiscountAmount =
      (Number(original_amount) * CLIENT_DISCOUNT_PERCENT) / 100;

    const citypassAmount =
      (Number(original_amount) * CITYPASS_PERCENT) / 100;

    const finalAmount =
      Number(original_amount) - clientDiscountAmount;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: client } = await supabase
      .from("clients")
      .select("*")
      .eq("id", user_id)
      .single();

    const { data: partner } = await supabase
      .from("partners")
      .select("*")
      .eq("id", partner_id)
      .single();

    if (!client || !partner) {
      return new Response(
        JSON.stringify({ error: "Клиент или партнёр не найден" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    let currentBonus = Number(partner.bonus_balance || 0);
    let currentDeposit = Number(partner.deposit_balance || 0);

    let remainingCharge = citypassAmount;

    if (currentBonus >= remainingCharge) {
      currentBonus -= remainingCharge;
    } else {
      remainingCharge -= currentBonus;
      currentBonus = 0;
      currentDeposit -= remainingCharge;
    }

    if (currentDeposit < 0) {
      return new Response(
        JSON.stringify({ error: "Недостаточно средств у партнёра" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await supabase.from("transactions").insert({
      partner_id,
      user_id,
      original_amount,
      client_discount_percent: CLIENT_DISCOUNT_PERCENT,
      citypass_percent: CITYPASS_PERCENT,
      client_discount_amount: clientDiscountAmount,
      citypass_amount: citypassAmount,
      final_amount: finalAmount,
      currency: "VND",
    });

    await supabase
      .from("clients")
      .update({
        total_spent:
          Number(client.total_spent || 0) + finalAmount,
      })
      .eq("id", user_id);

    await supabase
      .from("partners")
      .update({
        deposit_balance: currentDeposit,
        bonus_balance: currentBonus,
      })
      .eq("id", partner_id);

    return new Response(
      JSON.stringify({
        success: true,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: e.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});