import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Events } from './events.model';
@Injectable({
  providedIn: 'root',
})
export class EventsService {
  selectedEvent: Events = {
    eventID: '',
    description: '',
    type: '',
    startDate: new Date(),
    endDate: new Date(),
    daysOnCompletion: 0,
    extendedContractDuaration: 0,
    pevAtStart: 0,
    pevAtEnd: 0,
    aevAtStart: 0,
    aevAtEnd: 0,
    costClaimable: '',
    timeClaimReference: '',
  };
  constructor(private http: HttpClient, private router: Router) {}

  //function to get events
  getEvents(): Observable<any> {
    return this.http.get(environment.apiBaseUrl + '/events');
  }

  //function to add new event
  addEvents(event: Events): Observable<any> {
    return this.http.post(environment.apiBaseUrl + '/events', event);
  }
}
