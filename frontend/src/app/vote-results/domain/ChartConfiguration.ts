import {ChartOptions, ChartType} from "chart.js";

/**
 * Holds the configuration for the chart used to represent the estimates results.
 */
export class ChartConfiguration
{
	/**
	 * The colors for the chart bars. First bar will have CHART_COLORS[0] color, and then any
	 * following bar will increase the index and use that color.
	 */
	public static CHART_COLORS: string[] = [
    '#96ceb4',
    '#ffeead',
    '#ff6f69',
    '#ffcc5c',
    '#88d8b0'
	];

	/**
	 * The colors for the border of the chart's bars. First bar will have CHART_BORDER_COLORS[0]
	 * color, and then any following bar will increase the index and use that color.
	 */
	public static CHART_BORDER_COLORS: string[] = [
    '#96ceb4',
    '#ffeead',
    '#ff6f69',
    '#ffcc5c',
    '#88d8b0'
	];

	/**
	 * The type of chart to display the estimates.
	 */
	public static CHART_TYPE_BAR: ChartType = 'bar';

	/**
	 * The configuration object for the estimates chart.
	 */
	public static ESTIMATES_CHART_OPTIONS: ChartOptions = {
		animation: {
			duration: 0
		},
		responsive: true,
		scales: {
			xAxes: [{
				ticks: {
					beginAtZero: true,
					fontSize: 24
				},
        gridLines: {
          display: false,
        },
			}],
			yAxes: [{
				ticks: {
					beginAtZero: true,
					// return the value to display only if integer
					callback: (value: number) => value % 1 === 0 ? value : undefined
				},
        gridLines: {
          display: false
        }
			}]
		},
		plugins: {
			datalabels: {
				anchor: 'end',
				align: 'end',
			}
		}
	};
}
