package de.navvis.pokerplanning.room.web;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateResponse {
	private List<UserVoteInfo> votes;
	private Integer round;
}
