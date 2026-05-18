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
        "bg-canvas-primary leading-5 pl-12 pt-4 w-full pb-3.5 border-stroke-default rounded-md border outline-none focus:ring-2 focus:ring-accent-primary/25 disabled:cursor-not-allowed disabled:opacity-50",
        { "py-0 h-10": isFixed }
    )

    return (
        <div className="relative inline-block max-w-[540px] w-full">
            <SearchIcon className="size-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-fg-tertiary" />
            <Text asChild variant="subtitle-1" className="font-normal">
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    className={inputClass}
                    onChange={onHandleInputChange}
                    value={searchInputValue}
                />
            </Text>
        </div>
    )
}

export default SearchInput