import * as Ethers from 'ethers';
import BalanceCheckerABI from '../abis/BalanceChecker.abi.json';

const provider = (network: string) => new Ethers.JsonRpcProvider(network);

const contract = (network: string, address: string) =>
  new Ethers.Contract(address, BalanceCheckerABI, provider(network));

export { contract, provider };
