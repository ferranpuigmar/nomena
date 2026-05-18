import React from "react";
import SearchInput from "./search-input";
import Letters from "./letters";

interface QueryFilterProps {
    handleQueryInput: (query: string) => void;
    handleQueryLetter: (letter: string) => void;
    letters: string[];
    selectedLetter: string | null;
    onSetSelectedLetter: (letter: string | null) => void;
    isFixed: boolean;
}

const QueryFilter = ({ handleQueryInput, handleQueryLetter, letters, selectedLetter, onSetSelectedLetter, isFixed }: QueryFilterProps) => {
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
        <>
            <SearchInput onHandleInputChange={handleInputChange} searchInputValue={searchInput} isFixed={isFixed} />
            {!isFixed && <div className="flex justify-center gap-3"><Letters letters={letters} selectedLetter={selectedLetter} handleLetterClick={handleLetterClick} /></div>}
        </>
    )
}

export default QueryFilter