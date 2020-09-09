import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {RoomService} from "../services/room/room.service";
import {MatInput} from "@angular/material/input";
import {Router} from "@angular/router";
import {UserService} from "../services/user/user.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
	selector: 'welcome-page',
	templateUrl: './welcome-page.component.html',
	styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit, AfterViewInit
{
	/**
	 * The username introduced in the form.
	 */
	public username: string;

	/**
	 * Whether the user is only joining a room and simply needs to define a username.
	 * This will be set to true when e.g. a link of an already created room is visited.
	 */
	public onlyJoining: boolean;

	@ViewChild('nameInput', {static: true})
	private usernameInput: MatInput;

	@ViewChild('unsafeUsernameModal')
	public unsafeUsernameModal: TemplateRef<any>

	constructor(private RoomService: RoomService,
				private UserService: UserService,
				private router: Router,
				private dialog: MatDialog)
	{
	}

	public ngOnInit(): void
	{
		// check if user has landed on this page from an invite link
		this.onlyJoining = this.UserService.onlyJoining;
	}

	public ngAfterViewInit(): void
	{
		// set the focus on the name input
		setTimeout(() => this.usernameInput.focus(), 700);
	}

	/**
	 * Create a new room to start a new planning.
	 */
	public async createNewRoom(): Promise<void>
	{
		try
		{
			await this.RoomService.createRoom(this.username);
		}
		catch
		{
			this.displayUnsafeUsernameModal();
			return;
		}
		this.navigateToPokerPlanningPage();
	}

	/**
	 * Create the user with the introduced username and navigate to the poker planning page.
	 */
	public async joinPlanning(): Promise<void>
	{
		try
		{
			await this.UserService.createUser(this.username, this.RoomService.roomId)
		}
		catch
		{
			this.displayUnsafeUsernameModal();
			return;
		}
		this.navigateToPokerPlanningPage();
	}

	/**
	 * Show the modal that warns the user the username he selected contains unsafe chars.
	 * @private
	 */
	private displayUnsafeUsernameModal(): void
	{
		this.dialog.open(this.unsafeUsernameModal, {
			position: {
				top: "10%"
			}
		});
	}

	/**
	 * Navigate the browser page to the poker planning page where user can play scrum poker.
	 */
	private navigateToPokerPlanningPage()
	{
		this.router.navigateByUrl('/poker/' + this.RoomService.roomId)
			.then(() => {})
			.catch(() => console.log("Not possible to navigate to /poker"));
	}

	/**
	 * Handle the enter key depending on whether the user is creating or joining a room.
	 */
	public handleEnterKey(): void
	{
		if (this.onlyJoining) {
			this.joinPlanning().catch(() => {});
		}
		else {
			this.createNewRoom().catch(() => {});
		}
	}
}
