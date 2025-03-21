import { createTooltipUI } from "@/lib/utils/format";

export const HIGHCHART_DEFAULT_OPTIONS: Highcharts.Options = {
	chart: {
		type: "column",
		backgroundColor: "transparent",
		className: "bg-background w-full",
		spacingBottom: 20,
		marginBottom: 60,
		marginLeft: 80,
		marginRight: 20,
		style: {
			fontFamily: "var(--font-sans)",
		},
	},
	navigation: {
		buttonOptions: {
			enabled: false,
		},
	},
	title: {
		text: undefined,
	},
	xAxis: {
	
		lineColor: "var(--color-border)",
		labels: {
			formatter: function (): string {
				return this.pos === 0 || this.pos === 11 ? String(this.value) : "";
			},
			style: {
				color: "var(--color-muted-foreground)",
				textOverflow: 'none',
				whiteSpace: 'nowrap'
			},
			rotation: 0,
			overflow: 'allow'
		},
	},
	yAxis: {
		title: {
			text: undefined,
		},
		labels: {
			formatter: function () {
				return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format((this.value as number) / 1);
			},
			style: {
				color: "var(--color-muted-foreground)",
			},
		},
		gridLineColor: "var(--color-border)",
		gridLineDashStyle: "Dot",
	},
	plotOptions: {
		column: {
			borderWidth: 0,
			color: "var(--color-primary)",
			grouping: false,
		},
	},
	legend: {
		enabled: false,
	},
	credits: {
		enabled: false,
	},
	tooltip: {
        shared: true,
        useHTML: true,
        formatter: createTooltipUI,
		backgroundColor: "var(--color-popover)",
		borderColor: "var(--color-border)",
		style: {
			color: "var(--color-popover-foreground)",
		},
		
	},
};