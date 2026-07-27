type TextAreaFieldProps = {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  hint?: string;
};

export default function TextAreaField({
  name,
  label,
  value,
  onChange,
  rows = 4,
  hint,
}: TextAreaFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="font-mono text-xs font-bold uppercase tracking-wide text-ink/40"
      >
        {label}
      </label>

      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y border-2 border-ink bg-paper px-4 py-3 font-mono text-sm leading-relaxed text-ink
                   outline-none transition-colors duration-200 focus:border-accent"
      />

      {hint && <p className="font-mono text-xs uppercase tracking-wide text-ink/40">{hint}</p>}
    </div>
  );
}
