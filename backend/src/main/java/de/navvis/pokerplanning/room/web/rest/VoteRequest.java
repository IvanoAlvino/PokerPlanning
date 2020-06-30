package de.navvis.pokerplanning.room.web.rest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoteRequest
{
	/**
	 * The estimate the user has selected for voting.
	 */
	private String estimate;

	/**
	 * The id of the room where the user is providing the {@link #estimate}.
	 */
	private UUID roomId;
}
