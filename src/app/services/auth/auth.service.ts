import { apiBaseUrl } from "./../../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { throwError } from "rxjs";
import { User } from "../../types/User";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient) {}
  register(userData: User) {
    return this.http.post<any>(`${apiBaseUrl}users/register`, userData).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  login(userData: User) {
    return this.http.post<any>(`${apiBaseUrl}users/login`, userData).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  // ------------------manager----------------
  registerManager(userData: User) {
    return this.http
      .post<any>(`${apiBaseUrl}users/register-manager`, userData)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getManager() {
    return this.http.get<any>(`${apiBaseUrl}users/get-manager`).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  updateManager(userData: User, id: string) {
    return this.http
      .put<any>(`${apiBaseUrl}users/edit-manager/${id}`, userData)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }


  sendVerificationLink(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}users/sendVerificationLink`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  sendSignUpCredentials(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}users/sendSignUpCredentials`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
 
  sendVerificationLinkforManager(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}users/sendVerificationLinkforManager`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
 
  sendVerificationLinkforExecuter(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}users/sendVerificationLinkforExecuter`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
 
  sendVerificationLinkforReviewer(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}users/sendVerificationLinkforReviewer`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
 

  sendForgotPasswordLink(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}users/sendForgotPasswordLink`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }


  verifyVerificationLink(id: any) {
    return this.http
      .get<any>(`${apiBaseUrl}users/verifyVerificationLink/${id}`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  
  verifyVerificationLinkforNonOwner(id: any) {
    return this.http
      .get<any>(`${apiBaseUrl}users/verifyVerificationLinkforNonOwner/${id}`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  forgotPwd() {
    return this.http
      .get<any>(`${apiBaseUrl}users/forgotPwd/`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  /*saveNewpwd() {
    let pwd : any;
    return this.http
      .get<any>(`${apiBaseUrl}users/saveNewpwd`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }*/

  checkEmailVerified(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}users/checkEmailVerified/`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  deleteManager(id: string) {
    return this.http
      .delete<any>(`${apiBaseUrl}users/delete-manager/${id}`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  // -----------------manager end--------------------

  // ------------------------executer----------------
  registerExecuter(userData: User) {
    return this.http
      .post<any>(`${apiBaseUrl}users/register-executer`, userData)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getExecuter() {
    return this.http.get<any>(`${apiBaseUrl}users/get-executer`).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  updateExecuter(userData: User, id: string) {
    return this.http
      .put<any>(`${apiBaseUrl}users/edit-executer/${id}`, userData)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  deleteExecuter(id: string) {
    return this.http
      .delete<any>(`${apiBaseUrl}users/delete-executer/${id}`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  // --------------------------executer end----------------

  // ------------------------Reviewer----------------
  registerReviewer(userData: User) { // done
    return this.http
      .post<any>(`${apiBaseUrl}users/register-reviewer`, userData)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getReviewer() { // done
    return this.http.get<any>(`${apiBaseUrl}users/get-reviewer`).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  updateReviewer(userData: User, id: string) { // done
    return this.http
      .put<any>(`${apiBaseUrl}users/edit-reviewer/${id}`, userData)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  deleteReviewer(id: string) { // done
    return this.http
      .delete<any>(`${apiBaseUrl}users/delete-reviewer/${id}`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  // --------------------------Reviewer end----------------

  getReviewerId(email: string) { // done
    return this.http
      .get<any>(`${apiBaseUrl}users/get-reviewer-id/${email}`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getReviewerData(id: string) { // done
    return this.http
      .get<any>(`${apiBaseUrl}users/get-reviewer-data/${id}`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  changeUserPwd(obj: any) { 
    return this.http
      .post<any>(`${apiBaseUrl}users/changePassword/`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  setTrailLicense(obj: any) { 
    return this.http
      .post<any>(`${apiBaseUrl}users/setTrailLicense/`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getTrailLicense(obj: any) { 
    return this.http
      .post<any>(`${apiBaseUrl}users/getTrailLicense/`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  sendContactMail(obj: any) { 
    return this.http
      .post<any>(`${apiBaseUrl}users/sendContactMail/`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  sendDemoMail(obj: any) { 
    return this.http
      .post<any>(`${apiBaseUrl}users/sendDemoMail/`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  sendSubscribeMail(obj: any) { 
    return this.http
      .post<any>(`${apiBaseUrl}users/sendSubscribeMail/`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }


  IsUserSignedUp(obj: any) { 
    return this.http
      .post<any>(`${apiBaseUrl}users/IsUserSignedUp/`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
