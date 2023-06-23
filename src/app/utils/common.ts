export interface Options {
  contractAddress?: string;
}

export type BalanceMap = {
  [tokenAddress: string]: string;
};

export type AddressBalanceMap = {
  [address: string]: BalanceMap;
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
