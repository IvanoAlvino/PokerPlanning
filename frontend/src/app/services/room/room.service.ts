import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private roomUrl: string;

  constructor(private http: HttpClient) {
    this.roomUrl = 'http://localhost:8080/api/room';
  }

  public createRoom(username: string): Observable<RoomResponse> {
    const roomRequest: RoomRequest = {
      username: username,
      roomName: "IV room"
    };
    return this.http.post<RoomResponse>(this.roomUrl, roomRequest);
  }
}
