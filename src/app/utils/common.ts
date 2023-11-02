import { ethers } from 'ethers';
import {
  ethDefaultAssets,
  bscDefaultAssets,
  polygonDefaultAssets,
  arbitrumDefaultAssets,
} from '../constants';

export interface Options {
  contractAddress?: string;
}

export type BalanceMap = {
  [tokenAddress: string]: string;
};

export type AddressBalanceMap = {
  [address: string]: BalanceMap;
};

export const ETH_CONTRACT_ADDRESS =
  '0xb1f8e55c7f64d203c1400b9d8555d050f94adf39';
export const BSC_CONTRACT_ADDRESS =
  '0x2352c63A83f9Fd126af8676146721Fa00924d7e4';
export const POLYGON_CONTRACT_ADDRESS =
  '0x2352c63A83f9Fd126af8676146721Fa00924d7e4';
export const ARBITRUM_CONTRACT_ADDRESS =
  '0x151E24A486D7258dd7C33Fb67E4bB01919B7B32c';

export const ETH_RPC_URL: string = process.env.NEXT_PUBLIC_ETH_RPC_URL || '';
export const BSC_RPC_URL: string = process.env.NEXT_PUBLIC_BSC_RPC_URL || '';
export const POLYGON_RPC_URL: string =
  process.env.NEXT_PUBLIC_POLYGON_RPC_URL || '';
export const ARBITRUM_RPC_URL: string =
  process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || '';

export const NETWORK_CONFIGS: {
  [network: string]: {
    contractAddress: string;
    rpcUrl: string;
  };
} = {
  eth: {
    contractAddress: ETH_CONTRACT_ADDRESS,
    rpcUrl: ETH_RPC_URL,
  },
  ethereum: {
    contractAddress: ETH_CONTRACT_ADDRESS,
    rpcUrl: ETH_RPC_URL,
  },
  bsc: {
    contractAddress: BSC_CONTRACT_ADDRESS,
    rpcUrl: BSC_RPC_URL,
  },
  polygon: {
    contractAddress: POLYGON_CONTRACT_ADDRESS,
    rpcUrl: POLYGON_RPC_URL,
  },
  arbitrum: {
    contractAddress: ARBITRUM_CONTRACT_ADDRESS,
    rpcUrl: ARBITRUM_RPC_URL,
  },
};
export const NETWORKS: {
  [key: string]: {
    asset: string;
  };
} = {
  eth: { asset: 'ETH' },
  ethereum: { asset: 'ETH' },
  bsc: { asset: 'BNB' },
  polygon: { asset: 'MATIC' },
  arbitrum: { asset: 'ARB' },
};

const networkToAssets: {
  [network: string]: Array<{
    address: string;
    symbol: string;
    logo: string;
    decimals: number;
  }>;
} = {
  eth: ethDefaultAssets,
  bsc: bscDefaultAssets,
  polygon: polygonDefaultAssets,
  arbitrum: arbitrumDefaultAssets,
};

export function formatAddressBalances<T extends { toString: () => string }>(
  values: T[],
  addresses: string[],
  tokens: string[]
) {
  const balances: AddressBalanceMap = {};
  addresses.forEach((addr, addrIdx) => {
    balances[addr] = {};
    tokens.forEach((tokenAddr, tokenIdx) => {
      const balance = values[addrIdx * tokens.length + tokenIdx];
      balances[addr][tokenAddr] = balance.toString();
    });
  });
  return balances;
}

export function getAddressBalances<T extends { toString: () => string }>(
  values: T[],
  addresses: string[],
  assets: Array<{ symbol: string; decimals: number }>
) {
  const balances: AddressBalanceMap = {};
  addresses.forEach((addr, addrIdx) => {
    balances[addr] = {};
    assets.forEach((asset, assetIdx) => {
      const balance = ethers.formatUnits(
        values[addrIdx * assets.length + assetIdx].toString(),
        asset.decimals
      );
      balances[addr][`${asset.symbol}(${asset.decimals})`] = balance.toString();
    });
  });
  return balances;
}

export const getAssets = (network: string) => {
  const assets = networkToAssets[network];

  if (!assets) {
    return [];
  }

  return assets;
};

export const getAsset = (network: string, symbol: string) => {
  const assets = networkToAssets[network];

  if (!assets) {
    return null;
  }

  return assets.find((asset) => asset.symbol === symbol);
};

export const getContractAddressAndRpcUrl = (network = 'eth') => {
  const config = NETWORK_CONFIGS[network];

  if (!config) {
    return NETWORK_CONFIGS['eth'];
  }

  return config;
};
