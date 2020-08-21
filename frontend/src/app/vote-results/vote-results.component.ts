import {ChangeDetectorRef, Component, Input, ViewChild} from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from "chart.js";
import {BaseChartDirective, Label, ThemeService} from "ng2-charts";
import {ChartConfiguration} from "./domain/ChartConfiguration";
import {UserEstimate} from "../services/room/domain/RoomStatus";

@Component({
	selector: 'vote-results',
	templateUrl: './vote-results.component.html',
	styleUrls: ['./vote-results.component.scss']
})
export class VoteResultsComponent
{
	/**
	 * The list of estimates for all users.
	 */
	private _estimates: UserEstimate[];

	@Input()
	public set estimates(value: UserEstimate[])
	{
		this._estimates = value;
		this.displayEstimatesResult();
	}

	public get estimates(): UserEstimate[]
	{
		return this._estimates;
	}

	/**
	 * The type of chart to display.
	 */
	public chartType: ChartType = ChartConfiguration.CHART_TYPE_BAR;

	/**
	 * The chart options.
	 */
	public chartOptions: ChartOptions = ChartConfiguration.CHART_OPTIONS;

	/**
	 * The labels to use for the x-axis in the chart.
	 */
	public chartXAxisLabels: Label[] = [];

	/**
	 * The estimates data used to plot in the chart.
	 */
	public chartEstimateData: ChartDataSets[] = [];

	/**
	 * The average estimate.
	 */
	public averageEstimate: number;

	/**
	 * Reference to the chart object, useful to call methods on it.
	 */
	@ViewChild('myChart')
	public myChart: BaseChartDirective;

	/**
	 * The precision used to round the {@link averageEstimate}.
	 * A value of 0.1 means the average will be rounded to decimals e.g. 7.1
	 * A value of 0.01 means the average will be rounded to cents e.g. 7.13
	 */
	private ROUNDING_PRECISION: number = 0.1;

	/**
	 * Integer number that represents the extra buffer that will appear in the chart on the y axis
	 * on top of the maximum value already present in the graph.
	 * This will avoid the graph representing e.g. a max value of 5 on the y axis where the chart
	 * itself has a scale up to 5, which looks a bit bad in terms of UI
	 */
	private readonly Y_SCALE_MAX_OVERHEAD = 2;

	/**
	 * Calculate the chart data and the {@link averageEstimate} so to display this information
	 * as a result.
	 */
	private displayEstimatesResult(): void
	{
		// Variables used to build estimates chart data
		const uniqueEstimates: Set<string> = new Set<string>();
		const estimatesOccurrences: Map<string, number> = new Map<string, number>();

		// Variables to calculate estimates average
		let estimatesSum: number = 0;
		let totalEstimates: number = 0;

		this.estimates.forEach((result) =>
		{
			// if user has not voted, or voted with '?', jump to next estimate
			if (!result.voted || !result.estimate || result.estimate === "?")
			{
				return;
			}

			// Update data used for average estimate calculation
			totalEstimates++;
			estimatesSum += parseInt(result.estimate);

			// Update data that will be displayed in the chart
			uniqueEstimates.add(result.estimate.toString());
			this.incrementOccurrenceForEstimate(estimatesOccurrences, +result.estimate);
		});

		this.calculateAverageEstimate(estimatesSum, totalEstimates);
		this.calculateEstimatesChartData(uniqueEstimates, estimatesOccurrences);
		this.setCorrectYMaxScale(estimatesOccurrences);
	}

