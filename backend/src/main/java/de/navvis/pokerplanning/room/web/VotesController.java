package de.navvis.pokerplanning.room.web;

import de.navvis.pokerplanning.room.web.domain.UserEstimate;
import de.navvis.pokerplanning.room.web.exception.NoSuchRoomException;
import de.navvis.pokerplanning.room.RoomService;
import de.navvis.pokerplanning.room.web.rest.RoomStatus;
import de.navvis.pokerplanning.room.web.rest.VoteRequest;
import de.navvis.pokerplanning.web.domain.AttributeName;
import de.navvis.pokerplanning.web.exception.UnauthorizedException;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@CrossOrigin
public class VotesController
{
	private final RoomService roomService;

	private final HttpSession session;

	@PostMapping("/api/votes")
	public void vote(@RequestBody VoteRequest request)
	{
		var username = safelyGetAttribute(AttributeName.USERNAME, String.class);
		var roomId = request.getRoomId();
		try
		{
			roomService.vote(roomId, username, request.getEstimate());
		}
		catch (NoSuchRoomException e)
		{
			throw new UnauthorizedException();
		}
	}

	@PostMapping("/api/startVoting")
	public void startVoting()
	{
		UUID roomId = safelyGetAttribute(AttributeName.ROOM_ID, UUID.class);
		try
		{
			roomService.startVoting(roomId);
		}
		catch (NoSuchRoomException | IllegalAccessException e)
		{
			throw new UnauthorizedException();
		}
	}

	@PostMapping("/api/finishVoting")
	public void finishVoting()
	{
		var roomId = safelyGetAttribute(AttributeName.ROOM_ID, UUID.class);
		try
		{
			roomService.finishVoting(roomId);
		}
		catch (NoSuchRoomException | IllegalAccessException e)
		{
			throw new UnauthorizedException();
		}
	}

	@GetMapping("/api/updates/{roomId}")
	public RoomStatus fetchRoomStatus(@PathVariable UUID roomId)
	{
		try
		{
			List<UserEstimate> roomStatus = roomService.getStatus(roomId);
			boolean isVotingOngoing = roomService.isVotingOngoing(roomId);
			String moderatorUsername = roomService.getModeratorUsername(roomId);
			String username = safelyGetAttribute(AttributeName.USERNAME, String.class);
			return new RoomStatus(roomStatus, isVotingOngoing, moderatorUsername, username);
		}
		catch (NoSuchRoomException e)
		{
			throw new UnauthorizedException();
		}
	}

	private <T> T safelyGetAttribute(String attributeName, Class<T> clazz)
	{
		Object attribute = session.getAttribute(attributeName);
		return clazz.cast(attribute);
	}
}
