import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BarChartComponent = ({ incomes, expenses }) => {
  const getMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = months.map((month, index) => {
      const monthIncomes = incomes.filter(item => 
        new Date(item.date).getMonth() === index
      ).reduce((acc, item) => acc + item.amount, 0);
      
      const monthExpenses = expenses.filter(item => 
        new Date(item.date).getMonth() === index
      ).reduce((acc, item) => acc + item.amount, 0);

      return {
        month,
        income: monthIncomes,
        expenses: monthExpenses
      };
    });
    return data;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={getMonthlyData()}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="income" fill="#10b981" />
        <Bar dataKey="expenses" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;