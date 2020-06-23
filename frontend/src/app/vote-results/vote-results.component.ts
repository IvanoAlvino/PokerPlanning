import {Component, Input} from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from "chart.js";
import {Label} from "ng2-charts";

@Component({
	selector: 'vote-results',
	templateUrl: './vote-results.component.html',
	styleUrls: ['./vote-results.component.scss']
})
export class VoteResultsComponent
{

	private _results: UserVote[];

	@Input()
	public set results(value: UserVote[])
	{
		this._results = value;
		this.displayVotesResult();
	}

	public get results(): UserVote[]
	{
		return this._results;
	}

	public colors: string[] = ['rgba(255, 99, 132, 0.2)',
	                           'rgba(54, 162, 235, 0.2)',
	                           'rgba(255, 206, 86, 0.2)',
	                           'rgba(75, 192, 192, 0.2)',
	                           'rgba(153, 102, 255, 0.2)',
	                           'rgba(255, 159, 64, 0.2)'];

	public barChartType: ChartType = 'bar';

	public barChartOptions: ChartOptions = {
		responsive: true,
		scales: {
			xAxes: [{
				scaleLabel: {
					labelString: "Estimate",
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
    animation: {
      duration: 0
    },
		plugins: {
			datalabels: {
				anchor: 'end',
				align: 'end',
			}
		}
	};

	public barChartLabels: Label[] = [];

	public voteData: ChartDataSets[] = [];

	public averageVote: number;

	private displayVotesResult(): void
	{
		const resultsOccurrences: Map<string, number> = new Map<string, number>();
		const labels: Set<string> = new Set<string>();
		let sum: number = 0;
		let voteCounts: number = 0;

		this.results.forEach((result) =>
		{
			if (!result.voted)
			{
				return;
			}

			voteCounts++;
			sum += result.vote;
			labels.add(result.vote.toString());

			let voteOccurrences = resultsOccurrences.get(result.vote.toString());
			if (!voteOccurrences)
			{
				resultsOccurrences.set(result.vote.toString(), 1);
			}
			else
			{
				resultsOccurrences.set(result.vote.toString(), voteOccurrences + 1);
			}
		});

		this.averageVote = Math.round(sum / voteCounts * 10) / 10;
		this.barChartLabels = [...(labels)].sort();
		this.voteData = [{
			data: this.getValuesForLabels(resultsOccurrences, [...(labels)].sort()),
			backgroundColor: this.colors,
			hoverBackgroundColor: this.colors,
			borderColor: [
				'rgba(255, 99, 132, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)'
			],
			borderWidth: 1,
			barThickness: "flex",
			label: "Number of votes"
		}];
	}

	private getValuesForLabels(resultsOccurrences: Map<string, number>,
		labels: string[]): number[]
	{
		const results: number[] = [];
		labels.forEach((label) => results.push(resultsOccurrences.get(label)));
		return results;
	}
}
