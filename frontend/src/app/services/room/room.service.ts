import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ApiError, ErrorResponse} from "./domain/error/ApiError";

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  public roomId: string;
  public username: string;
  private readonly roomUrl: string;
  private readonly userUrl: string;
  private readonly voteUrl: string;
  private readonly finishVotingUrl: string;
  private readonly updatesUrl: string;

  constructor(private http: HttpClient) {
    this.roomUrl = '/api/room';
    this.userUrl = '/api/user';
    this.voteUrl = '/api/votes';
    this.finishVotingUrl = '/api/finishVoting';
    this.updatesUrl = '/api/updates';
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

  public async vote(estimate: number): Promise<void> {
    const voteRequest: VoteRequest = {
      estimate
    }
    try {
      await this.http.post(this.voteUrl, voteRequest).toPromise();
    } catch (e) {
      this.handleApiError(e);
    }
  }

  public async finishVoting(): Promise<void> {
    try {
      await this.http.post(this.finishVotingUrl, undefined).toPromise();
    } catch (e) {
      this.handleApiError(e);
    }
  }

  public async updates(roomId: string): Promise<UpdatesResponse> {
    try {
      return await this.http.get<UpdatesResponse>(`${this.updatesUrl}/${roomId}`).toPromise();
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

