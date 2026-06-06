import { Text } from "@src/app/shared/components/text/text";
import SearchIcon from "@src/assets/icons/search.svg?react"
import { cn } from "@src/lib/cn";

interface SearchInputProps {
    onHandleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    searchInputValue: string;
    isFixed: boolean;
}

const SearchInput = ({ onHandleInputChange, searchInputValue, isFixed }: SearchInputProps) => {

    console.log('SearchInput rendered with value:', searchInputValue, 'and isFixed:', isFixed);

    const inputClass = cn(
        "bg-canvas-surface leading-5 pl-10 pr-4 w-full border-stroke-default rounded-lg border outline-none focus:ring-2 focus:ring-accent-primary/25 disabled:cursor-not-allowed disabled:opacity-50",
        isFixed 
            ? "py-2.5 text-sm" 
            : "py-3.5 text-sm md:py-4 md:text-base"
    )
    
    const iconClass = cn(
        "absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500",
        isFixed ? "size-4" : "size-4.5 md:size-5"
    )

    return (
        <div className={cn(
            "relative inline-block",
            isFixed ? "w-full max-w-[540px] md:min-w-[400px]" : "w-full md:max-w-[540px]"
        )}>
            <SearchIcon className={iconClass} />
            <Text asChild variant="subtitle-1" className="font-normal">
                <input
                    type="text"
                    placeholder="Buscar nombres..."
                    className={inputClass}
                    onChange={onHandleInputChange}
                    value={searchInputValue}
                />
            </Text>
        </div>
    )
}

export default SearchInput