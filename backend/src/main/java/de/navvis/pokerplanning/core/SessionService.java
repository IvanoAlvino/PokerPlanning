package de.navvis.pokerplanning.core;

import lombok.RequiredArgsConstructor;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import javax.servlet.http.HttpSession;

import java.util.*;

import de.navvis.pokerplanning.user.web.domain.User;
import de.navvis.pokerplanning.web.domain.AttributeName;

@Service
@RequiredArgsConstructor
public class SessionService
{
	private final HttpSession session;

	/**
	 * Binds an object to this session, using the name specified. If an object of the same name is
	 * already bound to the session, the object is replaced.
	 *
	 * @param attributeName the name to which the object is bound; cannot be null
	 * @param value         the object to be bound
	 */
	public void setAttribute(String attributeName, Object value)
	{
		session.setAttribute(attributeName, value);
	}

	/**
	 * Get the user associated to the provided roomId by looking in the session object stored
	 * under {@link AttributeName#ROOM_USER_MAP}.
	 * @param roomId The id of the room for which to recover the registered user, if it exists
	 * @return If no such object exist in session, or if the user is not registered in the specified
	 * room , this method returns null. If the user is registered in the specified room, this method
	 * returns the entire {@link User} object.
	 */
	public User getUserForRoom(UUID roomId)
	{
		Map<UUID, User> roomUserMap = getRoomUserMap();
		return roomUserMap != null ? roomUserMap.get(roomId) : null;
	}

	/**
	 * Update the central object in session that related rooms and users, by adding the specified
	 * user to the specified roomId.
	 * This method makes sure to create the central object stored under
	 * {@link AttributeName#ROOM_USER_MAP} if it does not yet exist, or updates it if it does exist
	 * already.
	 *
	 * @param roomId The id of the room where to store the provided user
	 * @param user The user object to store
	 */
	public void updateRoomAndUserSessionObject(UUID roomId, User user)
	{
		Map<UUID, User> roomUserMap = getRoomUserMap();
		if (roomUserMap == null)
		{
			Map<UUID, User> newRoomUserMap = new HashMap<>();
			newRoomUserMap.put(roomId, user);
			setAttribute(AttributeName.ROOM_USER_MAP, newRoomUserMap);
			return;
		}

		roomUserMap.put(roomId, user);
		setAttribute(AttributeName.ROOM_USER_MAP, roomUserMap);
	}

	/**
	 * Get the map that relates rooms and users stored in the session.
	 * @return the central object useful to retrieve information regarding users and rooms.
	 */
	private Map<UUID, User> getRoomUserMap()
	{
		return (Map<UUID, User>)session.getAttribute(AttributeName.ROOM_USER_MAP);
	}
}
