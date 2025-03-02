import type { JSX, ReactNode } from "react";
import ShikiHighlighter, { isInlineCode, type Element } from "react-shiki";
import CopyButton from "@/components/ui/copy-button-me";
interface CodeHighlightProps {
  className?: string | undefined;
  children?: ReactNode | undefined;
  node?: Element | undefined;
}

export const CodeHighlight = ({
  className,
  children,
  node,
  ...props
}: CodeHighlightProps): JSX.Element => {
  const match = className?.match(/language-(\w+)/);
  const language = match ? match[1] : undefined;

  const isInline: boolean | undefined = node ? isInlineCode(node) : undefined;

  return !isInline ? (
    <div className="relative">
      <ShikiHighlighter
        language={language}
        theme={"github-light"}
        delay={150}
        {...props}
      >
        {String(children)}
      </ShikiHighlighter>
      <div className="absolute right-2 bottom-2">
        <CopyButton text={String(children)} className="bg-muted" />
      </div>
    </div>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};
