import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Claimant } from './claimant.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClaimantService {
  public claimants: Claimant[] = [];
  constructor(private http: HttpClient, private router: Router) {}

  //function to get all  claimants
  getAllClaimants(): Observable<any> {
    return this.http.get(environment.apiBaseUrl + '/claimants');
  }
}
