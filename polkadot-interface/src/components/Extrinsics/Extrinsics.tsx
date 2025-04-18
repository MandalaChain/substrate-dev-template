// src/components/Extrinsics/Extrinsics.tsx
import React, { useEffect, useState } from 'react';
import { getApi, getAccounts } from '../../services/api';
import { ApiPromise } from '@polkadot/api';
import { web3FromSource } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import ModuleSelection from './ModuleSelection';
import MethodSelection from './MethodSelection';
import ParameterInputs from '../common/ParameterInput';
import AccountSelect from './AccountSelect';
import TransactionStatus from './TransactionStatus';

interface TransactionState {
  status: 'none' | 'preparing' | 'broadcasting' | 'inBlock' | 'finalized' | 'error';
  hash?: string;
  blockHash?: string;
  error?: string;
}

const Extrinsics: React.FC = () => {
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [modules, setModules] = useState<string[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [methods, setMethods] = useState<string[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [paramTypes, setParamTypes] = useState<any[]>([]);
  const [paramValues, setParamValues] = useState<any[]>([]);
  const [transaction, setTransaction] = useState<TransactionState>({ status: 'none' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApi = async () => {
      try {
        const apiInstance = await getApi();
        setApi(apiInstance);
        
        // Get all available modules for extrinsics
        const availableModules = Object.keys(apiInstance.tx).sort();
        setModules(availableModules);
        
        // Select first module by default
        if (availableModules.length > 0) {
          setSelectedModule(availableModules[0]);
        }
        
        // Get accounts
        const availableAccounts = await getAccounts();
        setAccounts(availableAccounts);
        if (availableAccounts.length > 0) {
          setSelectedAccount(availableAccounts[0].address);
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
      // Get all methods for the selected module
      const methodList = Object.keys(api.tx[selectedModule]).sort();
      setMethods(methodList);
      
      // Reset selected method and params
      setSelectedMethod('');
      setParamTypes([]);
      setParamValues([]);
      setTransaction({ status: 'none' });
    } catch (error) {
      console.error('Error getting methods:', error);
      setError('Failed to get methods for the selected module.');
    }
  }, [api, selectedModule]);

  useEffect(() => {
    if (!api || !selectedModule || !selectedMethod) return;
    
    try {
      // Get parameter types for the selected method
      const method = api.tx[selectedModule][selectedMethod];
      const types = method.meta.args;
      
      setParamTypes(types);
      setParamValues(new Array(types.length).fill(''));
      setTransaction({ status: 'none' });
    } catch (error) {
      console.error('Error getting parameter types:', error);
      setError('Failed to get parameter types for the selected method.');
    }
  }, [api, selectedModule, selectedMethod]);

  const handleModuleChange = (module: string) => {
    setSelectedModule(module);
  };

  const handleMethodChange = (method: string) => {
    setSelectedMethod(method);
  };

  const handleParamChange = (index: number, value: string) => {
    const newValues = [...paramValues];
    newValues[index] = value;
    setParamValues(newValues);
  };

  const handleAccountChange = (address: string) => {
    setSelectedAccount(address);
  };

  const submitExtrinsic = async () => {
    if (!api || !selectedModule || !selectedMethod || !selectedAccount) return;
    
    setError(null);
    setTransaction({ status: 'preparing' });
    
    try {
      // Find the selected account
      const accountData = accounts.find(acc => acc.address === selectedAccount);
      if (!accountData) {
        throw new Error('Selected account not found');
      }
      
      // Get the injector for this account
      const injector = await web3FromSource(accountData.meta.source);
      
      // Create the extrinsic
      const method = api.tx[selectedModule][selectedMethod];
      const extrinsic = method(...paramValues);
      
      // Sign and submit the extrinsic
      setTransaction({ status: 'broadcasting' });
      
      await extrinsic.signAndSend(
        selectedAccount, 
        { signer: injector.signer }, 
        ({ status, events, dispatchError }) => {
          // Handle transaction status updates
          if (status.isInBlock) {
            setTransaction({ 
              status: 'inBlock', 
              hash: extrinsic.hash.toHex(), 
              blockHash: status.asInBlock.toHex() 
            });
            
            // Check for errors
            events.forEach(({ event }) => {
              if (api.events.system.ExtrinsicFailed.is(event)) {
                // Extract the error
                const [error] = event.data;
                let errorMessage = 'Transaction failed';
                
                if (error.isModule) {
                  const decoded = api.registry.findMetaError(error.asModule);
                  errorMessage = `${decoded.section}.${decoded.name}: ${decoded.docs}`;
                } else {
                  errorMessage = error.toString();
                }
                
                setTransaction({ 
                  status: 'error', 
                  hash: extrinsic.hash.toHex(), 
                  error: errorMessage 
                });
              }
            });
          } else if (status.isFinalized) {
            setTransaction({ 
              status: 'finalized', 
              hash: extrinsic.hash.toHex(), 
              blockHash: status.asFinalized.toHex() 
            });
          }
        }
      );
    } catch (error) {
      console.error('Error submitting extrinsic:', error);
      setTransaction({ 
        status: 'error', 
        error: `Failed to submit transaction: ${error instanceof Error ? error.message : String(error)}` 
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-polkadot-dark border-b pb-2">Extrinsics</h1>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <AccountSelect 
            accounts={accounts} 
            selectedAccount={selectedAccount} 
            onAccountChange={handleAccountChange} 
          />
          
          <ModuleSelection 
            modules={modules} 
            selectedModule={selectedModule} 
            onModuleChange={handleModuleChange} 
          />
          
          <MethodSelection 
            methods={methods} 
            selectedMethod={selectedMethod} 
            onMethodChange={handleMethodChange} 
          />
          
          {paramTypes.length > 0 && (
            <ParameterInputs 
              types={paramTypes} 
              values={paramValues} 
              onChange={handleParamChange} 
            />
          )}
          
          <button
            onClick={submitExtrinsic}
            disabled={!selectedMethod || !selectedAccount || transaction.status === 'broadcasting' || transaction.status === 'preparing'}
            className={`mt-6 px-6 py-2 rounded-md text-white ${
              !selectedMethod || !selectedAccount || transaction.status === 'broadcasting' || transaction.status === 'preparing'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-polkadot-primary hover:bg-polkadot-secondary'
            }`}
          >
            {transaction.status === 'preparing' || transaction.status === 'broadcasting' 
              ? 'Submitting...' 
              : 'Submit'}
          </button>
        </div>
        
        <div>
          <TransactionStatus transaction={transaction} />
        </div>
      </div>
    </div>
  );
};

export default Extrinsics;