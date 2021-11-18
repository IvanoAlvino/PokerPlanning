import {Component, Input} from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from "chart.js";
import {Label} from "ng2-charts";
import {ChartConfiguration} from "./domain/ChartConfiguration";
import {RoomStatus, UserEstimate} from "../services/room/domain/RoomStatus";

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
	private _estimateValues: Set<String>;

	private _fun: boolean;

	@Input()
	public set roomStatus(value: RoomStatus)
	{
		this._estimates = value ? value.estimates : [];
		this._estimateValues = new Set(this._estimates.map((e) => e.estimate));
		this._fun = value ? value.fun: false;
		this.displayEstimatesResult();
	}

	public get estimates(): UserEstimate[]
	{
		return this._estimates;
	}

	public get allEqual(): boolean
	{
		return  this._fun && this._estimates.length > 1 && this._estimateValues.size === 1;
	}

	public get noneEqual(): boolean
	{
		return this._fun  && this._estimateValues.size === this._estimates.length  && this._estimates.length > 1;
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
	 * The precision used to round the {@link averageEstimate}.
	 * A value of 0.1 means the average will be rounded to decimals e.g. 7.1
	 * A value of 0.01 means the average will be rounded to cents e.g. 7.13
	 */
	private ROUNDING_PRECISION: number = 0.1;

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
			estimatesSum += parseFloat(result.estimate);

			// Update data that will be displayed in the chart
			uniqueEstimates.add(result.estimate.toString());
			this.incrementOccurrenceForEstimate(estimatesOccurrences, result.estimate);
		});

		this.calculateAverageEstimate(estimatesSum, totalEstimates);
		this.calculateEstimatesChartData(uniqueEstimates, estimatesOccurrences);
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
			.map((estimate) => parseFloat(estimate))
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
	private incrementOccurrenceForEstimate(estimatesOccurrences: Map<string, number>, estimate: string): void
	{
		let voteOccurrences = estimatesOccurrences.get(estimate.toString());
		if (!voteOccurrences)
		{
			estimatesOccurrences.set(estimate, 1);
		}
		else
		{
			estimatesOccurrences.set(estimate, voteOccurrences + 1);
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

	// TODO add confetti when everybody votes with the same vote (https://jsfiddle.net/dtrooper/AceJJ/)
}
