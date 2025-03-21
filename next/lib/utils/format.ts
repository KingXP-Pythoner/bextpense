export const formatCurrency = (value: number, options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }) => {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: options?.minimumFractionDigits ?? 0,
        maximumFractionDigits: options?.maximumFractionDigits ?? 0
    }).format(value);
};

export const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
        signDisplay: 'always'
    }).format(value / 100);
}; 

export function createTooltipUI(this: any) {
    const points = this.points || [];
    if (!points.length) return '';
    
    return `
        <div style="padding: 8px;">
            <div style="color: var(--color-muted-foreground); font-size: 13px; margin-bottom: 8px;">
                ${points[0].key}
            </div>
            ${points.map((point: Highcharts.Point) => `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 8px; height: 8px; background: ${point.color}; border-radius: 2px;"></div>
                    <span style="color: var(--color-foreground); font-size: 13px;">${point.series.name}</span>
                    <span style="color: var(--color-foreground); font-size: 13px; font-weight: 500;">
                        ${formatCurrency(Math.abs(point.y || 0))}
                    </span>
                </div>
            `).join('')}
        </div>
    `;
}

export function toSentenceCase(str: string) {
	return str
		.replace(/_/g, " ")
		.replace(/([A-Z])/g, " $1")
		.toLowerCase()
		.replace(/^\w/, (c) => c.toUpperCase())
		.replace(/\s+/g, " ")
		.trim()
}
