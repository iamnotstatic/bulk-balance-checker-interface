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

export const ETH_RPC_URL = 'https://eth.llamarpc.com';
export const BSC_RPC_URL =
  'https://bsc-mainnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3';

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
