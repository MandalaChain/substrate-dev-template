import React from 'react';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

interface AccountSelectProps {
  accounts: InjectedAccountWithMeta[];
  selectedAccount: string;
  onAccountChange: (address: string) => void;
}

const AccountSelect: React.FC<AccountSelectProps> = ({ 
  accounts, 
  selectedAccount, 
  onAccountChange 
}) => {
  if (accounts.length === 0) {
    return (
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-700">
          No accounts found. Please install the PolkadotJS extension and create an account.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        Account
      </label>
      <select
        value={selectedAccount}
        onChange={(e) => onAccountChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-polkadot-primary"
      >
        <option value="" disabled>Select an account</option>
        {accounts.map((account) => (
          <option key={account.address} value={account.address}>
            {account.meta.name ? `${account.meta.name} (${account.address.slice(0, 6)}...${account.address.slice(-6)})` : account.address}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AccountSelect;