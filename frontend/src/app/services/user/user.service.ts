import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CreateUserRequest} from "./domain/CreateUserRequest";

@Injectable({
	providedIn: 'root'
})
export class UserService
{
	private readonly userUrl: string = '/api/user';

	/**
	 * Will be set to true when user is coming from a url with room id (i.e. joining an already
	 * created room).
	 */
	public onlyJoining: boolean = false;

	constructor(private http: HttpClient)
	{
	}

	/**
	 * Create a user with given username in the room with given roomId
	 * @param username The name of the user to create
	 * @param roomId The id of the room where to create the user
	 */
	public async createUser(username: string, roomId: string): Promise<void>
	{
		const createUserRequest: CreateUserRequest = {
			name: username,
			roomId: roomId
		};
		return this.http.post<void>(this.userUrl, createUserRequest).toPromise();
	}
}
