package de.navvis.pokerplanning.user.web;

import de.navvis.pokerplanning.room.web.exception.NoSuchRoomException;
import de.navvis.pokerplanning.room.RoomService;
import de.navvis.pokerplanning.room.web.exception.UserAlreadyExistsException;
import de.navvis.pokerplanning.user.UserService;
import de.navvis.pokerplanning.user.web.domain.User;
import de.navvis.pokerplanning.user.web.rest.CreateUserRequest;
import de.navvis.pokerplanning.web.exception.ConflictException;
import de.navvis.pokerplanning.web.exception.NotFoundException;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@CrossOrigin
@RequestMapping("/api/user")
public class UserController
{
	private final RoomService roomService;

	private final UserService userService;

	/**
	 * Create a new user with the provided name and assign it to the room with the provided roomId.
	 *
	 * @param userInfo The object that holds the information about the user
	 */
	@PostMapping
	public void createUser(@RequestBody CreateUserRequest userInfo)
	{
		try
		{
			User user = userService.createUser(userInfo);
			roomService.addUserToRoom(user, userInfo.getRoomId());
		}
		catch (NoSuchRoomException e)
		{
			throw new NotFoundException();
		}
		catch (UserAlreadyExistsException e)
		{
			throw new ConflictException();
		}
	}
}
