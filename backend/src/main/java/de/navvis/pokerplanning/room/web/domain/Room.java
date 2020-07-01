package de.navvis.pokerplanning.room.web.domain;

import lombok.Data;
import java.util.*;
import java.util.concurrent.TimeUnit;

import de.navvis.pokerplanning.room.web.exception.UserAlreadyExistsException;
import de.navvis.pokerplanning.user.web.domain.User;

@Data
public class Room
{
	/**
	 * The room's creation time.
	 */
	private final long creationTime = System.currentTimeMillis();

	/**
	 * The id of the room.
	 */
	private final UUID id = UUID.randomUUID();

	/**
	 * The list of users registered to the room.
	 */
	private Set<User> users = new HashSet<>();

	/**
	 * The id of the moderator for the room.
	 */
	private UUID moderatorId;

	/**
	 * The votes for each user in the current voting round. It is emptied before starting a new
	 * voting phase. The key is the userId and the value its estimate.
	 */
	private Map<UUID, String> votes = new HashMap<>();

	/**
	 * Whether votes in this room are currently active.
	 */
	private boolean isVotingPhase = false;

	/**
	 * Create a user with the given username and make it moderator of the room
	 *
	 * @param userId The id of the user to add as moderator
	 */
	public void setModerator(UUID userId)
	{
		this.moderatorId = userId;
	}

	/**
	 * Add the given user to the room.
	 *
	 * @param user The user to add to the room
	 * @throws UserAlreadyExistsException if a user with such username already exists
	 */
	public void addUser(User user) throws UserAlreadyExistsException
	{
		if (users.contains(user))
		{
			throw new UserAlreadyExistsException();
		}
		users.add(user);
	}

	/**
	 * Add a vote for the given username with the given estimate
	 *
	 * @param userId   The id of the user who is voting
	 * @param estimate The estimate which is being voted
	 */
	public void registerVote(UUID userId, String estimate)
	{
		if (userId == null)
		{
			return;
		}

		if (estimate == null)
		{
			votes.remove(userId);
			return;
		}
		votes.put(userId, estimate);
	}

	/**
	 * Start the voting phase. This operation is only allowed to moderators, so this check will be
	 * enforced and an exception will be thrown if not satisfied.
	 */
	public void startVotingPhase()
	{
		votes = new HashMap<>();
		this.isVotingPhase = true;
	}

	/**
	 * End the voting phase. This operation is only allowed to moderators, so this check will be
	 * enforced and an exception will be thrown if not satisfied.
	 */
	public void finishVotingPhase()
	{
		this.isVotingPhase = false;
	}

	/**
	 * Check whether the provided username is the room moderator.
	 *
	 * @param userId The id of the user to check for moderator rights.
	 * @return true if provided username is the room moderator.
	 */
	public boolean isModerator(UUID userId)
	{
		return Objects.equals(this.moderatorId, userId);
	}

	/**
	 * Check if this room has been created before the given timeValue expressed in the given
	 * timeUnit
	 *
	 * @param timeUnit  The unit for the given timeValue
	 * @param timeValue A numeric value expressed in the given timeUnit
	 * @return true if this room has been created before
	 */
	public boolean isOlderThan(TimeUnit timeUnit, int timeValue)
	{
		var currentTime = System.currentTimeMillis();
		return currentTime - this.creationTime > timeUnit.toMillis(timeValue);
	}
}
