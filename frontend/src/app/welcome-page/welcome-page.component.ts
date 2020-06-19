import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {RoomService} from "../services/room/room.service";
import {MatInput} from "@angular/material/input";
import {Router} from "@angular/router";

@Component({
  selector: 'welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements AfterViewInit {

  public username: string;

  @ViewChild('nameInput', {static: true})
  private input: MatInput;

  constructor(private RoomService: RoomService,
              private router: Router)
  {
  }

  public ngAfterViewInit(): void
  {
    setTimeout(() => this.input.focus(), 700);
  }

  public startPlanning(): void
  {
    this.RoomService.createRoom(this.username).subscribe((response) => console.log(response));
    this.router.navigateByUrl('/poker')
        .then(() => {})
        .catch(() => console.log("Not possible to navigate to /poker"));
  }

  public joinPlanning(): void
  {

  }
}
