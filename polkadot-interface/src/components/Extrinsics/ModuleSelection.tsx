import React from 'react';

interface ModuleSelectionProps {
  modules: string[];
  selectedModule: string;
  onModuleChange: (module: string) => void;
}

const ModuleSelection: React.FC<ModuleSelectionProps> = ({ 
  modules, 
  selectedModule, 
  onModuleChange 
}) => {
  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        Module
      </label>
      <select
        value={selectedModule}
        onChange={(e) => onModuleChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-polkadot-primary"
      >
        <option value="" disabled>Select a module</option>
        {modules.map((module) => (
          <option key={module} value={module}>
            {module}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModuleSelection;