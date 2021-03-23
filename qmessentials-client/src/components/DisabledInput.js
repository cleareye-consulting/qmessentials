export default function DisabledInput({ label, name, value }) {
  return (
    <div className="mb-3">
      <label className="control-label" htmlFor={name}>
        {label}
      </label>
      <input
        type="text"
        name={name}
        className="form-control"
        value={value}
        disabled
      />
    </div>
  )
}
