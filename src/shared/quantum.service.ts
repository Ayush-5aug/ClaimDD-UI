import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuantumService {
  constructor(private http: HttpClient, private router: Router) {}

  public QuantumType: string = '';

  //default return observable
  defaultReturn!: Observable<any>;

  //function to add Quantum Resources Manpower Admin
  addQuantumResourcesManpowerAdmin(
    data: any,
    importMonth: any
  ): Observable<any> {
    return this.http.post(
      environment.apiBaseUrl + '/quantum/resourcesManpowerAdmin',
      {
        data: data,
        importMonth: importMonth,
      }
    );
  }

  //function to add single Quantum Resources Manpower Admin
  addSingleQuantumResourcesManpowerAdmin(
    resourceId: string,
    date: any,
    value: string
  ): Observable<any> {
    return this.http.post(
      environment.apiBaseUrl + '/quantum/resourcesManpowerAdmin/addSingle',
      {
        resourceId: resourceId,
        date: date,
        value: value,
      }
    );
  }

  //function to get Quantum Resources Manpower Admin
  getQuantumResourcesManpowerAdmin(
    startDate: any,
    endDate: any
  ): Observable<any> {
    return this.http.post(
      environment.apiBaseUrl + '/quantum/resourcesManpowerAdmin/get',
      {
        startDate: startDate,
        endDate: endDate,
      }
    );
  }

  //function to delete Quantum Resources Manpower Admin
  deleteQuantumResourcesManpowerAdmin(
    resourceId: string,
    startDate: any,
    endDate: any
  ): Observable<any> {
    return this.http.post(
      environment.apiBaseUrl + '/quantum/resourcesManpowerAdmin/delete',
      { resourceId: resourceId, startDate: startDate, endDate: endDate }
    );
  }

  //general function to import data
  importQuantumData(data: any, importMonth: any): Observable<any> {
    if (this.QuantumType == 'ResourcesManpowerAdmin') {
      return this.addQuantumResourcesManpowerAdmin(data, importMonth);
    } else {
      return this.defaultReturn;
    }
  }

  //general function to preview data
  previewQuantumData(startDate: any, endDate: any): Observable<any> {
    startDate = new Date(startDate).toDateString();
    endDate = new Date(endDate).toDateString();

    if (this.QuantumType == 'ResourcesManpowerAdmin') {
      return this.getQuantumResourcesManpowerAdmin(startDate, endDate);
    } else {
      return this.defaultReturn;
    }
  }

  setQuantumType(quantumType: string) {
    this.QuantumType = quantumType;
  }

  //general function to add single data
  addSingleQuantumData(
    resourceId: string,
    date: any,
    value: string
  ): Observable<any> {
    date = new Date(date).toDateString();

    if (this.QuantumType == 'ResourcesManpowerAdmin') {
      return this.addSingleQuantumResourcesManpowerAdmin(
        resourceId,
        date,
        value
      );
    } else {
      return this.defaultReturn;
    }
  }

  //general function to delete data
  deleteQuantumData(
    resourceId: string,
    startDate: any,
    endDate: any
  ): Observable<any> {
    startDate = new Date(startDate).toDateString();
    endDate = new Date(endDate).toDateString();
    if (this.QuantumType == 'ResourcesManpowerAdmin') {
      return this.deleteQuantumResourcesManpowerAdmin(
        resourceId,
        startDate,
        endDate
      );
    } else {
      return this.defaultReturn;
    }
  }
}
