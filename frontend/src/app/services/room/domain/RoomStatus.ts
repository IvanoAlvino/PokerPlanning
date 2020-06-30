interface RoomStatus
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
	 * The name of the room moderator.
	 */
	moderatorUsername: string;

	/**
	 * The name of the user connected to the room.
	 */
	loggedInUsername: string;
}

interface UserEstimate
{
	/**
	 * The name of the user.
	 */
	username: string;

	/**
	 * Whether this user has provided an estimate.
	 */
	voted: boolean;

	/**
	 * The estimate this user has selected. Can be null if {@link #voted} is false.
	 */
	estimate: string;
}
