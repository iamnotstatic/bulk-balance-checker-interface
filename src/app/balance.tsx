'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import getBalances from './utils/getBalances';
import { ethers } from 'ethers';
import { provider } from './utils/providers';
import Erc20ABI from './abis/Erc20.abi.json';
import {
  formatAddressBalances,
  getAssets,
  getContractAddressAndRpcUrl,
  NETWORKS,
} from './utils/common';
import { CSVLink } from 'react-csv';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons';

const Balance = () => {
  const [addresses, setAddresses] = useState<string[]>([]);
  const [assets, setAssets] = useState<string[]>([]);
  const [network, setNetwork] = useState<string>('eth');
  const [assetNames, setAssetNames] = useState<string[]>([]);
  const [balances, setBalances] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isActiveIndexes, setIsActiveIndexes] = useState<number[]>([]);
  const [limit, setLimit] = useState<number>(100);

  const handleOnSubmit = async (e: any) => {
    try {
      setLoading(true);
      e.preventDefault();

      const { contractAddress, rpcUrl } = getContractAddressAndRpcUrl(network);

      const rawBalances = await getBalances(
        rpcUrl,
        contractAddress,
        addresses,
        assets
      );

      const balances = formatAddressBalances(rawBalances, addresses, assets);

      const rpcProvider = provider(rpcUrl);
      const assetNames = await Promise.all(
        assets.map(async (asset) => {
          if (asset === ethers.ZeroAddress) {
            return `${NETWORKS[network].asset} (18)`;
          }

          try {
            const token = new ethers.Contract(asset, Erc20ABI, rpcProvider);
            const [symbol, decimals] = await Promise.all([
              token.symbol().catch(() => token._symbol().catch(() => 'UNKNOWN')),
              token.decimals().catch(() => 18),
            ]);
            return `${symbol} (${decimals})`;
          } catch {
            return 'UNKNOWN (18)';
          }
        })
      );

      setBalances(balances);
      setAssetNames(assetNames);
      setLoading(false);
    } catch (error) {
      console.log(error, 'error in app');
      setLoading(false);
    }
  };

  const onSetAssets = (assets: string[]) => {
    setBalances({});

    assets = [...new Set(assets)];
    setAssets(assets);
  };

  const onSetAddresses = (addresses: string[]) => {
    setBalances({});

    addresses = [...new Set(addresses)];
    setAddresses(addresses);
  };

  const onSetNetwork = (network: string) => {
    setBalances({});
    setAssets([]);
    setIsActiveIndexes([]);
    setNetwork(network);
  };

  const loadMore = () => {
    setLimit(limit + 100);
  };

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-center">Bulk Balance Checker</h1>
        <p className="text-center mt-2">
          Discover the Collective Balance of Multiple Addresses and Assets
          Instantly!
        </p>
        <div className="flex flex-row justify-center mt-5">
          <a
            href="https://twitter.com/iamnotstatic"
            target="_blank"
            className="mr-5 hover:text-blue-500"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faTwitter} size="2x" />
          </a>
          <a
            href="https://github.com/iamnotstatic/bulk-balance-checker-interface"
            target="_blank"
            className="hover:text-blue-500"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faGithub} size="2x" />
          </a>
        </div>
      </div>

      <div className="bg-gray-100 p-6 mt-3 w-full">
        <form
          className="flex flex-col items-center justify-center"
          onSubmit={handleOnSubmit}
        >
          <select
            className="border rounded w-full px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3 py-4"
            onChange={(e) => onSetNetwork(e.target.value)}
          >
            <option value="eth">Ethereum (ETH)</option>
            <option value="bsc">BNB Smart Chain (BSC)</option>
            <option value="polygon">Polygon (MATIC)</option>
            <option value="arbitrum">Arbitrum (ARB)</option>
          </select>
          <div
            className={`flex text-center max-w-full gap-6 mt-3 mb-3 overflow-scroll`}
          >
            {getAssets(network).map((asset, index) => (
              <div
                key={index}
                className="text-center"
                onClick={() => {
                  if (isActiveIndexes.includes(index)) {
                    setIsActiveIndexes(
                      isActiveIndexes.filter((i) => i !== index)
                    );
                    onSetAssets(assets.filter((a) => a !== asset.address));
                    return;
                  }

                  setIsActiveIndexes([...isActiveIndexes, index]);
                  onSetAssets([...assets, asset.address]);
                }}
              >
                <div
                  className={`w-20 ${
                    isActiveIndexes.includes(index)
                      ? 'bg-gray-400'
                      : 'bg-gray-200'
                  } p-2 rounded-lg cursor-pointer hover:bg-gray-400 text-center`}
                >
                  <Image
                    src={asset.logo}
                    alt="Asset logo"
                    className="w-8 mx-auto"
                    width={0}
                    height={0}
                  />
                  <p className="text-xs mt-2 font-bold">{asset.symbol}</p>
                </div>
              </div>
            ))}
          </div>

          <textarea
            required={true}
            className="appearance-none border rounded w-full px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3 py-4"
            rows={3}
            onChange={(e) =>
              onSetAssets(
                e.target.value
                  .replace(/\s+/g, ' ')
                  .replace(/[.,]/g, '')
                  .replace(/[",]/g, '')
                  .trim()
                  .split(' ')
              )
            }
            placeholder="Token addresses 0x1234... 0x5678..."
            name="assets"
            value={assets.join(' ')}
          ></textarea>
          <textarea
            required={true}
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={8}
            onChange={(e) =>
              onSetAddresses(
                e.target.value
                  .replace(/\s+/g, ' ')
                  .replace(/[.,]/g, '')
                  .replace(/[",]/g, '')
                  .trim()
                  .split(' ')
              )
            }
            placeholder="Addresses 0x1234... 0x5678..."
            name="addresses"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded focus:outline-none focus:shadow-outline mt-5 cursor-pointer"
          >
            Get balances
          </button>
        </form>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center mt-5">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
          <h2 className="text-center mt-5">Loading...</h2>
        </div>
      )}

      {!loading &&
        Object.keys(balances).length > 0 &&
        addresses.length > 0 &&
        assets.length > 0 && (
          <div className="bg-gray-100 p-6 mt-3 w-full text-center">
            <h1 className="text-xl font-extralight text-center mb-3">
              Results ({addresses.length} addresses)
            </h1>
            <CSVLink
              data={[
                ['S/N', 'Address', ...assetNames],
                ...Object.keys(balances).map((address, index) => [
                  index + 1,
                  address,
                  ...assets.map((asset) =>
                    parseFloat(
                      ethers?.formatUnits(
                        balances[address][asset],
                        parseFloat(
                          assetNames[assets.indexOf(asset)]
                            ?.split('(')[1]
                            ?.split(')')[0]
                        )
                      )
                    ).toLocaleString('en-US')
                  ),
                ]),
              ]}
              filename={`balances(${addresses.length}).csv`}
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-6 rounded focus:outline-none focus:shadow-outline mt-2 mb-5 cursor-pointer float-right"
            >
              Export CSV
            </CSVLink>
            <table className="table-fixed w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Address</th>
                  {assetNames.map((asset, i) => (
                    <th className="px-4 py-2" key={i}>
                      {asset}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(balances)
                  .slice(0, limit)
                  .map((address, i) => (
                    <tr key={i}>
                      <td className="border px-4 py-2">{i + 1}</td>
                      <td className="border px-4 py-2">
                        {address.slice(0, 5)} ... {address.slice(-4)}
                      </td>
                      {assets.map((asset, i) => (
                        <td className="border px-4 py-2" key={i}>
                          {parseFloat(
                            ethers?.formatUnits(
                              balances[address][asset],
                              parseFloat(
                                assetNames[i]?.split('(')[1]?.split(')')[0]
                              )
                            )
                          ).toLocaleString('en-US')}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
            {Object.keys(balances).length > limit && (
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-6 rounded focus:outline-none focus:shadow-outline mt-2 mb-5 cursor-pointer"
                onClick={loadMore}
              >
                Load more
              </button>
            )}
          </div>
        )}
    </>
  );
};

export default Balance;
