package de.navvis.pokerplanning.room.web;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateResponse {

	/**
	 * The list of all estimates for all users.
	 */
	private List<UserEstimate> estimates;

	/**
	 * Whether the voting phase is ongoing. If false, means results can be displayed.
	 */
	private boolean isVotingOngoing;
}
