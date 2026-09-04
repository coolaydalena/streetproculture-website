import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { ProfileForm } from "@/components/account/profile-form";
import { getProfile, requireUser } from "@/lib/auth";
import { listOrdersForUser } from "@/lib/orders";
import { OrderRowList } from "@/components/checkout/order-row-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your Account",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  await requireUser("/account");
  const [profile, orders] = await Promise.all([
    getProfile(),
    listOrdersForUser(),
  ]);
  const recentOrders = orders.slice(0, 3);

  return (
    <>
      <PageHero kicker="Members" title="Your Account" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {profile?.avatar_url && (
            <Image
              src={profile.avatar_url}
              alt=""
              width={56}
              height={56}
              className="size-14 rounded-full object-cover"
            />
          )}
          <div>
            <p className="u-display text-2xl leading-none">
              {profile?.full_name ?? "Rider"}
            </p>
            <p className="mt-1 text-sm text-ink-soft">{profile?.email}</p>
          </div>
          <form action="/auth/signout" method="post" className="ml-auto">
            <button
              type="submit"
              className="u-label border border-ink px-4 py-2 transition-colors hover:bg-ink hover:text-paper"
            >
              Sign out
            </button>
          </form>
        </div>

        <section className="mt-12 border-t border-line pt-10">
          <h2 className="u-label text-oxblood">Profile</h2>
          <div className="mt-5">
            <ProfileForm fullName={profile?.full_name ?? ""} />
          </div>
        </section>

        <section className="mt-12 border-t border-line pt-10">
          <div className="flex items-center justify-between">
            <h2 className="u-label text-oxblood">Orders</h2>
            {orders.length > 0 && (
              <Link
                href="/account/orders"
                className="u-label text-ink-soft hover:text-ink"
              >
                View all →
              </Link>
            )}
          </div>
          <div className="mt-4">
            <OrderRowList
              orders={recentOrders}
              empty="No orders yet. Your purchases will show up here."
            />
          </div>
        </section>
      </div>
    </>
  );
}
