import { useState } from 'react'
import { useAuthStore } from '@src/features/auth/store/auth-store'
import { useFavoritesByUserId } from '../hooks/use-favorites'
import { useCouple } from '@src/features/couple/hooks/use-couple'
import NameCard from '@src/app/shared/components/name-card/name-card'
import { NameDetailDrawer } from '@src/features/names/components/name-detail-drawer'
import { useNameDetailNavigation } from '@src/features/names/hooks/use-name-detail-navigation'
import type { FavoriteName } from '../types/favorite-type'
import type { Name } from '@src/features/names/types/names-type'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'

function toName(item: FavoriteName): Name {
  return {
    id: item.id,
    name: item.name,
    normalizedName: '',
    gender: (item.gender ?? 'neutral') as Name['gender'],
    origin: item.origin ? [item.origin] : undefined,
    length: item.name.length,
    lengthCategory: item.name.length <= 6 ? 'short' : 'long',
    usageScore: item.usageScore,
  }
}

export function FavoritesPage() {
  const userId = useAuthStore((state) => state.user?.uid)
  const { favorites, isLoading, toggleFavorite, isFavorited } = useFavoritesByUserId(userId)
  const {
    sharedFavorites,
    partnerDisplayNames,
  } = useCouple(userId);

  const [activeTab, setActiveTab] = useState(0)

  const myNameIds = new Set(favorites?.names.map((n) => n.id) ?? [])
  const matches = sharedFavorites.flatMap((partnerFavorites) =>
    partnerFavorites.names.filter((n) => myNameIds.has(n.id))
  )
  const partnetFavoritesLength = sharedFavorites.reduce((total, partner) => total + partner.names.length, 0)
  const matchesLength = matches.length;
  const myFavoritesLength = favorites?.names.length ?? 0;

  const myNames: Name[] = favorites?.names.map(toName) ?? []
  const partnerNames: Name[] = sharedFavorites.flatMap((pf) => pf.names.map(toName))
  const matchNames: Name[] = matches.map(toName)

  const tabNames = [myNames, partnerNames, matchNames]
  const currentNames = tabNames[activeTab] ?? []

  const getIndexInCurrent = (nameId: string) => currentNames.findIndex((n) => n.id === nameId)

  const {
    selectedIndex,
    selectedName,
    hasPrevPageClick,
    hasNextPageClick,
    openNameDetail,
    closeNameDetail,
    handleDrawerNavigation,
  } = useNameDetailNavigation(currentNames)

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
      <TabGroup selectedIndex={activeTab} onChange={setActiveTab}>
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
                  origin={favorite.origin ? [favorite.origin] : undefined}
                  usageScore={favorite.usageScore}
                  isFavorited={isFavorited(favorite.id)}
        onToggleFavorite={activeTab === 0 ? (nameId, name) => toggleFavorite(nameId, name ?? '') : undefined}
                  onClick={() => openNameDetail(getIndexInCurrent(favorite.id))}
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
                        origin={name.origin ? [name.origin] : undefined}
                        usageScore={name.usageScore}
                        isFavorited={false}
                        onToggleFavorite={undefined}
                        onClick={() => openNameDetail(getIndexInCurrent(name.id))}
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
                          origin={name.origin ? [name.origin] : undefined}
                          usageScore={name.usageScore}
                          isFavorited={true}
                          onToggleFavorite={undefined}
                          onClick={() => openNameDetail(getIndexInCurrent(name.id))}
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

      <NameDetailDrawer
        name={selectedName}
        isOpen={selectedIndex !== null}
        onClose={closeNameDetail}
        onPrev={hasPrevPageClick ? () => handleDrawerNavigation('prev') : undefined}
        onNext={hasNextPageClick ? () => handleDrawerNavigation('next') : undefined}
        isFavorited={selectedName ? isFavorited(selectedName.id) : false}
        onToggleFavorite={activeTab === 0 ? (nameId, name) => toggleFavorite(nameId, name ?? '') : undefined}
      />
    </section>
  )
}
