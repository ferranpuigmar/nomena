import { useInfiniteQuery } from '@tanstack/react-query';
import type { DocumentSnapshot } from 'firebase/firestore';
import { getNames } from '../api';

export function useNames() {
  const query = useInfiniteQuery({
    queryKey: ['names'],
    initialPageParam: null as DocumentSnapshot | null,
    queryFn: ({ pageParam }) =>
      getNames({ cursor: pageParam ?? undefined }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
  });

  return {
    ...query,
    names: query.data?.pages.flatMap((page) => page.items) ?? [],
  };
}