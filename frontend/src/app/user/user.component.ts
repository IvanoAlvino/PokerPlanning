import {Component, Input} from '@angular/core';

@Component({
	selector: 'user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.scss']
})
export class UserComponent
{
	@Input()
	public user: UserEstimate;

	/**
	 * Whether the voting phase is currently ongoing.
	 */
	@Input()
	public isVotingOngoing: boolean;
}
