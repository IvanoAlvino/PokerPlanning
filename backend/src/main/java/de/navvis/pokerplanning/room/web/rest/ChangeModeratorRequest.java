package de.navvis.pokerplanning.room.web.rest;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@NoArgsConstructor
public class ChangeModeratorRequest
{
	/**
	 * The id of the new moderator.
	 */
	private UUID newModeratorId;

	/**
	 * The id of the room where the new moderator should be assigned.
	 */
	private UUID roomId;
}
