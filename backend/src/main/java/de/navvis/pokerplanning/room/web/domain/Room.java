package de.navvis.pokerplanning.room.web.domain;

import lombok.Data;
import org.springframework.stereotype.Component;
import java.util.*;
import java.util.concurrent.TimeUnit;

import de.navvis.pokerplanning.room.web.exception.UserAlreadyExistsException;

@Component
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
	private UUID id = UUID.randomUUID();

	/**
	 * The list of users registered to the room.
	 */
	private Set<String> usernames = new HashSet<>();

	/**
	 * The list of moderators for the room.
	 */
	private Set<String> moderatorUsernames = new HashSet<>();

	/**
	 * The votes for a the current voting phase. This only contains votes for the given round, and
	 * is emptied before starting a new voting phase.
	 */
	private Map<String, String> votes = new HashMap<>();

	/**
	 * Whether votes in this room are currently active.
	 */
	private boolean isVotingPhase = false;

	/**
	 * Create a user with the given username and make it moderator of the room
	 *
	 * @param username The name for the user to create
	 */
	public void addModeratorUser(String username)
	{
		usernames.add(username);
		moderatorUsernames.add(username);
	}

	/**
	 * Add a user with the given username.
	 *
	 * @param username The name of the user to create
	 * @throws UserAlreadyExistsException if a user with such username already exists
	 */
	public void addUser(String username) throws UserAlreadyExistsException
	{
		if (usernames.contains(username))
		{
			throw new UserAlreadyExistsException();
		}
		usernames.add(username);
	}

	/**
	 * Add a vote for the given username with the given estimate
	 *
	 * @param username The username who is voting
	 * @param estimate The estimate which is being voted
	 */
	public void registerVote(String username, String estimate)
	{
		if (estimate == null)
		{
			votes.remove(username);
			return;
		}
		votes.put(username, estimate);
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

	public boolean isModerator(String name)
	{
		return moderatorUsernames.contains(name);
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
