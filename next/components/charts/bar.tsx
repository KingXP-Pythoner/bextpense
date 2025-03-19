'use client'
import Highcharts from 'highcharts'
import 'highcharts/modules/exporting'
import HighchartsReact from 'highcharts-react-official'


export const defaultOptions: Highcharts.Options = {
    chart: {
        type: 'column',
        backgroundColor: '#000000',
        style: {
            fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, sans-serif'
        }
    },
    title: {
        text: undefined
    },
    xAxis: {
        categories: [
            'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 
            'Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025',
            'Nov 2025', 'Dec 2025'
        ],
        lineColor: '#333333',
        labels: {
            style: {
                color: '#999999'
            }
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
                color: '#999999'
            }
        },
        gridLineColor: '#333333',
        gridLineDashStyle: 'Dot'
    },
    plotOptions: {
        column: {
            borderWidth: 0,
            color: '#A855F7',
            grouping: false
        }
    },
    series: [{
        type: 'column',
        name: 'Background',
        data: [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5],
        color: '#333333'
    }, {
        type: 'column',
        name: 'Value',
        data: [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5],
        color: '#A855F7'
    }],
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    tooltip: {
        shared: true,
        backgroundColor: '#1a1a1a',
        borderColor: '#333333',
        style: {
            color: '#ffffff'
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