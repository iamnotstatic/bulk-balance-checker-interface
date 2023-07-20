import './globals.css';
import { Inter } from 'next/font/google';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Bulk balance Checker',
  description:
    'Discover the Collective Balance of Multiple Addresses and Assets Instantly!',
  keywords:
    'ethereum, bnb smart chain, polygon, arbitrum, blockchain, bulk, balance, checker, erc20, tokens, assets, addresses, web3, wallets, cryptocurrencies, defi, dapps, decentralized applications, smart contract, smart contracts, solidity',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
