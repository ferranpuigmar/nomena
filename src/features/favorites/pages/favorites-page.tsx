import { useAuthStore } from '@src/features/auth/store/auth-store'
import { useFavoritesByUserId } from '../hooks/use-favorites'
import { useCouple } from '@src/features/couple/hooks/use-couple'
import NameCard from '@src/app/shared/components/name-card/name-card'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'

export function FavoritesPage() {
  const userId = useAuthStore((state) => state.user?.uid)
  const { favorites, isLoading, toggleFavorite, isFavorited } = useFavoritesByUserId(userId)
  const { sharedFavorites } = useCouple(userId)
  const {
    partnerDisplayNames,
  } = useCouple(userId);

  const myNameIds = new Set(favorites?.names.map((n) => n.id) ?? [])
  const matches = sharedFavorites.flatMap((partnerFavorites) =>
    partnerFavorites.names.filter((n) => myNameIds.has(n.id))
  )
  const partnetFavoritesLength = sharedFavorites.reduce((total, partner) => total + partner.names.length, 0)
  const matchesLength = matches.length;
  const myFavoritesLength = favorites?.names.length ?? 0;

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
      <TabGroup>
        <TabList className="flex gap-4">
          <Tab className="-mb-px rounded-2xl border-2 px-4 py-2 text-sm font-medium text-gray-600 transition hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 data-selected:border-blue-600 data-selected:text-blue-700">
            Mis favoritos <span>{myFavoritesLength}</span>
          </Tab>
          <Tab className="-mb-px rounded-2xl border-2 px-4 py-2 text-sm font-medium text-gray-600 transition hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 data-selected:border-blue-600 data-selected:text-blue-700">
            Favoritos de {partnerDisplayNames[favorites.sharedWith[0]]} <span>{partnetFavoritesLength}</span>
          </Tab>
          <Tab className="-mb-px rounded-2xl border-2 px-4 py-2 text-sm font-medium text-gray-600 transition hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 data-selected:border-blue-600 data-selected:text-blue-700">
            Favoritos compartidos <span className="mt-1 text-sm text-gray-500">{matchesLength}</span>
          </Tab>
        </TabList>
        <TabPanels className="pt-4">
          <TabPanel>
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
          </TabPanel>
          <TabPanel>
            {sharedFavorites.map((partnerFavorites) => (
              <div key={partnerFavorites.userId} className="mt-10">
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
          </TabPanel>
          <TabPanel>
            {sharedFavorites.length > 0 && (
              <div className="mt-10">
                {matches.length === 0 ? (
                  <p className="mt-2 text-sm text-gray-500">Aún no coincidís en ningún nombre.</p>
                ) : (
                  <>
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
          </TabPanel>
        </TabPanels>
      </TabGroup>





    </section>
  )
}
