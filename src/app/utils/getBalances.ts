import { contract } from './providers';

async function getBalances(
  network: string,
  address: string,
  addresses: string[],
  tokens: string[]
) {
  const balances = await contract(network, address).balances(addresses, tokens);

  return balances;
}

export default getBalances;
