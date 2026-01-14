# Bulk Balance Checker

A web-based tool to check the balances of multiple wallet addresses across multiple ERC-20 tokens simultaneously. Supports Ethereum, BNB Smart Chain, Polygon, and Arbitrum networks.

## Features

- **Multi-Network Support**: Ethereum, BNB Smart Chain, Polygon, Arbitrum
- **Bulk Queries**: Check hundreds of addresses at once
- **Multiple Tokens**: Query native assets and ERC-20 tokens in a single request
- **Quick-Select Assets**: Pre-configured buttons for popular tokens (ETH, USDT, USDC, DAI, etc.)
- **CSV Export**: Download results for further analysis
- **Interactive Table**: Paginated results with load more functionality

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file with your RPC URLs:

```env
NEXT_PUBLIC_ETH_RPC_URL=https://ethereum-rpc.publicnode.com
NEXT_PUBLIC_BSC_RPC_URL=https://bsc-rpc.publicnode.com
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-bor-rpc.publicnode.com
NEXT_PUBLIC_ARBITRUM_RPC_URL=https://arbitrum-one-rpc.publicnode.com
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

### Build

```bash
npm run build
```

### Testing

```bash
npm test
```

## API

### `POST /api/check`

Check balances for multiple addresses and tokens.

**Request Body:**

```json
{
  "network": "eth",
  "addresses": ["0x123...", "0x456..."],
  "assets": ["0x0000000000000000000000000000000000000000", "0xdAC17F958D2ee523a2206206994597C13D831ec7"]
}
```

- `network`: One of `eth`, `bsc`, `polygon`, `arbitrum`
- `addresses`: Array of wallet addresses
- `assets`: Array of token addresses (use `0x0000...0000` for native token)

**Response:**

```json
{
  "message": "Balances fetched!",
  "data": {
    "0x123...": {
      "ETH(18)": "1.5",
      "USDT(6)": "1000.0"
    }
  }
}
```

**Note:** Large requests (~3000+ total queries) may fail due to RPC limits. Reduce the number of addresses or assets if this happens.

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [ethers.js](https://docs.ethers.org/) - Ethereum library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Jest](https://jestjs.io/) - Testing

## License

MIT
