"use client";

import React from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Button } from "@/components/ui/button";

type CopyButtonProps = {
  content: string;
  copyMessage?: string;
};

export const CopyButton = React.memo(
  function CopyButton({ content, copyMessage }: CopyButtonProps) {
    const { isCopied, handleCopy } = useCopyToClipboard({
      text: content,
      copyMessage,
    });

    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative h-6 w-6"
        aria-label="Copy to clipboard"
        onClick={handleCopy}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Check
            className={cn(
              "h-4 w-4 transition-transform ease-in-out",
              isCopied ? "scale-100" : "scale-0",
            )}
          />
        </div>
        <Copy
          className={cn(
            "h-4 w-4 transition-transform ease-in-out",
            isCopied ? "scale-0" : "scale-100",
          )}
        />
      </Button>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.content === nextProps.content &&
      prevProps.copyMessage === nextProps.copyMessage
    );
  },
);
