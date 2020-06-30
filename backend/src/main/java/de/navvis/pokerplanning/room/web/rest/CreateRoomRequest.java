package de.navvis.pokerplanning.room.web.rest;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CreateRoomRequest
{
	/**
	 * The name of the user who will be moderator of the room.
	 */
	private String moderatorUsername;
}
