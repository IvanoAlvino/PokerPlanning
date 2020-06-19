import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private readonly roomUrl: string;

  constructor(private http: HttpClient) {
    this.roomUrl = '/api/room';
  }

  public createRoom(username: string): Promise<RoomResponse> {
    const roomRequest: RoomRequest = {
      username: username,
      roomName: "IV room"
    };
    return this.http.post<RoomResponse>(this.roomUrl, roomRequest).toPromise();
  }

  public roomInfo(): Promise<RoomInfoResponse> {
    return this.http.get<RoomInfoResponse>(this.roomUrl).toPromise();
  }
}
