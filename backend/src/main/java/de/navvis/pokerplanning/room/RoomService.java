package de.navvis.pokerplanning.room;

import de.navvis.pokerplanning.room.web.domain.UserEstimate;
import de.navvis.pokerplanning.room.web.exception.NoSuchRoomException;
import de.navvis.pokerplanning.room.web.exception.UserAlreadyExistsException;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.TimeUnit;

import static java.util.stream.Collectors.toList;

@Service
public class RoomService {
	private static final Set<String> allowedEstimates =
		Set.of("0", "0.5", "1", "2", "3", "5", "8", "13", "20", "40", "100", "?");
	private static final Map<UUID, Room> rooms = new HashMap<>();
	private static final int roomAliveTime = 8;

	public synchronized UUID createRoom(String moderatorUsername) {
		var room = new Room();
		room.addUserWithoutCheck(moderatorUsername, true);
		rooms.put(room.id, room);
		return room.id;
	}

	public synchronized void doesRoomExist(String roomId) throws NoSuchRoomException
	{
		removeStaleRooms();
		getRoom(roomId);
	}

	public synchronized void addUser(String name, String roomId) throws NoSuchRoomException,
		UserAlreadyExistsException
	{
		getRoom(roomId).addUser(name, false);
	}

	public synchronized void vote(String roomId, String username, String estimate) throws NoSuchRoomException {
		if (estimate != null && !allowedEstimates.contains(estimate)) {
			throw new IllegalArgumentException();
		}
		var room = getRoom(roomId);
		room.addVote(username, estimate);
	}

	public void startVoting(String roomId, String username) throws NoSuchRoomException
	{
		getRoom(roomId).startVoting();
	}

	public synchronized void finishVoting(String roomId, String username) throws NoSuchRoomException {
		getRoom(roomId).finishVoting(username);
	}

	public synchronized List<UserEstimate> status(String roomId) throws NoSuchRoomException {
		var room = getRoom(roomId);
		return room.usernames.stream().map(username -> {
			var vote = new UserEstimate();
			vote.setUsername(username);
			vote.setVoted(room.votes.containsKey(username));
			vote.setEstimate(room.votes.get(username));
			return vote;
		}).collect(toList());
	}

	private synchronized Room getRoom(String roomId) throws NoSuchRoomException {
		var room = rooms.get(UUID.fromString(roomId));
		if (room == null) throw new NoSuchRoomException();
		return room;
	}

	private void removeStaleRooms() {
		var currentTime = System.currentTimeMillis();
		rooms.entrySet().removeIf((entry) -> currentTime - entry.getValue().creationTime >
				TimeUnit.HOURS.toMillis(roomAliveTime));
	}

	public boolean isVotingOngoing(String roomId) throws NoSuchRoomException
	{
		return getRoom(roomId).isVotingPhase;
	}

	private static class Room {
		long creationTime = System.currentTimeMillis();
		UUID id;
		Set<String> usernames = new HashSet<>();
		Set<String> moderatorUsernames = new HashSet<>();
		Map<String, String> votes = new HashMap<>();
		private boolean isVotingPhase = false;

		Room() {
			this.id = UUID.randomUUID();
		}

		void addUserWithoutCheck(String username, boolean moderator) {
			usernames.add(username);
			if (moderator) {
				moderatorUsernames.add(username);
			}
		}

		void addUser(String username, boolean moderator) throws UserAlreadyExistsException {
			if (usernames.contains(username)) throw new UserAlreadyExistsException();
			addUserWithoutCheck(username, moderator);
		}

		void addVote(String username, String estimate) {
			if (estimate == null)
			{
				votes.remove(username);
				return;
			}
			votes.put(username, estimate);
		}

		public void startVoting()
		{
			votes = new HashMap<>();
			this.isVotingPhase = true;
		}

		void finishVoting(String username) {
			if (!moderatorUsernames.contains(username)) {
				throw new IllegalArgumentException();
			}
			this.isVotingPhase = false;
		}
	}
}
