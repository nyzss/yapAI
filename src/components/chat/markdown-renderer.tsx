import React, { JSX, ReactNode } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ShikiHighlighter, { isInlineCode, type Element } from "react-shiki";

import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/chat/copy-button";

interface MarkdownRendererProps {
  children: string;
}

interface CodeHighlightProps {
  className?: string | undefined;
  children?: ReactNode | undefined;
  node?: Element | undefined;
}

const CodeHighlight = React.memo(
  ({
    className,
    children,
    node,
    ...props
  }: CodeHighlightProps): JSX.Element => {
    const match = className?.match(/language-(\w+)/);
    const language = match ? match[1] : undefined;
    const code = String(children);

    const isInline: boolean | undefined = node ? isInlineCode(node) : undefined;

    if (!isInline && language) {
      return (
        <div className="group/code relative my-2 mb-4">
          <ShikiHighlighter
            language={language}
            theme="github-dark"
            delay={150}
            {...props}
          >
            {code}
          </ShikiHighlighter>

          <div className="bg-background invisible absolute -right-2 -bottom-2 z-10 flex space-x-1 rounded-lg p-1 opacity-0 shadow-sm transition-all duration-200 group-hover/code:visible group-hover/code:opacity-100">
            <CopyButton content={code} copyMessage="Copied code to clipboard" />
          </div>
        </div>
      );
    }

    return (
      <code
        className={cn(
          "[:not(pre)>&]:bg-background/50 font-mono [:not(pre)>&]:rounded-md [:not(pre)>&]:px-1 [:not(pre)>&]:py-0.5",
          className,
        )}
        {...props}
      >
        {children}
      </code>
    );
  },
);
CodeHighlight.displayName = "CodeHighlight";

const COMPONENTS = {
  h1: withClass("h1", "text-2xl font-semibold"),
  h2: withClass("h2", "font-semibold text-xl"),
  h3: withClass("h3", "font-semibold text-lg"),
  h4: withClass("h4", "font-semibold text-base"),
  h5: withClass("h5", "font-medium"),
  strong: withClass("strong", "font-semibold"),
  a: withClass("a", "text-primary underline underline-offset-2"),
  blockquote: withClass("blockquote", "border-l-2 border-primary pl-4"),
  code: CodeHighlight,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pre: ({ children }: any) => children,
  ol: withClass("ol", "list-decimal space-y-2 pl-6"),
  ul: withClass("ul", "list-disc space-y-2 pl-6"),
  li: withClass("li", "my-1.5"),
  table: withClass(
    "table",
    "w-full border-collapse overflow-y-auto rounded-md border border-foreground/20",
  ),
  th: withClass(
    "th",
    "border border-foreground/20 px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
  ),
  td: withClass(
    "td",
    "border border-foreground/20 px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
  ),
  tr: withClass("tr", "m-0 border-t p-0 even:bg-muted"),
  p: withClass("p", "whitespace-pre-wrap"),
  hr: withClass("hr", "border-foreground/20"),
};

function withClass(Tag: keyof JSX.IntrinsicElements, classes: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const Component = ({ node, ...props }: any) => (
    <Tag className={classes} {...props} />
  );
  Component.displayName = Tag;
  return Component;
}

const MarkdownRenderer = React.memo(function MarkdownRenderer({
  children,
}: MarkdownRendererProps) {
  return (
    <Markdown remarkPlugins={[remarkGfm]} components={COMPONENTS}>
      {children}
    </Markdown>
  );
});

export default MarkdownRenderer;
