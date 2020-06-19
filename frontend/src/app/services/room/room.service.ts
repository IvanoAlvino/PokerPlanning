import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private readonly roomUrl: string;
  private readonly userUrl: string;
  public roomId: string;
  public username: string;

  constructor(private http: HttpClient) {
    this.roomUrl = '/api/room';
    this.userUrl = '/api/user';
  }

  public async createRoom(username: string): Promise<RoomResponse> {
    const roomRequest: RoomRequest = {
      username: username,
      roomName: "IV room"
    };
    const roomResponse = await this.http.post<RoomResponse>(this.roomUrl, roomRequest).toPromise();
    this.roomId = roomResponse.roomId;
    this.username = username;
    return roomResponse;
  }

  public roomInfo(): Promise<RoomInfoResponse> {
    return this.http.get<RoomInfoResponse>(this.roomUrl).toPromise();
  }

  public async createUser(username: string): Promise<void> {
    const userRequest: CreateUserRequest = {
      name: username,
      roomId: this.roomId
    };
    await this.http.post<void>(this.userUrl, userRequest).toPromise();
    this.username = username;
    return;
  }
}
