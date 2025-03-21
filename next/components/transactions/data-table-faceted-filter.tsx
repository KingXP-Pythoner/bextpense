import type { Option } from "@/lib/types/data-table";
import type { Column } from "@tanstack/react-table";
import { Check, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/shared/ui/badge";
import { Button } from "@/components/shared/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/shared/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/shared/ui/popover";
import { Separator } from "@/components/shared/ui/separator";

interface DataTableFacetedFilterProps<TData, TValue> {
	column?: Column<TData, TValue>;
	title?: string;
	options: Option[];
	localSelectedValues: Set<string>;
	setLocalSelectedValues: (values: Set<string>) => void;
}

export function DataTableFacetedFilter<TData, TValue>({
	title,
	options,
	localSelectedValues,
	setLocalSelectedValues,
}: DataTableFacetedFilterProps<TData, TValue>) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm" className="h-8 border-dashed">
					<PlusCircle className="mr-2 size-3.5" />
					{title}

					<div className="w-[34px] flex items-center">
						<Separator orientation="vertical" className="mx-2 h-4" />
						<Badge
							variant="secondary"
							className="rounded-sm px-1 font-normal lg:hidden"
						>
							{localSelectedValues.size}
						</Badge>
						<div className="hidden space-x-1 lg:flex">
							<Badge
								variant="secondary"
								className="rounded-sm px-1.5 aspect-square shrink-0 font-normal"
							>
								{localSelectedValues.size}
							</Badge>
						</div>
					</div>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[12.5rem] p-0" align="start">
				<Command>
					<CommandInput placeholder={title} />
					<CommandList className="max-h-full">
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup className="max-h-[18.75rem] overflow-y-auto overflow-x-hidden">
							{options.map((option) => {
								return (
									<CommandItem
										key={option.value}
										onSelect={() => {
											const isSelected = localSelectedValues.has(option.value);
											const next = new Set(localSelectedValues);
											if (isSelected) {
												next.delete(option.value);
											} else {
												next.add(option.value);
											}
											setLocalSelectedValues(next);
											// Update URL state in background
										}}
									>
										<div
											className={cn(
												"mr-2 flex size-3.5 items-center justify-center rounded-sm border border-primary",
												localSelectedValues.has(option.value)
													? "bg-primary text-primary-foreground"
													: "opacity-50 [&_svg]:invisible",
											)}
										>
											<Check className="size-3.5" aria-hidden="true" />
										</div>
										{option.icon && (
											<option.icon
												className="mr-2 size-3.5 text-muted-foreground"
												aria-hidden="true"
											/>
										)}
										<span>{option.label}</span>
										{option.count && (
											<span className="ml-auto flex size-3.5 items-center justify-center font-mono text-xs">
												{option.count}
											</span>
										)}
									</CommandItem>
								);
							})}
						</CommandGroup>
						{localSelectedValues.size > 0 && (
							<>
								<CommandSeparator />
								<CommandGroup>
									<CommandItem
										onSelect={() => {
											setLocalSelectedValues(new Set([]));
										}}
										className="justify-center text-center"
									>
										Clear filters
									</CommandItem>
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
