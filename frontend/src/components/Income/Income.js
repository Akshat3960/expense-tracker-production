import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import Sidebar from '../Layout/Sidebar';
import IncomeForm from './IncomeForm';
import IncomeCard from './IncomeCard';
import { exportToExcel } from '../../utils/exportToExcel';
import './Income.css';

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/income');
      setIncomes(res.data);
      setError('');
    } catch (err) {
      console.error('Fetch incomes error:', err);
      setError('Error loading incomes');
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = async (incomeData) => {
    try {
      await api.post('/api/income', incomeData);
      fetchIncomes();
    } catch (err) {
      console.error('Add income error:', err);
      alert('Error adding income');
    }
  };

  const handleDeleteIncome = async (id) => {
    if (!window.confirm('Are you sure you want to delete this income?')) {
      return;
    }

    try {
      await api.delete(`/api/income/${id}`);
      fetchIncomes();
    } catch (err) {
      console.error('Delete income error:', err);
      alert('Error deleting income');
    }
  };

  const handleExport = () => {
    const exportData = incomes.map(income => ({
      Title: income.title,
      Amount: income.amount,
      Category: income.category,
      Description: income.description,
      Date: new Date(income.date).toLocaleDateString()
    }));
    exportToExcel(exportData, 'income-report');
  };

  const totalIncome = incomes.reduce((acc, item) => acc + item.amount, 0);

  if (loading) {
    return (
      <div className="income-container">
        <Sidebar />
        <div className="main-content">
          <div className="loading">Loading incomes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="income-container">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Income Management</h1>
          <button onClick={handleExport} className="btn-export" disabled={incomes.length === 0}>
            📥 Export to Excel
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="total-display">
          <h2>Total Income: <span className="income-amount">${totalIncome.toFixed(2)}</span></h2>
        </div>

        <IncomeForm onAddIncome={handleAddIncome} />

        <div className="income-list">
          <h3>Income History</h3>
          <div className="income-grid">
            {incomes.length === 0 ? (
              <p className="no-data">No income records yet. Add your first income!</p>
            ) : (
              incomes.map((income) => (
                <IncomeCard 
                  key={income._id} 
                  income={income} 
                  onDelete={handleDeleteIncome}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Income;