import { Button } from '@src/app/shared/components/button/button'
import type { NameGender } from '../types/names-type'
import { cn } from '@src/lib/cn'

type GenderOption = {
  value: NameGender
  label: string
}

const GENDER_OPTIONS: GenderOption[] = [
  { value: 'boy', label: 'Masculino' },
  { value: 'girl', label: 'Femenino' },
  { value: 'unisex', label: 'Neutro' },
]

type GenderFiltersProps = {
  selectedGender: NameGender | null
  onToggleGender: (gender: NameGender | null) => void
  isFixed: boolean
}

export function GenderFilters({ selectedGender, onToggleGender, isFixed }: GenderFiltersProps) {

  const wrapperClass = cn(
    "flex gap-4 mb-2 justify-center",
    { 'mb-0 gap-2': isFixed }
  )

  const buttonClass = cn(
    "px-4 py-1.5 rounded-xl text-sm",
    { 'h-10': isFixed }
  )

  return (
    <div className={wrapperClass}>
      <Button variant="ghost" isSelected={selectedGender === null} className={buttonClass} onClick={() => onToggleGender(null)}>Todos</Button>
      {GENDER_OPTIONS.map(({ value, label }) => (
        <Button key={value} variant="ghost" isSelected={selectedGender === value} className={buttonClass} onClick={() => onToggleGender(value)}>
          {label}
        </Button>
      ))}
    </div>
  )
}