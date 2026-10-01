export default function DiseaseSearch({ value, onChange }) {
  return (
    <input
      type="search"
      className="input input--search"
      placeholder="Search diseases by name..."
      aria-label="Search diseases"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
