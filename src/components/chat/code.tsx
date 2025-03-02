import type { JSX, ReactNode } from "react";
import ShikiHighlighter, { type Element } from "react-shiki";
import CopyButton from "@/components/ui/copy-button";
interface CodeHighlightProps {
  className?: string | undefined;
  children?: ReactNode | undefined;
  node?: Element | undefined;
}

export const CodeHighlight = ({
  className,
  children,
  ...props
}: CodeHighlightProps): JSX.Element => {
  const match = className?.match(/language-(\w+)/);
  const language = match ? match[1] : undefined;

  if (!language) {
    return (
      <code {...props} className="bg-muted rounded-md p-1">
        {String(children)}
      </code>
    );
  }

  return (
    <div className="relative">
      <ShikiHighlighter language={language} theme={"github-light"} {...props}>
        {String(children)}
      </ShikiHighlighter>
      <div className="absolute right-2 bottom-2">
        <CopyButton text={String(children)} className="bg-muted" />
      </div>
    </div>
  );
};
