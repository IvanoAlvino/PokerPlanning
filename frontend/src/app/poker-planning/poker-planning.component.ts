import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-poker-planning',
  templateUrl: './poker-planning.component.html',
  styleUrls: ['./poker-planning.component.scss']
})
export class PokerPlanningComponent implements OnInit {

  private roomId: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('room-id');
    console.log("room id is", this.roomId);
  }

}
