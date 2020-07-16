export interface RoomStatus
{
	/**
	 * The list of all estimates for all users.
	 */
	estimates: UserEstimate[];

	/**
	 * Whether the voting phase is ongoing. If false, means results can be displayed.
	 */
	votingOngoing: boolean;

	/**
	 * The id of the room moderator.
	 */
	moderatorId: string;

	/**
	 * The id of the user connected to the room.
	 */
	userId: string;
}

export interface UserEstimate
{
	/**
	 * The name of the user.
	 */
	username: string;

	/**
	 * The unique id of the user.
	 */
	userId: string;

	/**
	 * Whether this user has provided an estimate.
	 */
	voted: boolean;

	/**
	 * The estimate this user has selected. Can be null if {@link #voted} is false.
	 */
	estimate: string;
}
