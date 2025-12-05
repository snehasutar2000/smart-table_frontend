import React from 'react';
import './OrderSummary.css';

function OrderSummary({ cart, placeOrder }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="order-summary">
      <h2>🛒 Order Summary</h2>
      {cart.length === 0 ? (
        <p>No items added yet.</p>
      ) : (
        <>
          <ul>
            {cart.map(item => (
              <li key={item.id}>
                {item.name} x {item.qty} = ₹{item.price * item.qty}
              </li>
            ))}
          </ul>
          <h3>Total: ₹{total.toFixed(2)}</h3>
          <button onClick={placeOrder}>Place Order</button>
        </>
      )}
    </div>
  );
}

export default OrderSummary;
