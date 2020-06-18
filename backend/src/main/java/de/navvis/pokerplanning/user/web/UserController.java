package de.navvis.pokerplanning.user.web;

import de.navvis.pokerplanning.room.NoSuchRoomException;
import de.navvis.pokerplanning.room.RoomService;
import de.navvis.pokerplanning.room.UserAlreadyExistsException;
import de.navvis.pokerplanning.web.AttributeName;
import de.navvis.pokerplanning.web.exception.ConflictException;
import de.navvis.pokerplanning.web.exception.NotFoundException;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

@RestController
@CrossOrigin
@RequestMapping("/api/user")
public class UserController {
	private final RoomService roomService;

	public UserController(RoomService roomService) {
		this.roomService = roomService;
	}

	@PostMapping
	public void createUser(@RequestBody CreateUserRequest request, HttpSession session) {
		try {
			roomService.addUser(request.getName(), request.getRoomId());
			session.setAttribute(AttributeName.USERNAME, request.getName());
			session.setAttribute(AttributeName.ROOM_ID, request.getRoomId());
		} catch (NoSuchRoomException e) {
			throw new NotFoundException();
		} catch (UserAlreadyExistsException e) {
			throw new ConflictException();
		}
	}
}
