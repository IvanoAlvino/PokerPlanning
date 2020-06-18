package de.navvis.pokerplanning.room;

import de.navvis.pokerplanning.user.User;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.UUID;

import static java.util.stream.Collectors.toList;

@Service
public class RoomService {
	private static final Object mutex = new Object();
	private static final Map<UUID, Room> rooms = new HashMap<>();

	public UUID createRoom(String name, String moderatorUsername) {
		var users = new HashSet<User>();
		users.add(new User(moderatorUsername, true));
		var room = new Room(UUID.randomUUID(), name, users);
		synchronized (mutex) {
			rooms.put(room.getId(), room);
		}
		return room.getId();
	}

	public SimpleRoomInfo getRoomInfo(String roomId) {
		var room = rooms.get(UUID.fromString(roomId));
		return new SimpleRoomInfo(room.getName(),
				room.getUsers().stream()
						.map(User::getName)
						.collect(toList()));
	}
}
