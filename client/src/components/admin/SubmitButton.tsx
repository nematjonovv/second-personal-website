type SubmitButtonProps = {
  children: React.ReactNode;
  pending?: boolean;
  pendingLabel?: string;
  disabled?: boolean;
};

export default function SubmitButton({
  children,
  pending,
  pendingLabel = "Saqlanmoqda…",
  disabled,
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="rounded-full bg-ink px-6 py-3 font-mono text-xs font-bold uppercase tracking-wide text-paper
                 transition-opacity duration-200 disabled:opacity-40"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
