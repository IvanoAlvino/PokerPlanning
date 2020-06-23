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

  public update: UpdatesResponse;

  public isVoteOngoing: boolean = false;

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
        .then((updates) => {
          // Only change the reference and trigger all template re-renders if something has changed
          if (JSON.stringify(this.update) !== JSON.stringify(updates))
          {
            this.update = updates;
          }
          this.isVoteOngoing = updates.votingOngoing;
        })
        .catch((error) => console.log("Error while fetching updates", error));
  }

  public startVoting(): void
  {
    this.RoomService.startVoting()
        .then(() => this.isVoteOngoing = true)
        .catch((error) => console.log("Error while starting voting", error));
  }

  public finishVoting(): void
  {
    this.RoomService.finishVoting()
        .then(() => this.isVoteOngoing = false)
        .catch((error) => console.log("Error while finish voting", error));
  }
}
