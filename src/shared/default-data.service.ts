import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Claimant } from './claimant.model';
import { Observable } from 'rxjs';
import { DefaultData } from './default-data.model';
@Injectable({
  providedIn: 'root',
})
export class DefaultDataService {
  public defaultData: DefaultData[] = [];
  constructor(private http: HttpClient, private router: Router) {}

  //function to get all default data
  getDefaultData(): Observable<any> {
    return this.http.get(environment.apiBaseUrl + '/defaultData');
  }

  //function to add default claimant
  addDefaultClaimant(claimantID: string): Observable<any> {
    return this.http.post(environment.apiBaseUrl + '/defaultData/claimant', {
      claimantID: claimantID,
    });
  }

  //function to add default project
  addDefaultProject(projectID: string): Observable<any> {
    return this.http.post(environment.apiBaseUrl + '/defaultData/project', {
      projectID: projectID,
    });
  }

  //function to remove default project
  removeDefaultProject(): Observable<any> {
    return this.http.delete(environment.apiBaseUrl + '/defaultData/project');
  }
}
