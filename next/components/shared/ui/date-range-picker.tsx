"use client"
import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { parseAsTimestamp, useQueryState, useQueryStates } from "nuqs"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/shared/ui/button"
import { Calendar } from "@/components/shared/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shared/ui/popover"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc)
dayjs.extend(timezone)

const datePresets = [
	{
		label: "Today",
		getValue: () => ({
			from: dayjs.utc().startOf("day").toDate(),
			to: dayjs.utc().endOf("day").toDate(),
		}),
	},
	{
		label: "Yesterday",
		getValue: () => ({
			from: dayjs.utc().subtract(1, "day").startOf("day").toDate(),
			to: dayjs.utc().subtract(1, "day").endOf("day").toDate(),
		}),
	},
	{
		label: "Last 3 months",
		getValue: () => ({
			from: dayjs.utc().subtract(3, "month").startOf("day").toDate(),
			to: dayjs.utc().endOf("day").toDate(),
		}),
	},
	{
		label: "Last 6 months",
		getValue: () => ({
			from: dayjs.utc().subtract(6, "month").startOf("day").toDate(),
			to: dayjs.utc().endOf("day").toDate(),
		}),
	},
]

interface DateRangePickerProps extends React.ComponentPropsWithoutRef<typeof PopoverContent> {
	/**
	 * The selected date range.
	 * @default undefined
	 * @example { fromDate: number, toDate: number }
	 */
	defaultDateRange?: {
		fromDate: number
		toDate: number
	}

	/**
	 * The placeholder text of the calendar trigger button.
	 * @default "Pick a date"
	 * @type string | undefined
	 */
	placeholder?: string

	/**
	 * The variant of the calendar trigger button.
	 * @default "outline"
	 * @type "default" | "outline" | "secondary" | "ghost"
	 */
	triggerVariant?: Exclude<ButtonProps["variant"], "destructive" | "link">

	/**
	 * The size of the calendar trigger button.
	 * @default "default"
	 * @type "default" | "sm" | "lg"
	 */
	triggerSize?: Exclude<ButtonProps["size"], "icon">

	/**
	 * The class name of the calendar trigger button.
	 * @default undefined
	 * @type string
	 */
	triggerClassName?: string

	/**
	 * Controls whether query states are updated client-side only (default: true).
	 * Setting to `false` triggers a network request to update the querystring.
	 * @default true
	 */
	shallow?: boolean
}

export function DateRangePicker({
	defaultDateRange,
	placeholder = "Pick a date",
	triggerVariant = "outline",
	triggerSize = "default",
	triggerClassName,
	shallow = true,
	className,
	...props
}: DateRangePickerProps) {
	const [dateParams, setDateParams] = useQueryStates(
		{
			fromDate: parseAsTimestamp.withDefault(dayjs.utc(defaultDateRange?.fromDate).toDate()),
			toDate: parseAsTimestamp.withDefault(dayjs.utc(defaultDateRange?.toDate).toDate()),
		},
		{
			clearOnDefault: true,
			shallow,
		}
	)
	const [featureFlags] = useQueryState("flags")
	const date = React.useMemo(() => {
		function parseDate(timestamp: number | null) {
			if (!timestamp) return undefined
			const parsedDate = dayjs.utc(timestamp)
			return isNaN(parsedDate.toDate().valueOf()) ? undefined : parsedDate.toDate()
		}

		return {
			from: parseDate(dayjs.utc(dateParams.fromDate).toDate().valueOf()) ?? dayjs.utc(defaultDateRange?.fromDate).toDate(),
			to: parseDate(dayjs.utc(dateParams.toDate).toDate().valueOf()) ?? dayjs.utc(defaultDateRange?.toDate).toDate(),
		}
	}, [dateParams, defaultDateRange])

	const handleReset = () => {
		setDateParams({
			fromDate: dayjs.utc(defaultDateRange?.fromDate).toDate(),
			toDate: dayjs.utc(defaultDateRange?.toDate).toDate(),
		})
	}

	const handlePresetChange = (preset: (typeof datePresets)[number]) => {
		const { from, to } = preset.getValue()
		setDateParams({ 
			fromDate: from, 
			toDate: to 
		})
	}

	const handleCalendarSelect = (range: DateRange | undefined) => {
		setDateParams({
			fromDate: range?.from ? dayjs.utc(range.from).toDate() : dateParams.fromDate,
			toDate: range?.to ? dayjs.utc(range.to).toDate() : dateParams.toDate,
		})
	}

	return (
		<div className="grid gap-2">
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant={triggerVariant}
						size={triggerSize}
						className={cn(
							"w-full justify-center gap-2 truncate text-left text-xs items-center font-normal",
							!date && "text-muted-foreground",
							triggerClassName	
						)}
						disabled={!!featureFlags && featureFlags.includes("builder_table")}
					>
						<CalendarIcon className="size-3.5" />
						<span>
							{date?.from ? (
								date.to ? (
									<>
										{dayjs.utc(date.from).format("MMM DD, YYYY")} - {dayjs.utc(date.to).format("MMM DD, YYYY")}
									</>
								) : (
									dayjs.utc(date.from).format("MMM DD, YYYY")
								)
							) : (
								<span>{placeholder}</span>
							)}
						</span>
					</Button>
				</PopoverTrigger>
				<PopoverContent className={cn("w-auto p-0", className)} {...props}>
					<div className="flex">
						<div className="flex flex-col p-2 border-r">
							{datePresets.map((preset) => (
								<Button
									key={preset.label}
									variant="ghost"
									size="sm"
									className="justify-start"
									onClick={() => handlePresetChange(preset)}
								>
									{preset.label}
								</Button>
							))}
							<Button variant="ghost" size="sm" className="justify-start" onClick={handleReset}>
								Reset
							</Button>
						</div>
						<div>
							<Calendar
								initialFocus
								mode="range"
								defaultMonth={date?.from ? dayjs.utc(date.from).toDate() : undefined}
								selected={date}
								onSelect={handleCalendarSelect}
								numberOfMonths={2}
							/>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	)
}
