import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class JwtInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = JSON.parse(localStorage.getItem("userData"))?.token;
    let clone: HttpRequest<any>;
    if (token) {
      clone = request.clone({
        setHeaders: {
          Accept: `application/json`,
          //"Content-Type": `multipart/form-data; boundary=---WebKitFormBoundary7MA4YWxkTrZu0gW`,
          //"Content-Type": `application/json`,
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      clone = request.clone({
        setHeaders: {
          Accept: `application/json`,
          "Content-Type": `application/json`,
        },
      });
    }
    return next.handle(clone);
  }
}
// application/json