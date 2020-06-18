package de.navvis.pokerplanning.room.web;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserVoteInfo {
	private String username;
	private Boolean voted;
	private Integer previousVote;
}
