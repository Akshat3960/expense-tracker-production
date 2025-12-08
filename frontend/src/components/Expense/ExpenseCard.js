import React, { useState } from 'react';
import './Expense.css';

const ExpenseCard = ({ expense, onDelete }) => {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div 
      className="expense-card"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      {showDelete && (
        <button 
          className="delete-btn" 
          onClick={() => onDelete(expense._id)}
        >
          🗑️
        </button>
      )}
      <div className="card-header expense-header">
        <h4>{expense.title}</h4>
        <span className="category-badge">{expense.category}</span>
      </div>
      <div className="card-amount expense-amount">
        ${expense.amount.toFixed(2)}
      </div>
      <p className="card-description">{expense.description}</p>
      <div className="card-date">
        📅 {new Date(expense.date).toLocaleDateString()}
      </div>
    </div>
  );
};

export default ExpenseCard;