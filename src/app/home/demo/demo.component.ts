import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {
  demoForm: FormGroup;

  constructor(private authService: AuthService, private toastr: ToastrService, private router: Router) {}

  ngOnInit(): void {
    this.demoForm = new FormGroup({
      mode: new FormControl(""),
      companyName: new FormControl(""),
      name: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      mobile: new FormControl("", [Validators.required]),
      designation: new FormControl("", [Validators.required]),
      country: new FormControl("", [Validators.required]),
    });

  }

  onDemoSubmit() {

    setTimeout ( () => {
        if (!this.demoForm.valid){
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
          let mode = (<HTMLInputElement>document.getElementById("mode")).value
          let mobile = (<HTMLInputElement>document.getElementById("usrMobile")).value
          let designation = (<HTMLInputElement>document.getElementById("usrDesignation")).value
          
          
          let obj: any = {}
          obj.msg = msg
          obj.company = usrCompany
          obj.name = usrName
          obj.email = usrEmail
          obj.location = usrLocation
          obj.mode = mode
          obj.mobile = mobile
          obj.design = designation
          
          this.authService.sendDemoMail(obj).subscribe((res) => {
  //          this.toastr.success("Email Sent to Good Faith")
              Swal.fire({
                title: "Demo Request Sent",
                text: "Thank you for contacting us for the Demo. We will get back to you within 24 hrs.",
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
