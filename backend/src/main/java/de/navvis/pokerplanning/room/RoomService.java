package de.navvis.pokerplanning.room;

import de.navvis.pokerplanning.user.User;
import lombok.Builder;
import lombok.Data;
import org.springframework.stereotype.Service;

import java.util.*;

import static java.util.stream.Collectors.toList;

@Service
public class RoomService {
	private static final Object mutex = new Object();
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

	public SimpleRoomInfo getRoomInfo(String roomId) {
		synchronized (mutex) {
			var room = rooms.get(UUID.fromString(roomId));
			return new SimpleRoomInfo(room.name,
					room.users.stream()
							.map(User::getName)
							.collect(toList()));
		}
	}

	public void addUser(String name, String roomId) throws NoSuchRoomException, UserAlreadyExistsException {
		var room = rooms.get(UUID.fromString(roomId));
		if (room == null) throw new NoSuchRoomException();
		var user = new User(name, false);
		room.addUser(user);
	}

	private static class Room {
		UUID id;
		String name;
		List<User> users = new ArrayList<>();
		Set<String> usernames = new HashSet<>();

		Room(UUID id, String name) {
			this.id = id;
			this.name = name;
		}

		void addUserWithoutCheck(User user) {
			users.add(user);
			usernames.add(user.getName());
		}

		void addUser(User user) throws UserAlreadyExistsException {
			if (usernames.contains(user.getName())) throw new UserAlreadyExistsException();
			addUserWithoutCheck(user);
		}
	}
}
