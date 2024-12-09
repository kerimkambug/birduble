import React from "react";
import "../styles/kilermenu.css";

const Kiler = ({ category, malzemelist, selectedItems, updateSelectedItems }) => {
  return (
    <div className="kiler-category">
      <h3>{category.toUpperCase()}</h3>
      <ul className="kiler-list">
        {malzemelist.map((malzeme, index) => (
          <li key={index} className="kiler-item">
            <input
              type="checkbox"
              id={malzeme}
              checked={selectedItems.includes(malzeme)}
              onChange={() => updateSelectedItems(malzeme)}
            />
            <label htmlFor={malzeme}>
              <span>{malzeme}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Kiler;
