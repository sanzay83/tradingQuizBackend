import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Questions.scss";

function Questions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:3000/items");
      setItems(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="item-list">
      <h2>Item List</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <span>ID: {item.item_id}</span> |<span>Question: {item.name}</span>{" "}
            |<span>Answer: {item.price}</span>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Questions;
