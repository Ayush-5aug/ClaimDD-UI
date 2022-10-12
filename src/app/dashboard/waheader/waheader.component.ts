import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ProjectService } from "src/app/services/project/project.service";
import { ClaimantService } from "src/app/services/claimant/claimant.service";
import { User } from "src/app/types/User";
import { Subscription } from "rxjs";

@Component({
  selector: "app-waheader",
  templateUrl: "./waheader.component.html",
  styleUrls: ["./waheader.component.css"],
})
export class WAheaderComponent implements OnInit {
  licenseType: string;
  assignedLicenseCount: any;
  activeLicenseCount: any;
  LicenseData: any;

  isOwner = false;
  isManager = false;
  isExecuter = false;
  isReviewer = false;
  userData: User;
  managerCount = 0;
  claimantCount = 0;
  executorCount = 0;
  activeProjectCount = 0;
  noOfLicensedProjects = 0;
  limitOfProjectValue = 0;
  NumberOfActiveProject = 0;
  licenseValidity = 0;

  claimant: any;
  project: any;
  defendant: any;
  contractRef: any;
  projectDataSubscription: Subscription;
  updatedProjectData: any;
  claimaintList: any;
  selectedClaimant: any;
  isMyPage = false;
  constructor(private router: Router, private projectService: ProjectService, private claimantService: ClaimantService) {
    this.projectDataSubscription = this.projectService.getSelectedProjectData(this.updatedProjectData).subscribe((res) => {
      this.inc(res);
    })
  }

  ngOnInit(): void {
    this.project = JSON.parse(localStorage.getItem("SelectedProjectName"))
    let managerIdList = []
    this.userData = JSON.parse(localStorage.getItem("userData"));
    console.log(this.userData)
    if (this.userData.isOwner) {
      this.isOwner = true;
        let obj : any = {}
        let obj1 : any = {}
        obj.email = this.userData['email']
        this.projectService.getLicenseData(obj).subscribe((res) => {
          console.log(res)
          this.LicenseData = res
          this.licenseType = res['licenseType']
          obj1.licenseIds = res['licenseKeys']
          //this.assignedLicenseCount = res['totalProjects']
        }), (err) => {
          console.log(err)
        }
        setTimeout(() => {
          this.projectService.getActiveLicenseCount(obj1).subscribe((res) => {
            console.log(res)
            this.activeLicenseCount = res['ActiveCount']
            this.assignedLicenseCount = res['AssignedCount']
          }), (err) => {
            console.log(err)
          }
        }, 2000)
    }
    if (this.userData.isManager) {
      this.isManager = true;
      this.isMyPage = true;
      this.projectService.getLicenseInfo(this.userData['email']).subscribe((res) => {
        console.log(res)
        //this.noOfLicensedProjects = res['activeProjects']
        this.licenseValidity = res['validity']
        //this.limitOfProjectValue = res['projectValueLimit']
        //this.NumberOfActiveProject = res['activeProjects']
        this.activeLicenseCount = res['activeLicenseCount']
        this.assignedLicenseCount  = res['assignedLicenseCount']
      })
    }
    if (this.userData.isExecuter) {
      this.isExecuter = true;
      const projectData = JSON.parse(localStorage.getItem("projectData"));
        if (projectData) {
          let claimantId = JSON.parse(localStorage.getItem("selectedClaimant"))
          this.claimantService.getCliamantById(claimantId).subscribe((res) => {
            this.claimant = res['name']
            console.log(this.claimant)
          })
            //this.claimant = projectData.claimantAs.value != "" ? projectData.claimantAs.value : projectData.claimantAs.selected
            this.defendant = projectData.nameOfDefendant
          }
    }
    if (this.userData.isReviewer) {
      this.isReviewer = true;
    } 
  }

  inc(res) {
    console.log("Value changed")
    console.log(this.projectDataSubscription)
    console.log(res)
    this.defendant = res.defendantName
    if (res.claimaintList.length > 0) {
    for (let i = 0; i < res.claimaintList.length; i++) {
      if (res.claimaintList[i]['_id'] == res.selectedClaimant) {
        this.claimant = res.claimaintList[i]['name']
        break;
      }
    }
    }
    else {
      this.claimantService.getCliamantById(res.selectedClaimant).subscribe((res) => {
        this.claimant = res['name']
        console.log(this.claimant)
      })
    }
    this.projectService.getProjectName(res.selectedProject).subscribe((res) => {
      this.project = res
      localStorage.setItem("SelectedProjectName", JSON.stringify(this.project));
      console.log(res)
    }), (err) => {
      console.log(err)
    }
  }

  onLogout() {
    localStorage.clear();
    this.router.navigate(["home/login"]);
  }
  
}
