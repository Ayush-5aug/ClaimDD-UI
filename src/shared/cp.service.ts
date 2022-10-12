import { Injectable } from '@angular/core';
import { Cp } from './cp.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CpService {
  today = new Date();
  selectedCp: Cp = {
    nameOfDefendant: '',
    contractRef: '',
    currency: '',
    originalContractPrice: 0,
    durationUnit: '',
    originalContractDuration: 0,
    commencementDate: this.datepipe.transform(this.today, 'yyyy-MM-dd'),
    workingHours: 0,
    claimCause: '',
    projectStatus: '',
    latestAmendmentReference: '',
    revisedContractPrice: 0,
    revisedContractDuration: 0,
    project: '',
  };
  constructor(
    private http: HttpClient,
    private router: Router,
    public datepipe: DatePipe
  ) {}

  //function to add contract particular
  addContractParticular(cpService: CpService): Observable<any> {
    return this.http.post(
      environment.apiBaseUrl + '/contractParticulars',
      cpService
    );
  }

  //function to get  contract particular
  getContractParticular() {
    const response = this.http.get(
      environment.apiBaseUrl + '/contractParticulars'
    ) as Observable<any>;
    response.subscribe(
      (res) => {
        console.log(res['data']);
        this.selectedCp = res['data'];
        this.selectedCp.commencementDate = this.datepipe.transform(
          this.selectedCp.commencementDate,
          'yyyy-MM-dd'
        );
        return true;
      },
      (err) => {
        console.log(err.error);
        return false;
      }
    );
  }
}
