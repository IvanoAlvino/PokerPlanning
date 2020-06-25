export class ApiError extends Error
{
	constructor(message?: string, public response?: ErrorResponse)
	{
		super(message);
	}
}

export enum ErrorResponse
{
	ROOM_DOESNT_EXIST,
	USER_DOESNT_EXIST,
	USERNAME_IS_TAKEN
}
