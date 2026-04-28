import { useAuthStore } from '@src/features/auth/store/auth-store'
import { useFavoritesByUserId } from '../hooks/use-favorites'
import { useCouple } from '@src/features/couple/hooks/use-couple'
import NameCard from '@src/app/shared/components/name-card/name-card'

export function FavoritesPage() {
  const userId = useAuthStore((state) => state.user?.uid)
  const { favorites, isLoading, toggleFavorite, isFavorited } = useFavoritesByUserId(userId)
  const { sharedFavorites } = useCouple(userId)

  const myNameIds = new Set(favorites?.names.map((n) => n.id) ?? [])
  const matches = sharedFavorites.flatMap((partnerFavorites) =>
    partnerFavorites.names.filter((n) => myNameIds.has(n.id))
  )

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
            gender={favorite.gender}
            origin={favorite.origin}
            usageScore={favorite.usageScore}
            isFavorited={isFavorited(favorite.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      {sharedFavorites.map((partnerFavorites) => (
        <div key={partnerFavorites.userId} className="mt-10">
          <h2 className="text-lg font-semibold text-gray-700">
            Favoritos compartidos
          </h2>
          {partnerFavorites.names.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">Tu pareja aún no tiene favoritos guardados.</p>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {partnerFavorites.names.map((name) => (
                <NameCard
                  key={name.id}
                  name={name.name}
                  nameId={name.id}
                  gender={name.gender}
                  origin={name.origin}
                  usageScore={name.usageScore}
                  isFavorited={false}
                  onToggleFavorite={undefined}
                />
              ))}
            </div>
          )}
        </div>
      ))}

      {sharedFavorites.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-700">Coincidencias</h2>
          {matches.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">Aún no coincidís en ningún nombre.</p>
          ) : (
            <>
              <p className="mt-1 text-sm text-gray-500">{matches.length} nombre{matches.length !== 1 ? 's' : ''} en común</p>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {matches.map((name) => (
                  <NameCard
                    key={name.id}
                    name={name.name}
                    nameId={name.id}
                    gender={name.gender}
                    origin={name.origin}
                    usageScore={name.usageScore}
                    isFavorited={true}
                    onToggleFavorite={undefined}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  )
}
