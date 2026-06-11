import type { AnchorHTMLAttributes, ReactNode } from "react";

interface ArrowLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  /** default = foreground text, primary = brand blue */
  tone?: "default" | "primary";
}

/**
 * Arrow-line CTA: uppercase mono label, hairline that extends on hover,
 * arrowhead at the end. The site's standard link treatment for
 * "see more" / secondary actions. Server-component safe (no hooks).
 */
export function ArrowLink({
  children,
  tone = "default",
  className,
  ...rest
}: ArrowLinkProps) {
  const toneClass = tone === "primary" ? " arrow-link-primary" : "";
  return (
    <a
      className={`arrow-link${toneClass}${className ? ` ${className}` : ""} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
      {...rest}
    >
      <span>{children}</span>
      <span className="arrow-link-line" aria-hidden="true">
        <span className="arrow-link-head" />
      </span>
    </a>
  );
}
