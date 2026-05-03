import { cn } from "@src/lib/cn";
import React from "react";

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

    const letterSquareClass = (letter: string) => cn(
        'px-2 py-1 mr-2 mb-2 bg-neutral border-2 rounded border-gray-300 cursor-pointer hover:bg-gray-300 transition-colors',
        selectedLetter === letter ? 'bg-blue-500 text-white' : 'bg-white text-black'
    );

    return (
        <>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    className="p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mb-4"
                    onChange={handleInputChange}
                    value={searchInput}
                />
            </div>
            <div className="mb-4 flex flex-wrap">
                {letters.map(letter => (
                    <button
                        type="button"
                        key={letter}
                        className={letterSquareClass(letter)}
                        onClick={() => handleLetterClick(letter)}
                    >
                        <span className="font-bold">{letter}</span>
                    </button>
                ))}
            </div>
        </>
    )
}

export default QueryFilter