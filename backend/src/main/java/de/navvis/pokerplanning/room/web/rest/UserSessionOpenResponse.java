package de.navvis.pokerplanning.room.web.rest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserSessionOpenResponse
{
	/**
	 * Whether the user session is currently open.
	 */
	private boolean isUserSessionOpen;
}
