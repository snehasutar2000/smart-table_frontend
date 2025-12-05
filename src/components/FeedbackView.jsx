import React, { useEffect, useState } from "react";
import axios from "axios";

function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState([]);

  const API_BASE = 'https://smart-table.onrender.com/api';
  
  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const res = await axios.get(`${API_BASE}/feedback`);
        setFeedbacks(res.data);
      } catch (err) {
        console.error("Failed to load feedback:", err);
      }
    };
    loadFeedback();
  }, []);

  return (
    <div className="feedback-container card">
      <h2 className="section-title">💬 Customer Feedback</h2>

      {feedbacks.length === 0 ? (
        <p>No feedback found.</p>
      ) : (
        feedbacks.map((fb) => (
          <div key={fb._id} className="feedback-card">
            <h4>{fb.name}</h4>
            <p>{fb.feedback}</p>
            <span className="feedback-time">
              {new Date(fb.createdAt).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
              })}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

export default FeedbackList;
