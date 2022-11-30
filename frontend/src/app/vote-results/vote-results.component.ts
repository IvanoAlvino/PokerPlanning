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
	private userEstimates: UserEstimate[];

	/**
   * Allow fireworks to be displayed in the event of maximum {@link unanimousAgreement}.
   */
  public allowFireworks: boolean;

  @Input()
  public set roomStatus(value: RoomStatus)
  {
    this.userEstimates = value ? value.estimates : [];
    this.allowFireworks = value ? value.allowFireworks: false;
    this.unanimousAgreement = this.isAgreementUnanimous();
    this.displayEstimatesResult();
  }

	/**
	 * The type of chart to display for the estimates.
	 */
	public estimatesChartType: ChartType = ChartConfiguration.CHART_TYPE_BAR;

	/**
	 * The estimates chart options.
	 */
	public estimatesChartOptions: ChartOptions = ChartConfiguration.ESTIMATES_CHART_OPTIONS;

	/**
	 * The labels to use for the x-axis in the chart for the estimates.
	 */
	public estimatesChartXAxisLabels: Label[] = [];

	/**
	 * The data used to plot in the chart for the estimates.
	 */
	public estimatesChartData: ChartDataSets[] = [];

	/**
	 * The average estimate.
	 */
	public averageEstimate: number;

  /**
   * Whether all users voted the same.
   */
  public unanimousAgreement: boolean;

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

		this.userEstimates.forEach((userEstimate) =>
		{
			if (!this.isValidNumericVote(userEstimate))
			{
				return;
			}

			// Update data used for average estimate calculation
			totalEstimates++;
			estimatesSum += parseFloat(userEstimate.estimate);

			// Update data that will be displayed in the chart
			uniqueEstimates.add(userEstimate.estimate.toString());
			this.incrementOccurrenceForEstimate(estimatesOccurrences, userEstimate.estimate);
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
		this.estimatesChartXAxisLabels = sortedUniqueEstimates;
		this.estimatesChartData = [{
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
	 * @param totalEstimates The number of estimates
	 */
	private calculateAverageEstimate(estimatesSum: number, totalEstimates: number)
	{
    if (estimatesSum == 0 || totalEstimates == 0)
    {
      this.averageEstimate = 0;
      return;
    }

		let precisionFactor = 1 / this.ROUNDING_PRECISION;
		let averageEstimate = estimatesSum / totalEstimates;
		this.averageEstimate = Math.round(averageEstimate * precisionFactor) / precisionFactor;
	}

  /**
   * Check if the given userEstimate is a valid, numeric vote.
   * If user has not voted, or voted with '?', this method will return false.
   * @param userEstimate The userEstimate to validate
   */
  private isValidNumericVote(userEstimate: UserEstimate): boolean {
    return userEstimate.voted && userEstimate.estimate && userEstimate.estimate !== "?";
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

  /**
   * Whether fireworks should be displayed.
   */
  public shouldDisplayFireworks(): boolean {
    return this.allowFireworks && this.unanimousAgreement;
  }

  private isAgreementUnanimous(): boolean {
    const numericEstimates = this.userEstimates
      .filter(userEstimate => this.isValidNumericVote(userEstimate));

    if (numericEstimates.length === 0) {
      return false;
    }

    let previousEstimate = undefined;
    for (const estimate of numericEstimates) {
      if (previousEstimate === undefined) {
        previousEstimate = parseFloat(estimate.estimate);
        continue;
      }

      // If current estimate is different then previous one, return false
      if (estimate !== previousEstimate) {
        return false;
      }
    }

    // All estimates are the same
    return true;
  }
}
