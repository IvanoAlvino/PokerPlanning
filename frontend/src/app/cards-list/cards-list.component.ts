import {Component, OnInit} from '@angular/core';
import {RoomService} from "../services/room/room.service";
import {ErrorResponse} from "../services/room/domain/error/ApiError";
import {Router} from "@angular/router";

@Component({
  selector: 'cards-list',
  templateUrl: './cards-list.component.html',
  styleUrls: ['./cards-list.component.scss']
})
export class CardsListComponent implements OnInit {
  public readonly values = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

  public selectedValue: number = undefined;

  constructor(private RoomService: RoomService,
              private router: Router) { }

  ngOnInit() {
  }

  public async selectCard(estimate: number): Promise<void> {
    this.selectedValue = estimate;
    try {
      await this.RoomService.vote(estimate);
    } catch (e) {
      switch (e.response) {
        case (ErrorResponse.ROOM_DOESNT_EXIST): {
          this.router.navigateByUrl('/welcome')
            .then(() => {})
            .catch(() => console.log("Not possible to navigate to /poker"));
        }
      }
    }
  }
}
