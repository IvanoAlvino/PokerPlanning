package de.navvis.pokerplanning.room;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.concurrent.TimeUnit;

import de.navvis.pokerplanning.core.SessionService;
import de.navvis.pokerplanning.room.web.domain.Room;
import de.navvis.pokerplanning.room.web.domain.UserEstimate;
import de.navvis.pokerplanning.room.web.exception.NoSuchRoomException;
import de.navvis.pokerplanning.room.web.exception.UserAlreadyExistsException;
import de.navvis.pokerplanning.user.web.domain.User;

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
	 * // TODO clean this array periodically, otherwise it will only grow bigger and bigger
	 */
	private static final Map<UUID, Room> rooms = new HashMap<>();

	/**
	 * The maximum amount of time expressed in hours a room in the {@link #rooms} can live. Rooms
	 * older than such value will be removed.
	 */
	private static final int ROOM_HOURS_TTL = 8;

	private final SessionService sessionService;

	/**
	 * Create a new room and assign the given moderatorUsername as moderator.
	 *
	 * @return the id of the created room
	 */
	public synchronized Room createRoom()
	{
		var room = new Room();
		rooms.put(room.getId(), room);
		return room;
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
	 * @param user   The user to add to the room
	 * @param roomId The id of the room where to add the user
	 * @throws NoSuchRoomException        if no room with the given id is found
	 * @throws UserAlreadyExistsException if a user with the same username already exists in the
	 *                                    room
	 */
	public synchronized void addUserToRoom(User user, UUID roomId) throws NoSuchRoomException,
		UserAlreadyExistsException
	{
		getRoom(roomId).addUser(user);
	}

	/**
	 * Register a vote for the given username in the given roomId with the given estimate.
	 *
	 * @param roomId   The id of the room where the vote will happen.
	 * @param userId   The id of the user who is voting
	 * @param estimate The estimate which has been selected by the user
	 * @throws NoSuchRoomException if no room with the given id is found
	 */
	public synchronized void vote(UUID roomId, UUID userId, String estimate)
		throws NoSuchRoomException
	{
		if (estimate != null && !ALLOWED_ESTIMATES.contains(estimate))
		{
			// TODO log here what happened
			throw new IllegalArgumentException();
		}

		Room room = getRoom(roomId);
		if (!room.isVotingPhase())
		{
			return;
		}

		room.registerVote(userId, estimate);
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
		User user = sessionService.getUserForRoom(room.getId());
		if (user == null || !room.isModerator(user.getId()))
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
			.getUsers()
			.stream()
			.map(user -> {
				var userEstimate = new UserEstimate();
				userEstimate.setUsername(user.getName());
				userEstimate.setUserId(user.getId());
				userEstimate.setVoted(room.getVotes().containsKey(user.getId()));
				// Only return the real estimates if the voting phase is finished
				if (!room.isVotingPhase())
				{
					userEstimate.setEstimate(room.getVotes().get(user.getId()));
				}
				return userEstimate;
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
	 *
	 * @param roomId The id of the room
	 * @return the moderator username
	 * @throws NoSuchRoomException if no room with the given id is found
	 */
	public UUID getModeratorUsername(UUID roomId) throws NoSuchRoomException
	{
		return getRoom(roomId).getModeratorId();
	}

	/**
	 * Set the user with the given userId as moderator of the room with the given roomId
	 *
	 * @param userId The id of the user to set as moderator
	 * @param roomId The id of the room where to set the moderator
	 * @throws NoSuchRoomException if no room with the given id is found
	 */
	public void setModeratorForRoom(UUID userId, UUID roomId)
		throws NoSuchRoomException
	{
		getRoom(roomId).setModeratorId(userId);
	}

	/**
	 * Assign the user identified by the newModeratorId for the room with the given roomId. Only a
	 * moderator can trigger this change.
	 *
	 * @param roomId         The id of the room
	 * @param newModeratorId The id of the new moderator
	 * @throws NoSuchRoomException    if no room with the given id is found
	 * @throws IllegalAccessException if the user triggering this change is not a moderator
	 */
	public void changeModerator(UUID roomId, UUID newModeratorId)
		throws NoSuchRoomException, IllegalAccessException
	{
		Room room = getRoom(roomId);
		enforceModeratorRights(room);
		room.setModeratorId(newModeratorId);
	}
}
