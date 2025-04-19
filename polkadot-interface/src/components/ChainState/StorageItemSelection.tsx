import React from 'react';

interface StorageItemSelectionProps {
  items: string[];
  selectedItem: string;
  onItemChange: (item: string) => void;
}

const StorageItemSelection: React.FC<StorageItemSelectionProps> = ({
  items,
  selectedItem,
  onItemChange,
}) => {
  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        Storage Item
      </label>
      <select
        value={selectedItem}
        onChange={(e) => onItemChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-polkadot-primary"
      >
        <option value="" disabled>
          Select a storage item
        </option>
        {items.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StorageItemSelection;
