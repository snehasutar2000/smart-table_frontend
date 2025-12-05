import { useState } from "react";
import axios from 'axios';

function FeedbackForm() {
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");

  const API_BASE = 'https://smart-table.onrender.com/api';
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!name){
        alert('Please add your name');return;
    }else if(!feedback){
        alert('Please add your feedback before submiting');return;
    }

    await axios.post(`${API_BASE}/feedback`, {
        name,
        feedback
    });

    const data = await res.json();
    setMessage(data.message || "Thank you for your feedback!");

    // clear form
    setName("");
    setFeedback("");
  };

  return (
    <div style={styles.container}>
      <h3>Customer Feedback</h3>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
          style={styles.input}
        />

        <label>Feedback</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Write your feedback..."
          required
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>Submit</button>
      </form>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    padding: "15px",
    margin: "20px auto",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fafafa",
    fontFamily: "Arial"
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "8px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  textarea: {
    padding: "8px",
    marginBottom: "12px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    minHeight: "80px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  message: {
    marginTop: "10px",
    color: "#333",
  }
};

export default FeedbackForm;
