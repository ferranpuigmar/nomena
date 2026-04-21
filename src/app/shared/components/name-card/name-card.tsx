interface NameCardProps {
  name: string
  nameId: string
  isFavorited?: boolean
  onToggleFavorite?: (nameId: string) => Promise<void>
}

const NameCard = ({ name, nameId, isFavorited = false, onToggleFavorite }: NameCardProps) => {
  const handleClick = async () => {
    if (onToggleFavorite) {
      try {
        await onToggleFavorite(nameId)
      } catch (error) {
        console.error('Failed to toggle favorite:', error)
      }
    }
  }

  return (
    <div className="p-4 border rounded shadow">
      <div className="text-sm font-semibold">{name}</div>
      <div className="text-sm text-gray-500">
        {onToggleFavorite && (
          <button
            onClick={handleClick}
            className={`hover:underline cursor-pointer ${
              isFavorited ? 'text-red-500 font-semibold' : 'text-blue-500'
            }`}
          >
            {isFavorited ? '❤️' : 'Add to favorites'}
          </button>
        )}
      </div>
    </div>
  )
}

export default NameCard
