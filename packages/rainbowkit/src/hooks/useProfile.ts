import type { Address } from 'viem';
import { useBalance } from 'wagmi';
import { useGetPrimaryName } from './useGetPrimaryName';

interface UseProfileParameters {
  address?: Address;
  includeBalance?: boolean;
}

export function useProfile({ address, includeBalance }: UseProfileParameters) {
  const { primaryName } = useGetPrimaryName();
  const { data: balance } = useBalance({
    address: includeBalance ? address : undefined,
  });

  return { ensName: primaryName, ensAvatar: undefined, balance };
}
