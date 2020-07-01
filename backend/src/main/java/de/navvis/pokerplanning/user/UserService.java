package de.navvis.pokerplanning.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

import de.navvis.pokerplanning.core.SessionService;
import de.navvis.pokerplanning.user.web.domain.User;
import de.navvis.pokerplanning.user.web.rest.CreateUserRequest;
import de.navvis.pokerplanning.web.domain.AttributeName;

@Service
@RequiredArgsConstructor
public class UserService
{
	private final SessionService sessionService;

	/**
	 * Create a user by saving his information in the session
	 *
	 * @param userInfo The object that holds user information
	 */
	public User createUser(CreateUserRequest userInfo)
	{
		return createUser(userInfo.getName(), userInfo.getRoomId());
	}

	/**
	 * Create a user by saving his information in the session
	 * @param username The name of the user
	 * @param roomId The room where the user is created
	 */
	public User createUser(String username, UUID roomId)
	{
		User user = new User(username, roomId);
		sessionService.setAttribute(AttributeName.USERNAME, username);
		sessionService.setAttribute(AttributeName.USER_ID, user.getId());
		sessionService.setAttribute(AttributeName.ROOM_ID, roomId);
		return user;
	}
}
