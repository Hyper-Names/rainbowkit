import { useQuery } from '@tanstack/react-query';
import { http, type Chain, createPublicClient } from 'viem';
import { readContract } from 'viem/actions';
import { useAccount } from 'wagmi';
import { HyperliquidNamesABI } from './HyperliquidNamesABI';

const HLNContract = '0x3b55d601ce87262fecfbc5583a442ebe4d07bdb6';

export const hyperliquidTestnet = {
  id: 998,
  name: 'Hyperliquid Testnet',
  nativeCurrency: {
    name: 'HYPE',
    symbol: 'HYPE',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://api.hyperliquid-testnet.xyz/evm'],
    },
    public: {
      http: ['https://api.hyperliquid-testnet.xyz/evm'],
    },
  },
  testnet: true,
} as const satisfies Chain;

const publicClient = createPublicClient({
  chain: hyperliquidTestnet,
  transport: http(),
});

export const useGetPrimaryName = () => {
  /** Gets the primary name for the address
   * @returns The primary name for the address, empty string if none.
   */
  const { address } = useAccount();
  const {
    data: primaryName,
    isLoading: isPrimaryNameLoading,
    error: primaryNameError,
    refetch: refetchPrimaryName,
  } = useQuery({
    queryKey: ['primaryName', address ? address : ''],
    queryFn: () => getPrimaryName(),
    enabled: !!address,
    initialData: undefined,
  });
  const getPrimaryName = async () => {
    if (address) {
      const primaryName = await readContract(publicClient, {
        abi: HyperliquidNamesABI,
        address: HLNContract,
        functionName: 'primaryName',
        args: [address],
      });

      if (primaryName) {
        return primaryName as string;
      }
      return undefined;
    }
    return undefined;
  };

  return {
    primaryName,
    isPrimaryNameLoading,
    primaryNameError,
    refetchPrimaryName,
  };
};
