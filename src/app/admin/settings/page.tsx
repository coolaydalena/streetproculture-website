import { requireSuperadmin } from "@/lib/auth";
import { getSettingsForAdmin } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await requireSuperadmin("/admin/settings");
  const { settings, methods } = await getSettingsForAdmin();

  return (
    <div>
      <h1 className="u-display text-3xl">Checkout Settings</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-soft">
        Fees and payment methods for the online shop.
      </p>
      <div className="mt-8">
        <SettingsForm settings={settings} methods={methods} />
      </div>
    </div>
  );
}
