import {Component, Input} from '@angular/core';

@Component({
	selector: 'app-users-list',
	templateUrl: './users-list.component.html',
	styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent
{
	@Input()
	public userList: UserEstimate[];
}
