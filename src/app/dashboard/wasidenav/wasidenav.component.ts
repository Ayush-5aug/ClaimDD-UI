import { Component, OnInit } from "@angular/core";
import { User } from "src/app/types/User";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../services/auth/auth.service";



@Component({
  selector: "app-wasidenav",
  templateUrl: "./wasidenav.component.html",
  styleUrls: ["./wasidenav.component.css"],
})
export class WASidenavComponent implements OnInit {
  userData: User;
  isOwner: boolean = false;
  isManager = false;
  isMyPage = false;
  isExecuter: boolean = false;
  isReviewer: boolean = false;
  dashboardUrl = "../User";
  openChangePwdRef: any;
  prevOption: any = ""
  openClaimSelectionRef: any
  
  constructor(private router: Router, private modalService: NgbModal, private toastr: ToastrService, private authService: AuthService) {}

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    console.log(this.userData)
    if (this.userData.isOwner) {
      this.isOwner = true;
    }
    if (this.userData.isManager) {
      this.isManager = true;
      this.isMyPage = true;
    }
    if (this.userData.isReviewer) {
      this.isReviewer = true
      this.dashboardUrl = "../User/reviewerDashboard"
    }
    if (this.userData.isExecuter) {
      this.isExecuter = true
    }

  }

  onLogout() {
    localStorage.clear();
    this.router.navigate(["home/login"]);
  }

  openPopUp(modelRef: any) {
    this.openChangePwdRef = this.modalService.open(modelRef);
  }

  operations(modelRef: any) {
    let option = (<HTMLInputElement>document.getElementById("operations")).value
    console.log(option)
    if (option == "logout") {
      this.prevOption = "";
      this.onLogout();
    }
    if (option == "pwdChange" && this.prevOption != "pwdChange") {
      this.prevOption = option;
      this.openPopUp(modelRef);
    }
    if (option == "") {
      this.prevOption = ""
    }
  }

  changePwd() {
    let newPwd = (<HTMLInputElement>document.getElementById("newPwd")).value
    let cnfPwd = (<HTMLInputElement>document.getElementById("cnfPwd")).value
    if (!cnfPwd || !newPwd) {
      this.toastr.error("Feilds can not be empty")
      return
    }
    if (cnfPwd != newPwd) {
      this.toastr.error("New password & Confirm Password should match")
      return
    }
    let obj : any = {}
    obj.email = this.userData['email']
    obj.isOwner = this.userData['isOwner']
    obj.isManager = this.userData['isManager']
    obj.isExecuter = this.userData['isExecuter']
    obj.isReviewer = this.userData['isReviewer']
    obj.newPwd = newPwd
    this.authService.changeUserPwd(obj).subscribe((res) => {
      localStorage.setItem("userData", JSON.stringify(res['user']));
    }), (err) => {
      console.log(err)
    }
    this.openChangePwdRef.close();
    window.location.reload();
  }



}
