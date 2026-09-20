"use client";

import { useEffect, useState } from "react";

const FALLBACK =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
      <rect width="128" height="128" fill="#120c1c"/>
      <circle cx="64" cy="52" r="22" fill="#3b2a5c"/>
      <ellipse cx="64" cy="108" rx="36" ry="28" fill="#3b2a5c"/>
    </svg>`
  );

/** Local demo image with silent fallback — avoids broken-image icons. */
export function SafeImage({
  src,
  alt = "",
  className,
  fallback = FALLBACK,
}: {
  src: string;
  alt?: string;
  className?: string;
  fallback?: string;
}) {
  const [current, setCurrent] = useState(src || fallback);
  useEffect(() => {
    setCurrent(src || fallback);
  }, [src, fallback]);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      className={className}
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
    />
  );
}
