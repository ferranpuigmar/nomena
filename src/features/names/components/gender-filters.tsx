import type { NameGender } from '../types/names-type'

type GenderOption = {
  value: NameGender
  label: string
}

const GENDER_OPTIONS: GenderOption[] = [
  { value: 'boy', label: 'Niño' },
  { value: 'girl', label: 'Niña' },
  { value: 'unisex', label: 'Neutro' },
]

type GenderFiltersProps = {
  selectedGenders: NameGender[]
  onToggleGender: (gender: NameGender) => void
}

export function GenderFilters({ selectedGenders, onToggleGender }: GenderFiltersProps) {
  return (
    <div className="flex gap-4 mb-4">
      {GENDER_OPTIONS.map(({ value, label }) => (
        <label key={value} className="flex items-center gap-1.5 cursor-pointer select-none text-sm">
          <input
            type="checkbox"
            checked={selectedGenders.includes(value)}
            onChange={() => onToggleGender(value)}
            className="rounded border-gray-300"
          />
          {label}
        </label>
      ))}
    </div>
  )
}