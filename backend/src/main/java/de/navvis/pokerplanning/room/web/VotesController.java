package de.navvis.pokerplanning.room.web;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

import de.navvis.pokerplanning.core.SessionService;
import de.navvis.pokerplanning.room.RoomService;
import de.navvis.pokerplanning.room.web.domain.UserEstimate;
import de.navvis.pokerplanning.room.web.exception.NoSuchRoomException;
import de.navvis.pokerplanning.room.web.rest.RoomStatus;
import de.navvis.pokerplanning.room.web.rest.VoteRequest;
import de.navvis.pokerplanning.web.exception.UnauthorizedException;

import static de.navvis.pokerplanning.web.domain.AttributeName.*;

@RequiredArgsConstructor
@RestController
@CrossOrigin
public class VotesController
{
	private final RoomService roomService;

	private final SessionService sessionService;

	@PostMapping("/api/votes")
	public void vote(@RequestBody VoteRequest request)
	{
		UUID userId = sessionService.safelyGetAttribute(USER_ID, UUID.class);
		UUID roomId = request.getRoomId();
		try
		{
			roomService.vote(roomId, userId, request.getEstimate());
		}
		catch (NoSuchRoomException e)
		{
			throw new UnauthorizedException();
		}
	}

	@PostMapping("/api/startVoting")
	public void startVoting()
	{
		UUID roomId = sessionService.safelyGetAttribute(ROOM_ID, UUID.class);
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
		var roomId = sessionService.safelyGetAttribute(ROOM_ID, UUID.class);
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
			UUID moderatorId = roomService.getModeratorUsername(roomId);
			UUID userId = sessionService.safelyGetAttribute(USER_ID, UUID.class);
			return new RoomStatus(roomStatus, isVotingOngoing, moderatorId, userId);
		}
		catch (NoSuchRoomException e)
		{
			throw new UnauthorizedException();
		}
	}
}
