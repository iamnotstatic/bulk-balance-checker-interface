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
  try {
    const body = await request.json();

    const network = body.network?.toLowerCase();
    if (!network) {
      return NextResponse.json(
        { error: 'Network is required' },
        { status: 400 }
      );
    }

    const networkInfo = NETWORKS[network];
    if (!networkInfo) {
      return NextResponse.json(
        { error: `Invalid network: ${network}. Supported: eth, bsc, polygon, arbitrum` },
        { status: 400 }
      );
    }

    const addresses = body.addresses;
    if (!Array.isArray(addresses) || addresses.length === 0) {
      return NextResponse.json(
        { error: 'Addresses must be a non-empty array' },
        { status: 400 }
      );
    }

    const invalidAddresses = addresses.filter((addr) => !ethers.isAddress(addr));
    if (invalidAddresses.length > 0) {
      return NextResponse.json(
        { error: `Invalid addresses: ${invalidAddresses.slice(0, 3).join(', ')}${invalidAddresses.length > 3 ? '...' : ''}` },
        { status: 400 }
      );
    }

    const assets = body.assets;
    if (!Array.isArray(assets) || assets.length === 0) {
      return NextResponse.json(
        { error: 'Assets must be a non-empty array' },
        { status: 400 }
      );
    }

    const invalidAssets = assets.filter((addr) => !ethers.isAddress(addr));
    if (invalidAssets.length > 0) {
      return NextResponse.json(
        { error: `Invalid asset addresses: ${invalidAssets.slice(0, 3).join(', ')}${invalidAssets.length > 3 ? '...' : ''}` },
        { status: 400 }
      );
    }

    const { contractAddress, rpcUrl } = getContractAddressAndRpcUrl(network);

    if (!rpcUrl) {
      return NextResponse.json(
        { error: `RPC URL not configured for network: ${network}` },
        { status: 500 }
      );
    }

    const balances = await getBalances(
      rpcUrl,
      contractAddress,
      addresses,
      assets
    );

    const rpcProvider = provider(rpcUrl);
    const assetNames = await Promise.all(
      assets.map(async (asset) => {
        if (asset === ethers.ZeroAddress) {
          return { symbol: networkInfo.asset, decimals: 18 };
        }

        try {
          const token = new ethers.Contract(asset, Erc20ABI, rpcProvider);
          const [symbol, decimals] = await Promise.all([
            token.symbol().catch(() => token._symbol().catch(() => 'UNKNOWN')),
            token.decimals().catch(() => 18),
          ]);

          return { symbol, decimals: Number(decimals) };
        } catch {
          return { symbol: 'UNKNOWN', decimals: 18 };
        }
      })
    );

    const formattedBalances = getAddressBalances(balances, addresses, assetNames);

    return NextResponse.json({
      message: 'Balances fetched!',
      data: formattedBalances,
    });
  } catch (error) {
    console.error('Balance check error:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch balances. Reduce the number of addresses or assets and try again.' },
      { status: 500 }
    );
  }
}
