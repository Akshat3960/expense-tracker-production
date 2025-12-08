import React, { useState } from 'react';
import './Income.css';

const IncomeCard = ({ income, onDelete }) => {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div 
      className="income-card"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      {showDelete && (
        <button 
          className="delete-btn" 
          onClick={() => onDelete(income._id)}
        >
          🗑️
        </button>
      )}
      <div className="card-header income-header">
        <h4>{income.title}</h4>
        <span className="category-badge">{income.category}</span>
      </div>
      <div className="card-amount income-amount">
        ${income.amount.toFixed(2)}
      </div>
      <p className="card-description">{income.description}</p>
      <div className="card-date">
        📅 {new Date(income.date).toLocaleDateString()}
      </div>
    </div>
  );
};

export default IncomeCard;