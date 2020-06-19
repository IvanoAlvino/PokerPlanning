import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {RoomService} from "../services/room/room.service";
import {MatInput} from "@angular/material/input";
import {Router} from "@angular/router";
import {UserService} from "../services/user/user.service";

@Component({
  selector: 'welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit, AfterViewInit {

  public username: string;

  public onlyJoining: boolean;

  @ViewChild('nameInput', {static: true})
  private input: MatInput;

  constructor(private RoomService: RoomService,
              private UserService: UserService,
              private router: Router)
  {
  }

  public ngOnInit(): void
  {
    // check if user has landed on this page from an invite link
    this.onlyJoining = this.UserService.onlyJoining;
  }

  public ngAfterViewInit(): void
  {
    // set the focus on the name input
    setTimeout(() => this.input.focus(), 700);
  }

  public async startPlanning(): Promise<void>
  {
    const createRoomResp = await this.RoomService.createRoom(this.username);
    this.router.navigateByUrl('/poker/' + createRoomResp.roomId)
        .then(() => {})
        .catch(() => console.log("Not possible to navigate to /poker"));
  }

  public async joinPlanning(): Promise<void>
  {
    // create user
    await this.UserService.createUser(this.username, this.RoomService.roomId)
    // navigate to poker planning page
    this.router.navigateByUrl('/poker/' + this.RoomService.roomId)
        .then(() => {})
        .catch(() => console.log("Not possible to navigate to /poker"));
  }
}
