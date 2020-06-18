package de.navvis.pokerplanning.room;

import de.navvis.pokerplanning.user.User;
import lombok.Builder;
import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Data
@Builder
public class Room {
	private UUID id;
	private String name;
	private Set<User> users;
}
