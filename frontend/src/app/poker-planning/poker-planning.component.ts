import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RoomService} from "../services/room/room.service";
import {UserService} from "../services/user/user.service";

@Component({
  selector: 'app-poker-planning',
  templateUrl: './poker-planning.component.html',
  styleUrls: ['./poker-planning.component.scss']
})
export class PokerPlanningComponent implements OnInit {

  public roomId: string;

  private userList: string[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private RoomService: RoomService,
              private UserService: UserService) {

  }

  async ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('room-id');

    const roomInfo = await this.RoomService.roomInfo(this.roomId);
    console.log("On init, user list", roomInfo);

    this.userList = roomInfo.users;

    this.createUserIfNeeded(roomInfo);
  }

  private createUserIfNeeded(roomInfo: RoomInfoResponse): void
  {
    if (!roomInfo.username || roomInfo.username === "") {
      // redirect user to welcome page so he can insert his name
      this.UserService.onlyJoining = true;
      this.router.navigate(['/welcome'])
          .then(() => {})
          .catch(() => console.log("Not possible to navigate to /welcome"));
    }
  }

}
