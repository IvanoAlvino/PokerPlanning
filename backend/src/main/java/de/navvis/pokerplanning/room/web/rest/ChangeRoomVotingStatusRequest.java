package de.navvis.pokerplanning.room.web.rest;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@NoArgsConstructor
public class ChangeRoomVotingStatusRequest
{
	UUID roomId;
}
