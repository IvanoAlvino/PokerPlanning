package de.navvis.pokerplanning.room.web;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoteRequest
{
	private String estimate;

	private String roomId;
}
