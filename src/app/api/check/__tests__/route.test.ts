import { GET, POST } from '../route';

// Mock dependencies
jest.mock('../../../utils/providers', () => ({
  provider: jest.fn(() => ({})),
}));

jest.mock('../../../utils/getBalances', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../../utils/common', () => ({
  NETWORKS: {
    eth: { asset: 'ETH' },
    ethereum: { asset: 'ETH' },
    bsc: { asset: 'BNB' },
    polygon: { asset: 'MATIC' },
    arbitrum: { asset: 'ARB' },
  },
  getAddressBalances: jest.fn((values, addresses, assets) => {
    const result: Record<string, Record<string, string>> = {};
    addresses.forEach((addr: string, addrIdx: number) => {
      result[addr] = {};
      assets.forEach((asset: { symbol: string; decimals: number }, assetIdx: number) => {
        result[addr][`${asset.symbol}(${asset.decimals})`] = '1.0';
      });
    });
    return result;
  }),
  getContractAddressAndRpcUrl: jest.fn((network: string) => ({
    contractAddress: '0x1234567890123456789012345678901234567890',
    rpcUrl: network === 'norpc' ? '' : 'https://eth.example.com',
  })),
}));

jest.mock('ethers', () => ({
  ethers: {
    isAddress: (addr: string) => /^0x[a-fA-F0-9]{40}$/.test(addr),
    ZeroAddress: '0x0000000000000000000000000000000000000000',
    Contract: jest.fn().mockImplementation(() => ({
      symbol: jest.fn().mockResolvedValue('TEST'),
      decimals: jest.fn().mockResolvedValue(18),
    })),
  },
}));

import getBalances from '../../../utils/getBalances';

const mockGetBalances = getBalances as jest.MockedFunction<typeof getBalances>;

// Helper to create a mock Request
function createRequest(body: unknown): Request {
  return {
    json: async () => body,
  } as Request;
}

function createInvalidJsonRequest(): Request {
  return {
    json: async () => {
      throw new SyntaxError('Unexpected token');
    },
  } as Request;
}

describe('GET /api/check', () => {
  it('returns health check message', async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ message: 'App is running!' });
  });
});

describe('POST /api/check', () => {
  const validAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
  const validAsset = '0x0000000000000000000000000000000000000000';

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetBalances.mockResolvedValue([BigInt('1000000000000000000')]);
  });

  describe('network validation', () => {
    it('returns 400 when network is missing', async () => {
      const request = createRequest({
        addresses: [validAddress],
        assets: [validAsset],
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Network is required');
    });

    it('returns 400 for invalid network', async () => {
      const request = createRequest({
        network: 'invalid',
        addresses: [validAddress],
        assets: [validAsset],
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid network: invalid');
    });

    it('accepts valid networks', async () => {
      const networks = ['eth', 'ethereum', 'bsc', 'polygon', 'arbitrum'];

      for (const network of networks) {
        const request = createRequest({
          network,
          addresses: [validAddress],
          assets: [validAsset],
        });

        const response = await POST(request);
        expect(response.status).toBe(200);
      }
    });

    it('handles network case-insensitively', async () => {
      const request = createRequest({
        network: 'ETH',
        addresses: [validAddress],
        assets: [validAsset],
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });
  });

  describe('addresses validation', () => {
    it('returns 400 when addresses is not an array', async () => {
      const request = createRequest({
        network: 'eth',
        addresses: 'not-an-array',
        assets: [validAsset],
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Addresses must be a non-empty array');
    });

    it('returns 400 when addresses is empty', async () => {
      const request = createRequest({
        network: 'eth',
        addresses: [],
        assets: [validAsset],
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Addresses must be a non-empty array');
    });

    it('returns 400 for invalid address format', async () => {
      const request = createRequest({
        network: 'eth',
        addresses: ['invalid-address', '0xshort'],
        assets: [validAsset],
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid addresses');
    });
  });

  describe('assets validation', () => {
    it('returns 400 when assets is not an array', async () => {
      const request = createRequest({
        network: 'eth',
        addresses: [validAddress],
        assets: 'not-an-array',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Assets must be a non-empty array');
    });

    it('returns 400 when assets is empty', async () => {
      const request = createRequest({
        network: 'eth',
        addresses: [validAddress],
        assets: [],
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Assets must be a non-empty array');
    });

    it('returns 400 for invalid asset address', async () => {
      const request = createRequest({
        network: 'eth',
        addresses: [validAddress],
        assets: ['not-valid'],
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid asset addresses');
    });
  });

  describe('RPC configuration', () => {
    it('returns 500 when RPC URL is not configured', async () => {
      const { getContractAddressAndRpcUrl } = require('../../../utils/common');
      getContractAddressAndRpcUrl.mockReturnValueOnce({
        contractAddress: '0x1234567890123456789012345678901234567890',
        rpcUrl: '',
      });

      const request = createRequest({
        network: 'eth',
        addresses: [validAddress],
        assets: [validAsset],
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('RPC URL not configured');
    });
  });

  describe('successful requests', () => {
    it('returns balances for valid request', async () => {
      const request = createRequest({
        network: 'eth',
        addresses: [validAddress],
        assets: [validAsset],
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Balances fetched!');
      expect(data.data).toBeDefined();
      expect(data.data[validAddress]).toBeDefined();
    });

    it('calls getBalances with correct parameters', async () => {
      const request = createRequest({
        network: 'eth',
        addresses: [validAddress],
        assets: [validAsset],
      });

      await POST(request);

      expect(mockGetBalances).toHaveBeenCalledWith(
        'https://eth.example.com',
        '0x1234567890123456789012345678901234567890',
        [validAddress],
        [validAsset]
      );
    });

    it('handles multiple addresses and assets', async () => {
      const addresses = [validAddress, '0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8'];
      const assets = [validAsset, '0xdAC17F958D2ee523a2206206994597C13D831ec7'];

      mockGetBalances.mockResolvedValue([
        BigInt('1000000000000000000'),
        BigInt('2000000'),
        BigInt('500000000000000000'),
        BigInt('1000000'),
      ]);

      const request = createRequest({
        network: 'eth',
        addresses,
        assets,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Object.keys(data.data)).toHaveLength(2);
    });
  });

  describe('error handling', () => {
    it('returns 400 for invalid JSON', async () => {
      const request = createInvalidJsonRequest();

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid JSON body');
    });

    it('returns 500 for unexpected errors', async () => {
      mockGetBalances.mockRejectedValue(new Error('RPC connection failed'));

      const request = createRequest({
        network: 'eth',
        addresses: [validAddress],
        assets: [validAsset],
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch balances. Reduce the number of addresses or assets and try again.');
    });
  });
});
