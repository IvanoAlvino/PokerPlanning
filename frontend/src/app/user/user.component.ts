import {Component, Input} from '@angular/core';
import {UserEstimate} from "../services/room/domain/RoomStatus";
import {RoomService} from "../services/room/room.service";

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

	constructor(private RoomService: RoomService)
	{
	}

	public changeModerator(newModeratorId: string): void
	{
		this.RoomService.changeModerator(newModeratorId)
			.catch((error) => console.log("Impossible to change moderator", error));
	}
}
