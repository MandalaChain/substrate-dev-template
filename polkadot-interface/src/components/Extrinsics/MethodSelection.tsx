import React from 'react';

interface MethodSelectionProps {
  methods: string[];
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

const MethodSelection: React.FC<MethodSelectionProps> = ({ 
  methods, 
  selectedMethod, 
  onMethodChange 
}) => {
  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        Method
      </label>
      <select
        value={selectedMethod}
        onChange={(e) => onMethodChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-polkadot-primary"
      >
        <option value="" disabled>Select a method</option>
        {methods.map((method) => (
          <option key={method} value={method}>
            {method}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MethodSelection;