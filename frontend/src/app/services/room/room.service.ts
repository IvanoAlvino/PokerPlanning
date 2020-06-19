import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ApiError, ErrorResponse} from "./domain/error/ApiError";

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

  public async roomInfo(roomId: string): Promise<RoomInfoResponse> {
    try {
      this.roomId = roomId;
      const roomInfo = await this.http.get<RoomInfoResponse>(`${this.roomUrl}/${roomId}`).toPromise();
      this.username = roomInfo.username;
      return roomInfo;
    } catch (e) {
      this.handleApiError(e);
    }
  }

  public async createUser(username: string): Promise<void> {
    const userRequest: CreateUserRequest = {
      name: username,
      roomId: this.roomId
    };
    try {
      await this.http.post<void>(this.userUrl, userRequest).toPromise();
      this.username = username;
    } catch (e) {
      this.handleApiError(e);
    }
  }

  private handleApiError(e: HttpErrorResponse): void {
    switch (e.status) {
      case 401:
        this.username = undefined;
        throw new ApiError("User is not registered in a room!", ErrorResponse.USER_DOESNT_EXIST);
      case 404:
        this.roomId = undefined;
        this.username = undefined;
        throw new ApiError("Specified room doesn't exist!", ErrorResponse.ROOM_DOESNT_EXIST);
      case 409:
        throw new ApiError("User with this username is already registered in a room!",
          ErrorResponse.USERNAME_IS_TAKEN);
      default:
        throw new Error("Unknown server error");
    }
  }
}

