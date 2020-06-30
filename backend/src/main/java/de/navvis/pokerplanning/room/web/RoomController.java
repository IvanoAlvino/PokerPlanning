package de.navvis.pokerplanning.room.web;

import de.navvis.pokerplanning.room.web.exception.NoSuchRoomException;
import de.navvis.pokerplanning.room.RoomService;
import de.navvis.pokerplanning.room.web.rest.CreateRoomRequest;
import de.navvis.pokerplanning.room.web.rest.CreateRoomResponse;
import de.navvis.pokerplanning.room.web.rest.UserSessionOpenResponse;
import de.navvis.pokerplanning.web.domain.AttributeName;
import de.navvis.pokerplanning.web.exception.NotFoundException;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@CrossOrigin
@RequestMapping("/api/room")
public class RoomController
{
	private final RoomService roomService;

	@PostMapping
	public CreateRoomResponse createRoom(@RequestBody CreateRoomRequest request,
		HttpSession session)
	{
		UUID roomId = roomService.createRoom(request.getModeratorUsername());
		session.setAttribute(AttributeName.USERNAME, request.getModeratorUsername());
		session.setAttribute(AttributeName.ROOM_ID, roomId);
		return new CreateRoomResponse(roomId);
	}

	@GetMapping("/{roomId}")
	public UserSessionOpenResponse isUserSessionOpen(@PathVariable UUID roomId,
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
