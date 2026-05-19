import { cn } from "@src/lib/cn";
import HeartIcon from "@src/assets/icons/heart.svg?react";

interface NameCardHearthProps {
    isFavorited: boolean;
    isLoading: boolean;
    onToggleFavorite?: (nameId: string, name?: string) => Promise<void>;
    nameId: string;
    name: string;
    onHandleFavoriteClick: (e: React.MouseEvent) => void;
}

const NameCardHearth = ({ isFavorited, isLoading, onToggleFavorite, onHandleFavoriteClick }: NameCardHearthProps) => {

    if (!onToggleFavorite) {
        return null
    }

    return (

        <button
            onClick={onHandleFavoriteClick}
            disabled={isLoading}
            className={cn(
                "transition-opacity cursor-pointer",
                isFavorited ? "text-red-500" : "text-gray-300 hover:text-red-400",
            )}
            aria-label={
                isFavorited ? "Quitar de favoritos" : "Añadir a favoritos"
            }
        >
            <HeartIcon className="w-5 h-5" />
        </button>

    )
}

export default NameCardHearth