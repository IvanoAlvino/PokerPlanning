package de.navvis.pokerplanning.room;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import javax.servlet.http.HttpSession;
import java.util.*;
import java.util.concurrent.TimeUnit;

import de.navvis.pokerplanning.room.web.domain.Room;
import de.navvis.pokerplanning.room.web.domain.UserEstimate;
import de.navvis.pokerplanning.room.web.exception.NoSuchRoomException;
import de.navvis.pokerplanning.room.web.exception.UserAlreadyExistsException;
import de.navvis.pokerplanning.web.domain.AttributeName;

import static java.util.stream.Collectors.toList;

@RequiredArgsConstructor
@Service
public class RoomService
{
	/**
	 * The list of allowed estimates votes.
	 */
	private static final Set<String> ALLOWED_ESTIMATES =
		Set.of("0", "0.5", "1", "2", "3", "5", "8", "13", "20", "40", "100", "?");

	/**
	 * The map of all rooms.
	 */
	private static final Map<UUID, Room> rooms = new HashMap<>();

	/**
	 * The maximum amount of time expressed in hours a room in the {@link #rooms} can live. Rooms
	 * older than such value will be removed.
	 */
	private static final int ROOM_HOURS_TTL = 8;

	/**
	 * The current http session.
	 */
	private final HttpSession session;

	/**
	 * Create a new room and assign the given moderatorUsername as moderator.
	 *
	 * @param moderatorUsername The name of the room's moderator
	 * @return the id of the created room
	 */
	public synchronized UUID createRoom(String moderatorUsername)
	{
		var room = new Room();
		room.addModeratorUser(moderatorUsername);
		rooms.put(room.getId(), room);
		return room.getId();
	}

	/**
	 * Check if the room with the provided roomId exists, and throw an exception if it does not.
	 *
	 * @param roomId The id of the room for which to check existence
	 * @throws NoSuchRoomException if no room with such id exists.
	 */
	public synchronized void doesRoomExist(UUID roomId) throws NoSuchRoomException
	{
		removeStaleRooms();
		getRoom(roomId);
	}

	/**
	 * Add the user with the given name to the room with the given roomId.
	 *
	 * @param name   The name of the user to add to the room
	 * @param roomId The id of the room where to add the user
	 * @throws NoSuchRoomException        if no room with the given id is found
	 * @throws UserAlreadyExistsException if a user with the same username already exists in the
	 *                                    room
	 */
	public synchronized void addUserToRoom(String name, UUID roomId) throws NoSuchRoomException,
		UserAlreadyExistsException
	{
		getRoom(roomId).addUser(name);
	}

	/**
	 * Register a vote for the given username in the given roomId with the given estimate.
	 *
	 * @param roomId   The room where the vote will happen.
	 * @param username The name of the user who will vote.
	 * @param estimate The estimate which has been selected by the user
	 * @throws NoSuchRoomException if no room with the given id is found
	 */
	public synchronized void vote(UUID roomId, String username, String estimate)
		throws NoSuchRoomException
	{
		if (estimate != null && !ALLOWED_ESTIMATES.contains(estimate))
		{
			throw new IllegalArgumentException();
		}
		getRoom(roomId).registerVote(username, estimate);
	}

	/**
	 * Start the voting phase in the room with the given roomId
	 *
	 * @param roomId The if of the room where to start the voting phase
	 * @throws NoSuchRoomException    if a room with the given id does not exist.
	 * @throws IllegalAccessException if the user requesting this operation is not a moderator.
	 */
	public void startVoting(UUID roomId) throws NoSuchRoomException, IllegalAccessException
	{
		Room room = getRoom(roomId);
		enforceModeratorRights(room);
		room.startVotingPhase();
	}

	/**
	 * Finish the voting phase in the room with the given roomId
	 *
	 * @param roomId The if of the room where to start the voting phase
	 * @throws NoSuchRoomException    if a room with the given id does not exist
	 * @throws IllegalAccessException if the user requesting this operation is not a moderator.
	 */
	public synchronized void finishVoting(UUID roomId)
		throws NoSuchRoomException, IllegalAccessException
	{
		Room room = getRoom(roomId);
		enforceModeratorRights(room);
		room.finishVotingPhase();
	}

	/**
	 * Check if the current user is a moderator, and throw an exception if otherwise.
	 *
	 * @throws IllegalAccessException if the user is not a moderator
	 */
	private void enforceModeratorRights(Room room) throws IllegalAccessException
	{
		var username = session.getAttribute(AttributeName.USERNAME).toString();
		if (!room.isModerator(username))
		{
			throw new IllegalAccessException();
		}
	}

	/**
	 * Get the current status for the room with the given roomId.
	 *
	 * @param roomId The id of the room
	 * @return the list of actions for all users registered to the room
	 * @throws NoSuchRoomException if no room with the given id is found
	 */
	public synchronized List<UserEstimate> getStatus(UUID roomId) throws NoSuchRoomException
	{
		Room room = getRoom(roomId);
		return room
			.getUsernames()
			.stream()
			.map(username -> {
				var vote = new UserEstimate();
				vote.setUsername(username);
				vote.setVoted(room.getVotes().containsKey(username));
				// Only return the real estimates if the voting phase is finished
				if (!room.isVotingPhase())
				{
					vote.setEstimate(room.getVotes().get(username));
				}
				return vote;
			})
			.collect(toList());
	}

	/**
	 * Get the room with the given roomId.
	 *
	 * @param roomId The if of the room to retrieve.
	 * @return the resolved room
	 * @throws NoSuchRoomException if no room with the given id is found
	 */
	private synchronized Room getRoom(UUID roomId) throws NoSuchRoomException
	{
		Optional<Room> room = Optional.ofNullable(rooms.get(roomId));
		return room.orElseThrow(NoSuchRoomException::new);
	}

	/**
	 * Remove all rooms from {@link #rooms} that are older than {@link #ROOM_HOURS_TTL}.
	 */
	private void removeStaleRooms()
	{
		rooms
			.entrySet()
			.removeIf((entry) -> entry.getValue().isOlderThan(TimeUnit.HOURS, ROOM_HOURS_TTL));
	}

	/**
	 * Check if the room with the given id is currently in the voting phase
	 *
	 * @param roomId The id of the room
	 * @return whether the vote is currently ongoing
	 * @throws NoSuchRoomException if no room with the given id is found
	 */
	public boolean isVotingOngoing(UUID roomId) throws NoSuchRoomException
	{
		return getRoom(roomId).isVotingPhase();
	}

	/**
	 * Get the moderator username for the room with the provided roomId.
	 * @param roomId The id of the room
	 * @return the moderator username
	 * @throws NoSuchRoomException if no room with the given id is found
	 */
	public String getModeratorUsername(UUID roomId) throws NoSuchRoomException
	{
		return getRoom(roomId).getModeratorUsername();
	}
}
