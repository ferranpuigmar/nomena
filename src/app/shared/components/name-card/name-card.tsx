import React from "react";
import type { NameGender } from "@src/features/names/types/names-type";
import { cn } from "@src/lib/cn";
import NameCardHearth from "./name-card-hearth";
import { Text } from "../text/text";
import Tag from "@src/app/shared/components/tag/tag";
import { GENDER_DICTIONARY, GENDER_LABEL, MAX_USAGE_SCORE } from "../../constants/names";

const usageQuantityFormat = (score: number) => {
	if (score >= 1000) {
		return `${(score / 1000).toFixed(1)}K`;
	}
	return score.toString();
}

function useageToString(score: number): string {
	const usageDictionary: Record<number, string> = {
		1: "Poco Usado",
		2: "Usado",
		3: "Muy usado"
	}

	const normalized = Math.log(score) / Math.log(MAX_USAGE_SCORE);
	return usageDictionary[Math.max(1, Math.round(normalized * 2) + 1)];
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
		"cursor-pointer transition-shadow transition-transform duration-200",
		"rounded-lg bg-white transform hover:-translate-y-0.5",
		onClick ? "hover:shadow-md" : "cursor-default"
	);

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
			</div>

			{usageScore != null && (
				<div className="flex justify-between border border-t-0 rounded-bl-lg rounded-br-lg p-4 py-3 border-neutral-200">
					{gender && (
						<div className="flex gap-2 text-xs text-gray-500">
							<Tag variant={GENDER_DICTIONARY[gender]}>{GENDER_LABEL[gender]}</Tag>
						</div>
					)}
					{usageScore && (
						<div className="flex gap-2 text-xs text-gray-500">
							<Tag variant="gray">
								{useageToString(usageScore)}
								<span className="mx-1 inline-block rounded-full w-0.5 h-0.5 bg-neutral-700"></span>
								{usageQuantityFormat(usageScore)}
							</Tag>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default NameCard;
