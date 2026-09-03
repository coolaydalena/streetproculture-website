import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { PageHero } from "@/components/layout/page-hero";
import { GoogleButton } from "@/components/auth/google-button";
import { getUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const user = await getUser();
  if (user) redirect(next && next.startsWith("/") ? next : "/account");

  return (
    <>
      <PageHero
        kicker="Members"
        title="Sign In"
        intro="Sign in with Google to track your reservations and orders. Shop staff use the same login for the product CMS."
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Suspense fallback={null}>
          <GoogleButton />
        </Suspense>
        <p className="mt-6 max-w-md text-sm text-ink-soft">
          We only use your Google account for sign-in. No posting, no contacts —
          just your name and email.
        </p>
      </div>
    </>
  );
}
