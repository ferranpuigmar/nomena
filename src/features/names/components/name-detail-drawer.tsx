import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";
import React from "react";
import type { Name, NameGender } from "../types/names-type";
import { cn } from "@src/lib/cn";
import { Button } from "@src/app/shared/components/button/button";

const GENDER_LABEL: Record<NameGender, string> = {
	boy: "Niño",
	girl: "Niña",
	unisex: "Neutro",
};

const MAX_USAGE_SCORE = 603004;

function scoreToDots(score: number): number {
	const normalized = Math.log(score) / Math.log(MAX_USAGE_SCORE);
	return Math.max(1, Math.round(normalized * 4) + 1);
}

interface NameDetailDrawerProps {
	name: Name | null;
	isOpen: boolean;
	onClose: () => void;
	onPrev?: () => void;
	onNext?: () => void;
	isFavorited?: boolean;
	onToggleFavorite?: (nameId: string, name?: string) => Promise<void>;
}

export function NameDetailDrawer({
	name,
	isOpen,
	onClose,
	onPrev,
	onNext,
	isFavorited = false,
	onToggleFavorite,
}: NameDetailDrawerProps) {
	const [isFavoriteLoading, setIsFavoriteLoading] = React.useState(false);

	const handleFavoriteClick = async () => {
		if (!name || !onToggleFavorite || isFavoriteLoading) {
			return;
		}

		setIsFavoriteLoading(true);
		try {
			await onToggleFavorite(name.id, name.name);
		} catch (error) {
			console.error("Failed to toggle favorite:", error);
		} finally {
			setIsFavoriteLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onClose={onClose} className="relative z-50">
			{/* Backdrop */}
			<DialogBackdrop
				transition
				className="fixed inset-0 bg-black/30 transition duration-300 ease-in-out data-closed:opacity-0"
			/>

			{/* Drawer panel */}
			<div className="fixed inset-0 overflow-hidden">
				<div className="absolute inset-0 overflow-hidden">
					<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
						<DialogPanel
							transition
							className="pointer-events-auto w-screen max-w-md transform transition duration-300 ease-in-out data-closed:translate-x-full"
						>
							<div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
								{/* Header */}
								<div className="flex items-center justify-between px-6 py-4 border-b">
									<DialogTitle className="text-lg font-semibold text-gray-900">
										{name?.name ?? ""}
									</DialogTitle>
									<div className="flex items-center gap-1">
										<button
											onClick={onPrev}
											disabled={!onPrev}
											className="rounded p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
											aria-label="Nombre anterior"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
													clipRule="evenodd"
												/>
											</svg>
										</button>
										<button
											onClick={onNext}
											disabled={!onNext}
											className="rounded p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
											aria-label="Nombre siguiente"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
													clipRule="evenodd"
												/>
											</svg>
										</button>
										<button
											onClick={onClose}
											className="rounded p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors ml-1"
											aria-label="Cerrar"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
													clipRule="evenodd"
												/>
											</svg>
										</button>
									</div>
								</div>

								{/* Content */}
								{name && (
									<div className="flex-1 px-6 py-6 space-y-6">
										{/* Gender & Origin */}
										<div className="flex flex-wrap gap-3">
											{name.gender && (
												<span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
													{GENDER_LABEL[name.gender]}
												</span>
											)}
											{name.origin && name.origin.length > 0 && name.origin.map((o, i) => (
												<span key={i} className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
													{o}
												</span>
											))}
										</div>

										{/* Meaning */}
										{name.meaning && (
											<div>
												<h3 className="text-sm font-medium text-gray-500 mb-1">
													Significado
												</h3>
												<p className="text-sm text-gray-900">{name.meaning}</p>
											</div>
										)}

										{/* Usage score */}
										{name.usageScore != null && (
											<div>
												<h3 className="text-sm font-medium text-gray-500 mb-2">
													Personas registradas
												</h3>
												<div className="flex items-center gap-2">
													<div className="flex gap-1">
														{Array.from({ length: 5 }, (_, i) => (
															<span
																key={i}
																className={cn(
																	"h-3 w-3 rounded-full",
																	i < scoreToDots(name.usageScore!)
																		? "bg-gray-700"
																		: "bg-gray-200",
																)}
															/>
														))}
													</div>
													<span className="text-sm text-gray-500">
														{name.usageScore.toLocaleString("es-ES")}
													</span>
												</div>
											</div>
										)}

										{/* Spain usage rank */}
										{name.spainUsageRank != null && (
											<div>
												<h3 className="text-sm font-medium text-gray-500 mb-1">
													Ranking en España
												</h3>
												<p className="text-sm text-gray-900">
													#{name.spainUsageRank}
												</p>
											</div>
										)}

										{/* Length */}
										<div>
											<h3 className="text-sm font-medium text-gray-500 mb-1">
												Longitud
											</h3>
											<p className="text-sm text-gray-900">
												{name.length} letras ·{" "}
												{name.lengthCategory === "short" ? "Corto" : "Largo"}
											</p>
										</div>

										{onToggleFavorite && (
											<div className="pt-2">
												<Button
													variant={isFavorited ? "danger" : "default"}
													onClick={handleFavoriteClick}
													disabled={isFavoriteLoading}
													className="w-full"
												>
													{isFavorited ? "Quitar de favoritos" : "Añadir a favoritos"}
												</Button>
											</div>
										)}
									</div>
								)}
							</div>
						</DialogPanel>
					</div>
				</div>
			</div>
		</Dialog>
	);
}
