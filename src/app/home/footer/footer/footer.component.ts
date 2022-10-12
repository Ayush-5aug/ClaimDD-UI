import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  subscriptionForm: FormGroup;

  constructor(private authService: AuthService, private toastr: ToastrService, private router: Router) {}

  ngOnInit(): void {
    this.subscriptionForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),  
    });

  }

  onSubscribeSubmit() {

    setTimeout ( () => {
        if (!this.subscriptionForm.valid){
        Swal.fire({
          title: "Data",
          text: "Please provide all mandatory data.",
          icon: "warning",
        })
        return;
        }
        else {
          let usrName = (<HTMLInputElement>document.getElementById("usrName")).value
          let usrEmail = (<HTMLInputElement>document.getElementById("usrEmail")).value
          let obj: any = {}
          obj.name = usrName
          obj.email = usrEmail
          this.authService.sendSubscribeMail(obj).subscribe((res) => {
  //          this.toastr.success("Email Sent to Good Faith")
              Swal.fire({
                title: "Subscribed",
                text: "Thank you for subscribing for our news letter.",
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
