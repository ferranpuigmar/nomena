import { useInitialLetters } from "../hooks/use-initial-letters"
import { GenderFilters } from "./gender-filters"
import QueryFilter from "./query-filter"
import type { NameGender } from "../types/names-type"
import { Text } from "@src/app/shared/components/text/text"
import Dropdown from "./dropdown"
import Letters from "./letters"
import React from "react"
import { cn } from "@src/lib/cn"
import { Button } from "@src/app/shared/components/button/button"

interface HeroSearchProps {
    handleOnToggleGender: (gender: NameGender | null) => void
    handleOnDebounceQuery: (query: string) => void
    handleOnQueryLetter: (letter: string) => void
    selectedGender: NameGender | null
}

const RenderLettersSection = ({ letters, selectedLetter, handleOnSelectLetter }: { letters: string[], selectedLetter: string | null, handleOnSelectLetter: (letter: string) => void }) => {
    return (
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-white shadow-lg ring-1 ring-black/5">
            <Button variant="ghost" onClick={() => handleOnSelectLetter('')} className={cn("w-full text-sm font-regular", !selectedLetter ? 'text-accent-primary font-bold' : 'text-fg-tertiary')}>
                All
            </Button>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(2rem,1fr))] gap-3 [&_button]:w-7.5
                     [&_button]:px-2 [&_button]:aspect-square [&_button]:border [&_button]:border-stroke-default">
                <Letters letters={letters} selectedLetter={selectedLetter} handleLetterClick={handleOnSelectLetter} />
            </div>
        </div>
    )
}

const HeroSearch = ({ handleOnToggleGender, handleOnQueryLetter, selectedGender, handleOnDebounceQuery }: HeroSearchProps) => {
    const { letters } = useInitialLetters()
    const [selectedLetter, setSelectedLetter] = React.useState<string | null>(null);
    const [isFixed, setIsFixed] = React.useState(false)
    const sentinelRef = React.useRef<HTMLDivElement>(null)
    const wrapperRef = React.useRef<HTMLDivElement>(null)
    const [fixedHeight, setFixedHeight] = React.useState(0)

    React.useEffect(() => {
        const sentinel = sentinelRef.current
        if (!sentinel) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                const fixed = !entry.isIntersecting
                setIsFixed(fixed)
                if (fixed && wrapperRef.current) {
                    setFixedHeight(wrapperRef.current.offsetHeight)
                }
            },
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

    const handleOnSelectLetter = (letter: string) => {
        setSelectedLetter(letter)
        handleOnQueryLetter(letter)
    }

    return (
        <>
            <div ref={sentinelRef} />
            {isFixed && <div style={{ height: fixedHeight }} />}
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
                    {isFixed && <Dropdown className="h-10"
                        dropDownButton={<span className="font-bold">{selectedLetter ? selectedLetter : 'A-Z'}</span>}
                        dropDownItem={<RenderLettersSection letters={letters} selectedLetter={selectedLetter} handleOnSelectLetter={handleOnSelectLetter} />}
                    />}
                    <GenderFilters selectedGender={selectedGender} onToggleGender={handleOnToggleGender} isFixed={isFixed} />

                </div>
            </div>
        </>
    )
}

export default HeroSearch