export default function RadioGroup({ name, options, value, onChange }) {
  return (
    <div role="radiogroup">
      {options.map((opt) => (
        <label key={opt.value} style={{ display: "block", cursor: "pointer" }}>
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}