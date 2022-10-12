import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Claimant } from './claimant.model';
import { Observable } from 'rxjs';
import { Project } from './project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  public projects: Project[] = [];
  constructor(private http: HttpClient, private router: Router) {}

  //function to get all  claimants
  getProjectsofClaimant(claimantID: any): Observable<any> {
    return this.http.get(
      environment.apiBaseUrl + '/projects/claimantID/' + claimantID
    );
  }
}
