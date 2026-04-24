import { createClient } from "@supabase/supabase-js";

const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = URL && KEY ? createClient(URL, KEY) : null;
export const syncEnabled = !!supabase;

export async function pullData(pin) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("sync_data")
    .select("data, updated_at")
    .eq("pin", pin)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function pushData(pin, payload) {
  if (!supabase) return null;
  const updated_at = new Date().toISOString();
  const { error } = await supabase
    .from("sync_data")
    .upsert({ pin, data: payload, updated_at });
  if (error) throw error;
  return updated_at;
}
