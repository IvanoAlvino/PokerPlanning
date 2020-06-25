package de.navvis.pokerplanning.room.web;

import de.navvis.pokerplanning.room.NoSuchRoomException;
import de.navvis.pokerplanning.room.RoomService;
import de.navvis.pokerplanning.web.AttributeName;
import de.navvis.pokerplanning.web.exception.UnauthorizedException;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

@RestController
@CrossOrigin
public class VotesController {
	private final RoomService roomService;

	public VotesController(RoomService roomService) {
		this.roomService = roomService;
	}

	@PostMapping("/api/votes")
	public void vote(@RequestBody VoteRequest request, HttpSession session) {
		var username = session.getAttribute(AttributeName.USERNAME).toString();
		var roomId = request.getRoomId();
		try {
			roomService.vote(roomId, username, request.getEstimate());
		}	catch (NoSuchRoomException e) {
			session.removeAttribute(AttributeName.ROOM_ID);
			session.removeAttribute(AttributeName.USERNAME);
			throw new UnauthorizedException();
		}
	}

	@PostMapping("/api/finishVoting")
	public void finishVoting(HttpSession session) {
		var username = session.getAttribute(AttributeName.USERNAME).toString();
		var roomId = session.getAttribute(AttributeName.ROOM_ID).toString();
		try {
			roomService.finishVoting(roomId, username);
		}	catch (NoSuchRoomException e) {
			session.removeAttribute(AttributeName.ROOM_ID);
			session.removeAttribute(AttributeName.USERNAME);
			throw new UnauthorizedException();
		}
	}

	@PostMapping("/api/startVoting")
	public void startVoting(HttpSession session) {
		var username = session.getAttribute(AttributeName.USERNAME).toString();
		var roomId = session.getAttribute(AttributeName.ROOM_ID).toString();
		try {
			roomService.startVoting(roomId, username);
		}	catch (NoSuchRoomException e) {
			session.removeAttribute(AttributeName.ROOM_ID);
			session.removeAttribute(AttributeName.USERNAME);
			throw new UnauthorizedException();
		}
	}

	@GetMapping("/api/updates/{roomId}")
	public UpdateResponse updates(@PathVariable String roomId, HttpSession session) {
		try {
			return new UpdateResponse(roomService.status(roomId), roomService.isVotingOngoing(roomId));
		}	catch (NoSuchRoomException e) {
			session.removeAttribute(AttributeName.ROOM_ID);
			session.removeAttribute(AttributeName.USERNAME);
			throw new UnauthorizedException();
		}
	}
}
