import { AddressBalanceMap } from 'eth-balance-checker';
import { contract } from './providers';
import { formatAddressBalances } from './common';

async function getBalances(
  addresses: string[],
  tokens: string[]
): Promise<AddressBalanceMap> {
  const balances = await contract.balances(addresses, tokens);

  return formatAddressBalances(balances, addresses, tokens);
}

export default getBalances;