	/**
	 * Builds the labels to display on the x-axis based on all unique estimates ordered asc, and
	 * build all occurrences on the y-axis per unique estimate value.
	 * @param uniqueEstimates The unordered list of unique estimates. WIll be ordered in this method
	 * @param estimatesOccurrences The map of occurrences per each estimate value
	 */
	private calculateEstimatesChartData(uniqueEstimates: Set<string>,
		estimatesOccurrences: Map<string, number>): void
	{
		let sortedUniqueEstimates = [...uniqueEstimates]
			.map((estimate) => parseInt(estimate))
			.sort((first, second) => first - second)
			.map((estimate) => estimate.toString());
		this.chartXAxisLabels = sortedUniqueEstimates;
		this.chartEstimateData = [{
			data: this.getOccurrencesForEstimates(estimatesOccurrences, sortedUniqueEstimates),
			backgroundColor: ChartConfiguration.CHART_COLORS,
			hoverBackgroundColor: ChartConfiguration.CHART_COLORS,
			borderColor: ChartConfiguration.CHART_BORDER_COLORS,
			borderWidth: 1,
			barThickness: "flex",
			label: "Number of votes"
		}];
	}

	/**
	 * Calculate the average estimate, with decimal precision.
	 * @param estimatesSum The total sum of all estimates
	 * @param totalEstimates The
	 */
	private calculateAverageEstimate(estimatesSum: number, totalEstimates: number)
	{
		let precisionFactor = 1 / this.ROUNDING_PRECISION;
		let averageEstimate = estimatesSum / totalEstimates;

		if (estimatesSum == 0 || totalEstimates == 0)
		{
			this.averageEstimate = 0;
			return;
		}
		this.averageEstimate = Math.round(averageEstimate * precisionFactor) / precisionFactor;
	}

	/**
	 * Increment the number of occurrences for the given estimate.
	 * @param estimatesOccurrences The map used to track the number of occurrences of each estimate
	 * @param estimate The estimate for which to increment the occurrence
	 */
	private incrementOccurrenceForEstimate(estimatesOccurrences: Map<string, number>,
		estimate: number): void
	{
		let voteOccurrences = estimatesOccurrences.get(estimate.toString());
		if (!voteOccurrences)
		{
			estimatesOccurrences.set(estimate.toString(), 1);
		}
		else
		{
			estimatesOccurrences.set(estimate.toString(), voteOccurrences + 1);
		}
	}

	/**
	 * Get a list of occurrences per each estimate value present in the given uniqueEstimates array.
	 * @param estimatesOccurrences The map used to track the number of occurrences of each estimate
	 * @param uniqueEstimates The list of unique estimates
	 */
	private getOccurrencesForEstimates(estimatesOccurrences: Map<string, number>,
		uniqueEstimates: string[]): number[]
	{
		return uniqueEstimates.map((estimate) => estimatesOccurrences.get(estimate));
	}

	/**
	 * Set the maximum value of the Y scale, based on the maximum value that should be represented
	 * plus a small buffer determined by {@link Y_SCALE_MAX_OVERHEAD}
	 * @param estimatesOccurrences The estimates occurrence array needed to determenine the max
	 * value on the y axis
	 */
	private setCorrectYMaxScale(estimatesOccurrences: Map<string, number>): void
	{
		let maxOccurrence = 0;
		for (const occurrence of estimatesOccurrences.values())
		{
			if (occurrence > maxOccurrence)
			{
				maxOccurrence = occurrence;
			}
		}

		this.updateYScaleMax(maxOccurrence);
	}

	/**
	 * Update the chart by replacing the part of the object and retriggering the chart update.
	 * @param maxOccurrence The maxOccurrence value used to determine the max y scale value
	 */
	private updateYScaleMax(maxOccurrence: number): void
	{
		let chartOptionsClone = JSON.parse(JSON.stringify(this.chartOptions));
		// Assign the new y scale max value
		chartOptionsClone.scales.yAxes[0].ticks.max = maxOccurrence + this.Y_SCALE_MAX_OVERHEAD;
		// Reassign the callback that was not cloned (functions are not cloned)
		chartOptionsClone.scales.yAxes[0].ticks.callback =
			(value: number) => value % 1 === 0 ? value : undefined;

		this.chartOptions = chartOptionsClone;
		this.myChart.update();
	}
}
