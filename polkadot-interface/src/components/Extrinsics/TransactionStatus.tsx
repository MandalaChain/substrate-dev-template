import React from 'react';

interface TransactionStatusProps {
  transaction: {
    status: 'none' | 'preparing' | 'broadcasting' | 'inBlock' | 'finalized' | 'error';
    hash?: string;
    blockHash?: string;
    error?: string;
  };
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({ transaction }) => {
  if (transaction.status === 'none') {
    return (
      <div className="bg-gray-50 p-4 rounded-md h-64 flex items-center justify-center">
        <p className="text-gray-500">Transaction status will appear here</p>
      </div>
    );
  }

  if (transaction.status === 'preparing' || transaction.status === 'broadcasting') {
    return (
      <div className="bg-gray-50 p-4 rounded-md h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-polkadot-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">
            {transaction.status === 'preparing' ? 'Preparing transaction...' : 'Broadcasting transaction...'}
          </p>
        </div>
      </div>
    );
  }

  if (transaction.status === 'error') {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <h3 className="font-medium text-red-700 mb-2">Transaction Error</h3>
        <p className="text-red-600 mb-2">{transaction.error}</p>
        {transaction.hash && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">Transaction Hash:</p>
            <p className="text-sm font-mono break-all bg-gray-100 p-2 rounded">{transaction.hash}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-green-50 p-4 rounded-md">
      <h3 className="font-medium text-green-700 mb-2">
        Transaction {transaction.status === 'inBlock' ? 'In Block' : 'Finalized'}
      </h3>
      <div className="mt-2">
        <p className="text-sm text-gray-600">Transaction Hash:</p>
        <p className="text-sm font-mono break-all bg-gray-100 p-2 rounded">{transaction.hash}</p>
      </div>
      {transaction.blockHash && (
        <div className="mt-2">
          <p className="text-sm text-gray-600">Block Hash:</p>
          <p className="text-sm font-mono break-all bg-gray-100 p-2 rounded">{transaction.blockHash}</p>
        </div>
      )}
      <div className="mt-4">
        <div className={`flex items-center ${transaction.status === 'finalized' ? 'text-green-700' : 'text-yellow-600'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>
            {transaction.status === 'finalized' 
              ? 'Transaction has been finalized' 
              : 'Transaction is in block but not yet finalized'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransactionStatus;