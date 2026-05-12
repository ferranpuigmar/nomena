import { Text } from "@src/app/shared/components/text/text";
import SearchIcon from "@src/assets/icons/search.svg?react"

interface SearchInputProps {
    onHandleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    searchInputValue: string;
}

const SearchInput = ({ onHandleInputChange, searchInputValue }: SearchInputProps) => {
    return (
        <div className="relative inline-block max-w-[540px] w-full mt-2 mb-3">
            <SearchIcon className="size-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-fg-tertiary" />
            <Text asChild variant="subtitle-1" className="font-normal">
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    className="bg-canvas-primary leading-5 pl-12 pt-4 w-full pb-3.5 border-stroke-default rounded-md border outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    onChange={onHandleInputChange}
                    value={searchInputValue}
                />
            </Text>
        </div>
    )
}

export default SearchInput