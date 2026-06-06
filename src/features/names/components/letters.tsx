import { cn } from "@src/lib/cn";

interface LettersProps {
    letters: string[];
    selectedLetter: string | null;
    handleLetterClick: (letter: string) => void;
}

const Letters = ({ letters, selectedLetter, handleLetterClick }: LettersProps) => {
    const letterSquareClass = (letter: string) => cn(
        'shrink-0 cursor-pointer hover:text-accent-primary transition-colors text-xs font-medium md:text-sm',
        selectedLetter === letter ? 'text-accent-primary font-bold' : 'text-neutral-500'
    );

    return (
        letters.map(letter => (
            <button
                type="button"
                key={letter}
                className={letterSquareClass(letter)}
                onClick={() => handleLetterClick(letter)}
            >
                {letter}
            </button>
        ))
    )
}

export default Letters