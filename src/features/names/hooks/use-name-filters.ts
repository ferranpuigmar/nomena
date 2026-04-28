import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { Filters, NameGender } from '../types/names-type'

export function useNameFilters() {
  const queryClient = useQueryClient()
  const [selectedGenders, setSelectedGenders] = useState<NameGender[]>([])

  const filters: Filters | undefined = selectedGenders.length > 0
    ? { gender: selectedGenders, usageScore: null, length_category: null }
    : undefined

  const toggleGender = (gender: NameGender) => {
    queryClient.invalidateQueries({ queryKey: ['names'] })
    setSelectedGenders((prev) =>
      prev.includes(gender) ? prev.filter((g) => g !== gender) : [...prev, gender]
    )
  }

  return { selectedGenders, filters, toggleGender }
}
