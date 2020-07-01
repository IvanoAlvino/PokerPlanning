package de.navvis.pokerplanning.room.web.rest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

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
	 * The id of the room moderator.
	 */
	private UUID moderatorId;

	/**
	 * The id of the current user connected to the room.
	 */
	private UUID userId;
}
