import { supabase } from "../supabase";

export async function getPartnerApplications() {
  return await supabase
    .from("partner_applications")
    .select("*")
    .order("created_at", {
      ascending: false,
    });
}

export async function approvePartner(id) {
  return await supabase
    .from("partner_applications")
    .update({
      status: "approved",
    })
    .eq("id", id);
}

export async function rejectPartner(id) {
  return await supabase
    .from("partner_applications")
    .update({
      status: "rejected",
    })
    .eq("id", id);
}