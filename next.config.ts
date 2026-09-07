import type { NextConfig } from "next";

// Supabase Storage host for product images. Set NEXT_PUBLIC_SUPABASE_URL so the
// hostname matches your project (e.g. abcdefgh.supabase.co). Localhost is added
// for `supabase start`.
const supabaseHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").hostname;
  } catch {
    return "";
  }
})();

const nextConfig: NextConfig = {
  images: {
    // Next 16 blocks image optimization for hosts that resolve to a private IP
    // (SSRF guard), which breaks the local `supabase start` stack on
    // 127.0.0.1:54321 with `400 "url" parameter is not allowed`. Allow it only
    // in dev — production always talks to the public *.supabase.co host.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: [
      ...(supabaseHost
        ? ([
            {
              protocol: "https" as const,
              hostname: supabaseHost,
              pathname: "/storage/v1/object/public/**",
            },
          ] as const)
        : []),
      // Local Supabase stack
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "54321",
        pathname: "/storage/v1/object/public/**",
      },
      // Google account avatars (SSO profile pictures)
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
