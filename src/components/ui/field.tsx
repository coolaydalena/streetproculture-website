import type { ComponentProps, ReactNode } from "react";

const CONTROL =
  "mt-2 w-full border border-line bg-paper-card px-3 py-2.5 text-sm outline-none focus:border-oxblood disabled:opacity-50";

export function Input({
  className = "",
  ...props
}: ComponentProps<"input">) {
  return <input className={`${CONTROL} ${className}`} {...props} />;
}

export function Textarea({
  className = "",
  ...props
}: ComponentProps<"textarea">) {
  return <textarea className={`${CONTROL} ${className}`} {...props} />;
}

export function Select({
  className = "",
  children,
  ...props
}: ComponentProps<"select">) {
  return (
    <select className={`${CONTROL} ${className}`} {...props}>
      {children}
    </select>
  );
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="u-label text-ink-soft">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="mt-1 text-xs text-ink-soft">{hint}</p>
      )}
      {error && <p className="mt-1 text-xs text-oxblood">{error}</p>}
    </div>
  );
}

export function Checkbox({
  label,
  description,
  className = "",
  ...props
}: ComponentProps<"input"> & { label: string; description?: string }) {
  return (
    <label className={`flex items-start gap-3 ${className}`}>
      <input
        type="checkbox"
        className="mt-0.5 size-4 shrink-0 accent-oxblood"
        {...props}
      />
      <span>
        <span className="u-label block">{label}</span>
        {description && (
          <span className="mt-0.5 block text-xs text-ink-soft">{description}</span>
        )}
      </span>
    </label>
  );
}
