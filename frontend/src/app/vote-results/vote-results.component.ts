import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-vote-results',
  templateUrl: './vote-results.component.html',
  styleUrls: ['./vote-results.component.scss']
})
export class VoteResultsComponent implements OnInit {
  @Input()
  public votes: UserVote[];
  public estimateCounts: EstimateCount[]
  public average: number;

  constructor() { }

  ngOnInit() {
    const estimateCounts = new Map<number, number>()
    let sum = 0;
    let count = 0;
    this.votes.forEach(vote => {
      const value = vote.previousVote;
      if (value === undefined || value === null) return;
      const number = estimateCounts.get(value);
      estimateCounts.set(value, number === undefined ? 1 : number + 1);
      sum += value;
      count++;
    });
    if (count > 0) {
      this.average = sum / count;
    }
    estimateCounts.forEach(((value, key) => this.estimateCounts.push({estimate: key, count: value})))
  }

}
