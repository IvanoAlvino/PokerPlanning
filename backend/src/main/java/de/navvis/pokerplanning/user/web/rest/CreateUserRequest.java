package de.navvis.pokerplanning.user.web.rest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateUserRequest
{
	/**
	 * The username of the user to create.
	 */
	private String name;

	/**
	 * The if of the room where the user will be assigned.
	 */
	private UUID roomId;
}
