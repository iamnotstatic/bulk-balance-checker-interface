export type Asset = {
  address: string;
  symbol: string;
  logo: string;
};

export const ethDefaultAssets: Asset[] = [
  {
    address: '0x0000000000000000000000000000000000000000',
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
    logo: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=014',
  },
  {
    address: '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
    symbol: 'BUSD',
    logo: 'https://cryptologos.cc/logos/binance-usd-busd-logo.png?v=014',
  },
];

export const bscDefaultAssets: Asset[] = [
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'BNB',
    logo: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png?v=014',
  },
  {
    address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    symbol: 'WBNB',
    logo: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png?v=014',
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
    logo: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=014',
  },
  {
    address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    symbol: 'BUSD',
    logo: 'https://cryptologos.cc/logos/binance-usd-busd-logo.png?v=014',
  },
];

export const polygonDefaultAssets: Asset[] = [
  {
    symbol: 'MATIC',
    logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png?v=014',
    address: '0x0000000000000000000000000000000000000000',
  },
  {
    symbol: 'USDT',
    logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png?v=014',
    address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  },
  {
    symbol: 'USDC',
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=014',
  },
  {
    symbol: 'DAI',
    address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    logo: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=014',
  },
  {
    symbol: 'BUSD',
    address: '0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39',
    logo: 'https://cryptologos.cc/logos/binance-usd-busd-logo.png?v=014',
  },
];

export const arbitrumDefaultAssets: Asset[] = [
  {
    symbol: 'ARB',
    logo: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png?v=014',
    address: '0x0000000000000000000000000000000000000000',
  },
  {
    symbol: 'USDT',
    logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png?v=014',
    address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  },
  {
    symbol: 'USDC',
    address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=014',
  },
  {
    symbol: 'DAI',
    address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    logo: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=014',
  },
];
