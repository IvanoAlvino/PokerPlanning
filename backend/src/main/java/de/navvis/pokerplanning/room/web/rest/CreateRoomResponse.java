package de.navvis.pokerplanning.room.web.rest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateRoomResponse
{
	/**
	 * The id of the room
	 */
	private UUID roomId;
}
