import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: "app-contact-us",
  templateUrl: "./contact-us.component.html",
  styleUrls: ["./contact-us.component.css"],
})
export class ContactUsComponent implements OnInit {
  contactForm: FormGroup;

  constructor(private authService: AuthService, private toastr: ToastrService, private router: Router) {}

  ngOnInit(): void {
    this.contactForm = new FormGroup({
      companyName: new FormControl(""),
      name: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),  
      country: new FormControl("", [Validators.required]),
    });

  }

  onMessageSubmit() {

    setTimeout ( () => {
        if (!this.contactForm.valid){
        Swal.fire({
          title: "Data",
          text: "Please provide all mandatory data.",
          icon: "warning",
        })
        return;
        }
        else {
          let msg = (<HTMLInputElement>document.getElementById("msg")).value
          let usrCompany = (<HTMLInputElement>document.getElementById("usrCompany")).value
          let usrName = (<HTMLInputElement>document.getElementById("usrName")).value
          let usrEmail = (<HTMLInputElement>document.getElementById("usrEmail")).value
          let usrLocation = (<HTMLInputElement>document.getElementById("usrLocation")).value
          let obj: any = {}
          obj.msg = msg
          obj.company = usrCompany
          obj.name = usrName
          obj.email = usrEmail
          obj.location = usrLocation
          this.authService.sendContactMail(obj).subscribe((res) => {
  //          this.toastr.success("Email Sent to Good Faith")
              Swal.fire({
                title: "Message Sent",
                text: "Thank you for contacting us. We will get back to you within 24hrs.",
                icon: "success",
              })
          //this.router.navigate(["/home"]);
          }, (err) => {
            this.toastr.error(err.error.err)
          })
        }
    }, 300);
  }
}
