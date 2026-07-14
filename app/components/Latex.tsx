"use client";

import katex from "katex";

export function Latex({ expression, block = false, className = "" }: { expression: string; block?: boolean; className?: string }) {
  const html = katex.renderToString(expression, {
    displayMode: block,
    throwOnError: false,
    strict: "ignore",
  });

  return (
    <span
      className={`latex ${block ? "latex-block" : "latex-inline"} ${className}`.trim()}
      aria-label={expression}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
