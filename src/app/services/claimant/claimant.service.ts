import { apiBaseUrl } from "./../../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Claimant } from "src/app/types/Claimant";

@Injectable({
  providedIn: "root",
})
export class ClaimantService {
  constructor(private http: HttpClient) {}

  addClaimant(claimantData: Claimant) {
    return this.http
      .post<any>(`${apiBaseUrl}claimants/create-claimant`, claimantData)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getAllClaimant() {
    return this.http.get<any>(`${apiBaseUrl}claimants/get-all-claimant`).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  getExecuterCliamant() {
    return this.http
      .get<any>(`${apiBaseUrl}claimants/get-executer-claimant`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getCliamantById(id: any) {
    return this.http
      .get<any>(`${apiBaseUrl}claimants/get-claimant/${id}`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  editClaimant(claimantData: Claimant, id: string) {
    return this.http
      .put<any>(`${apiBaseUrl}claimants/update-claimant/${id}`, claimantData)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  deleteClaimant(id: string) {
    return this.http
      .delete<any>(`${apiBaseUrl}claimants/delete-claimant/${id}`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
