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
		'rgba(255, 99, 132, 0.2)',
		'rgba(54, 162, 235, 0.2)',
		'rgba(255, 206, 86, 0.2)',
		'rgba(75, 192, 192, 0.2)',
		'rgba(153, 102, 255, 0.2)',
		'rgba(255, 159, 64, 0.2)'
	];

	/**
	 * The colors for the border of the chart's bars. First bar will have CHART_BORDER_COLORS[0]
	 * color, and then any following bar will increase the index and use that color.
	 */
	public static CHART_BORDER_COLORS: string[] = [
		'rgba(255, 99, 132, 1)',
		'rgba(54, 162, 235, 1)',
		'rgba(255, 206, 86, 1)',
		'rgba(75, 192, 192, 1)',
		'rgba(153, 102, 255, 1)',
		'rgba(255, 159, 64, 1)'
	];

	/**
	 * The type of chart to display.
	 */
	public static CHART_TYPE_BAR: ChartType = 'bar';

	/**
	 * The configuration object for the entire chart.
	 */
	public static CHART_OPTIONS: ChartOptions = {
		responsive: true,
		scales: {
			xAxes: [{
				scaleLabel: {
					labelString: "Estimate",
					fontStyle: "italic",
					display: true,
					fontSize: 18,
				},
				ticks: {
					beginAtZero: true,
					fontSize: 24
				}
			}], yAxes: [{
				scaleLabel: {
					labelString: "Number of votes",
					fontStyle: "italic",
					display: true,
					fontSize: 18
				},
				ticks: {
					beginAtZero: true,
					// return the value to display only if integer
					callback: (value: number) => value % 1 === 0 ? value : undefined
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
