// src/components/common/ParameterInputs.tsx

interface ParameterInputsProps {
  types: any[];
  values: any[];
  onChange: (index: number, value: string) => void;
}

const ParameterInputs: React.FC<ParameterInputsProps> = ({ types, values, onChange }) => {
  if (types.length === 0) {
    return <div className="mt-4 text-gray-600">No parameters required</div>;
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium mb-2">Parameters</h3>
      {types.map((type, index) => {
        const typeName = type.type ? type.type.toString() : 'unknown';
        const name = type.name ? type.name.toString() : `param${index + 1}`;
        
        return (
          <div key={index} className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              {name}: <span className="text-xs text-gray-500">({typeName})</span>
            </label>
            <input
              type="text"
              value={values[index] || ''}
              onChange={(e) => onChange(index, e.target.value)}
              placeholder={`Enter ${typeName}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-polkadot-primary"
            />
          </div>
        );
      })}
    </div>
  );
};

export default ParameterInputs;
