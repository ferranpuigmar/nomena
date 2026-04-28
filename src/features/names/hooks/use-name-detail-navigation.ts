import { useState } from 'react'
import type { Name } from '../types/names-type'

type DrawerDirection = 'prev' | 'next'

export function useNameDetailNavigation(names: Name[]) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const selectedName = selectedIndex !== null ? names[selectedIndex] ?? null : null
  const hasPrevPageClick = selectedIndex !== null && selectedIndex > 0
  const hasNextPageClick = selectedIndex !== null && selectedIndex < names.length - 1

  const openNameDetail = (index: number) => {
    setSelectedIndex(index)
  }

  const closeNameDetail = () => {
    setSelectedIndex(null)
  }

  const handleDrawerNavigation = (direction: DrawerDirection) => {
    if (selectedIndex === null) return

    const newIndex = direction === 'prev' ? selectedIndex - 1 : selectedIndex + 1

    if (newIndex >= 0 && newIndex < names.length) {
      setSelectedIndex(newIndex)
    }
  }

  return {
    selectedIndex,
    selectedName,
    hasPrevPageClick,
    hasNextPageClick,
    openNameDetail,
    closeNameDetail,
    handleDrawerNavigation,
  }
}