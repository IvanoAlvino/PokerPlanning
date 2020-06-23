import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from "chart.js";
import {Label} from "ng2-charts";

@Component({
  selector: 'vote-results',
  templateUrl: './vote-results.component.html',
  styleUrls: ['./vote-results.component.scss']
})
export class VoteResultsComponent {

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

  public barChartType: ChartType = 'bar';

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  public barChartLabels: Label[] = ['0', '1', '2', '3', '5', '6', '13', '21', '34', '55', '89'];

  public voteData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  private displayVotesResult(): void
  {
    const resultsOccurrences: Map<string, number> = new Map<string, number>();
    const labels: Set<string> = new Set<string>();

    this.results.forEach((result) => {
      if (!result.voted)
      {
        return;
      }

      labels.add(result.vote.toString());

      let voteOccurrences = resultsOccurrences.get(result.vote.toString());
      if (!voteOccurrences) {
        resultsOccurrences.set(result.vote.toString(), 1);
      }
      else {
        resultsOccurrences.set(result.vote.toString(), voteOccurrences + 1);
      }
    });

    this.barChartLabels = [...labels];
    this.voteData = [{
      data: this.getValuesForLabels(resultsOccurrences, labels)
    }];
  }

  private getValuesForLabels(resultsOccurrences: Map<string, number>, labels: Set<string>): number[]
  {
    const results: number[] = [];
    labels.forEach((label) => results.push(resultsOccurrences.get(label)));
    return results;
  }
}
