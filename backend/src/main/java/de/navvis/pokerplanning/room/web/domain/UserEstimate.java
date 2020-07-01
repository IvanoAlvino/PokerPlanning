package de.navvis.pokerplanning.room.web.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserEstimate
{
	/**
	 * The name of the user.
	 */
	private String username;

	/**
	 * The unique id of the user.
	 */
	private UUID userId;

	/**
	 * Whether this user has provided an estimate.
	 */
	private Boolean voted;

	/**
	 * The estimate this user has selected. Can be null if {@link #voted} is false.
	 */
	private String estimate;
}
