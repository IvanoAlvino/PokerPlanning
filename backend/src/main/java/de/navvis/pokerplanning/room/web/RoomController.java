package de.navvis.pokerplanning.room.web;

import de.navvis.pokerplanning.room.NoSuchRoomException;
import de.navvis.pokerplanning.room.RoomService;
import de.navvis.pokerplanning.room.SimpleRoomInfo;
import de.navvis.pokerplanning.web.AttributeName;
import de.navvis.pokerplanning.web.exception.NotFoundException;
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

	@GetMapping("/{roomId}")
	public RoomInfoResponse roomInfo(@PathVariable String roomId, HttpSession session) {
		var username = Optional.ofNullable(session.getAttribute(AttributeName.USERNAME));
		SimpleRoomInfo roomInfo;
		try {
			roomInfo = roomService.getRoomInfo(roomId);
		} catch (NoSuchRoomException e) {
			session.removeAttribute(AttributeName.ROOM_ID);
			session.removeAttribute(AttributeName.USERNAME);
			throw new NotFoundException();
		}
		return new RoomInfoResponse(
				roomInfo.getRoomName(),
				username.orElse("").toString(),
				roomInfo.getUsers());
	}
}
