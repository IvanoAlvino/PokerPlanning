package de.navvis.pokerplanning.room;

import de.navvis.pokerplanning.room.web.UserVoteInfo;
import de.navvis.pokerplanning.user.User;
import org.springframework.stereotype.Service;

import java.util.*;

import static java.util.stream.Collectors.toList;

@Service
public class RoomService {
	private static final Object mutex = new Object();
	private static final Set<Integer> allowedEstimates = Set.of(1, 2, 3, 5, 8, 13, 21, 34, 55, 89);
	private static final Map<UUID, Room> rooms = new HashMap<>();

	public UUID createRoom(String name, String moderatorUsername) {
		var moderator = new User(moderatorUsername, true);
		var room = new Room(UUID.randomUUID(), name);
		room.addUserWithoutCheck(moderator);
		synchronized (mutex) {
			rooms.put(room.id, room);
		}
		return room.id;
	}

	public SimpleRoomInfo getRoomInfo(String roomId) throws NoSuchRoomException {
		synchronized (mutex) {
			var room = getRoom(roomId);
			return new SimpleRoomInfo(room.name, new ArrayList<>(room.usernames));
		}
	}

	public void addUser(String name, String roomId) throws NoSuchRoomException, UserAlreadyExistsException {
		var user = new User(name, false);
		getRoom(roomId).addUser(user);
	}

	public void vote(String roomId, String username, Integer estimate) throws NoSuchRoomException {
		if (!allowedEstimates.contains(estimate)) throw new IllegalArgumentException();
		var room = getRoom(roomId);
		room.addVote(username, estimate);
	}

	public void finishVoting(String roomId, String username) throws NoSuchRoomException {
		getRoom(roomId).finishVoting(username);
	}

	public List<UserVoteInfo> status(String roomId) throws NoSuchRoomException {
		var room = getRoom(roomId);
		return room.usernames.stream().map(username -> {
			var vote = new UserVoteInfo();
			vote.setUsername(username);
			vote.setVoted(room.votes.containsKey(username));
			vote.setPreviousVote(room.formerVotes.get(username));
			return vote;
		}).collect(toList());
	}

	private Room getRoom(String roomId) throws NoSuchRoomException {
		var room = rooms.get(UUID.fromString(roomId));
		if (room == null) throw new NoSuchRoomException();
		return room;
	}

	private static class Room {
		UUID id;
		String name;
		Set<String> usernames = new HashSet<>();
		Set<String> moderatorUsernames = new HashSet<>();
		Map<String, Integer> votes = new HashMap<>();
		Map<String, Integer> formerVotes = new HashMap<>();

		Room(UUID id, String name) {
			this.id = id;
			this.name = name;
		}

		void addUserWithoutCheck(User user) {
			usernames.add(user.getName());
			if (user.isModerator()) {
				moderatorUsernames.add(user.getName());
			}
		}

		void addUser(User user) throws UserAlreadyExistsException {
			if (usernames.contains(user.getName())) throw new UserAlreadyExistsException();
			addUserWithoutCheck(user);
		}

		void addVote(String username, Integer estimate) {
			votes.put(username, estimate);
		}

		void finishVoting(String username) {
			if (!moderatorUsernames.contains(username)) throw new IllegalArgumentException();
			formerVotes = votes;
			votes = new HashMap<>();
		}
	}
}
