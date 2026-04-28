import { useInfiniteQuery } from '@tanstack/react-query';
import type { DocumentSnapshot } from 'firebase/firestore';
import { getNames } from '../api';
import type { Filters } from '../types/names-type';

export function useNames(filters?: Filters) {
  const query = useInfiniteQuery({
    queryKey: ['names', filters],
    initialPageParam: null as DocumentSnapshot | null,
    queryFn: ({ pageParam }) =>
      getNames({ cursor: pageParam ?? undefined, filters }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
  });

  return {
    ...query,
    names: query.data?.pages.flatMap((page) => page.items) ?? [],
  };
}