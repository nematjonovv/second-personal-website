import { Fragment, type ReactNode } from "react";

type Block =
  | { kind: "code"; code: string }
  | { kind: "heading"; level: 2 | 3; text: string }
  | { kind: "list"; ordered: boolean; items: string[] }
  | { kind: "paragraph"; text: string };

function parse(source: string): Block[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    if (line.trimStart().startsWith("```")) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      i++;
      blocks.push({ kind: "code", code: code.join("\n") });
      continue;
    }

    const heading = /^(#{2,3})\s+(.*)$/.exec(line);
    if (heading) {
      blocks.push({
        kind: "heading",
        level: heading[1].length === 2 ? 2 : 3,
        text: heading[2].trim(),
      });
      i++;
      continue;
    }

    const isUl = (l: string) => /^\s*[-*]\s+/.test(l);
    const isOl = (l: string) => /^\s*\d+\.\s+/.test(l);

    if (isUl(line) || isOl(line)) {
      const ordered = isOl(line);
      const matches = ordered ? isOl : isUl;
      const items: string[] = [];
      while (i < lines.length && matches(lines[i])) {
        items.push(lines[i].replace(/^\s*(?:[-*]|\d+\.)\s+/, ""));
        i++;
      }
      blocks.push({ kind: "list", ordered, items });
      continue;
    }

    const paragraph: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trimStart().startsWith("```") &&
      !/^#{2,3}\s/.test(lines[i]) &&
      !isUl(lines[i]) &&
      !isOl(lines[i])
    ) {
      paragraph.push(lines[i].trim());
      i++;
    }
    blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
  }

  return blocks;
}

const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;

function inline(text: string): ReactNode {
  return text.split(INLINE).map((part, i) => {
    if (!part) return null;

    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded bg-ink/10 px-1.5 py-0.5 font-mono text-[0.9em]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    if (link) {
      const external = /^https?:\/\//.test(link[2]);
      return (
        <a
          key={i}
          href={link[2]}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
          className="underline decoration-accent decoration-2 underline-offset-4 transition-colors duration-200 hover:text-accent"
        >
          {link[1]}
        </a>
      );
    }

    return <Fragment key={i}>{part}</Fragment>;
  });
}

export default function Markdown({ source }: { source: string }) {
  return (
    <div className="max-w-172">
      {parse(source).map((block, i) => {
        switch (block.kind) {
          case "heading":
            return block.level === 2 ? (
              <h2
                key={i}
                className="mt-14 mb-5 font-display text-2xl uppercase leading-tight tracking-tight md:text-3xl"
              >
                {block.text}
              </h2>
            ) : (
              <h3
                key={i}
                className="mt-10 mb-4 font-mono text-sm font-bold uppercase tracking-wide"
              >
                {block.text}
              </h3>
            );

          case "code":
            return (
              <pre
                key={i}
                className="scroll-invert mt-6 mb-6 overflow-x-auto border-2 border-ink bg-ink p-5 font-mono text-xs leading-relaxed text-paper md:text-sm"
              >
                <code>{block.code}</code>
              </pre>
            );

          case "list":
            return block.ordered ? (
              <ol key={i} className="mt-6 mb-6 flex flex-col gap-3">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 font-mono text-xs font-bold text-accent">
                      {String(j + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-sm leading-relaxed md:text-base">
                      {inline(item)}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <ul key={i} className="mt-6 mb-6 flex flex-col gap-3">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <span
                      className="mt-2 h-2 w-2 shrink-0 bg-accent"
                      aria-hidden
                    />
                    <span className="font-mono text-sm leading-relaxed md:text-base">
                      {inline(item)}
                    </span>
                  </li>
                ))}
              </ul>
            );

          default:
            return (
              <p
                key={i}
                className="mt-5 font-mono text-sm leading-relaxed md:text-base"
              >
                {inline(block.text)}
              </p>
            );
        }
      })}
    </div>
  );
}
