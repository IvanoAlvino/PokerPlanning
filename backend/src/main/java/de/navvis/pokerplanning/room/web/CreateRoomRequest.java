package de.navvis.pokerplanning.room.web;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CreateRoomRequest {
	private String username;
	private String roomName;
}
