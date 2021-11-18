package de.navvis.pokerplanning.room.web;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

import de.navvis.pokerplanning.core.SessionService;
import de.navvis.pokerplanning.room.RoomService;
import de.navvis.pokerplanning.room.web.domain.UserEstimate;
import de.navvis.pokerplanning.room.web.exception.NoSuchRoomException;
import de.navvis.pokerplanning.room.web.rest.ChangeRoomVotingStatusRequest;
import de.navvis.pokerplanning.room.web.rest.RoomStatus;
import de.navvis.pokerplanning.room.web.rest.VoteRequest;
import de.navvis.pokerplanning.user.web.domain.User;
import de.navvis.pokerplanning.web.exception.UnauthorizedException;

@RestController
@CrossOrigin
public class VotesController
{
	private final RoomService roomService;

	private final SessionService sessionService;

	private final Boolean fun;

	public VotesController(RoomService roomService,
		SessionService sessionService, @Value("${instance.likes_fun}") Boolean fun)
	{
		this.roomService = roomService;
		this.sessionService = sessionService;
		this.fun = fun;
	}

	@PostMapping("/api/votes")
	public void vote(@RequestBody VoteRequest request)
	{
		User user = sessionService.getUserForRoom(request.getRoomId());
		try
		{
			roomService.vote(request.getRoomId(), user.getId(), request.getEstimate());
		}
		catch (NoSuchRoomException e)
		{
			throw new UnauthorizedException();
		}
	}

	@PostMapping("/api/startVoting")
	public void startVoting(@RequestBody ChangeRoomVotingStatusRequest request)
	{
		UUID roomId = request.getRoomId();
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
	public void finishVoting(@RequestBody ChangeRoomVotingStatusRequest request)
	{
		UUID roomId = request.getRoomId();
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
			User user = sessionService.getUserForRoom(roomId);
			return new RoomStatus(roomStatus, isVotingOngoing, moderatorId, user.getId(), this.fun);
		}
		catch (NoSuchRoomException e)
		{
			throw new UnauthorizedException();
		}
	}
}
