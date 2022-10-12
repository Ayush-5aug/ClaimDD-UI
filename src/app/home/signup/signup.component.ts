import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth/auth.service";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import * as EmailValidator from 'email-validator';

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  isEmailVerified: Boolean;
  verifyMsg: any;
  EmailModalRef: any;
  show: boolean = false;
  constructor(private authService: AuthService, private router: Router, private modalService: NgbModal, private toastr: ToastrService,) {}

  ngOnInit(): void {
    this.isEmailVerified = false;
    this.verifyMsg = "Not Verified";
    this.registerForm = new FormGroup({
      userName: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required]),
      confirmPassword: new FormControl("", [Validators.required]),
      isOwner: new FormControl(""),
      companyName: new FormControl(""),
      designation: new FormControl(""),
      phone: new FormControl(""),
      city: new FormControl(""),
      country: new FormControl("India", [Validators.required]),
    });
  }

  onRegisterSubmit(modelRef: any) {
    let obj: any = {}
    obj.email = this.registerForm.value.email
    if (!EmailValidator.validate(this.registerForm.value.email))
    {
      this.toastr.error("Please enter a valid email")
      return;
    }
    obj.userType = "isOwner"
    console.log(obj.email)
    if (obj.email) {
    this.authService.checkEmailVerified(obj).subscribe(
      (res) => {
        console.log(res)
        this.isEmailVerified = res['message'];
      }
    )
    }
    setTimeout ( () => {
      console.log(this.isEmailVerified)
      if(this.isEmailVerified == false) {
        //this.EmailModalRef = this.modalService.open(modelRef);
        /*if (this.registerForm.valid){
        Swal.fire({
          title: "Not Valid Data",
          text: "Please enter necessary data.",
          icon: "warning",
        })
        return;
        }*/
        Swal.fire({
          title: "Email is not yet verified.",
          text: "Please verify the email to sign up.",
          icon: "warning",
        })
        return;

      }
      else {
      this.verifyMsg = "Verified";
      if (!this.registerForm.valid){
        Swal.fire({
          title: "Not Valid Data",
          text: "Please enter necessary data.",
          icon: "warning",
        })
        return;
      }
      if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
        this.toastr.error("Password & Confirm Password should match");
        return;
      }
      this.authService.register(this.registerForm.value).subscribe(
        (res) => {
          //this.toastr.success("Sign Up Successfull");
          this.authService.sendSignUpCredentials(obj).subscribe(
            (res) => {
              console.log(res)
            },
            (err) => {
              console.log({ err });
            });
            Swal.fire({
              title: "Sign Up Successful",
              text: "You can Log In as a Owner with your credentials that emailed to you.",
              icon: "success",
            })
          this.router.navigate(["/home/login"]);
        },
        (err) => {
          console.log({ err });
        }
      );
      }
    }, 300);
  }


  sendLink() {
    let obj: any = {}
    obj.email = this.registerForm.value.email
    obj.userType = "isOwner";
    if (!EmailValidator.validate(this.registerForm.value.email))
    {
      this.toastr.error("Please enter a valid email !")
      return;
    }
    this.authService.checkEmailVerified(obj).subscribe(
      (res) => {
        this.isEmailVerified = res['message'];
      }
    )
    setTimeout ( () => {
      if(!this.isEmailVerified) {
        this.verifyMsg = "Not Verified";
        //this.EmailModalRef = this.modalService.open(modelRef);
        this.authService.sendVerificationLink(obj).subscribe(
          (res) => {
            console.log(res)
            Swal.fire({
              title: "Verification Link - Emailed ",
              text: "Please check and verify the email to sign up.",
              icon: "success",
            })    
          },
          (err) => {
            console.log({ err });
          });
        return;
      }
      else {
      this.verifyMsg = "Verified";
      this.toastr.success("Email is already verified")
      return;
      }
    }, 500);
  }


  
  password() {
    this.show = !this.show;
  }
}
