package de.navvis.pokerplanning.user;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class User {
	private String name;
	private boolean moderator;
}
