// src/components/ChainState/ChainState.tsx
import React, { useEffect, useState } from 'react';
import { getApi } from '../../services/api';
import { ApiPromise } from '@polkadot/api';
import ModuleSelection from './ModuleSelection';
import StorageItemSelection from './StorageItemSelection';
import ParameterInputs from '../common/ParameterInput';
import ResultDisplay from '../common/ResultDisplay';

const ChainState: React.FC = () => {
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [modules, setModules] = useState<string[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [storageItems, setStorageItems] = useState<string[]>([]);
  const [selectedStorageItem, setSelectedStorageItem] = useState<string>('');
  const [paramTypes, setParamTypes] = useState<any[]>([]);
  const [paramValues, setParamValues] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApi = async () => {
      try {
        const apiInstance = await getApi();
        setApi(apiInstance);
        
        // Get all available modules
        const availableModules = Object.keys(apiInstance.query).sort();
        setModules(availableModules);
        
        // Select first module by default
        if (availableModules.length > 0) {
          setSelectedModule(availableModules[0]);
        }
      } catch (error) {
        console.error('Error initializing API:', error);
        setError('Failed to initialize API connection.');
      }
    };
    
    initializeApi();
  }, []);

  useEffect(() => {
    if (!api || !selectedModule) return;
    
    try {
      // Get all storage items for the selected module
      const items = Object.keys(api.query[selectedModule]).sort();
      setStorageItems(items);
      
      // Reset selected storage item and params
      setSelectedStorageItem('');
      setParamTypes([]);
      setParamValues([]);
      setResult(null);
    } catch (error) {
      console.error('Error getting storage items:', error);
      setError('Failed to get storage items for the selected module.');
    }
  }, [api, selectedModule]);

  useEffect(() => {
    if (!api || !selectedModule || !selectedStorageItem) return;
    
    try {
      // Get parameter types for the selected storage item
      const method = api.query[selectedModule][selectedStorageItem];
      const meta = method.meta;
      
      // Extract parameter types from metadata
      const types = meta.type.isMap 
        ? [meta.type.asMap.key] 
        : meta.type.isDoubleMap 
          ? [meta.type.asDoubleMap.key1, meta.type.asDoubleMap.key2]
          : [];
      
      setParamTypes(types);
      setParamValues(new Array(types.length).fill(''));
      setResult(null);
    } catch (error) {
      console.error('Error getting parameter types:', error);
      setError('Failed to get parameter types for the selected storage item.');
    }
  }, [api, selectedModule, selectedStorageItem]);

  const handleModuleChange = (module: string) => {
    setSelectedModule(module);
  };

  const handleStorageItemChange = (item: string) => {
    setSelectedStorageItem(item);
  };

  const handleParamChange = (index: number, value: string) => {
    const newValues = [...paramValues];
    newValues[index] = value;
    setParamValues(newValues);
  };

  const executeQuery = async () => {
    if (!api || !selectedModule || !selectedStorageItem) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const method = api.query[selectedModule][selectedStorageItem];
      let queryResult;
      
      // Execute query with or without parameters
      if (paramTypes.length === 0) {
        queryResult = await method();
      } else {
        queryResult = await method(...paramValues);
      }
      
      // Format the result
      setResult(queryResult);
    } catch (error) {
      console.error('Error executing query:', error);
      setError('Failed to execute the query. Check your parameters and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-polkadot-dark border-b pb-2">ChainState</h1>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <ModuleSelection 
            modules={modules} 
            selectedModule={selectedModule} 
            onModuleChange={handleModuleChange} 
          />
          
          <StorageItemSelection 
            items={storageItems} 
            selectedItem={selectedStorageItem} 
            onItemChange={handleStorageItemChange} 
          />
          
          {paramTypes.length > 0 && (
            <ParameterInputs 
              types={paramTypes} 
              values={paramValues} 
              onChange={handleParamChange} 
            />
          )}
          
          <button
            onClick={executeQuery}
            disabled={!selectedStorageItem || isLoading}
            className={`mt-6 px-6 py-2 rounded-md text-white ${
              !selectedStorageItem || isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-polkadot-primary hover:bg-polkadot-secondary'
            }`}
          >
            {isLoading ? 'Querying...' : 'Query'}
          </button>
        </div>
        
        <div>
          <ResultDisplay result={result} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default ChainState;