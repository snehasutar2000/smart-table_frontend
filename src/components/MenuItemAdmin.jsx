import React, { useState } from 'react';
import './MenuItem.css';

function MenuItem({ item, addToCart }) {
  const [qty, setQty] = useState(1);

  return (
    <div className="menu-item">
      <img src={item.image} alt={item.name} />
      <div className="menu-details">
        <h3>{item.name}</h3>
        <p>{item.desc}</p>
        <p className="price">${item.price.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default MenuItem;
