import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { Filters, NameGender } from '../types/names-type'
import { useDebouncedCallback } from 'use-debounce';

export function useNameFilters() {
  const queryClient = useQueryClient()
  const [selectedGenders, setSelectedGenders] = useState<NameGender[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filters: Filters | undefined = selectedGenders.length > 0 || searchQuery
    ? { gender: selectedGenders.length > 0 ? selectedGenders : null, usageScore: null, length_category: null, query: searchQuery || undefined }
    : undefined

  const toggleGender = (gender: NameGender) => {
    queryClient.invalidateQueries({ queryKey: ['names'] })
    setSelectedGenders((prev) =>
      prev.includes(gender) ? prev.filter((g) => g !== gender) : [...prev, gender]
    )
  }

  const handleDebounceQuery = useDebouncedCallback((query: string) => {
    setSearchQuery(query)
  }, 500)

  const cancelDebounceQuery = () => {
    handleDebounceQuery.cancel()
  }

  return { selectedGenders, filters, toggleGender, handleDebounceQuery, setSearchQuery, cancelDebounceQuery }
}
