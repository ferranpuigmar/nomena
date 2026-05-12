import { useInitialLetters } from "../hooks/use-initial-letters"
import { GenderFilters } from "./gender-filters"
import QueryFilter from "./query-filter"
import type { NameGender } from "../types/names-type"
import { Text } from "@src/app/shared/components/text/text"

interface HeroSearchProps {
    handleOnToggleGender: (gender: NameGender) => void
    handleOnDebounceQuery: (query: string) => void
    handleOnQueryLetter: (letter: string) => void
    selectedGender: NameGender[]
}

const HeroSearch = ({ handleOnToggleGender, handleOnQueryLetter, selectedGender, handleOnDebounceQuery }: HeroSearchProps) => {
    const { letters } = useInitialLetters()

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-7xl py-4 px-4 text-center">
                <Text asChild variant="h1"><h1>Descubre el nombre perfecto</h1></Text>
                <QueryFilter handleQueryInput={handleOnDebounceQuery} handleQueryLetter={handleOnQueryLetter} letters={letters} />
                <GenderFilters selectedGenders={selectedGender} onToggleGender={handleOnToggleGender} />
            </div>
        </div>
    )
}

export default HeroSearch