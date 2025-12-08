import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import Sidebar from '../Layout/Sidebar';
import SummaryCard from './SummaryCard';
import RecentTransactions from './RecentTransactions';
import BarChartComponent from '../Charts/BarChartComponent';
import PieChartComponent from '../Charts/PieChartComponent';
import LineChartComponent from '../Charts/LineChartComponent';
import './Dashboard.css';

const Dashboard = () => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [incomeRes, expenseRes] = await Promise.all([
        api.get('/api/income'),
        api.get('/api/expense')
      ]);
      setIncomes(incomeRes.data);
      setExpenses(expenseRes.data);
      setError('');
    } catch (err) {
      console.error('Fetch data error:', err);
      setError('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = incomes.reduce((acc, item) => acc + item.amount, 0);
  const totalExpense = expenses.reduce((acc, item) => acc + item.amount, 0);
  const balance = totalIncome - totalExpense;

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="main-content">
          <div className="loading">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="main-content">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <h1 className="page-title">Dashboard Overview</h1>
        
        <div className="summary-cards">
          <SummaryCard 
            title="Total Balance" 
            amount={balance} 
            icon="💰" 
            color="#667eea"
          />
          <SummaryCard 
            title="Total Income" 
            amount={totalIncome} 
            icon="💵" 
            color="#10b981"
          />
          <SummaryCard 
            title="Total Expenses" 
            amount={totalExpense} 
            icon="💸" 
            color="#ef4444"
          />
        </div>

        <div className="charts-container">
          <div className="chart-card">
            <h3>Income vs Expenses</h3>
            <BarChartComponent incomes={incomes} expenses={expenses} />
          </div>
          <div className="chart-card">
            <h3>Expense Categories</h3>
            <PieChartComponent expenses={expenses} />
          </div>
          <div className="chart-card full-width">
            <h3>Trend Analysis</h3>
            <LineChartComponent incomes={incomes} expenses={expenses} />
          </div>
        </div>

        <RecentTransactions incomes={incomes} expenses={expenses} />
      </div>
    </div>
  );
};

export default Dashboard;