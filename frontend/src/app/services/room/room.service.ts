import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ApiError, ErrorResponse} from "./domain/error/ApiError";

@Injectable({
	providedIn: 'root'
})
export class RoomService
{
	private readonly roomUrl: string = '/api/room';

	private readonly voteUrl: string = '/api/votes';

	private readonly updatesUrl: string = '/api/updates';

	private readonly startVotingUrl: string = '/api/startVoting';

	private readonly finishVotingUrl: string = '/api/finishVoting';

	/**
	 * The id of the current room.
	 */
	public roomId: string;

	constructor(private http: HttpClient)
	{
	}

	/**
	 * Create a new room with the given moderatorUsername as moderator.
	 * @param moderatorUsername The name of the room moderator
	 */
	public async createRoom(moderatorUsername: string): Promise<RoomResponse>
	{
		const roomRequest: RoomRequest = {
			moderatorUsername: moderatorUsername
		};
		const roomResponse = await this.http.post<RoomResponse>(this.roomUrl, roomRequest)
			.toPromise();
		this.roomId = roomResponse.roomId;
		return roomResponse;
	}

	/**
	 * Check if user has already an open session with the server.
	 * This method checks as well if the given roomId exists, and throws an {@link ApiError} if it
	 * does not.
	 * @param roomId The id of the room to check for existence
	 */
	public async isUserSessionOpen(roomId: string): Promise<UserSessionOpenResponse>
	{
		try
		{
			const url = `${this.roomUrl}/${roomId}`;
			// Calling this endpoint will throw en error if room does not exist
			let userSessionOpenResponse = await this.http.get<UserSessionOpenResponse>(url)
				.toPromise();
			this.roomId = roomId;
			return userSessionOpenResponse;
		}
		catch (e)
		{
			this.handleApiError(e);
		}
	}

	/**
	 * Vote for the current room with the given estimate.
	 * @param estimate The estimate used for voting
	 */
	public async vote(estimate: string): Promise<void>
	{
		try
		{
			const voteRequest: VoteRequest = {
				estimate: estimate,
				roomId: this.roomId
			};
			await this.http.post(this.voteUrl, voteRequest).toPromise();
		}
		catch (e)
		{
			this.handleApiError(e);
		}
	}

	/**
	 * Start the voting phase for the current room.
	 */
	public async startVoting(): Promise<void>
	{
		try
		{
			await this.http.post(this.startVotingUrl, undefined).toPromise();
		}
		catch (e)
		{
			this.handleApiError(e);
		}
	}

	/**
	 * Close the voting phase for the current room.
	 */
	public async finishVoting(): Promise<void>
	{
		try
		{
			await this.http.post(this.finishVotingUrl, undefined).toPromise();
		}
		catch (e)
		{
			this.handleApiError(e);
		}
	}

	/**
	 * Fetch updates for the current room.
	 */
	public async fetchUpdates(): Promise<UpdateResponse>
	{
		try
		{
			const url = `${this.updatesUrl}/${this.roomId}`;
			return await this.http.get<UpdateResponse>(url).toPromise();
		}
		catch (e)
		{
			this.handleApiError(e);
		}
	}

	/**
	 * Handle the api error by rethrowing the correct {@link ApiError} based on the error code
	 * in the given errorResponse.
	 * @param errorResponse The error response gotten from the server
	 */
	private handleApiError(errorResponse: HttpErrorResponse): void
	{
		switch (errorResponse.status)
		{
			case 401:
				throw new ApiError("User is not registered in a room!",
					ErrorResponse.USER_DOESNT_EXIST);
			case 404:
				this.roomId = undefined;
				throw new ApiError("Specified room doesn't exist!",
					ErrorResponse.ROOM_DOESNT_EXIST);
			case 409:
				throw new ApiError("User with this username is already registered in a room!",
					ErrorResponse.USERNAME_IS_TAKEN);
			default:
				throw new Error("Unknown server error");
		}
	}
}

