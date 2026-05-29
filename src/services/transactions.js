import { supabase } from "../supabase";

export async function getTransactions() {
  return await supabase
    .from("transactions")
    .select("*")
    .order("created_at", {
      ascending: false,
    });
}

export async function createTransaction(data) {
  return await supabase
    .from("transactions")
    .insert(data);
}