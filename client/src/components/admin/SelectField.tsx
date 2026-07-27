type SelectFieldProps = {
  name: string;
  label: string;
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
  hint?: string;
};

export default function SelectField({
  name,
  label,
  value,
  options,
  onChange,
  hint,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="font-mono text-xs font-bold uppercase tracking-wide text-ink/40"
      >
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full border-2 border-ink bg-paper px-4 py-3 font-mono text-sm text-ink outline-none
                   transition-colors duration-200 focus:border-accent"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {hint && <p className="font-mono text-xs uppercase tracking-wide text-ink/40">{hint}</p>}
    </div>
  );
}
