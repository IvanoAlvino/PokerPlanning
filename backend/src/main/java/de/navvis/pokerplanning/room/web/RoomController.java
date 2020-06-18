package de.navvis.pokerplanning.room.web;

import de.navvis.pokerplanning.room.NoSuchRoomException;
import de.navvis.pokerplanning.room.RoomService;
import de.navvis.pokerplanning.room.SimpleRoomInfo;
import de.navvis.pokerplanning.web.AttributeName;
import de.navvis.pokerplanning.web.exception.NotFoundException;
import de.navvis.pokerplanning.web.exception.UnauthorizedException;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/api/room")
public class RoomController {
	private final RoomService roomService;

	public RoomController(RoomService roomService) {
		this.roomService = roomService;
	}

	@PostMapping
	public CreateRoomResponse createRoom(@RequestBody CreateRoomRequest request, HttpSession session) {
		var roomId = roomService.createRoom(request.getRoomName(), request.getUsername());
		session.setAttribute(AttributeName.USERNAME, request.getUsername());
		session.setAttribute(AttributeName.ROOM_ID, roomId);
		return new CreateRoomResponse(roomId.toString());
	}

	@GetMapping
	public RoomInfoResponse roomInfo(HttpSession session) {
		var roomId = Optional.ofNullable(session.getAttribute(AttributeName.ROOM_ID));
		var username = Optional.ofNullable(session.getAttribute(AttributeName.USERNAME));
		if (roomId.isEmpty() || username.isEmpty()) throw new NotFoundException();
		SimpleRoomInfo roomInfo;
		try {
			roomInfo = roomService.getRoomInfo(roomId.get().toString());
		} catch (NoSuchRoomException e) {
			session.removeAttribute(AttributeName.ROOM_ID);
			session.removeAttribute(AttributeName.USERNAME);
			throw new UnauthorizedException();
		}
		return new RoomInfoResponse(
				roomInfo.getRoomName(),
				username.orElse("").toString(),
				roomInfo.getUsers());
	}
}
