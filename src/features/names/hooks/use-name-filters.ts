import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { Filters, NameGender } from '../types/names-type'
import { useDebouncedCallback } from 'use-debounce';

export function useNameFilters() {
  const queryClient = useQueryClient()
  const [selectedGender, setSelectedGender] = useState<NameGender | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filters: Filters | undefined = selectedGender || searchQuery
    ? { gender: selectedGender, usageScore: null, length_category: null, query: searchQuery || undefined }
    : undefined

  const toggleGender = (gender: NameGender | null) => {
    queryClient.invalidateQueries({ queryKey: ['names'] })
    if(!gender || gender === selectedGender) {
      setSelectedGender(null)
      return
    }

    setSelectedGender(gender)
  }

  const handleDebounceQuery = useDebouncedCallback((query: string) => {
    setSearchQuery(query)
  }, 500)

  const cancelDebounceQuery = () => {
    handleDebounceQuery.cancel()
  }

  const clearSearchQuery = () => {
    queryClient.removeQueries({ queryKey: ['names'] })
    setSearchQuery('')
    handleDebounceQuery.cancel()
  }

  return { selectedGender, filters, toggleGender, handleDebounceQuery, setSearchQuery, cancelDebounceQuery, clearSearchQuery }
}
