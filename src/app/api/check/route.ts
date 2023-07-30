import { NextResponse } from 'next/server';

import getBalances from '../../utils/getBalances';
import {
  NETWORKS,
  getAddressBalances,
  getAssets,
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

  const assets = getAssets(network);
  const nativeAsset = networkInfo.asset;

  const filteredAssets = assets.filter((asset) =>
    [nativeAsset, 'USDT', 'USDC', 'BUSD'].includes(asset.symbol)
  );
  const assetAddresses = filteredAssets.map((asset) => asset.address);

  const { contractAddress, rpcUrl } = getContractAddressAndRpcUrl(network);
  const balances = await getBalances(
    rpcUrl,
    contractAddress,
    addresses,
    assetAddresses
  );

  const formattedBalances = getAddressBalances(
    balances,
    addresses,
    filteredAssets
  );

  return NextResponse.json({
    message: 'Balances fetched!',
    data: formattedBalances,
  });
}
