import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export default function ChatInput({
  onSubmit,
  isDisabled = false,
  initialInput = "",
}: {
  onSubmit: (message: string) => void;
  isDisabled?: boolean;
  initialInput?: string;
}) {
  const [input, setInput] = useState(initialInput);

  const handleChatSubmit = () => {
    if (!input.trim() || isDisabled) return;
    onSubmit(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isDisabled) {
      e.preventDefault();
      handleChatSubmit();
    }
  };

  return (
    <div className="pointer-events-none absolute inset-0 flex items-end">
      <div className="from-background pointer-events-auto w-full bg-gradient-to-t to-transparent p-4 pt-16">
        <div className="relative w-full max-w-full px-6">
          <Textarea
            value={input}
            placeholder={
              isDisabled ? "Waiting for response..." : "Type your message..."
            }
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-background/80 border-muted max-h-[120px] min-h-[60px] resize-none pr-12"
            disabled={isDisabled}
          />
          <Button
            type="button"
            size="icon"
            onClick={handleChatSubmit}
            className="absolute right-8 bottom-2 h-8 w-8"
            disabled={!input.trim() || isDisabled}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
