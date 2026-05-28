import type { NameGender } from "@src/features/names/types/names-type";
import type { TagVariant } from "../components/tag/tag.config";

export const GENDER_LABEL: Record<NameGender, string> = {
	boy: "Masculino",
	girl: "Femenino",
	unisex: "Neutro",
	neutral: "Neutro",
};

export const GENDER_DICTIONARY: Record<NameGender, TagVariant> = {
	boy: 'gender-male',
	girl: 'gender-female',
	unisex: 'gender-unisex',
	neutral: 'gender-unisex',
};

export const MAX_USAGE_SCORE = 603004;