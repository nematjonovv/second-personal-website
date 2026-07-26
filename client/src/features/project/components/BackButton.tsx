import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ label }: { label: string }) {
  return (
    <Link
      href="/work"
      className="group inline-flex items-center gap-2 rounded-full border-2 border-paper px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide transition-colors duration-200 hover:bg-paper/10"
    >
      <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
      {label}
    </Link>
  );
}
