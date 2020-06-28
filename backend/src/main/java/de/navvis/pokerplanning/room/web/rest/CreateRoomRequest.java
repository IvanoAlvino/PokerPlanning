package de.navvis.pokerplanning.room.web.rest;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CreateRoomRequest {
	private String moderatorUsername;
}
