import React from "react";
import SearchInput from "./search-input";
import Letters from "./letters";

interface QueryFilterProps {
    handleQueryInput: (query: string) => void;
    handleQueryLetter: (letter: string) => void;
    letters: string[];
}

const QueryFilter = ({ handleQueryInput, handleQueryLetter, letters }: QueryFilterProps) => {
    const [searchInput, setSearchInput] = React.useState('');
    const [selectedLetter, setSelectedLetter] = React.useState<string | null>(null);

    const handleLetterClick = (letter: string) => {
        const newLetter = selectedLetter === letter ? null : letter;
        setSelectedLetter(newLetter);
        handleQueryLetter(newLetter ?? '');
        setSearchInput('');
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
        handleQueryInput(e.target.value);
        setSelectedLetter(null);
    }

    return (
        <>
            <SearchInput onHandleInputChange={handleInputChange} searchInputValue={searchInput} />
            <Letters letters={letters} selectedLetter={selectedLetter} handleLetterClick={handleLetterClick} />
        </>
    )
}

export default QueryFilter