interface UpdatesResponse {
  votes: UserVote[];
  round: number;
}

interface UserVote {
  username: string;
  voted: boolean;
  previousVote: number;
}
