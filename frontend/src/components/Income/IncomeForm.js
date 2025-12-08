import React, { useState } from 'react';
import './Income.css';

const IncomeForm = ({ onAddIncome }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Salary',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = ['Salary', 'Freelance', 'Business', 'Investments', 'Other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddIncome({ ...formData, amount: parseFloat(formData.amount) });
    setFormData({
      title: '',
      amount: '',
      category: 'Salary',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="form-card">
      <h3>Add New Income</h3>
      <form onSubmit={handleSubmit} className="income-form">
        <div className="form-row">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Monthly Salary"
              required
            />
          </div>
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional description..."
            rows="3"
          />
        </div>

        <button type="submit" className="btn-submit">Add Income</button>
      </form>
    </div>
  );
};

export default IncomeForm;