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
          <div className="grid grid-cols-4 gap-4">
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

          {isLoading && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}
          <button onClick={() => fetchNextPage()} disabled={isLoading}>
            Load More
          </button>

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
