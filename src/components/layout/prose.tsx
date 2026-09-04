import type { ReactNode } from "react";

/**
 * Shared long-form text styling for the legal pages. Plain elements
 * (`<h2>`, `<p>`, `<ul>`, `<a>`, `<strong>`) are styled via descendant
 * selectors so page content stays readable markup.
 */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div
      className={[
        "max-w-2xl space-y-5 text-sm leading-relaxed text-ink-soft",
        "[&_h2]:mt-10 [&_h2]:font-[family-name:var(--font-heading)] [&_h2]:text-xl [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:text-ink",
        "[&_p]:mt-3",
        "[&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5",
        "[&_a]:text-oxblood [&_a]:underline [&_a]:underline-offset-2",
        "[&_strong]:font-semibold [&_strong]:text-ink",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
