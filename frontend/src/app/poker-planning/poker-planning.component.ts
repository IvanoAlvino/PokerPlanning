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

  private userList: UserVote[] = [];

  private updatesIntervalId: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private RoomService: RoomService,
              private UserService: UserService) {

  }

  async ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('room-id');
    try
    {
      const roomInfo = await this.RoomService.roomInfo(this.roomId);
      this.createUserIfNeeded(roomInfo);
      if (!this.updatesIntervalId) {
        this.updatesIntervalId = setInterval(() => this.fetchUpdates(), 1000);
      }
    }
    catch (e)
    {
      this.router.navigate(['/welcome'])
          .then(() => {})
          .catch(() => console.log("Not possible to navigate to /welcome"));
    }
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

  private fetchUpdates(): void
  {
    this.RoomService.updates(this.roomId)
        .then((updates) => this.userList = updates.votes)
        .catch((error) => console.log("Error while fetching updates", error));
  }

  public finishVoting(): void
  {
    this.RoomService.finishVoting()
        .then(() => console.log("Voting finished"))
        .catch((error) => console.log("Error while finish voting", error));
  }
}
