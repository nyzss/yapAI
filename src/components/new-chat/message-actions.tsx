import type { Message } from "ai";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";

import { CopyIcon, ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { memo } from "react";

export function PureMessageActions({
  chatId,
  message,
  isLoading,
}: {
  chatId: string;
  message: Message;
  isLoading: boolean;
}) {
  const [, copyToClipboard] = useCopyToClipboard();

  if (isLoading) return null;
  if (message.role === "user") return null;
  if (message.toolInvocations && message.toolInvocations.length > 0)
    return null;

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-row gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="text-muted-foreground h-fit px-2 py-1"
              variant="outline"
              onClick={async () => {
                await copyToClipboard(message.content as string);
                toast.success("Copied to clipboard!");
              }}
            >
              <CopyIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="text-muted-foreground !pointer-events-auto h-fit px-2 py-1"
              variant="outline"
              onClick={async () => {
                const upvote = fetch("/api/vote", {
                  method: "PATCH",
                  body: JSON.stringify({
                    chatId,
                    messageId: message.id,
                    type: "up",
                  }),
                });

                toast.promise(upvote, {
                  loading: "Upvoting Response...",
                  success: () => {
                    return "Upvoted Response!";
                  },
                  error: "Failed to upvote response.",
                });
              }}
            >
              <ThumbsUp />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Upvote Response</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="text-muted-foreground !pointer-events-auto h-fit px-2 py-1"
              variant="outline"
              onClick={async () => {
                const downvote = fetch("/api/vote", {
                  method: "PATCH",
                  body: JSON.stringify({
                    chatId,
                    messageId: message.id,
                    type: "down",
                  }),
                });

                toast.promise(downvote, {
                  loading: "Downvoting Response...",
                  success: () => {
                    return "Downvoted Response!";
                  },
                  error: "Failed to downvote response.",
                });
              }}
            >
              <ThumbsDown />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Downvote Response</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export const MessageActions = memo(
  PureMessageActions,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;

    return true;
  },
);
