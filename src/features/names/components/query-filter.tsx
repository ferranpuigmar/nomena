import React from "react";
import SearchInput from "./search-input";
import Letters from "./letters";
import { cn } from "@src/lib/cn";

interface QueryFilterProps {
    handleQueryInput: (query: string) => void;
    handleQueryLetter: (letter: string) => void;
    letters: string[];
    selectedLetter: string | null;
    onSetSelectedLetter: (letter: string | null) => void;
    isFixed: boolean;
    isMobile: boolean;
}

const QueryFilter = ({ handleQueryInput, handleQueryLetter, letters, selectedLetter, onSetSelectedLetter, isFixed, isMobile }: QueryFilterProps) => {
    const [searchInput, setSearchInput] = React.useState('');

    const handleLetterClick = (letter: string) => {
        const newLetter = selectedLetter === letter ? null : letter;
        onSetSelectedLetter(newLetter);
        handleQueryLetter(newLetter ?? '');
        setSearchInput('');
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
        handleQueryInput(e.target.value);
        onSetSelectedLetter(null);
    }

    return (
        <div className={cn(
            "w-full",
            !isFixed && !isMobile ? "flex flex-col items-center gap-3" : ""
        )}>
            <SearchInput onHandleInputChange={handleInputChange} searchInputValue={searchInput} isFixed={isFixed} />
            {/* Letras horizontales solo en desktop no-sticky */}
            {!isFixed && !isMobile && (
                <div className="flex justify-center gap-2">
                    <Letters letters={letters} selectedLetter={selectedLetter} handleLetterClick={handleLetterClick} />
                </div>
            )}
        </div>
    )
}

export default QueryFilter