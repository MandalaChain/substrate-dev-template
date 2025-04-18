// src/components/common/ResultDisplay.tsx
import { Codec } from '@polkadot/types/types';

interface ResultDisplayProps {
  result: Codec | null;
  isLoading: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-gray-50 p-4 rounded-md h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-polkadot-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading result...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-gray-50 p-4 rounded-md h-64 flex items-center justify-center">
        <p className="text-gray-500">Query result will appear here</p>
      </div>
    );
  }

  // Format the result
  let formattedResult: string;
  try {
    // Try to convert to human-readable JSON
    const resultObj = JSON.parse(result.toString());
    formattedResult = JSON.stringify(resultObj, null, 2);
  } catch (e) {
    // Fallback to string representation
    formattedResult = result.toString();
  }

  return (
    <div>
      <h3 className="font-medium mb-2">Result</h3>
      <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
        <pre className="text-sm">{formattedResult}</pre>
      </div>
    </div>
  );
};

export default ResultDisplay;