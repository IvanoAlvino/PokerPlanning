import {Component, Input} from '@angular/core';
import {UserEstimate} from "../services/room/domain/RoomStatus";

@Component({
	selector: 'users-list',
	templateUrl: './users-list.component.html',
	styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent
{
	/**
	 * The list of users to display.
	 */
	@Input()
	public userList: UserEstimate[];

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

	/**
	 * Whether the voting phase is currently ongoing.
	 */
	@Input()
	public isVotingOngoing: boolean;
}
