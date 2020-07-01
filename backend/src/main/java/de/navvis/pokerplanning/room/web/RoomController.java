package de.navvis.pokerplanning.room.web;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

import de.navvis.pokerplanning.core.SessionService;
import de.navvis.pokerplanning.room.RoomService;
import de.navvis.pokerplanning.room.web.exception.NoSuchRoomException;
import de.navvis.pokerplanning.room.web.exception.UserAlreadyExistsException;
import de.navvis.pokerplanning.room.web.rest.ChangeModeratorRequest;
import de.navvis.pokerplanning.room.web.rest.CreateRoomRequest;
import de.navvis.pokerplanning.room.web.rest.CreateRoomResponse;
import de.navvis.pokerplanning.room.web.rest.UserSessionOpenResponse;
import de.navvis.pokerplanning.user.UserService;
import de.navvis.pokerplanning.user.web.domain.User;
import de.navvis.pokerplanning.web.domain.AttributeName;
import de.navvis.pokerplanning.web.exception.ConflictException;
import de.navvis.pokerplanning.web.exception.NotFoundException;
import de.navvis.pokerplanning.web.exception.UnauthorizedException;

@RequiredArgsConstructor
@RestController
@CrossOrigin
@RequestMapping("/api/room")
public class RoomController
{
	private final RoomService roomService;

	private final UserService userService;

	private final SessionService sessionService;

	@PostMapping
	public CreateRoomResponse createRoom(@RequestBody CreateRoomRequest request)
	{
		UUID roomId = roomService.createRoom().getId();
		User user = userService.createUser(request.getModeratorUsername(), roomId);
		try
		{
			roomService.addUserToRoom(user, roomId);
			roomService.setModeratorForRoom(user.getId(), roomId);
		}
		catch (NoSuchRoomException e)
		{
			throw new NotFoundException();
		}
		catch (UserAlreadyExistsException e)
		{
			throw new ConflictException();
		}
		return new CreateRoomResponse(roomId);
	}

	@GetMapping("/{roomId}")
	public UserSessionOpenResponse isUserSessionOpen(@PathVariable UUID roomId)
	{
		try
		{
			roomService.doesRoomExist(roomId);
			boolean isUserSessionOpen = sessionService.getAttribute(AttributeName.USERNAME) != null;
			return new UserSessionOpenResponse(isUserSessionOpen);
		}
		catch (NoSuchRoomException e)
		{
			throw new NotFoundException();
		}
	}

	@PostMapping
	public void changeRoomModerator(@RequestBody ChangeModeratorRequest request)
	{
		try
		{
			roomService.changeModerator(request.getRoomId(), request.getNewModeratorId());
		}
		catch (NoSuchRoomException e)
		{
			throw new NotFoundException();
		}
		catch (IllegalAccessException e)
		{
			throw new UnauthorizedException();
		}
	}
}
