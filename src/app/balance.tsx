'use client';

import React, { useState } from 'react';
import getBalances from './utils/getBalances';
import { ethers } from 'ethers';
import { ethers as provider } from './utils/providers';

const Balance = () => {
  const [addresses, setAddresses] = useState<string[]>([]);
  const [assets, setAssets] = useState<string[]>([]);
  const [assetNames, setAssetNames] = useState<string[]>([]);
  const [balances, setBalances] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleOnSubmit = async (e: any) => {
    try {
      setLoading(true);
      e.preventDefault();

      const balances = await getBalances(addresses, assets);

      // Get asset names
      const assetNames = await Promise.all(
        assets.map(async (asset) => {
          if (asset === ethers.ZeroAddress) return 'ETH (18)';

          const token = new ethers.Contract(
            asset,
            [
              'function name() view returns (string)',
              'function symbol() view returns (string)',
              'function decimals() view returns (uint8)',
            ],
            provider
          );

          const symbol = await token.symbol();
          const decimals = await token.decimals();

          return `${symbol} (${decimals})`;
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
    setAssets([]);
    setAssets(assets);
  };

  const onSetAddresses = (addresses: string[]) => {
    setAddresses([]);
    setAddresses(addresses);
  };
  return (
    <>
      <h1 className="text-3xl font-bold text-center">
        Ethereum Bulk Balance Checker
      </h1>
      <div className="bg-gray-100 p-6 mt-3 w-full">
        <form
          className="flex flex-col items-center justify-center"
          onSubmit={handleOnSubmit}
        >
          <textarea
            required={true}
            className="appearance-none border rounded w-full px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3 py-4"
            rows={3}
            onChange={(e) =>
              onSetAssets(e.target.value.replace(/\s+/g, ' ').trim().split(' '))
            }
            placeholder="Token addresses 0x1234... 0x5678..."
            name="assets"
          ></textarea>
          <textarea
            required={true}
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={8}
            onChange={(e) =>
              onSetAddresses(
                e.target.value.replace(/\s+/g, ' ').trim().split(' ')
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

      {!loading && Object.keys(balances).length > 0 && (
        <div className="bg-gray-100 p-6 mt-3 w-full text-center">
          <h1 className="text-xl font-extralight text-center mb-3">Results</h1>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Address</th>
                {assetNames.map((asset, i) => (
                  <th className="px-4 py-2" key={i}>
                    {asset}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(balances).map((address, i) => (
                <tr key={i}>
                  <td className="border px-4 py-2">
                    {address.slice(0, 6)} ... {address.slice(-5)}
                  </td>
                  {assets.map((asset, i) => (
                    <td className="border px-4 py-2" key={i}>
                      {parseFloat(
                        ethers.formatUnits(
                          balances[address][asset],
                          parseFloat(assetNames[i].split('(')[1].split(')')[0])
                        )
                      ).toLocaleString('en-US')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Balance;
