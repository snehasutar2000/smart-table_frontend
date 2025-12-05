import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuItem from './MenuItem';
import OrderSummary from './OrderSummary';
import FeedbackForm from './Feedback';
import { useSearchParams } from "react-router-dom";

 function Customer() {
 const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [menuLoading, setMenuLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [searchParams] = useSearchParams();

    useEffect(() => {
    const tableNo = searchParams.get("table_no");
    if (tableNo) {
      setTableNumber(tableNo);
    }
  }, [searchParams]);

  const API_BASE = 'https://smart-table.onrender.com/api';

  // Fetch menu
  const fetchMenu = async () => {
    try {
      const res = await axios.get(`${API_BASE}/menu`);
      setMenu(res.data);
    } catch (err) {
      console.error('Failed to fetch menu:', err);
    } finally {
      setMenuLoading(false);
    }
  };

  // Fetch orders (optionally filtered by table)
  const fetchOrders = async (tableNo = '') => {
    try {
      setOrdersLoading(true);
      const url = tableNo
        ? `${API_BASE}/orders?tableNumber=${tableNo}`
        : `${API_BASE}/orders`;
      const res = await axios.get(url);
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Load menu initially
  useEffect(() => {
    fetchMenu();
  }, []);

  // 🔁 Fetch orders whenever table number changes
  useEffect(() => {
    if (tableNumber) {
      fetchOrders(tableNumber);
    } else {
      setOrders([]); // Clear orders when no table selected
    }
  }, [tableNumber]);

  // Add items to cart
  const addToCart = (item, qty) => {
    if (!qty) return;
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + qty } : c));
    } else {
      setCart([...cart, { ...item, qty }]);
    }
  };

  // Place order
  const placeOrder = async () => {
    if (cart.length === 0 || !tableNumber) {
      alert('Please select items and enter table number.');
      return;
    }

    const order = {
      tableNumber,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.qty, 0),
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post(`${API_BASE}/orders`, order);
      setOrderPlaced(true);
      setCart([]);
      fetchOrders(tableNumber); // 🔁 Refresh only that table’s orders
    } catch (err) {
      console.error('Order failed:', err);
      alert('Failed to place order. Please try again.');
    }
  };

  if (orderPlaced) {
    return (
      <div className="thankyou">
        <h2>✅ Thank you for your order!</h2>
        <p>Your food will be served shortly at <b>Table {tableNumber}</b>.</p>
        <button onClick={() => setOrderPlaced(false)}>Place Another Order</button>
      </div>
    );
  }

return (
  <div className="App">

    {/* HEADER */}
    <header className="app-header">
      <h1>🍴 SmartTable Menu</h1>
    </header>

    {/* TABLE INPUT */}
    <div className="table-input card">
      <label>Enter Table Number</label>
      <input
        type="number"
        className="input-box"
        placeholder="Table Number"
        value={tableNumber}
        disabled
        onChange={e => setTableNumber(e.target.value)}
      />
    </div>

    {/* ORDER SUMMARY */}
    <OrderSummary cart={cart} placeOrder={placeOrder} />

    <FeedbackForm/>

    {/* ORDERS */}
    <section className="orders-section">
      <h2 className="section-title">🧾 Orders for Table {tableNumber || '—'}</h2>

      {ordersLoading ? (
        <p className="loading">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders for this table.</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card card">
              <ul className="order-items">
                <li id="itemsHeader">
                    <span>Item</span>
                    <span>Quantity</span>
                    <span>Price</span>
                    <span>Status</span>
                </li>
                {order.items.map((it, i) => (
                  <li className="itemsList" key={i}>
                    <span>{it.name}</span>
                    <span>x {it.qty}</span>
                    <span>₹{it.price * it.qty}</span>
                    <span>{order.status ? order.status : 'Pending'}</span>
                  </li>
                ))}
              </ul>

              <p className="order-total"><b>Total:</b> ₹{order.total}</p>
              <p className="order-time">🕒 {new Date(order.createdAt).toLocaleString("en-IN", {timeZone: "Asia/Kolkata"})}</p>
            </div>
          ))}
        </div>
      )}
    </section>

    {/* MENU SECTION */}
    <section className="menu-section">
      <h2 className="section-title">📋 Menu</h2>

      {menuLoading ? (
        <p className="loading">Loading menu...</p>
      ) : (
        <div className="menu-grid">
          {menu.length === 0 ? (
            <p>No menu items found.</p>
          ) : (
            menu.map(item => (
              <MenuItem
                key={item.id}
                item={item}
                addToCart={addToCart}
              />
            ))
          )}
        </div>
      )}
    </section>
  </div>
);
 }

 export default Customer;
