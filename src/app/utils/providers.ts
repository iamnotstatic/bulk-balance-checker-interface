import * as Ethers from 'ethers';
import BalanceCheckerABI from '../abis/BalanceChecker.abi.json';

const provider = new Ethers.JsonRpcProvider(
  'https://bsc-mainnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3'
);

const contract = new Ethers.Contract(
  '0x2352c63A83f9Fd126af8676146721Fa00924d7e4',
  BalanceCheckerABI,
  provider
);

export { contract, provider };
