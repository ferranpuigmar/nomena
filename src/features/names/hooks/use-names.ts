import { useQuery } from '@tanstack/react-query';
import { getNames } from '../api/get-names';

export function useNames() {
  return useQuery({
    queryKey: ['names'],
    queryFn: getNames,
  });
}