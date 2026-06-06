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
import { useIsMobile } from "@src/app/shared/hooks/useMobile"

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

const RenderGenderFiltersSection = ({ selectedGender, onToggleGender }: { selectedGender: NameGender | null, onToggleGender: (gender: NameGender | null) => void }) => {
    const GENDER_OPTIONS = [
        { value: 'boy' as NameGender, label: 'Masculino' },
        { value: 'girl' as NameGender, label: 'Femenino' },
        { value: 'unisex' as NameGender, label: 'Neutro' },
    ]
    
    return (
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-white shadow-lg ring-1 ring-black/5 min-w-[160px]">
            <Button 
                variant="ghost" 
                onClick={() => onToggleGender(null)} 
                className={cn("w-full text-sm justify-start", selectedGender === null ? 'text-accent-primary font-bold' : 'text-fg-tertiary')}
            >
                Todos
            </Button>
            {GENDER_OPTIONS.map(({ value, label }) => (
                <Button 
                    key={value}
                    variant="ghost" 
                    onClick={() => onToggleGender(value)}
                    className={cn("w-full text-sm justify-start", selectedGender === value ? 'text-accent-primary font-bold' : 'text-fg-tertiary')}
                >
                    {label}
                </Button>
            ))}
        </div>
    )
}

const HeroSearch = ({ handleOnToggleGender, handleOnQueryLetter, selectedGender, handleOnDebounceQuery }: HeroSearchProps) => {
    const { letters } = useInitialLetters()
    const [selectedLetter, setSelectedLetter] = React.useState<string | null>(null);
    const [isFixed, setIsFixed] = React.useState(false)
    const isMobile = useIsMobile()
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
        isFixed && "fixed top-[60px] md:top-[68px] left-0 right-0 z-30 border-b border-stroke-subtle shadow-sm"
    )

    const ContainerClass = cn(
        "mx-auto max-w-7xl px-4 flex flex-col items-center gap-4",
        {
            'flex-row justify-center py-2.5': isFixed,
            'text-center py-4 md:py-6': !isFixed,
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
                    {!isFixed && (
                        <Text asChild variant="h1">
                            <h1 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
                                Descubre el nombre perfecto
                            </h1>
                        </Text>
                    )}
                    {/* Search + Alphabet Selector */}
                    {/* Mobile no-sticky: en la misma línea | Desktop no-sticky: QueryFilter incluye las letras debajo */}
                    {/* Sticky mode: Search + dropdowns juntos y centrados */}
                    <div className={cn(
                        "flex items-center gap-2.5",
                        {
                            "w-full max-w-[540px]": !isFixed && isMobile,
                            "w-full": !isFixed && !isMobile,
                            "": isFixed // Sin width forzado en sticky, solo el ancho de su contenido
                        }
                    )}>
                        <QueryFilter
                            handleQueryInput={handleOnDebounceQuery}
                            handleQueryLetter={handleOnQueryLetter}
                            letters={letters}
                            selectedLetter={selectedLetter}
                            onSetSelectedLetter={setSelectedLetter}
                            isFixed={isFixed}
                            isMobile={isMobile}
                        />
                        
                        {/* Dropdown A-Z en mobile no-sticky */}
                        {!isFixed && isMobile && (
                            <Dropdown 
                                className="h-12 shrink-0"
                                dropDownButton={
                                    <span className="text-sm font-bold text-neutral-700">
                                        {selectedLetter || 'A-Z'}
                                    </span>
                                }
                                dropDownItem={
                                    <RenderLettersSection 
                                        letters={letters} 
                                        selectedLetter={selectedLetter} 
                                        handleOnSelectLetter={handleOnSelectLetter} 
                                    />
                                }
                            />
                        )}
                        
                        {/* Dropdowns en sticky mode (alphabet + filters) */}
                        {isFixed && (
                            <>
                                {/* Alphabet Dropdown */}
                                <Dropdown 
                                    className="h-10 shrink-0"
                                    dropDownButton={
                                        <span className="text-xs font-bold text-neutral-700 md:text-sm">
                                            {selectedLetter || 'A-Z'}
                                        </span>
                                    }
                                    dropDownItem={
                                        <RenderLettersSection 
                                            letters={letters} 
                                            selectedLetter={selectedLetter} 
                                            handleOnSelectLetter={handleOnSelectLetter} 
                                        />
                                    }
                                />
                                
                                {/* Gender Filter Button */}
                                <Dropdown
                                    className="h-10 shrink-0"
                                    dropDownButton={
                                        <div className="relative flex items-center gap-1.5">
                                            <svg className="size-3.5 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                            </svg>
                                            {selectedGender && (
                                                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-700 px-1.5 text-[10px] font-semibold text-white">
                                                    1
                                                </span>
                                            )}
                                        </div>
                                    }
                                    dropDownItem={
                                        <RenderGenderFiltersSection 
                                            selectedGender={selectedGender}
                                            onToggleGender={handleOnToggleGender}
                                        />
                                    }
                                />
                            </>
                        )}
                    </div>
                    
                    {/* Gender Pills en no-sticky mode */}
                    {!isFixed && (
                        <GenderFilters 
                            selectedGender={selectedGender} 
                            onToggleGender={handleOnToggleGender} 
                            isFixed={isFixed} 
                        />
                    )}

                </div>
            </div>
        </>
    )
}

export default HeroSearch