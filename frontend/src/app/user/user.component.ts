import {Component, Input} from '@angular/core';
import {UserEstimate} from "../services/room/domain/RoomStatus";

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
	public userToDisplay: UserEstimate;

	/**
	 * Whether the voting phase is currently ongoing.
	 */
	@Input()
	public isVotingOngoing: boolean;

	/**
	 * The id of the current room moderator.
	 */
	@Input()
	public moderatorId: string;

}
