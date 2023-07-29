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

export const ETH_RPC_URL = 'https://eth.llamarpc.com';
export const BSC_RPC_URL =
  'https://bsc-mainnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3';
export const POLYGON_RPC_URL = 'https://rpc-mainnet.maticvigil.com';
export const ARBITRUM_RPC_URL = 'https://arb1.arbitrum.io/rpc';

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
      balances[addr][asset.symbol] = balance.toString();
    });
  });
  return balances;
}

export const getAssets = (network: string) => {
  if (network === 'eth') {
    return ethDefaultAssets;
  } else if (network === 'bsc') {
    return bscDefaultAssets;
  } else if (network === 'polygon') {
    return polygonDefaultAssets;
  } else if (network === 'arbitrum') {
    return arbitrumDefaultAssets;
  } else {
    return [];
  }
};

export const getAsset = (network: string, symbol: string) => {
  if (network === 'eth') {
    return ethDefaultAssets.find((asset) => asset.symbol === symbol);
  } else if (network === 'bsc') {
    return bscDefaultAssets.find((asset) => asset.symbol === symbol);
  } else if (network === 'polygon') {
    return polygonDefaultAssets.find((asset) => asset.symbol === symbol);
  } else if (network === 'arbitrum') {
    return arbitrumDefaultAssets.find((asset) => asset.symbol === symbol);
  } else {
    return null;
  }
};

export const getContractAddressAndRpcUrl = (network: string) => {
  switch (network) {
    case 'eth':
      return {
        contractAddress: ETH_CONTRACT_ADDRESS,
        rpcUrl: ETH_RPC_URL,
      };
    case 'bsc':
      return {
        contractAddress: BSC_CONTRACT_ADDRESS,
        rpcUrl: BSC_RPC_URL,
      };
    case 'polygon':
      return {
        contractAddress: POLYGON_CONTRACT_ADDRESS,
        rpcUrl: POLYGON_RPC_URL,
      };
    case 'arbitrum':
      return {
        contractAddress: ARBITRUM_CONTRACT_ADDRESS,
        rpcUrl: ARBITRUM_RPC_URL,
      };
    default:
      return {
        contractAddress: ETH_CONTRACT_ADDRESS,
        rpcUrl: ETH_RPC_URL,
      };
  }
};
