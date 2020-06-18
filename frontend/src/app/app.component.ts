import { Component } from '@angular/core';
import {RoomService} from "../services/room/room.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private RoomService: RoomService)
  {
  }

  public startPlanning()
  {
    this.RoomService.createRoom().subscribe((response) => console.log(response));
  }

  public joinPlanning()
  {

  }
}
