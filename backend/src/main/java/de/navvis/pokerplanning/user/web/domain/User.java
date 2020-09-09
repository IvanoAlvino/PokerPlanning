package de.navvis.pokerplanning.user.web.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import java.util.UUID;

@Getter
@RequiredArgsConstructor
public class User
{
	/**
	 * The id of the user.
	 */
	private final UUID id = UUID.randomUUID();

	/**
	 * The room where the user is registered.
	 */
	private final UUID roomId;

	/**
	 * The name of the user;
	 */
	private final String name;
}
