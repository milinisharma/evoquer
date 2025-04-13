import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebService {

  constructor(
    private http: HttpClient
  ) { }

  getEventList () {
    return this.http.get("../../assets/sample-json/event-list.json")
  }

  saveEvent (body: any) {
    return this.http.post("_save_api_here_", body);
  }

  getCalender () {
    return this.http.get("../../assets/sample-json/calender-list.json")
  }


}
