package de.navvis.pokerplanning.room.web;

import de.navvis.pokerplanning.room.RoomService;
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
		session.setAttribute("username", request.getUsername());
		session.setAttribute("roomId", roomId);
		return new CreateRoomResponse(roomId.toString());
	}

	@GetMapping
	public RoomInfoResponse roomInfo(HttpSession session) {
		var roomId = Optional.ofNullable(session.getAttribute("roomId"));
		var username = Optional.ofNullable(session.getAttribute("username"));
		if (roomId.isEmpty() || username.isEmpty()) throw new NotFoundException();
		var roomInfo = roomService.getRoomInfo(roomId.get().toString());
		return new RoomInfoResponse(
				roomInfo.getRoomName(),
				username.orElse("").toString(),
				roomInfo.getUsers());
	}
}
