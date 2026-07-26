import { cn } from "@/lib/utils";
import type { AccentText } from "../about.type";

export default function AccentPhrase({
  text,
  className,
}: {
  text: AccentText;
  className?: string;
}) {
  return (
    <>
      {text.before}
      <span className={cn("font-accent italic normal-case text-accent", className)}>
        {text.accent}
      </span>
      {text.after}
    </>
  );
}
