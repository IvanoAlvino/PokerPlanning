import {Component, Input, TemplateRef, ViewChild} from '@angular/core';
import {UserEstimate} from "../services/room/domain/RoomStatus";
import {RoomService} from "../services/room/room.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
	selector: 'user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.scss']
})
export class UserComponent
{
	/**
	 * The user object to display.
	 */
	@Input()
	public user: UserEstimate;

	/**
	 * Whether the voting phase is currently ongoing.
	 */
	@Input()
	public isVotingOngoing: boolean;

	/**
	 * Whether the currently logged in user is the room moderator.
	 */
	@Input()
	public isModerator: boolean;

	/**
	 * The id of the currently logged in user.
	 */
	@Input()
	public userId: string;

	@ViewChild('modal')
	public changeModeratorModal: TemplateRef<any>

	public newProposedModeratorUsername: string;

	constructor(private RoomService: RoomService,
				private dialog: MatDialog)
	{
	}

	/**
	 * Open a modal to ask for confirmation on the operation, and then change the room moderator
	 * if the user confirms.
	 * @param newProposedRoomModerator The user that might become moderator
	 */
	public changeModerator(newProposedRoomModerator: UserEstimate): void
	{
		// Prepare data for the modal
		this.newProposedModeratorUsername = newProposedRoomModerator.username;

		this.dialog.open(this.changeModeratorModal, {
				position: {
					top: "10%"
				}
			})
			.afterClosed()
			.subscribe((result) =>
			{
				if (result === true)
				{
					this.RoomService.changeModerator(newProposedRoomModerator.userId)
						.catch((error) => console.log("Impossible to change moderator", error));
				}
			});
	}
}
