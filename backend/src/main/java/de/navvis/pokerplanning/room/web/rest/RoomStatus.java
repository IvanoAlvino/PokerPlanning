package de.navvis.pokerplanning.room.web.rest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import de.navvis.pokerplanning.room.web.domain.UserEstimate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomStatus
{
	/**
	 * The list of all estimates for all users.
	 */
	private List<UserEstimate> estimates;

	/**
	 * Whether the voting phase is ongoing. If false, means results can be displayed.
	 */
	private boolean isVotingOngoing;

	/**
	 * The name of the room moderator.
	 */
	private String moderatorUsername;

	/**
	 * The name of the user connected to the room.
	 */
	private String loggedInUsername;
}
