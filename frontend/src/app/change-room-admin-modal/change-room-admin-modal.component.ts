import { Component, OnInit } from '@angular/core';
import {RoomService} from "../services/room/room.service";
import {UserEstimate} from "../services/room/domain/RoomStatus";

@Component({
  selector: 'app-change-room-admin-modal',
  templateUrl: './change-room-admin-modal.component.html',
  styleUrls: ['./change-room-admin-modal.component.scss']

})
export class ChangeRoomAdminModalComponent implements OnInit {

  /**
   * The list of available users.
   */
  public availableUsers: UserEstimate[];

  /**
   * The id of the user currently selected in the select box.
   */
  public selectedUserId: string;

  constructor(private RoomService: RoomService) {
  }

  ngOnInit(): void {
    this.RoomService.fetchUpdates().then((update) => {
      this.selectedUserId = update.moderatorId;
      this.availableUsers = update.estimates;
    })
  }
}
