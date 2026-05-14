import { Button } from '@headlessui/react'
import type { NameGender } from '../types/names-type'
import { cn } from '@src/lib/cn'

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
  selectedGender: NameGender | null
  onToggleGender: (gender: NameGender | null) => void
}

export function GenderFilters({ selectedGender, onToggleGender }: GenderFiltersProps) {

  const buttonLabelClass = (gender: NameGender | null) => cn(
    "px-4 py-1.5 rounded-xl border",
    "bg-white text-gray-700 border-stroke-default",
    "data-[state=on]:bg-blue-600 data-[state=on]:text-white",
    {
      'bg-accent-primary text-white border-accent-primary': selectedGender === gender,
    }
  )

  return (
    <div className="flex gap-4 mb-2 justify-center">
      <Button className={buttonLabelClass(null)} onClick={() => onToggleGender(null)}>Todos</Button>
      {GENDER_OPTIONS.map(({ value, label }) => (
        <Button key={value} className={buttonLabelClass(value)} onClick= {() => onToggleGender(value)}>
          {label}
        </Button>
      ))}
    </div>
  )
}