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
import { useIsMobile } from '@src/app/shared/hooks/useMobile'
import { Loader2 } from 'lucide-react'

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
  const isMobile = useIsMobile();

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
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin h-8 w-8 text-accent-primary" />
          <p className="text-sm text-neutral-600">Cargando favoritos...</p>
        </div>
      </div>
    )
  }

  if (!favorites || favorites.names.length === 0) {
    return (
      <section>
        <h1 className="text-2xl md:text-3xl font-heading font-semibold text-neutral-900 mb-4">Favoritos</h1>
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-8 text-center">
          <p className="text-neutral-600">Aun no has guardado nombres en favoritos.</p>
          <p className="text-sm text-neutral-500 mt-2">Explora nombres y añade tus favoritos tocando el corazón ❤️</p>
        </div>
      </section>
    )
  }

  return (
    <section>
      {/* Mobile: Secciones con headers */}
      {isMobile ? (
        <div className="space-y-8">
          {/* Mis favoritos */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-semibold text-neutral-900">Mis favoritos</h2>
              <span className="text-xs bg-neutral-100 px-2.5 py-1 rounded-full text-neutral-600">{myFavoritesLength}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {favorites.names.map((favorite) => (
                <NameCard
                  key={favorite.id}
                  name={favorite.name}
                  nameId={favorite.id}
                  gender={favorite.gender}
                  origin={favorite.origin ? [favorite.origin] : undefined}
                  usageScore={favorite.usageScore}
                  isFavorited={isFavorited(favorite.id)}
                  onToggleFavorite={(nameId, name) => toggleFavorite(nameId, name ?? '')}
                  onClick={() => openNameDetail(getIndexInCurrent(favorite.id))}
                />
              ))}
            </div>
          </div>

          {/* Favoritos de pareja */}
          {sharedFavorites.map((partnerFavorites) => (
            <div key={partnerFavorites.userId}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-heading font-semibold text-neutral-900">De {partnerDisplayNames[favorites.sharedWith[0]]}</h2>
                <span className="text-xs bg-neutral-100 px-2.5 py-1 rounded-full text-neutral-600">{partnerFavorites.names.length}</span>
              </div>
              {partnerFavorites.names.length === 0 ? (
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 text-center">
                  <p className="text-sm text-neutral-600">Tu pareja aún no tiene favoritos guardados.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
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

          {/* Compartidos */}
          {sharedFavorites.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-heading font-semibold text-neutral-900">Compartidos</h2>
                <span className="text-xs bg-accent-light text-accent-primary px-2.5 py-1 rounded-full font-medium">{matchesLength}</span>
              </div>
              {matches.length === 0 ? (
                <div className="bg-accent-light border border-accent-primary/20 rounded-lg p-6 text-center">
                  <p className="text-sm text-neutral-700">Aún no coincidís en ningún nombre.</p>
                  <p className="text-xs text-neutral-600 mt-1">Seguid explorando 💚</p>
                </div>
              ) : (
                <>
                  <div className="mb-4 p-3 bg-accent-light border border-accent-primary/20 rounded-lg">
                    <p className="text-sm text-accent-primary font-medium">
                      🎉 ¡{matchesLength} {matchesLength === 1 ? 'coincidencia' : 'coincidencias'}!
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
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
        </div>
      ) : (
        /* Desktop: Tabs como antes */
        <TabGroup selectedIndex={activeTab} onChange={setActiveTab}>
          <TabList className="flex gap-3 border-b border-neutral-200">
            <Tab className="shrink-0 px-4 py-3 text-sm font-medium text-neutral-600 border-b-2 border-transparent transition hover:text-neutral-900 focus:outline-none data-selected:border-accent-primary data-selected:text-accent-primary whitespace-nowrap">
              Mis favoritos <span className="ml-1 text-xs bg-neutral-100 px-2 py-0.5 rounded-full">{myFavoritesLength}</span>
            </Tab>
            <Tab className="shrink-0 px-4 py-3 text-sm font-medium text-neutral-600 border-b-2 border-transparent transition hover:text-neutral-900 focus:outline-none data-selected:border-accent-primary data-selected:text-accent-primary whitespace-nowrap">
              De {partnerDisplayNames[favorites.sharedWith[0]]} <span className="ml-1 text-xs bg-neutral-100 px-2 py-0.5 rounded-full">{partnetFavoritesLength}</span>
            </Tab>
            <Tab className="shrink-0 px-4 py-3 text-sm font-medium text-neutral-600 border-b-2 border-transparent transition hover:text-neutral-900 focus:outline-none data-selected:border-accent-primary data-selected:text-accent-primary whitespace-nowrap">
              Compartidos <span className="ml-1 text-xs bg-accent-light text-accent-primary px-2 py-0.5 rounded-full">{matchesLength}</span>
            </Tab>
          </TabList>
          <TabPanels className="pt-6">
          <TabPanel>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
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
              <div key={partnerFavorites.userId}>
                {partnerFavorites.names.length === 0 ? (
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-8 text-center">
                    <p className="text-neutral-600">Tu pareja aún no tiene favoritos guardados.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
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
              <div>
                {matches.length === 0 ? (
                  <div className="bg-accent-light border border-accent-primary/20 rounded-lg p-8 text-center">
                    <p className="text-neutral-700">Aún no coincidís en ningún nombre.</p>
                    <p className="text-sm text-neutral-600 mt-2">Seguid explorando y añadiendo favoritos 💚</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 p-4 bg-accent-light border border-accent-primary/20 rounded-lg">
                      <p className="text-sm text-accent-primary font-medium">
                        🎉 ¡{matchesLength} {matchesLength === 1 ? 'coincidencia' : 'coincidencias'} encontradas!
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
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
      )}

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
