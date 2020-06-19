import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  /**
   * Will be set to true when user is coming from a url with room id (i.e. joining an already
   * created room).
   */
  public onlyJoining: boolean = false;

  private readonly userUrl: string;

  constructor(private http: HttpClient) {
    this.userUrl = '/api/user';
  }

  public async createUser(username: string, roomId: string): Promise<void> {
    const createUserRequest: CreateUserRequest = {
      name: username,
      roomId: roomId
    };
    return this.http.post<void>(this.userUrl, createUserRequest).toPromise();
  }
}
