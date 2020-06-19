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

  public async roomInfo(): Promise<RoomInfoResponse> {
    try {
      const roomInfo = await this.http.get<RoomInfoResponse>(this.roomUrl).toPromise();
      this.username = roomInfo.username;
      return roomInfo;
    } catch (e) {
      switch (e.status) {
        case 404:
          this.roomId = undefined;
          this.username = undefined;
          throw new ApiError("Specified room doesn't exist!", ErrorResponse.ROOM_DOESNT_EXIST);
        case 401:
          this.username = undefined;
          throw new ApiError("User is not registered in a room!", ErrorResponse.USER_DOESNT_EXIST);
        default:
          throw new Error("Unknown server error");
      }
    }
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
