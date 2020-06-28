package de.navvis.pokerplanning.room.web;

import de.navvis.pokerplanning.room.web.exception.NoSuchRoomException;
import de.navvis.pokerplanning.room.RoomService;
import de.navvis.pokerplanning.room.web.rest.CreateRoomRequest;
import de.navvis.pokerplanning.room.web.rest.CreateRoomResponse;
import de.navvis.pokerplanning.room.web.rest.UserSessionOpenResponse;
import de.navvis.pokerplanning.web.domain.AttributeName;
import de.navvis.pokerplanning.web.exception.NotFoundException;

import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

@RestController
@CrossOrigin
@RequestMapping("/api/room")
public class RoomController {
	private final RoomService roomService;

	public RoomController(RoomService roomService) {
		this.roomService = roomService;
	}

	// TODO to kick a user out of the room, we need to destroy its session
	// Look at https://stackoverflow.com/questions/18109665/how-do-i-remotely-invalidate-users-servlet-session-on-the-fly
	// to understand how to store reference to sessions: this way the admin can retrieve session
	// for a user and destroy it.
	// In order to do so, every user should have an unique id

	// TODO mark somebody else as admin

	@PostMapping
	public CreateRoomResponse createRoom(@RequestBody CreateRoomRequest request, HttpSession session) {
		var roomId = roomService.createRoom(request.getModeratorUsername());
		session.setAttribute(AttributeName.USERNAME, request.getModeratorUsername());
		session.setAttribute(AttributeName.ROOM_ID, roomId);
		return new CreateRoomResponse(roomId.toString());
	}

	@GetMapping("/{roomId}")
	public UserSessionOpenResponse isUserSessionOpen(@PathVariable String roomId,
		HttpSession session)
	{
		try
		{
			roomService.doesRoomExist(roomId);
			boolean isUserSessionOpen = session.getAttribute(AttributeName.USERNAME) != null;
			return new UserSessionOpenResponse(isUserSessionOpen);
		}
		catch (NoSuchRoomException e)
		{
			throw new NotFoundException();
		}
	}
}
