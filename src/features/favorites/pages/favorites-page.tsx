import { useAuthStore } from '../../auth/store/auth-store'
import { useFavoritesByUserId } from '../hooks/use-favorites'
import NameCard from '../../../app/shared/components/name-card/name-card'

export function FavoritesPage() {
  const userId = useAuthStore((state) => state.user?.uid)
  const { favorites, isLoading, toggleFavorite, isFavorited } = useFavoritesByUserId(userId)

  if (isLoading) {
    return <p>Loading favorites...</p>
  }

  if (!favorites || favorites.names.length === 0) {
    return (
      <section>
        <h1 className="text-2xl font-semibold text-gray-900">Favoritos</h1>
        <p className="mt-3 text-gray-600">Aun no has guardado nombres en favoritos.</p>
      </section>
    )
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold text-gray-900">Favoritos</h1>
      <p className="mt-2 text-gray-600">{favorites.names.length} nombres guardados</p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {favorites.names.map((favorite) => (
          <NameCard
            key={favorite.id}
            name={favorite.name}
            nameId={favorite.id}
            isFavorited={isFavorited(favorite.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </section>
  )
}
