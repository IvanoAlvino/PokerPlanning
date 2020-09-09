package de.navvis.pokerplanning.web.domain;

public class AttributeName
{
	/**
	 * A key used to store the central objects that contains all rooms where the person with this
	 * http session has created users. This object allows to perform central operation, like
	 * understanding is the person with such http session has a user logged in a specific room.
	 */
	public static final String ROOM_USER_MAP = "roomUserMap";
}
