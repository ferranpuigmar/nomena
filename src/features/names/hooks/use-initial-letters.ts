import { useQuery } from '@tanstack/react-query';
import { getInitialLetters } from '../api/get-initial-letters/service';

export function useInitialLetters() {
  const query = useQuery({
    queryKey: ['letters'],
    queryFn: () => getInitialLetters(),
  });

  return {
    ...query,
    letters: query.data?.letters ?? [],
    counts: query.data?.counts ?? {},
  };
}