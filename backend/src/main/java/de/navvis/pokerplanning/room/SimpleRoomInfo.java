package de.navvis.pokerplanning.room;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class SimpleRoomInfo {
	private String roomName;
	private List<String> users;
}
