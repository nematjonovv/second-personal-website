import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 group"
      aria-label="Hikmatillo — bosh sahifa"
    >
      <span className="font-display text-paper font-bold bg-accent rounded-[100px] p-1 -rotate-10 text-sm">HN</span>
      <span className="font-display text-ink text-xl font-bold">HIKMATILLO</span>
    </Link>
  );
}