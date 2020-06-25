package de.navvis.pokerplanning.room;

import de.navvis.pokerplanning.room.web.UserEstimate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.TimeUnit;

import static java.util.stream.Collectors.toList;

@Service
public class RoomService {
	private static final Set<Integer> allowedEstimates = Set.of(0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89);
	private static final Map<UUID, Room> rooms = new HashMap<>();
	private static final int roomAliveTime = 8;

	public synchronized UUID createRoom(String name, String moderatorUsername) {
		var room = new Room(UUID.randomUUID(), name);
		room.addUserWithoutCheck(moderatorUsername, true);
		rooms.put(room.id, room);
		return room.id;
	}

	public synchronized SimpleRoomInfo getRoomInfo(String roomId) throws NoSuchRoomException {
		removeStaleRooms();
		var room = getRoom(roomId);
		removeStaleRooms();
		return new SimpleRoomInfo(room.name, new ArrayList<>(room.usernames));
	}

	public synchronized void addUser(String name, String roomId) throws NoSuchRoomException, UserAlreadyExistsException {
		getRoom(roomId).addUser(name, false);
	}

	public synchronized void vote(String roomId, String username, Integer estimate) throws NoSuchRoomException {
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
		String name;
		Set<String> usernames = new HashSet<>();
		Set<String> moderatorUsernames = new HashSet<>();
		Map<String, Integer> votes = new HashMap<>();
		private boolean isVotingPhase = false;

		Room(UUID id, String name) {
			this.id = id;
			this.name = name;
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

		void addVote(String username, Integer estimate) {
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
