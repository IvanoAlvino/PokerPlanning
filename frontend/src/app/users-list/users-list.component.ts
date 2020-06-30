import {Component, Input} from '@angular/core';

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
	 * Whether the voting phase is currently ongoing.
	 */
	@Input()
	public isVotingOngoing: boolean;
}
