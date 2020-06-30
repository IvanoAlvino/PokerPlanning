interface RoomStatus
{
	estimates: UserEstimate[];
	votingOngoing: boolean;
}

interface UserEstimate
{
	username: string;
	voted: boolean;
	estimate: string;
}
