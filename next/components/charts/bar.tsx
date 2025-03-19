'use client'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export const defaultOptions: Highcharts.Options = {
    chart: {
        type: 'column',
        backgroundColor: 'transparent',
        className: 'bg-background',
        spacingBottom: 20,
        marginBottom: 60,
        style: {
            fontFamily: 'var(--font-sans)'
        }
    },
    navigation: {
        buttonOptions: {
            enabled: false
        }
    },
    title: {
        text: undefined
    },
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 
            'Jun', 'Jul', 'Aug', 'Sep', 'Oct',
            'Nov', 'Dec'
        ],
        lineColor: 'var(--color-border)',
        labels: {
            formatter: function(): string {
                return this.pos === 0 || this.pos === 11 ? String(this.value) : '';
            },
            style: {
                color: 'var(--color-muted-foreground)'
            },
            rotation: 0,
            y: 20
        }
    },
    yAxis: {
        title: {
            text: undefined
        },
        labels: {
            formatter: function() {
                return '$' + (this.value as number / 1000000).toFixed(1) + 'M';
            },
            style: {
                color: 'var(--color-muted-foreground)'
            }
        },
        gridLineColor: 'var(--color-border)',
        gridLineDashStyle: 'Dot'
    },
    plotOptions: {
        column: {
            borderWidth: 0,
            color: 'var(--color-primary)',
            grouping: false
        }
    },
    series: [{
        type: 'column',
        name: 'Background',
        data: [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5],
        color: 'var(--color-muted)'
    }, {
        type: 'column',
        name: 'Value',
        data: [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5],
        color: 'var(--color-primary)'
    }],
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    tooltip: {
        shared: true,
        backgroundColor: 'var(--color-popover)',
        borderColor: 'var(--color-border)',
        style: {
            color: 'var(--color-popover-foreground)'
        },
        formatter: function(this: any) {
            if (!this.points) return '';
            return this.points.reduce((s: string, point: any) => {
                if (point.series.name === 'Value') {
                    return `<b>${point.key}</b><br/>$${point.y}M`;
                }
                return s;
            }, '');
        }
    }
}

type BarChartProps = {
    options: Highcharts.Options
}

const VerticalColumnBarChart = ({options}: BarChartProps) => {
    return (
        <HighchartsReact highcharts={Highcharts} options={options} />
    )
}

export {VerticalColumnBarChart}