"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export function GlobalHotkeys() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      const ctrlC = e.ctrlKey && key.toLowerCase() === "c";

      if (key !== "Escape" && !ctrlC) return;

      // Don't hijack copy
      if (ctrlC && window.getSelection()?.toString()) return;

      if (pathname !== "/") {
        e.preventDefault();
        router.push("/");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pathname, router]);

  return null;
}

