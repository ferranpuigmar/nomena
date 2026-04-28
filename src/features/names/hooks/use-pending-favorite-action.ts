import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuthStore } from '@src/features/auth/store/auth-store'

type ToggleFavorite = (nameId: string, name?: string) => Promise<void>

export function usePendingFavoriteAction(userId: string | undefined, toggleFavorite: ToggleFavorite) {
  const pendingAction = useAuthStore((state) => state.pendingAction)
  const setPendingAction = useAuthStore((state) => state.setPendingAction)
  const location = useLocation()
  const consumedPendingActionRef = useRef<string | null>(null)

  useEffect(() => {
    if (location.state?.from?.pathname !== '/login' || !userId || pendingAction?.type !== 'ADD_FAVORITE') {
      return
    }

    const pendingNameId = pendingAction.payload.nameId
    const pendingActionKey = `${location.key}:${pendingNameId}`

    if (consumedPendingActionRef.current === pendingActionKey) {
      return
    }

    consumedPendingActionRef.current = pendingActionKey

    setPendingAction(null)
    void toggleFavorite(pendingNameId)
  }, [userId, location.key, location.state, pendingAction, setPendingAction, toggleFavorite])
}