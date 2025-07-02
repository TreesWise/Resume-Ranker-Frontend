import React from 'react';
import './styles.css';

const Select = ({data, selectedValue, onSelectValue, title}) => {
  return (
    <div>
      <label className="select-label">{title}</label>
      <select
        className="select-input"
        value={selectedValue}
        onChange={(e) => onSelectValue(e.target.value)}
      >
        <option value="" disabled>Select an option</option>
        {data.map((item, index) => (
          <option key={index} value={item}>
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Select