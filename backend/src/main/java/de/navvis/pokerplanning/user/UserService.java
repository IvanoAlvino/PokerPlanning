package de.navvis.pokerplanning.user;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import java.util.UUID;
import java.util.regex.Pattern;

import de.navvis.pokerplanning.core.SessionService;
import de.navvis.pokerplanning.room.web.exception.UserAlreadyExistsException;
import de.navvis.pokerplanning.user.web.domain.User;
import de.navvis.pokerplanning.user.web.exception.UnsafeUsernameException;
import de.navvis.pokerplanning.user.web.rest.CreateUserRequest;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserService
{
	private final SessionService sessionService;

	/**
	 * Regex pattern for selecting all unsafe characters to be used for a username. Matches
	 * punctuation: One of !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~.
	 */
	private static final Pattern UNSAFE_CHARS_PATTERN = Pattern.compile("[\\p{Punct}]");

	/**
	 * Create a user by saving his information in the session
	 *
	 * @param userInfo The object that holds user information
	 */
	public User createUser(CreateUserRequest userInfo)
		throws UnsafeUsernameException, UserAlreadyExistsException
	{
		return createUser(userInfo.getName(), userInfo.getRoomId());
	}

	/**
	 * Create a user by saving his information in the session
	 * @param username The name of the user
	 * @param roomId The room where the user is created
	 */
	public User createUser(String username, UUID roomId)
		throws UnsafeUsernameException, UserAlreadyExistsException
	{
		User existingUser = sessionService.getUserForRoom(roomId);
		if (existingUser != null)
		{
			log.error("User already exist in this session. RoomId {}, Existing user {}", roomId,
				existingUser.getName());
			throw new UserAlreadyExistsException();
		}

		validateUsername(username);
		User user = new User(roomId, username);
		sessionService.updateRoomAndUserSessionObject(roomId, user);
		return user;
	}

	/**
	 * Validate the provided username, and throw an exception if it contains unsafe chars
	 * specified in {@link #UNSAFE_CHARS_PATTERN}.
	 * @param username The username to validate
	 * @throws UnsafeUsernameException if unsafe chars are found
	 */
	public void validateUsername(String username) throws UnsafeUsernameException
	{
		if (username == null)
		{
			log.error("The specified username is null, no user will be created");
			throw new UnsafeUsernameException();
		}

		if (UNSAFE_CHARS_PATTERN.matcher(username).find())
		{
			log.error("The specified username '{}' is unsafe, no user will be created", username);
			throw new UnsafeUsernameException();
		}
	}
}
