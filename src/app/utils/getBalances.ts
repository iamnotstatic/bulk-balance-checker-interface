import { AddressBalanceMap } from 'eth-balance-checker';
import { getAddressesBalances } from 'eth-balance-checker/lib/ethers';
import { ethers } from './providers';

async function getBalances(
  addresses: string[],
  tokens: string[]
): Promise<AddressBalanceMap> {
  return await getAddressesBalances(ethers, addresses, tokens);
}

export default getBalances;
