import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuItem from './MenuItemAdmin';
import FeedbackList from './FeedbackView';
import { useSearchParams } from "react-router-dom";

function Admin() {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [menuLoading, setMenuLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");

  const [searchParams] = useSearchParams();
  const API_BASE = 'https://smart-table.onrender.com/api';

  useEffect(() => {
    const tableNo = searchParams.get("table_no");
    if (tableNo) setTableNumber(tableNo);
  }, [searchParams]);

  /* Fetch Menu */
  const fetchMenu = async () => {
    try {
      const res = await axios.get(`${API_BASE}/menu`);
      setMenu(res.data);
    } finally {
      setMenuLoading(false);
    }
  };

  /* Fetch Orders */
  const fetchOrders = async (tableNo = '') => {
    try {
      setOrdersLoading(true);
      const url = tableNo
        ? `${API_BASE}/orders?tableNumber=${tableNo}`
        : `${API_BASE}/orders`;

      const res = await axios.get(url);
      setOrders(res.data);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => { fetchMenu(); }, []);
  useEffect(() => {
    tableNumber ? fetchOrders(tableNumber) : setOrders([]);
  }, [tableNumber]);

  /* Update Process */
  const updateProcess = async (orderId, status) => {
    try {
      await axios.post(`${API_BASE}/process/update`, {
        orderId,
        process: status
      });

      fetchOrders(tableNumber);
    } catch {
      alert("Failed to update process");
    }
  };

  return (
    <div className="App">

      {/* HEADER */}
      <header className="app-header">
        <h1>🍽️ SmartTable Admin Panel</h1>
      </header>

      {/* TABS */}
      <div className="tab-buttons">
        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          📦 Orders
        </button>

        <button
          className={activeTab === "feedback" ? "active" : ""}
          onClick={() => setActiveTab("feedback")}
        >
          💬 Feedback
        </button>
      </div>

      {/* Conditional Rendering */}
      {activeTab === "orders" ? (
        <>
          {/* Table Input */}
          <div className="table-input card">
            <label>Enter Table Number</label>
            <input
              type="number"
              className="input-box"
              placeholder="Table Number"
              value={tableNumber}
              onChange={e => setTableNumber(e.target.value)}
            />
          </div>

          {/* Orders Section */}
          <section className="orders-section">
            <h2 className="section-title">🧾 Orders for Table {tableNumber || '—'}</h2>

            {ordersLoading ? (
              <p className="loading">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p>No orders for this table.</p>
            ) : (
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order._id} className="order-card card">

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

                          <span>
                            <select
                              onChange={(e) =>
                                updateProcess(order._id, e.target.value)
                              }
                              value={order.status}
                            >
                              <option value='Pending'>Pending</option>
                              <option value='Chef Assigned'>Chef Assigned</option>
                              <option value='Ingredients Sourced'>Ingredients Sourced</option>
                              <option value='Cooking Started'>Cooking Started</option>
                              <option value='Cooking Completed'>Cooking Completed</option>
                              <option value='Ready to Serve'>Ready to Serve</option>
                              <option value='Serving'>Serving</option>
                              <option value='Completed'>Completed</option>
                            </select>
                          </span>
                        </li>
                      ))}
                    </ul>

                    <p className="order-total"><b>Total:</b> ₹{order.total}</p>
                    <p className="order-time">
                      🕒 {new Date(order.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Menu Section */}
          <section className="menu-section">
            <h2 className="section-title">📋 Menu</h2>

            {menuLoading ? (
              <p className="loading">Loading menu...</p>
            ) : (
              <div className="menu-grid">
                {menu.length === 0 ? (
                  <p>No menu items found.</p>
                ) : (
                  menu.map(item => <MenuItem key={item.id} item={item} />)
                )}
              </div>
            )}
          </section>
        </>
      ) : (
        <FeedbackList />
      )}

    </div>
  );
}

export default Admin;
