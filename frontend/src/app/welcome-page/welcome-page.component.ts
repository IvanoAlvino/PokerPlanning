import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {RoomService} from "../services/room/room.service";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements AfterViewInit {

  public username: string;

  @ViewChild('nameInput', {static: true})
  private input: MatInput;

  constructor(private RoomService: RoomService)
  {
  }

  public ngAfterViewInit(): void
  {
    setTimeout(() => this.input.focus(), 700);
  }

  public startPlanning()
  {
    this.RoomService.createRoom().subscribe((response) => console.log(response));
  }

  public joinPlanning()
  {

  }
}
