import ethers from 'ethers';

export type Asset = {
  address: string;
  symbol: string;
  logo: string;
};

export const ethDefaultAssets: Asset[] = [
  {
    address: ethers.ZeroAddress,
    symbol: 'ETH',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=014',
  },
  {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    symbol: 'WETH',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=014',
  },
  {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    symbol: 'USDT',
    logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png?v=014',
  },
  {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    symbol: 'USDC',
    logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=014',
  },
  {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    symbol: 'DAI',
    logo: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg?v=014',
  },
  {
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    symbol: 'WBTC',
    logo: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png?v=014',
  },
  {
    address: '0x',
    symbol: 'N/A',
    logo: 'https://user-images.githubusercontent.com/46509072/195873643-471eaa95-cb32-4675-a892-329a66cb0ee1.png',
  },
];

export const bscDefaultAssets: Asset[] = [
  {
    address: ethers.ZeroAddress,
    symbol: 'BNB',
    logo: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png?v=014',
  },
  {
    address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    symbol: 'WBNB',
    logo: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png?v=014',
  },
  {
    address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    symbol: 'BUSD',
    logo: 'https://cryptologos.cc/logos/binance-usd-busd-logo.png?v=014',
  },
  {
    address: '0x55d398326f99059fF775485246999027B3197955',
    symbol: 'USDT',
    logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png?v=014',
  },
  {
    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    symbol: 'USDC',
    logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=014',
  },
  {
    address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
    symbol: 'DAI',
    logo: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg?v=014',
  },
  {
    address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    symbol: 'Cake',
    logo: 'https://cryptologos.cc/logos/pancakeswap-cake-logo.svg?v=14',
  },
];
