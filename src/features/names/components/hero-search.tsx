import { useInitialLetters } from "../hooks/use-initial-letters"
import { GenderFilters } from "./gender-filters"
import QueryFilter from "./query-filter"
import type { NameGender } from "../types/names-type"
import { Text } from "@src/app/shared/components/text/text"
import Dropdown from "./dropdown"
import Letters from "./letters"
import React from "react"
import { cn } from "@src/lib/cn"

interface HeroSearchProps {
    handleOnToggleGender: (gender: NameGender | null) => void
    handleOnDebounceQuery: (query: string) => void
    handleOnQueryLetter: (letter: string) => void
    selectedGender: NameGender | null
}

const HeroSearch = ({ handleOnToggleGender, handleOnQueryLetter, selectedGender, handleOnDebounceQuery }: HeroSearchProps) => {
    const { letters } = useInitialLetters()
    const [selectedLetter, setSelectedLetter] = React.useState<string | null>(null);
    const [isFixed, setIsFixed] = React.useState(false)
    const sentinelRef = React.useRef<HTMLDivElement>(null)
    const wrapperRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        const sentinel = sentinelRef.current
        if (!sentinel) return

        const observer = new IntersectionObserver(
            ([entry]) => setIsFixed(!entry.isIntersecting),
            { threshold: 0 }
        )
        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [])


    const wrapperRefClass = cn(
        "bg-white",
        isFixed && "fixed top-0 left-0 right-0 z-50 shadow-md"
    )

    const ContainerClass = cn(
        "mx-auto max-w-7xl py-4 px-4 text-center flex items-center gap-4",
        {
            'flex-row': isFixed,
            'flex-col': !isFixed,
        }
    )

    return (
        <>
            <div ref={sentinelRef} />
            <div ref={wrapperRef} className={wrapperRefClass}>
                <div className={ContainerClass}>
                    {!isFixed && <Text asChild variant="h1"><h1>Descubre el nombre perfecto</h1></Text>}
                    <QueryFilter 
                        handleQueryInput={handleOnDebounceQuery} 
                        handleQueryLetter={handleOnQueryLetter} 
                        letters={letters} 
                        selectedLetter={selectedLetter} 
                        onSetSelectedLetter={setSelectedLetter}
                        isFixed={isFixed}
                    />
                    <Dropdown
                        dropDownButton={<span className="font-bold">A-Z</span>}
                        dropDownItem={<Letters letters={letters} selectedLetter={selectedLetter} handleLetterClick={handleOnQueryLetter} />}
                    />
                    <GenderFilters selectedGender={selectedGender} onToggleGender={handleOnToggleGender} />
                    
                </div>
            </div>
        </>
    )
}

export default HeroSearch