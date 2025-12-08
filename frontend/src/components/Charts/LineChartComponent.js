import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LineChartComponent = ({ incomes, expenses }) => {
  const getMonthlyTrend = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    const data = months.map((month, index) => {
      const monthIncomes = incomes.filter(item => {
        const date = new Date(item.date);
        return date.getMonth() === index && date.getFullYear() === currentYear;
      }).reduce((acc, item) => acc + item.amount, 0);
      
      const monthExpenses = expenses.filter(item => {
        const date = new Date(item.date);
        return date.getMonth() === index && date.getFullYear() === currentYear;
      }).reduce((acc, item) => acc + item.amount, 0);

      return {
        month,
        income: monthIncomes,
        expenses: monthExpenses,
        balance: monthIncomes - monthExpenses
      };
    });
    
    return data;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={getMonthlyTrend()}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} />
        <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
        <Line type="monotone" dataKey="balance" stroke="#667eea" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;