import { apiBaseUrl } from "./../../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Observable, throwError, Subject } from "rxjs";
import { Project } from "src/app/types/Project";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class ProjectService {

  private subject = new Subject<any>();

  sendSelectedProjectData(res: any) {
    this.subject.next(res);
  }

  getSelectedProjectData(res) {
    return this.subject.asObservable();
  }

  constructor(private http: HttpClient,
    private router: Router) {}

  addProject(projectData: Project, claimantId: string) {
    let obj: any = {};
    obj.name = projectData.name;
    obj.claimantId = claimantId;
    obj.assignedLicenseKey = projectData['assignedLicenseKey'];
    return this.http
      .post<any>(`${apiBaseUrl}projects/create-project`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getAvailableLicenseKeys(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}projects/getAvailableLicenseKeys`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getAllProject(claimantId: string) {
    return this.http
      .get<any>(`${apiBaseUrl}projects/get-all-project/${claimantId}`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getExecuterProject(claimantId: string) {
    return this.http
      .get<any>(`${apiBaseUrl}projects/get-executer-project/${claimantId}`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  editProject(projectData: Project, id: string) {
    return this.http
      .put<any>(`${apiBaseUrl}projects/update-project/${id}`, projectData)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  updateProjectData(projectId: string, projectData: any) {
    console.log(projectData)
    return this.http
      .post<any>(
        `${apiBaseUrl}projects/update-project-data/${projectId}`,
        projectData
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  uploadImage(projectId: string, formData: any) {
    return this.http.post(`${apiBaseUrl}projects/uploadImage/${projectId}`,formData).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  /*getImage(imagePath: string) {
    return this.http.get(`${apiBaseUrl}projects/getImage/${imagePath}`).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }*/

  getProjectDataById(projectId: string) {
    return this.http
      .get<any>(`${apiBaseUrl}projects/get-project-data/${projectId}`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getRatesById(projectId: string) {
    return this.http
      .get<any>(`${apiBaseUrl}projects/rates/${projectId}`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getQuantumById(projectId: string) {
    return this.http
      .get<any>(`${apiBaseUrl}projects/quantum/${projectId}`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  deleteProject(id: string) {
    return this.http
      .delete<any>(`${apiBaseUrl}projects/delete-project/${id}`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  deleteEvent(id: string, index : any) {
    let obj : any = {}
    obj.projectId = id
    obj.index = index
    return this.http
      .post<any>(`${apiBaseUrl}projects/delete-event`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  editEvent(id: string, index : any, obj: any) {
    let obj1 : any = {}
    obj1.projectId = id
    obj1.index = index
    obj1.data = obj
    return this.http
      .post<any>(`${apiBaseUrl}projects/edit-event`, obj1)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  assignExecuter(projectId: string, claimantId: string, executerId: string) {
    let obj: any = {};
    obj.projectId = projectId;
    obj.claimantId = claimantId;
    obj.executerId = executerId;
    return this.http
      .post<any>(`${apiBaseUrl}projects/assign-executer`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getAssignedExecuter(executerId: string) {
    return this.http
      .get<any>(`${apiBaseUrl}projects/assign-executer/${executerId}`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getPreviewData(projectId: string, field: string, selectedTab: string) {
    let obj: any = {};
    obj.projectId = projectId;
    obj.field = field;
    obj.selectedTab = selectedTab;
    return this.http
      .post<any>(`${apiBaseUrl}projects/get-preview-data`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  addDataToProjectwithDate(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}projects/addDataToProjectWithDate/`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  searchDataWithDates(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}projects/searchDataWithDates/`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  searchData(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}projects/searchData/`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  addDataToProject(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}projects/addDataToProject/`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  editCellData(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}projects/editCellData/`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  editRowData(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}projects/editRowData/`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  downloadTemplate(fileName: string): Observable<any> {
      const param = new HttpParams().set('filename', fileName)
      const options = {
        params: param
      };
      return this.http.get(`${apiBaseUrl}projects/download/${fileName}`, {...options, responseType: 'blob'})
  }

  deletePreviewData(obj: any) {
    console.log(obj)
    return this.http
      .post<any>(`${apiBaseUrl}projects/delete-preview-data/`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  deleteCellPreviewData(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}projects/delete-cell-preview-data/`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  saveLicenseData(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}projects/saveLicenseData/`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getLicenseData(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}projects/getLicenseData/`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getLicenseDates(projectId: any) {
    return this.http
      .get<any>(`${apiBaseUrl}projects/getLicenseDates/${projectId}`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getAllLicenseKeyData(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}projects/getAllLicenseKeyData/`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  updateLicenseValidity(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}projects/updateLicenseValidity/`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  upgradeLicense(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}projects/upgradeLicense/`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getEvents(projectId: string) {
    const obj: any = {}
    obj.projectId = projectId
    return this.http
      .post<any>(`${apiBaseUrl}projects/getEvents/`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getManagerProjects(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}projects/getManagerProjects/`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  deleteAssignedExecuter(
    projectId: string,
    claimantId: string,
    executerId: string
  ) {
    const obj: any = {};
    obj.projectId = projectId;
    obj.claimantId = claimantId;
    obj.executerId = executerId;
    console.log(obj);
    return this.http
      .post<any>(`${apiBaseUrl}projects/remove-executer`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getAllClaims(projectId: string) {
    return this.http
      .get<any>(`${apiBaseUrl}projects/get-all-claims/${projectId}`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  assignProjectToReviewer(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}projects/assignProjectToReviewer/`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  unassignClaimFromReviewer(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}projects/unassignClaimFromReviewer/`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  showassignProjectOfReviewer(reviewerId: string) {
    return this.http
      .get<any>(`${apiBaseUrl}projects/showassignProjectOfReviewer/${reviewerId}`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getManagersCount(ownerEmail: string) {
    return this.http
      .get<any>(`${apiBaseUrl}projects/getManagersCount/${ownerEmail}`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getClaimantCount(managerIdList: any) {
    console.log(managerIdList)
    return this.http
      .post<any>(`${apiBaseUrl}projects/getClaimantCount`, managerIdList)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getExecutorCount(managerIdList: any) {
    console.log(managerIdList)
    return this.http
      .post<any>(`${apiBaseUrl}projects/getExecutorCount`, managerIdList)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getActiveProjectsCount(managerIdList: any) {
    console.log(managerIdList)
    return this.http
      .post<any>(`${apiBaseUrl}projects/getActiveProjectsCount`, managerIdList)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getLicenseInfo(managerEmail: any) {
    return this.http
      .get<any>(`${apiBaseUrl}projects/getLicenseInfo/${managerEmail}`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getProjectName(projectId: string) {
    console.log("CALEED")
    return this.http
      .get<any>(`${apiBaseUrl}projects/getProjectName/${projectId}`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  checkTrailProject(obj: any) {
    console.log("CALEED")
    return this.http
      .post<any>(`${apiBaseUrl}projects/checkTrailProject`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getManagerExecutorNames(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}projects/getManagerExecutorNames`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  deactivateLicenseKey(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}projects/deactivateLicenseKey`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getActiveLicenseCount(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}projects/getActiveLicenseCount`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  validateLicenseEmail(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}projects/validateLicenseEmail`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getLicenseDataFromProjectId(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}projects/getLicenseDataFromProjectId`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getLicenseCurrencyFromProjectId(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}projects/getLicenseCurrencyFromProjectId`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  makePayment(stripeToken: any, data: any): Observable<any>{
    const url = "https://claimdd-wa.herokuapp.com/payment/"
    return this.http.post<any>(url,{token:stripeToken, data: data})
  }

  updateUtility(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}projects/updateUtility`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getCurrencyData(countryCode: any) {
    return this.http
      .post<any>('https://claimdd-wa.herokuapp.com/getConversionRates', countryCode)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  checkForUniqueEventId(obj: any) {
    return this.http
      .post<any>(`${apiBaseUrl}projects/checkForUniqueEventId`, obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
