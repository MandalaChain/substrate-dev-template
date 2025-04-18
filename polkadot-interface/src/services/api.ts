// src/services/api.ts
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { BehaviorSubject } from 'rxjs';

// Default WebSocket provider for local zombienet node
const WS_PROVIDER = 'ws://127.0.0.1:38191';

// Create a subject to track connection status and share between components
export const connectionStatus = new BehaviorSubject<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');

// Store the API instance
let api: ApiPromise | null = null;

/**
 * Initialize the PolkadotJS API connection
 */
export const initApi = async (endpoint: string = WS_PROVIDER): Promise<ApiPromise> => {
  connectionStatus.next('connecting');
  
  try {
    // If an API instance already exists, disconnect first
    if (api) {
      await api.disconnect();
      api = null;
    }
    
    // Create connection to the specified endpoint
    const provider = new WsProvider(endpoint);
    api = await ApiPromise.create({ provider });
    
    // Set up event listeners
    provider.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
      connectionStatus.next('error');
    });
    
    provider.on('disconnected', () => {
      console.log('Disconnected from node');
      connectionStatus.next('disconnected');
    });
    
    // Set connection status to connected
    connectionStatus.next('connected');
    console.log('Connected to node:', endpoint);
    
    return api;
  } catch (error) {
    console.error('Failed to connect to node:', error);
    connectionStatus.next('error');
    throw error;
  }
};

/**
 * Get the current API instance or initialize if not available
 */
export const getApi = async (): Promise<ApiPromise> => {
  if (!api) {
    return await initApi();
  }
  return api;
};

/**
 * Connect to wallet extensions (e.g., PolkadotJS Extension)
 */
export const connectWallets = async (): Promise<void> => {
  try {
    // Enable the extension
    const extensions = await web3Enable('PolkadotJS Interface');
    
    if (extensions.length === 0) {
      console.warn('No extension found, please install PolkadotJS extension');
      return;
    }
    
    // Get all accounts from the extension
    const allAccounts = await web3Accounts();
    console.log('Available accounts:', allAccounts);
    
    return;
  } catch (error) {
    console.error('Error connecting to extension:', error);
    throw error;
  }
};

/**
 * Get available accounts from wallet extensions
 */
export const getAccounts = async () => {
  try {
    await web3Enable('PolkadotJS Interface');
    const allAccounts = await web3Accounts();
    return allAccounts;
  } catch (error) {
    console.error('Error getting accounts:', error);
    return [];
  }
};

/**
 * Clean up API connection
 */
export const disconnectApi = async (): Promise<void> => {
  if (api) {
    await api.disconnect();
    api = null;
    connectionStatus.next('disconnected');
  }
};