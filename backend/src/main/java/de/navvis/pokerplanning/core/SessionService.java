package de.navvis.pokerplanning.core;

import lombok.RequiredArgsConstructor;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import javax.servlet.http.HttpSession;

@Service
@RequiredArgsConstructor
public class SessionService
{
	private final HttpSession session;

	/**
	 * Obtain the attribute with the given attributeName from the session, and safely cast it to the
	 * given clazz.
	 *
	 * @param attributeName The name of the attribute to retrieve from the session
	 * @param clazz         The type used to safely cast the found object
	 * @param <T>           The object safely casted
	 * @return the object, or null of not found
	 */
	public @Nullable
	<T> T safelyGetAttribute(String attributeName, Class<T> clazz)
	{
		Object attribute = session.getAttribute(attributeName);
		return clazz.cast(attribute);
	}

	/**
	 * Binds an object to this session, using the name specified. If an object of the same name is
	 * already bound to the session, the object is replaced.
	 *
	 * @param attributeName the name to which the object is bound; cannot be null
	 * @param value         the object to be bound
	 */
	public void setAttribute(String attributeName, Object value)
	{
		session.setAttribute(attributeName, value);
	}

	/**
	 * Returns the object bound with the specified name in this session, or
	 * <code>null</code> if no object is bound under the name.
	 *
	 * @param name a string specifying the name of the object
	 * @return the object with the specified name
	 */
	public Object getAttribute(String name)
	{
		return session.getAttribute(name);
	}
}
