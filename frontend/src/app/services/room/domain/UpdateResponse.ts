interface UpdateResponse {
  estimates: UserEstimate[];
  votingOngoing: boolean;
}

interface UserEstimate {
  username: string;
  voted: boolean;
  estimate: number;
}
