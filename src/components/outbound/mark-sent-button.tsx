"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface MarkSentButtonProps {
  prospectId: string;
  /**
   * Server action to call. Expected signature:
   *   (prospectId: string) => Promise<void>
   * Pages that use this component can pass `markConnectSent` from
   * "@/app/(app)/outbound/actions" or any equivalent action.
   */
  action: (prospectId: string) => Promise<unknown>;
  className?: string;
}

export function MarkSentButton({
  prospectId,
  action,
  className,
}: MarkSentButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  function handleClick() {
    startTransition(async () => {
      await action(prospectId);
      setDone(true);
    });
  }

  if (done) {
    return (
      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
        Sent
      </span>
    );
  }

  return (
    <Button
      type="button"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      className={cn("h-7 text-xs", className)}
    >
      {isPending ? "Marking…" : "Mark sent"}
    </Button>
  );
}
