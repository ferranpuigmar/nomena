import NameCard from '../components/name-card'
import { NameDetailDrawer } from '../components/name-detail-drawer'
import { GenderFilters } from '../components/gender-filters'
import { useNameDetailNavigation } from '../hooks/use-name-detail-navigation.ts'
import { usePendingFavoriteAction } from '../hooks/use-pending-favorite-action'
import { useNames } from '../hooks/use-names'
import { useNameFilters } from '../hooks/use-name-filters'
import { useAuthStore } from '@src/features/auth/store/auth-store'
import { useFavoritesByUserId } from '@src/features/favorites/hooks/use-favorites'
import { useInitialLetters } from '../hooks/use-initial-letters.ts'
import QueryFilter from '../components/query-filter.tsx'

export function SearchPage() {
  const userId = useAuthStore((state) => state.user?.uid)
  const { selectedGenders, filters, toggleGender, handleDebounceQuery, setSearchQuery, cancelDebounceQuery } = useNameFilters()

  const { data, isLoading, error, fetchNextPage } = useNames(filters)
  const { letters } = useInitialLetters()
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

  const handleQueryLetter = (letter: string) => {
    setSearchQuery(letter)
    cancelDebounceQuery()
  }

  return (
    <section>
      <GenderFilters selectedGenders={selectedGenders} onToggleGender={toggleGender} />
      <QueryFilter handleQueryInput={handleDebounceQuery} handleQueryLetter={handleQueryLetter} letters={letters} />

      <div className="grid grid-cols-6 gap-4">
        {allNames.map((name, index) => (
          <NameCard
            key={name.id}
            name={name.name}
            nameId={name.id}
            gender={name.gender}
            origin={name.origin}
            usageScore={name.usageScore}
            isFavorited={isFavorited(name.id)}
            onToggleFavorite={toggleFavorite}
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
        onToggleFavorite={toggleFavorite}
      />
    </section>
  )
}
