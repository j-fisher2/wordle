const Checkbox = ({ label, checked, onChange }) => {
  const handleChange = (e) => {
    if (onChange) onChange();
  };

  return (
    <div>
        <label>
        <input type="checkbox" checked={checked} onChange={handleChange} />
        {label}
        </label>
    </div>
  );
};

export default Checkbox;