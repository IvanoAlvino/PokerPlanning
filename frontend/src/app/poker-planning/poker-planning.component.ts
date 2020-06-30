import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RoomService} from "../services/room/room.service";
import {UserService} from "../services/user/user.service";

@Component({
	selector: 'app-poker-planning',
	templateUrl: './poker-planning.component.html',
	styleUrls: ['./poker-planning.component.scss']
})
export class PokerPlanningComponent implements OnInit
{

	/**
	 * The last update fetched from server that had new data.
	 * Storing this update is useful so to avoid re-render the child components for every updates
	 * from server that have no new data.
	 */
	public lastMeaningfulUpdate: RoomStatus;

	/**
	 * Whether the room is currently in a voting phase.
	 */
	public isVoteOngoing: boolean = false;

	/**
	 * A reference to the interval that fetches the updates from the server.
	 */
	private updatesIntervalId: number;

	constructor(private route: ActivatedRoute,
		private router: Router,
		private RoomService: RoomService,
		private UserService: UserService)
	{
	}

	async ngOnInit()
	{
		try
		{
			await this.redirectUserToWelcomePageIfNotRegistered();
		}
		catch (e)
		{
			this.navigateToWelcomePage();
		}
	}

	/**
	 * Check if user has no session open already with the server, and navigate to the welcome page
	 * if this is the case so that the user can register to the room.
	 * If user is already registered to the room, this method will only make sure he will be polling
	 * for room updates.
	 */
	private async redirectUserToWelcomePageIfNotRegistered(): Promise<void>
	{
		const roomId = this.route.snapshot.paramMap.get('room-id');
		const response = await this.RoomService.isUserSessionOpen(roomId);
		if (response.userSessionOpen)
		{
			this.startUpdatePolling();
			return;
		}

		// redirect user to welcome page so he can insert his name
		this.UserService.onlyJoining = true;
		this.navigateToWelcomePage();
	}

	/**
	 * Fetch room updates and update {@link lastMeaningfulUpdate} only if the newly received data
	 * has some changes with respect to the previous data.
	 */
	private fetchUpdates(): void
	{
		this.RoomService.fetchUpdates()
			.then((update) =>
			{
				// Avoid triggering all template re-renders if there are no changes
				if (JSON.stringify(this.lastMeaningfulUpdate) !== JSON.stringify(update))
				{
					this.lastMeaningfulUpdate = update;
				}
				this.isVoteOngoing = update.votingOngoing;
			})
			.catch((error) => console.log("Error while fetching updates", error));
	}

	/**
	 * Start the polling to fetch room updates from the server.
	 */
	private startUpdatePolling(): void
	{
		if (this.updatesIntervalId)
		{
			return;
		}
		this.updatesIntervalId = setInterval(() => this.fetchUpdates(), 1000);
	}

	/**
	 * Navigate the browser page to the welcome page.
	 */
	private navigateToWelcomePage(): void
	{
		this.router.navigate(['/welcome'])
			.then(() => {})
			.catch(() => console.log("Not possible to navigate to /welcome"));
	}

	/**
	 * Start the voting phase in the room.
	 */
	public startVoting(): void
	{
		this.RoomService.startVoting()
			.then(() => this.isVoteOngoing = true)
			.catch((error) => console.log("Error while starting voting", error));
	}

	/**
	 * Close the voting phase in the room.
	 */
	public finishVoting(): void
	{
		this.RoomService.finishVoting()
			.then(() => this.isVoteOngoing = false)
			.catch((error) => console.log("Error while finish voting", error));
	}

	/**
	 * Check whether the current user is a moderator.
	 */
	public isModerator(): boolean
	{
		// If no information about the room is available, bail out
		if (!this.lastMeaningfulUpdate)
		{
			return false;
		}
		return this.lastMeaningfulUpdate.loggedInUsername ===
		       this.lastMeaningfulUpdate.moderatorUsername;
	}
}
