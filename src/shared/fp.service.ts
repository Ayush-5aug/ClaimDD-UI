import { Injectable } from '@angular/core';
import { Fp } from './fp.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FpService {
  selectedFp: Fp = {
    _id: '',
    hoOverheadPercentage: 0,
    profitPercentage: 0,
    yearlyInterest: 0,
    interestType: 'simple',
    compoundingPeriod: 'Daily',
    annualTurnover: 0,
    annualHOOC: 0,
    annualProfit: 0,
    actualTurnover: 0,
    actualHOOC: 0,
    actualProfit: 0,
    hoOverheadAndProfitFromula: '',
    hoOverheadCostPerDay: 0,
    profitAmountPerDay: 0,
    project: '',
  };
  constructor(private http: HttpClient, private router: Router) {}

  //function to add Financial particular
  addFinancialParticular(fpService: FpService): Observable<any> {
    return this.http.post(
      environment.apiBaseUrl + '/financialParticulars',
      fpService
    );
  }

  //function to get  Financial particular
  getFinancialParticular() {
    const response = this.http.get(
      environment.apiBaseUrl + '/financialParticulars'
    ) as Observable<any>;
    response.subscribe(
      (res) => {
        console.log(res['data']);
        this.selectedFp = res['data'];
        return true;
      },
      (err) => {
        console.log(err.error);
        return false;
      }
    );
  }
}
