import { supabase } from "../supabase";

export async function getBalance() {
  return await supabase
    .from("balances")
    .select("*")
    .limit(1)
    .single();
}