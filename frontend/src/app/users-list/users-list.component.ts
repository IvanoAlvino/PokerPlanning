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
	private _userList: UserEstimate[];

	@Input()
	public set userList(value: UserEstimate[])
	{
		this._userList = this.getSortedEstimatesDESC(value);
	}

	public get userList(): UserEstimate[]
	{
		return this._userList;
	}

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

	/**
	 * Clone the provided estimates array and sort it by estimate value, in a descending order.
	 * @param estimates The array of estimates to sort
	 */
	public getSortedEstimatesDESC(estimates: UserEstimate[]): UserEstimate[]
	{
		// Clone the array not to tamper with original data
		const sortedEstimate = [...estimates];
		return sortedEstimate.sort((firstEstimate, secondEstimate) => {
			if (firstEstimate.estimate === "?" || !firstEstimate.estimate)
			{
				return 1;
			}

			if (secondEstimate.estimate === "?" || !secondEstimate.estimate)
			{
				return -1;
			}

			return parseFloat(secondEstimate.estimate) - parseFloat(firstEstimate.estimate);
		});
	}
}
