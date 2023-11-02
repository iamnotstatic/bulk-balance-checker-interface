import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { provider } from '../../utils/providers';
import Erc20ABI from '../../abis/Erc20.abi.json';

import getBalances from '../../utils/getBalances';
import {
  NETWORKS,
  getAddressBalances,
  getContractAddressAndRpcUrl,
} from '../../utils/common';

export async function GET() {
  return NextResponse.json({ message: 'App is running!' });
}

export async function POST(request: Request) {
  const body = await request.json();

  const network = body.network.toLowerCase();
  const networkInfo = NETWORKS[network];

  if (!networkInfo) {
    return NextResponse.json({
      message: 'Invalid network!',
    });
  }

  const addresses = body.addresses;
  if (!Array.isArray(addresses)) {
    return NextResponse.json({
      message: 'Invalid addresses!',
    });
  }

  const assets = body.assets;
  if (!Array.isArray(assets)) {
    return NextResponse.json({
      message: 'Invalid assets!',
    });
  }

  const { contractAddress, rpcUrl } = getContractAddressAndRpcUrl(network);
  const balances = await getBalances(
    rpcUrl,
    contractAddress,
    addresses,
    assets
  );

  // Get asset names
  const assetNames = await Promise.all(
    assets.map(async (asset) => {
      if (asset === ethers.ZeroAddress)
        return network === 'eth' || network === 'ethereum'
          ? { symbol: 'ETH', decimals: 18 }
          : network === 'bsc'
          ? { symbol: 'BNB', decimals: 18 }
          : network === 'polygon'
          ? { symbol: 'MATIC', decimals: 18 }
          : network === 'arbitrum'
          ? { symbol: 'ARB', decimals: 18 }
          : { symbol: 'UNKNOWN', decimals: 18 };

      // TODO: Switch this to work with the assets symbol instead of the contract address
      const token = new ethers.Contract(asset, Erc20ABI, provider(rpcUrl));

      const symbol = (await token.symbol()) || (await await token._symbol());
      const decimals = await token.decimals();

      return {
        symbol,
        decimals,
      };
    })
  );

  const formattedBalances = getAddressBalances(balances, addresses, assetNames);

  return NextResponse.json({
    message: 'Balances fetched!',
    data: formattedBalances,
  });
}
