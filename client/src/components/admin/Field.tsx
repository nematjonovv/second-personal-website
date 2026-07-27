type FieldProps = {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "password";
  hint?: string;
  autoComplete?: string;
  required?: boolean;
};

export default function Field({
  name,
  label,
  value,
  onChange,
  type = "text",
  hint,
  autoComplete,
  required,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="font-mono text-xs font-bold uppercase tracking-wide text-ink/40"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        required={required}
        className="w-full border-2 border-ink bg-paper px-4 py-3 font-mono text-sm text-ink outline-none
                   transition-colors duration-200 focus:border-accent"
      />

      {hint && (
        <p className="font-mono text-xs uppercase tracking-wide text-ink/40">{hint}</p>
      )}
    </div>
  );
}
