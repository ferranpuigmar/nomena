import type { NameGender } from '../../../../features/names/types/names-type'

const GENDER_LABEL: Record<NameGender, string> = {
  boy: 'Niño',
  girl: 'Niña',
  neutral: 'Neutro',
}

const MAX_USAGE_SCORE = 603004

function scoreToDots(score: number): number {
  // Logarithmic scale: score 603004 → 5 dots, score 20 → 1 dot
  const normalized = Math.log(score) / Math.log(MAX_USAGE_SCORE)
  return Math.max(1, Math.round(normalized * 4) + 1)
}

interface NameCardProps {
  name: string
  nameId: string
  gender?: NameGender
  origin?: string
  usageScore?: number
  isFavorited?: boolean
  onToggleFavorite?: (nameId: string, name?: string) => Promise<void>
  onClick?: () => void
}

const NameCard = ({ name, nameId, gender, origin, usageScore, isFavorited = false, onToggleFavorite, onClick }: NameCardProps) => {
  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onToggleFavorite) {
      try {
        await onToggleFavorite(nameId, name)
      } catch (error) {
        console.error('Failed to toggle favorite:', error)
      }
    }
  }

  return (
    <div
      className="relative p-4 border rounded shadow flex flex-col gap-2 items-start cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      {onToggleFavorite && (
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 text-xl leading-none ${isFavorited ? 'text-red-500' : 'text-gray-300 hover:text-red-400'}`}
          aria-label={isFavorited ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          ♥
        </button>
      )}
      <div>
        <span className="text-sm font-semibold">{name}</span>
      </div>
      <div className="flex gap-2 text-xs text-gray-500">
        {gender && <span>{GENDER_LABEL[gender]}</span>}
        {gender && origin && <span>·</span>}
        {origin && <span>{origin}</span>}
      </div>
      {usageScore != null && (
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-400">Personas registradas</span>
          <div className="flex items-center gap-1.5" aria-label={`Popularidad: ${scoreToDots(usageScore)} de 5`}>
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    i < scoreToDots(usageScore) ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">({usageScore.toLocaleString('es-ES')})</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default NameCard
