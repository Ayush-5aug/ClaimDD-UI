import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth/auth.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService, private modalService: NgbModal, private toastr: ToastrService,) {}
  loginForm: FormGroup;
  forgetPwdModelRef: any;
  emailId: any;
  isError: Boolean = false;
  errorMsg: string = "";
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required]),
      userType: new FormControl("isOwner", [Validators.required])
    });
  }
  onLoginSubmit() {
    //if (!this.loginForm.valid) return;
    if (!this.loginForm.valid){
      Swal.fire({
        title: "Not Valid Data",
        text: "Please enter necessary data.",
        icon: "warning",
      })
      return;
    }

    let obj: any = {}
    obj.email = this.loginForm.value.email
    obj.userType = this.loginForm.value.userType
    this.authService.checkEmailVerified(obj).subscribe(
      (res) => {
       console.log(res)
        if(res['message'] == false) {                 // if user is not registered/verified (change login condition to false)
          if (obj.userType == "isOwner") {   
            this.isError = true;
            Swal.fire({
              title: "Sure?",
              text: "You are not signed up to log in as an Owner.",
              icon: "info",
            })
          }
          else {
            this.isError = true;
            //this.errorMsg = "User is neither registered nor verified.";
            Swal.fire({
              title: "Sure?",
              text: "You are either registered or verified the email.",
              icon: "info",
            })
          }
        }
        else {              // verified user
        setTimeout(() => {
          this.authService.login(this.loginForm.value).subscribe(
            (res) => {
              localStorage.setItem("userData", JSON.stringify(res));
              if (res['isReviewer'] == true) {
                this.toastr.success("Welcome Reviewer");
                this.router.navigate(["/User/reviewerDashboard"])
              }
              else if (res['isOwner'] == true) {
                this.toastr.success("Welcome Owner");
                this.router.navigate(["/User/create-manager"])
              }
              else if (res['isManager'] == true) {
                this.toastr.success("Welcome Manager");
                this.router.navigate(["/User/create-executer"])
              }
              else {
                this.toastr.success("Welcome Executer");
                this.router.navigate(["/User"]);
              }
            },
            (err) => 
            {
            // this.toastr.error("Invalid Credentials.");
              Swal.fire({
                title: "Invalid Credentials",
                text: "Please enter correct credentials.",
                icon: "info",
              })
        
              console.log({ err })
            }
          );
        }, 500);
      }
    }
    )
  }

  forgotPwd(modelRef: any) {
    this.forgetPwdModelRef = this.modalService.open(modelRef);
  }
  
  sendForgotPasswordLink() {
    this.forgetPwdModelRef.close();
    let obj: any = {}
    obj.email = this.emailId
    obj.forgotPwd = true
    obj.userType = this.loginForm.value.userType
    this.authService.sendForgotPasswordLink(obj).subscribe(
      (res) => {
        console.log(res)
        Swal.fire({
          title: "Emailed",
          text: "Password reset link is emailed.",
          icon: "info",
        })

      },
      (err) => {
        console.log({ err });
      });
  }
}
