import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {RoomService} from "../services/room/room.service";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  public username: string;

  @ViewChild('nameInput', {static: true})
  private input: MatInput;

  constructor(private RoomService: RoomService)
  {
  }

  public ngAfterViewInit(): void
  {
    setTimeout(() => this.input.focus());
  }

  public startPlanning()
  {
    this.RoomService.createRoom().subscribe((response) => console.log(response));
  }

  public joinPlanning()
  {

  }
}
