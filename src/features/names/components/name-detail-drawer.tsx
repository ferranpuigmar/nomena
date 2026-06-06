import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";
import React from "react";
import type { Name } from "../types/names-type";
import { cn } from "@src/lib/cn";
import { Button } from "@src/app/shared/components/button/button";
import ArrowLeftIcon from "@src/assets/icons/arrow-left.svg?react";
import ArrowRightIcon from "@src/assets/icons/arrow-right.svg?react";
import CloseIcon from "@src/assets/icons/x.svg?react";
import Tag from "@src/app/shared/components/tag/tag";
import { GENDER_DICTIONARY, GENDER_LABEL } from "@src/app/shared/constants/names";
import { useIsMobile } from "@src/app/shared/hooks/useMobile";

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
	const isMobile = useIsMobile();

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
				className="fixed inset-0 bg-black/30 transition-[opacity] duration-300 ease-in-out data-closed:opacity-0"
			/>

			{/* Drawer panel */}
			<div className="fixed inset-0 overflow-hidden">
				<div className="absolute inset-0 overflow-hidden">
					<div className={cn(
						"pointer-events-none fixed flex max-w-full",
						isMobile ? "inset-x-0 bottom-0 items-end" : "inset-y-0 right-0 pl-10"
					)}>
						<DialogPanel
							transition
							className={cn(
								"pointer-events-auto w-screen transition-[translate] duration-300 ease-in-out flex flex-col",
								isMobile 
									? "max-h-[90vh] rounded-t-2xl data-closed:translate-y-full" 
									: "h-full max-w-md data-closed:translate-x-full"
							)}
						>
							{/* Inner container with proper flex */}
							<div className="flex h-full flex-col bg-white shadow-xl rounded-t-2xl overflow-hidden">
								{/* Header */}
								<div className="flex items-center justify-between px-6 py-4 gap-1 border-b border-neutral-200">
									<div className="flex items-center gap-2">
										<Button variant="rounded" onClick={onPrev} disabled={!onPrev}>
											<ArrowLeftIcon className="h-5 w-5" />
										</Button>
										<Button variant="rounded" onClick={onNext} disabled={!onNext}>
											<ArrowRightIcon className="h-5 w-5" />
										</Button>
									</div>
									<Button variant="rounded" onClick={onClose}>
										<CloseIcon className="h-5 w-5" />
									</Button>
								</div>

								{/* Content - Scrolleable */}
								{name && (
									<div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
										<DialogTitle className="text-4xl font-semibold text-neutral-900 lowercase first-letter:uppercase inline-block">
											{name?.name ?? ""}
										</DialogTitle>
										{/* Gender & Origin */}
										<div className="flex flex-wrap gap-3">
											{name.gender && (
												<Tag variant={GENDER_DICTIONARY[name.gender]}>{GENDER_LABEL[name.gender]}</Tag>
											)}
											{name.origin && name.origin.length > 0 && name.origin.map((o, i) => (
												<span key={i} className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700">
													{o}
												</span>
											))}
										</div>

										{/* Meaning */}
										{name.meaning && (
											<div>
												<h3 className="text-sm font-medium text-neutral-500 mb-1">
													Significado
												</h3>
												<p className="text-sm text-neutral-900">{name.meaning}</p>
											</div>
										)}

										{/* Usage score */}
										{name.usageScore != null && (
											<div>
												<h3 className="text-sm font-medium text-neutral-500 mb-2">
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
																		? "bg-neutral-700"
																		: "bg-neutral-200",
																)}
															/>
														))}
													</div>
													<span className="text-sm text-neutral-500">
														{name.usageScore.toLocaleString("es-ES")}
													</span>
												</div>
											</div>
										)}

										{/* Spain usage rank */}
										{name.spainUsageRank != null && (
											<div>
												<h3 className="text-sm font-medium text-neutral-500 mb-1">
													Ranking en España
												</h3>
												<p className="text-sm text-neutral-900">
													#{name.spainUsageRank}
												</p>
											</div>
										)}

										{/* Length */}
										<div>
											<h3 className="text-sm font-medium text-neutral-500 mb-1">
												Longitud
											</h3>
											<p className="text-sm text-neutral-900">
												{name.length} letras ·{" "}
												{name.lengthCategory === "short" ? "Corto" : "Largo"}
											</p>
										</div>
									</div>
								)}

								{/* Footer - Botón sticky */}
								{onToggleFavorite && name && (
									<div className="border-t border-neutral-200 p-4 bg-white">
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
						</DialogPanel>
					</div>
				</div>
			</div>
		</Dialog>
	);
}
