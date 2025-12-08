import React from 'react';
import './Dashboard.css';

const SummaryCard = ({ title, amount, icon, color }) => {
  return (
    <div className="summary-card" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="summary-icon" style={{ background: color }}>
        {icon}
      </div>
      <div className="summary-details">
        <p className="summary-title">{title}</p>
        <h2 className="summary-amount" style={{ color }}>
          ${amount.toFixed(2)}
        </h2>
      </div>
    </div>
  );
};

export default SummaryCard;