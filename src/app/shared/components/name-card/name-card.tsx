import React from "react";
import type { NameGender } from "@src/features/names/types/names-type";
import { cn } from "@src/lib/cn";
import NameCardHearth from "./name-card-hearth";
import { Text } from "../text/text";
import type { TagVariant } from "../tag/Tag.config";
import Tag from "../tag/Tag";

const GENDER_LABEL: Record<NameGender, string> = {
	boy: "Masculino",
	girl: "Femenino",
	unisex: "Neutro",
	neutral: "Neutro",
};

const GENDER_DICTIONARY: Record<NameGender, TagVariant> = {
	boy: 'gender-male',
	girl: 'gender-female',
	unisex: 'gender-unisex',
	neutral: 'gender-unisex',
};

const MAX_USAGE_SCORE = 603004;

function scoreToDots(score: number): number {
	// Logarithmic scale: score 603004 → 5 dots, score 20 → 1 dot
	const normalized = Math.log(score) / Math.log(MAX_USAGE_SCORE);
	return Math.max(1, Math.round(normalized * 4) + 1);
}

interface NameCardProps {
	name: string;
	nameId: string;
	gender?: NameGender;
	origin?: string[];
	usageScore?: number;
	isFavorited?: boolean;
	onToggleFavorite?: (nameId: string, name?: string) => Promise<void>;
	onClick?: () => void;
}

const NameCard = ({
	name,
	nameId,
	gender,
	origin,
	usageScore,
	isFavorited = false,
	onToggleFavorite,
	onClick,
}: NameCardProps) => {
	const [isLoading, setIsLoading] = React.useState(false);

	const handleFavoriteClick = async (e: React.MouseEvent) => {
		e.stopPropagation();
		if (onToggleFavorite && !isLoading) {
			setIsLoading(true);
			try {
				await onToggleFavorite(nameId, name);
			} catch (error) {
				console.error("Failed to toggle favorite:", error);
			} finally {
				setIsLoading(false);
			}
		}
	};

	const boxClass = cn(
		"relative",
		"rounded-lg bg-white",
		onClick ? "hover:shadow-md" : "cursor-default"
	);

	console.log('gender', gender, 'origin', origin, 'usageScore', usageScore)

	return (
		<div
			className={boxClass}
			onClick={onClick}
		>
			<div className="absolute top-5.5 right-5 text-xl leading-none">
				<NameCardHearth
					isFavorited={isFavorited}
					isLoading={isLoading}
					onToggleFavorite={onToggleFavorite}
					nameId={nameId}
					name={name}
					onHandleFavoriteClick={handleFavoriteClick}
				/>
			</div>
			<div className="border rounded-tl-lg rounded-tr-lg p-5 pb-4 flex flex-col gap-1 border-neutral-200">
				<div>
					<Text variant="h2" className="font-heading text-xl lowercase first-letter:uppercase inline-block">
						{name}
					</Text>
				</div>
				<div className="flex gap-2 text-xs text-gray-500">
					{gender && gender !== null && <Tag variant={GENDER_DICTIONARY[gender]}>{GENDER_LABEL[gender]}</Tag>}
					{!!gender && Array.isArray(origin) && origin.length > 0 && <span>·</span>}
					{Array.isArray(origin) && origin.length > 0 && <span>{origin.join(', ')}</span>}
				</div>
			</div>

			{usageScore != null && (
				<div className="flex flex-col gap-0.5 border border-t-0 rounded-bl-lg rounded-br-lg p-4 border-neutral-200">
					<span className="text-xs text-gray-400">Personas registradas</span>
					<div
						className="flex items-center gap-1.5"
						aria-label={`Popularidad: ${scoreToDots(usageScore)} de 5`}
					>
						<div className="flex gap-1">
							{Array.from({ length: 5 }, (_, i) => (
								<span
									key={i}
									className={cn(
										"h-2 w-2 rounded-full",
										i < scoreToDots(usageScore) ? "bg-gray-700" : "bg-gray-200",
									)}
								/>
							))}
						</div>
						<span className="text-xs text-gray-400">
							({usageScore.toLocaleString("es-ES")})
						</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default NameCard;
