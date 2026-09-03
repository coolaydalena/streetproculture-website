"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AccountActionState = { ok: boolean; error?: string };

export async function updateProfile(
  _prev: AccountActionState,
  formData: FormData,
): Promise<AccountActionState> {
  const user = await requireUser();

  const fullName = String(formData.get("full_name") ?? "").trim().slice(0, 120);
  if (!fullName) return { ok: false, error: "Name cannot be empty" };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("streetproculture_users")
    .update({ full_name: fullName })
    .eq("id", user.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/account");
  return { ok: true };
}
