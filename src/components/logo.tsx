/**
 * RethinkAI brand mark: the "Rethought R".
 * A geometric R whose diagonal leg is detached and pivoted a few degrees
 * out of position, with an electric-blue square marking the pivot joint:
 * the letter literally re-thought. Mark body inherits currentColor so it
 * works on both themes; the pivot stays brand blue.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        fill="currentColor"
        d="M 8 4 L 48 4 C 52 4 56 8 56 16 L 56 24 C 56 32 52 36 48 36 L 16 36 L 16 60 L 8 60 Z M 16 12 L 44 12 C 47 12 48 14 48 16 L 48 24 C 48 26 47 28 44 28 L 16 28 Z"
      />
      <path fill="currentColor" d="M 41 42 L 47 38 L 60 57 L 55 60 Z" />
      <rect x="40" y="36" width="8" height="8" fill="#2563EB" />
    </svg>
  );
}

/**
 * Full lockup: mark + RethinkAI wordmark. Use in header and footer so the
 * brand renders identically everywhere.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5${className ? ` ${className}` : ""}`}>
      <LogoMark className="h-[22px] w-[22px] shrink-0 text-foreground" />
      <span className="text-lg font-bold leading-none tracking-tight">
        Rethink<span className="text-primary">AI</span>
      </span>
    </span>
  );
}
