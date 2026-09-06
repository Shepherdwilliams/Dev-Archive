import React from 'react';

/**
 * Canonical Site Owner Email Address
 */
export const OWNER_EMAIL = 'wordswithoutwallspublishing@gmail.com';

/**
 * Checks whether the provided email corresponds to the authorized site owner.
 */
export function isSiteOwner(email: string | null | undefined): boolean {
  if (!email || typeof email !== 'string') return false;
  return email.trim().toLowerCase() === OWNER_EMAIL.toLowerCase();
}

/**
 * Validates whether a URL is safe for navigation.
 * Permits only http:, https:, and mailto: protocols.
 * Blocks dangerous schemes like javascript:, data:, vbscript:, and relative malicious vectors.
 */
export function isSafeUrl(url: string | undefined | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim().toLowerCase();
  return trimmed.startsWith('https://') || trimmed.startsWith('http://') || trimmed.startsWith('mailto:');
}

/**
 * Safe link component for ReactMarkdown to prevent XSS via javascript: links
 * and reverse tabnabbing via rel="noopener noreferrer nofollow".
 */
export const SafeMarkdownLink: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  href,
  children,
  className,
  ...props
}) => {
  if (!isSafeUrl(href)) {
    return <span className="underline decoration-dotted text-slate-400 text-xs font-mono">{children}</span>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={className || "text-brand-green hover:underline hover:text-brand-green/80 font-medium transition-colors"}
      {...props}
    >
      {children}
    </a>
  );
};
