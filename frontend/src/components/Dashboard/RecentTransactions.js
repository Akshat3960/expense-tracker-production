import React from 'react';
import './Dashboard.css';

const RecentTransactions = ({ incomes, expenses }) => {
  const allTransactions = [
    ...incomes.map(item => ({ ...item, type: 'income' })),
    ...expenses.map(item => ({ ...item, type: 'expense' }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="recent-transactions">
      <h3>Recent Transactions</h3>
      <div className="transactions-list">
        {allTransactions.length === 0 ? (
          <p className="no-data">No transactions yet</p>
        ) : (
          allTransactions.map((transaction) => (
            <div 
              key={transaction._id} 
              className={`transaction-item ${transaction.type}`}
            >
              <div className="transaction-info">
                <h4>{transaction.title}</h4>
                <p>{transaction.category} - {new Date(transaction.date).toLocaleDateString()}</p>
              </div>
              <div className={`transaction-amount ${transaction.type}`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;