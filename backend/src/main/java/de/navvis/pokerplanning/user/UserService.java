package de.navvis.pokerplanning.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import javax.servlet.http.HttpSession;

import de.navvis.pokerplanning.user.web.rest.CreateUserRequest;
import de.navvis.pokerplanning.web.domain.AttributeName;

@Service
@RequiredArgsConstructor
public class UserService
{
	private final HttpSession session;

	/**
	 * Create a user by saving his information in the session
	 *
	 * @param userInfo The object that holds user information
	 */
	public void createUser(@RequestBody CreateUserRequest userInfo)
	{
		session.setAttribute(AttributeName.USERNAME, userInfo.getName());
		session.setAttribute(AttributeName.ROOM_ID, userInfo.getRoomId());
	}
}
