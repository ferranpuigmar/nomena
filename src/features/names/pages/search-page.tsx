import NameCard from '../components/name-card'
import { useNames } from '../hooks/use-names'
import { useAuthStore } from '../../auth/store/auth-store'
import { useFavoritesByUserId } from '../../favorites/hooks/use-favorites'

export function SearchPage() {
  const userId = useAuthStore((state) => state.user?.uid)
  const { data, isLoading, error, fetchNextPage } = useNames()
  const { toggleFavorite, isFavorited } = useFavoritesByUserId(userId)

  return (
    <section>
      {data?.pages?.map((page, index) => (
        <div key={index} className="grid grid-cols-6 gap-4">
          {page.items.map((name) => (
            <NameCard
              key={name.id}
              name={name.name}
              nameId={name.id}
              isFavorited={isFavorited(name.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ))}

      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <button onClick={() => fetchNextPage()} disabled={isLoading}>
        Load More
      </button>
    </section>
  )
}
