"use client";

import { useMemo } from "react";
import katex from "katex";

export function Latex({ expression, block = false, className = "" }: { expression: string; block?: boolean; className?: string }) {
  const html = useMemo(() => katex.renderToString(expression, {
    displayMode: block,
    throwOnError: false,
    strict: "ignore",
  }), [expression, block]);

  return (
    <span
      className={`latex ${block ? "latex-block" : "latex-inline"} ${className}`.trim()}
      aria-label={expression}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
