import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import Sidebar from '../Layout/Sidebar';
import ExpenseForm from './ExpenseForm';
import ExpenseCard from './ExpenseCard';
import { exportToExcel } from '../../utils/exportToExcel';
import './Expense.css';

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/expense');
      setExpenses(res.data);
      setError('');
    } catch (err) {
      console.error('Fetch expenses error:', err);
      setError('Error loading expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expenseData) => {
    try {
      await api.post('/api/expense', expenseData);
      fetchExpenses();
    } catch (err) {
      console.error('Add expense error:', err);
      alert('Error adding expense');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await api.delete(`/api/expense/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error('Delete expense error:', err);
      alert('Error deleting expense');
    }
  };

  const handleExport = () => {
    const exportData = expenses.map(expense => ({
      Title: expense.title,
      Amount: expense.amount,
      Category: expense.category,
      Description: expense.description,
      Date: new Date(expense.date).toLocaleDateString()
    }));
    exportToExcel(exportData, 'expense-report');
  };

  const totalExpense = expenses.reduce((acc, item) => acc + item.amount, 0);

  if (loading) {
    return (
      <div className="expense-container">
        <Sidebar />
        <div className="main-content">
          <div className="loading">Loading expenses...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="expense-container">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Expense Management</h1>
          <button onClick={handleExport} className="btn-export" disabled={expenses.length === 0}>
            📥 Export to Excel
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="total-display">
          <h2>Total Expenses: <span className="expense-amount">${totalExpense.toFixed(2)}</span></h2>
        </div>

        <ExpenseForm onAddExpense={handleAddExpense} />

        <div className="expense-list">
          <h3>Expense History</h3>
          <div className="expense-grid">
            {expenses.length === 0 ? (
              <p className="no-data">No expense records yet. Add your first expense!</p>
            ) : (
              expenses.map((expense) => (
                <ExpenseCard 
                  key={expense._id} 
                  expense={expense} 
                  onDelete={handleDeleteExpense}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expense;