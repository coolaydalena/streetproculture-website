"use client";

import { useActionState, useEffect } from "react";
import { updateProfile, type AccountActionState } from "@/lib/actions/account";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

const initial: AccountActionState = { ok: false };

export function ProfileForm({ fullName }: { fullName: string }) {
  const [state, action, pending] = useActionState(updateProfile, initial);
  const { push } = useToast();

  useEffect(() => {
    if (state.ok) push("Profile updated", "success");
    else if (state.error) push(state.error, "error");
  }, [state, push]);

  return (
    <form action={action} className="max-w-md space-y-5">
      <Field label="Display name" htmlFor="full_name" error={state.error}>
        <Input
          id="full_name"
          name="full_name"
          defaultValue={fullName}
          required
          maxLength={120}
        />
      </Field>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
