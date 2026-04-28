import NameCard from '../components/name-card'
import { NameDetailDrawer } from '../components/name-detail-drawer'
import { useNameDetailNavigation } from '../hooks/use-name-detail-navigation.ts'
import { usePendingFavoriteAction } from '../hooks/use-pending-favorite-action'
import { useNames } from '../hooks/use-names'
import { useNameFilters } from '../hooks/use-name-filters'
import { useAuthStore } from '@src/features/auth/store/auth-store'
import { useFavoritesByUserId } from '@src/features/favorites/hooks/use-favorites'
import type { NameGender } from '../types/names-type'

const GENDER_OPTIONS: { value: NameGender; label: string }[] = [
  { value: 'boy', label: 'Niño' },
  { value: 'girl', label: 'Niña' },
  { value: 'unisex', label: 'Neutro' },
]

export function SearchPage() {
  const userId = useAuthStore((state) => state.user?.uid)
  const { selectedGenders, filters, toggleGender } = useNameFilters()

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

  return (
    <section>
      <div className="flex gap-4 mb-4">
        {GENDER_OPTIONS.map(({ value, label }) => (
          <label key={value} className="flex items-center gap-1.5 cursor-pointer select-none text-sm">
            <input
              type="checkbox"
              checked={selectedGenders.includes(value)}
              onChange={() => toggleGender(value)}
              className="rounded border-gray-300"
            />
            {label}
          </label>
        ))}
      </div>

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
      />
    </section>
  )
}
