package de.navvis.pokerplanning.user.web;

import de.navvis.pokerplanning.room.NoSuchRoomException;
import de.navvis.pokerplanning.room.RoomService;
import de.navvis.pokerplanning.room.UserAlreadyExistsException;
import de.navvis.pokerplanning.web.exception.ConflictException;
import de.navvis.pokerplanning.web.exception.NotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/user")
public class UserController {
	private final RoomService roomService;

	public UserController(RoomService roomService) {
		this.roomService = roomService;
	}

	@PostMapping
	public void createUser(@RequestBody CreateUserRequest request) {
		try {
			roomService.addUser(request.getName(), request.getRoomId());
		} catch (NoSuchRoomException e) {
			throw new NotFoundException();
		} catch (UserAlreadyExistsException e) {
			throw new ConflictException();
		}
	}
}
