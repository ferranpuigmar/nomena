import { cn } from "@src/lib/cn";

interface LettersProps {
    letters: string[];
    selectedLetter: string | null;
    handleLetterClick: (letter: string) => void;
}

const Letters = ({ letters, selectedLetter, handleLetterClick }: LettersProps) => {
    const letterSquareClass = (letter: string) => cn(
        'bg-neutral cursor-pointer hover:text-accent-primary transition-colors text-sm font-regular',
        selectedLetter === letter ? 'text-accent-primary font-bold' : 'text-fg-tertiary'
    );

    return (
        <div className="flex flex-wrap justify-center gap-3">
            {letters.map(letter => (
                <button
                    type="button"
                    key={letter}
                    className={letterSquareClass(letter)}
                    onClick={() => handleLetterClick(letter)}
                >
                    {letter}
                </button>
            ))}
        </div>
    )
}

export default Letters