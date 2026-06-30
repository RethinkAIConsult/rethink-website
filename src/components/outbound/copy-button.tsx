"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CopyButtonProps {
  text: string;
  className?: string;
}

// Robust copy: the async clipboard API only works in a secure context (https or
// localhost). Over a LAN IP (e.g. 192.168.x.x) it's unavailable, so we fall back
// to the legacy execCommand path which works anywhere.
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy method */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [label, setLabel] = useState<"Copy note" | "Copied" | "Copy failed">("Copy note");

  async function onCopy() {
    const ok = await copyText(text);
    setLabel(ok ? "Copied" : "Copy failed");
    setTimeout(() => setLabel("Copy note"), 1500);
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onCopy}
      className={cn("h-7 text-xs", className)}
    >
      {label}
    </Button>
  );
}
