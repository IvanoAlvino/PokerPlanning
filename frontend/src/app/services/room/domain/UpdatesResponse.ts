interface UpdatesResponse {
  votes: UserVote[];
  votingOngoing: boolean;
}

interface UserVote {
  username: string;
  voted: boolean;
  vote: number;
}
