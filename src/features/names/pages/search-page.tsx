import NameCard from '../components/name-card'
import { NameDetailDrawer } from '../components/name-detail-drawer'
import { useNameDetailNavigation } from '../hooks/use-name-detail-navigation.ts'
import { usePendingFavoriteAction } from '../hooks/use-pending-favorite-action'
import { useNames } from '../hooks/use-names'
import { useNameFilters } from '../hooks/use-name-filters'
import { useAuthStore } from '@src/features/auth/store/auth-store'
import { useFavoritesByUserId } from '@src/features/favorites/hooks/use-favorites'
import { ContentWrapper } from '@src/app/shared/components/content-wrapper/content-wrapper.tsx'
import HeroSearch from '../components/hero-search.tsx'
import { Button } from '@src/app/shared/components/button/button.tsx'
import { Loader2 } from 'lucide-react'

export function SearchPage() {
  const userId = useAuthStore((state) => state.user?.uid)
  const { selectedGender, filters, toggleGender, handleDebounceQuery, setSearchQuery, cancelDebounceQuery, clearSearchQuery } = useNameFilters()

  const { data, isLoading, error, fetchNextPage } = useNames(filters)
  const { toggleFavorite, isFavorited } = useFavoritesByUserId(userId)
  usePendingFavoriteAction(userId, toggleFavorite)

  const allNames = data?.pages?.flatMap((page) => page.items) ?? []
  const {
    selectedIndex,
    selectedName,
    hasPrevPageClick,
    hasNextPageClick,
    openNameDetail,
    closeNameDetail,
    handleDrawerNavigation,
  } = useNameDetailNavigation(allNames)

  const handleQueryLetter = (letter: string | null) => {
    if (!letter) {
      clearSearchQuery()
      return
    }
    setSearchQuery(letter)
    cancelDebounceQuery()
  }

  return (
    <ContentWrapper hasFullLayout>
      <section>
        <HeroSearch
          handleOnToggleGender={toggleGender}
          handleOnQueryLetter={handleQueryLetter}
          handleOnDebounceQuery={handleDebounceQuery}
          selectedGender={selectedGender}
        />

        <ContentWrapper>
          {isLoading && allNames.length === 0 ? (
            // Estado de carga inicial: spinner centrado con min-height
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="animate-spin h-8 w-8 text-accent-primary" />
                <p className="text-sm text-neutral-600">Cargando nombres...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
                {allNames.map((name, index) => (
                  <NameCard
                    key={name.normalizedName}
                    name={name.name}
                    nameId={name.id}
                    gender={name.gender}
                    origin={name.origin}
                    usageScore={name.usageScore}
                    isFavorited={isFavorited(name.id)}
                    onToggleFavorite={() => toggleFavorite(name.id, name.name)}
                    onClick={() => openNameDetail(index)}
                  />
                ))}
              </div>

              {error && <p className="text-center text-red-600 mt-6">Error: {error.message}</p>}
              
              <div className='flex justify-center w-full mt-6'>
                <Button className='px-14' onClick={() => fetchNextPage()} disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin h-4 w-4" />
                      Cargando...
                    </span>
                  ) : (
                    'Cargar más nombres'
                  )}
                </Button>
              </div>
            </>
          )}


          <NameDetailDrawer
            name={selectedName}
            isOpen={selectedIndex !== null}
            onClose={closeNameDetail}
            onPrev={hasPrevPageClick ? () => handleDrawerNavigation('prev') : undefined}
            onNext={hasNextPageClick ? () => handleDrawerNavigation('next') : undefined}
            isFavorited={selectedName ? isFavorited(selectedName.id) : false}
            onToggleFavorite={() => selectedName ? toggleFavorite(selectedName.id, selectedName.name) : Promise.resolve()}
          />
        </ContentWrapper>
      </section>
    </ContentWrapper>
  )
}
