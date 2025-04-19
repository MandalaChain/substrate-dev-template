import { ApiPromise } from '@polkadot/api';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

export interface ApiContextType {
  api: ApiPromise | null;
  isApiReady: boolean;
  isApiConnecting: boolean;
  apiError: Error | null;
  accounts: InjectedAccountWithMeta[];
  connectApi: (endpoint?: string) => Promise<void>;
  disconnectApi: () => Promise<void>;
}