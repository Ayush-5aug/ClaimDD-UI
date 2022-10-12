import { Component, OnInit } from "@angular/core";
import { User } from "src/app/types/User";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { matchValidator } from "../../../shared/matchValidator";
import { AuthService } from "../../services/auth/auth.service";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { catchError, delay } from "rxjs/operators";
import { ProjectService } from "src/app/services/project/project.service";
import { throwError } from "rxjs/internal/observable/throwError";
import { Console } from "console";

@Component({
  selector: "app-create-manager",
  templateUrl: "./create-manager.component.html",
  styleUrls: ["./create-manager.component.css"],
})
export class CreateManagerComponent implements OnInit {
  trailLicenseProjectName: string;
  selectedManager: any;
  managerResetEmail: string;
  resetPwdForm: FormGroup;
  resetPwdModal: any;
  validity: any;
  selectedExecutor: any;
  licenseData: any;
  seletedRow: any;
  numberOfProject: any;
  projectValue: any;
  currency: any;
  licenseValidity: any;
  userData: User;
  addManagerForm: FormGroup;
  trailLicenseForm: FormGroup;
  managerList: Array<User>;
  modalReference: any;
  isEditingManager = false;
  editingManagerId: string;
  licenseKeyData: any;
  trailLicenseData: any;
  licenseId: any;
  licenseModalRef: any;
  traillicenseModalRef: any;
  managerModalRef: any;
  managerClaimantData: any;
  buttonText: any;
  isDisabledTrailButton : Boolean;

  manageLicense = true;
  manageManager = false;
  licenseDetails = false;
  FormatedPV:any;
  constructor(
    private projectService: ProjectService,
    private router: Router,
    private modalService: NgbModal,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.isDisabledTrailButton = false;
    this.buttonText = "Activate Flexi Plan";
    this.userData = JSON.parse(localStorage.getItem("userData"));
    if (!this.userData.isOwner) this.router.navigate(["/dashboard"]);
    this.getManager();
    this.addManagerForm = new FormGroup({
      userName: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [
        Validators.required,
        matchValidator("confirmPassword", true),
      ]),
      confirmPassword: new FormControl("", [
        Validators.required,
        matchValidator("password"),
      ]),
    });
    this.resetPwdForm = new FormGroup({
      newPwd: new FormControl("", [Validators.required]),
      cnfPwd: new FormControl("", [Validators.required]),
    });
    this.trailLicenseForm = new FormGroup({
      projectRegion: new FormControl("Middle East", [Validators.required]),
      currency: new FormControl("AED", [Validators.required]),
      projectValue: new FormControl("100000000", [Validators.required]),
      startDate: new FormControl("", [Validators.required]),
      validity: new FormControl({value: '', disabled: true}),
      local: new FormControl("en-US"),
    });
    let obj: any = {}
    obj.email = this.userData.email
    this.projectService
            .getLicenseData(obj)
            .subscribe((res) => {
              console.log(res)
              this.licenseData = res
              if(this.licenseData['licenseKeys'].length != 0) {
                this.buttonText = "Manage Flexi Plan"
              }
              localStorage.setItem(
                "licenseData",
                JSON.stringify(res)
              );
              this.projectValue = res['projectValueLimit']
              this.currency = res['currency']
              this.numberOfProject = res['totalProjects']
              this.licenseValidity = res['validity']
              this.licenseId = res['_id']
              console.log(this.licenseId)
      });
      setTimeout (() => {
        let obj3: any = {}
        obj3.email = this.userData.email
        console.log(this.userData.email)
        this.authService
              .getTrailLicense(obj3)
              .subscribe((res) => {
                this.trailLicenseData = res['user']
                console.log(res)
                console.log(new Intl.DateTimeFormat(this.trailLicenseData['local'], {year: 'numeric', month: 'short', day: 'numeric'}).format(new Date(this.trailLicenseData['trialLicenseStartDate'])))
                if (this.trailLicenseData && this.trailLicenseData['region']) {
                  //this.isDisabledTrailButton = true;
                  this.trailLicenseForm.patchValue({
                    projectRegion: this.trailLicenseData['region'],
                    currency: this.trailLicenseData['currency'],
                    projectValue: this.trailLicenseData['projectValue'],
                    local: this.trailLicenseData['local'],
                    startDate: new Intl.DateTimeFormat(this.trailLicenseData['local'], {year: 'numeric', month: 'short', day: 'numeric'}).format(new Date(this.trailLicenseData['trialLicenseStartDate'])),
                    validity: this.trailLicenseData['validity'],
                  })
                  this.getValidity(event);
                }
                console.log(this.trailLicenseData)
        });
      }, 1500);
      setTimeout (() => {
      let obj1: any = {}
      obj1.licenseId = this.licenseId
      console.log(this.licenseId)
      this.projectService
            .getAllLicenseKeyData(obj1)
            .subscribe((res) => {
              console.log(res)
              //this.licenseKeyData = res;
              this.formatLicenseKeyData(res);
      });
    }, 2500);
      setTimeout (() => {
        let obj2: any =[]
        for(let i = 0; i < this.managerList.length; i++) {
          obj2.push(this.managerList[i]['_id'])
        }
        this.projectService
              .getManagerProjects(obj2)
              .subscribe((res) => {
                console.log(res)
                this.managerClaimantData = res
                console.log(this.managerClaimantData)
        });
        console.log(this.trailLicenseData['projectId'])
        this.projectService.getProjectName(this.trailLicenseData['projectId']).subscribe((res) => {
          console.log(res)
          this.trailLicenseProjectName = res
        }, (err) => {
          this.trailLicenseProjectName = "Not Found"
        })
      }, 2500);
  }
  openAddManagerModal(content: any) {
    this.modalReference = this.modalService.open(content);
    this.modalReference.closed.subscribe((data: any) => {
      this.addManagerForm.reset();
    });
    this.modalReference.dismissed.subscribe((data: any) => {
      this.addManagerForm.reset();
    });
  }

  formatLicenseKeyData(data: any) {
    for(let i = 0; i < data.length; i++) {
      if (data[i][1]) {
        data[i][1] = new Intl.DateTimeFormat(this.trailLicenseData['local'], {year: "numeric", month: "long", day: "numeric"}).format(new Date(data[i][1]))
      }
      if (data[i][2]) {
        data[i][2] = new Intl.DateTimeFormat(this.trailLicenseData['local'], {year: "numeric", month: "long", day: "numeric"}).format(new Date(data[i][2]))
      }
      if (data[i][4]) {
        data[i][4] = Intl.NumberFormat(this.trailLicenseData['local'], {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(data[i][4])
      }
 
    }
    this.trailLicenseData['trialLicenseStartDate'] = new Intl.DateTimeFormat(this.trailLicenseData['local'], {year: "numeric", month: "long", day: "numeric"}).format(new Date(this.trailLicenseData['trialLicenseStartDate']))
    this.trailLicenseData['validity'] = new Intl.DateTimeFormat(this.trailLicenseData['local'], {year: "numeric", month: "long", day: "numeric"}).format(new Date(this.trailLicenseData['validity']))
    this.trailLicenseData['projectValue'] = new Intl.NumberFormat(this.trailLicenseData['local'], {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(this.trailLicenseData['projectValue'])
    this.projectValue = new Intl.NumberFormat(this.trailLicenseData['local'], {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(this.projectValue)
    this.licenseValidity = new Intl.DateTimeFormat(this.trailLicenseData['local'], {year: "numeric", month: "long", day: "numeric"}).format(new Date(this.licenseValidity))

    console.log(this.licenseValidity)
    this.licenseKeyData = data;
  }

  getManager() {
    this.authService.getManager().subscribe((res) => {
      this.managerList = res;
      console.log(res)
    });
  }

  onAddManagerSubmit() {
    if (!this.addManagerForm.valid) return;

    this.addManagerForm.value.createdBy = this.userData._id;

    this.authService.registerManager(this.addManagerForm.value).subscribe(
      (res) => {
        this.getManager();
        let email = this.addManagerForm.value.email
        this.modalReference.close();
        this.addManagerForm.reset();
        let obj: any = {}
        obj.email = email
        obj.userType = "isManager";
        obj.ownerEmail = this.userData.email
        obj.ownerName = this.userData.userName
        this.authService.sendVerificationLinkforManager(obj).subscribe(
          (res) => {
            console.log(res)
          },
          (err) => {
            console.log({ err });
          });
       // this.toastr.success("Manager's email ID is successfully added and verification email has been sent to him/her. He/she has to verify the email to log in.");        
          Swal.fire({
            title: "Manager Added",
            text: "Verification email has been sent to Manager's email. He/she has to verify the email to log in.",
            icon: "success",
          })
        },
      (err) => {
        this.toastr.error(err.error.err);
      }
    );
  }

  onManagerEdit(id: string, content: any) {
    this.isEditingManager = true;
    this.managerList.forEach((manager) => {
      if (manager._id === id) {
        this.editingManagerId = id;
        this.addManagerForm.patchValue({
          userName: manager.userName,
          id: manager._id,
          email: manager.email,
        });
        this.modalReference = this.modalService.open(content);
        this.modalReference.dismissed
          .pipe(delay(500))
          .subscribe((data: any) => {
            this.addManagerForm.reset();
            this.isEditingManager = false;
          });
        this.modalReference.closed.pipe(delay(500)).subscribe((data: any) => {
          this.addManagerForm.reset();
          this.isEditingManager = false;
        });
      }
    });
  }
  onManagerEditSubmit() {
    console.log(this.addManagerForm.value)
    this.authService
      .updateManager(this.addManagerForm.value, this.editingManagerId)
      .subscribe(
        (res) => {
          this.getManager();
          this.modalReference.close();
          this.addManagerForm.reset();
        },
        (err) => {
          this.toastr.error(err.error.err);
        }
      );
  }
  onManagerDelete(id: string) {
    Swal.fire({
      title: "Are you sure?",
      text: "It shall also delete Claimant & Project created by Manager",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.deleteManager(id).subscribe(
          (res) => {
            this.getManager();
            Swal.fire("Deleted!", "Manager has been deleted.", "success");
          },
          (err) => this.toastr.error(err.error.err)
        );
      }
    });
  }

  licenseUpgrade(modelRef: any) {
    if(this.licenseData['licenseKeys'].length != 0) {
      console.log(this.licenseData)
      this.router.navigate(["User/licenseUpgrade"])
    }
    else {
      this.licenseModalRef = this.modalService.open(modelRef);
    }
  }

  OpenTrailLicenseSettings(modelRef: any) {
      this.traillicenseModalRef = this.modalService.open(modelRef);
  }

  redirect() {
    this.licenseModalRef.close()
    this.router.navigate(["home/pricing"])
  }

  openLicenseKeyDetailModel(modelRef: any, index: any) {
    this.seletedRow = index;
    console.log(this.licenseKeyData, index)
    if(this.licenseKeyData[index][6] == "Not yet assigned") {
      this.selectedExecutor = "Not yet assigned"
      this.selectedManager = "Not yet assigned"
    }
    else {
      // fetch from DB
      let obj : any = {}
      obj.projectId = this.licenseKeyData[index][6]
      this.projectService.getManagerExecutorNames(obj).subscribe((res) => {
        this.selectedExecutor = res['executerName']
        this.selectedManager = res['managerName']
      })
    }
    this.licenseModalRef = this.modalService.open(modelRef);
  }

  openManagerDetailModel(modelRef: any, index: any) {
    this.seletedRow = index;
    console.log(this.seletedRow)
    this.managerModalRef = this.modalService.open(modelRef);
  }

  onTrailLicenseSubmit() {
    if (!this.trailLicenseForm.valid) {
      this.toastr.error("All feilds are mandatory !!");
      return;
    }
    let obj : any = {}
    obj.email = this.userData.email
    obj.trialLicenseStartDate = this.trailLicenseForm.value.startDate
    obj.validity = this.validity
    obj.projectValue = this.trailLicenseForm.value.projectValue
    obj.currency = this.trailLicenseForm.value.currency
    obj.region = this.trailLicenseForm.value.projectRegion
    obj.local = this.trailLicenseForm.value.local
    console.log(obj)
    this.authService.setTrailLicense(obj).subscribe((res) => {
      console.log(res)
      this.traillicenseModalRef.close();
      this.toastr.success("Trail License Updated")
    }), (err) => {
      console.log(err)
      this.toastr.error(err.error.err)
    }
  }

  getValidity(e: any) {
    var d = new Date(this.trailLicenseForm.value.startDate);
    let TregionFormat = this.trailLicenseForm.value.local;
    d.setMonth(d.getMonth() + 3);
    this.validity = new Date(d);
    this.validity = new Intl.DateTimeFormat(TregionFormat, {year: "numeric", month: "long", day: "numeric"}).format(this.validity);
  }

  deactivateLicense(index: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Deactivate it!",
    }).then((result) => {
      if (result.isConfirmed) {
          let obj1: any = {}
          obj1.licenseId = this.licenseId
          let obj: any = {}
          obj.licenseKey = this.licenseKeyData[index][0]
          this.projectService.deactivateLicenseKey(obj).subscribe((res)=> {
            this.toastr.success(res['msg'])
          }, (err) => {
            this.toastr.error(err)
          })
          setTimeout(() => {
            this.projectService
                  .getAllLicenseKeyData(obj1)
                  .subscribe((res) => {
                    this.licenseKeyData = res;
            });
          }, 200)
        }
    });
  }

  onManagerResetPwd(email: string, content: any) {
    this.managerResetEmail = email;
    this.resetPwdModal = this.modalService.open(content);
  }

  onResetPwdSubmit() {
    if (!this.resetPwdForm.valid){
      this.toastr.error("Form is not valid")
      return;
    }
    if (this.resetPwdForm.value.newPwd != this.resetPwdForm.value.cnfPwd) {
      this.toastr.error("New password & Confirm Password should match")
      return;
    }
    let obj: any = {}
    obj.email = this.managerResetEmail
    obj.isOwner = false
    obj.isManager = true
    obj.isExecuter = false
    obj.isReviewer = false
    obj.newPwd = this.resetPwdForm.value.newPwd
    this.authService.changeUserPwd(obj).subscribe((res) => {
      localStorage.setItem("userData", JSON.stringify(res['user']));
      this.resetPwdModal.close();
    }), (err) => {
      this.toastr.error(err.error.err)
    }
  }

  FormatPValue() {
    let TdecimalPlaces = 2;
    let TregionFormat = this.trailLicenseForm.value.local;
  
    let amount = this.trailLicenseForm.value.projectValue;
    
   // this.trailLicenseForm.patchValue({
   //example: new Intl.DateTimeFormat(TregionFormat, {year: "numeric", month: "long", day: "numeric"}).format(date),
    this.FormatedPV = new Intl.NumberFormat(TregionFormat, {minimumFractionDigits: TdecimalPlaces, maximumFractionDigits: TdecimalPlaces}).format(amount);
    //})

    var d = new Date(this.trailLicenseForm.value.startDate);
    d.setMonth(d.getMonth() + 3);
    this.validity = new Date(d);
    console.log (this.validity);
    this.validity = new Intl.DateTimeFormat(TregionFormat, {year: "numeric", month: "long", day: "numeric"}).format(this.validity);
    console.log (this.validity);
  }

  formatNumber(value: number) {
    // this is for formatting single value/number
  let TregionFormat = this.trailLicenseForm.value.local;
  const formatSetting =  new Intl.NumberFormat(TregionFormat, {minimumFractionDigits: 2, maximumFractionDigits: 2});
  var formattedNumber = formatSetting.format(value) 
  return formattedNumber
  }

  formatDate(value: Date) {
      // this is for formatting single value/date
    let TregionFormat = this.trailLicenseForm.value.local;
   // console.log(TregionFormat)
    const formatSetting =  new Intl.DateTimeFormat(TregionFormat, {year: "numeric", month: "long", day: "numeric"});
    var formattedDate = formatSetting.format(new Date(value));
    return formattedDate
  }


  convertDatetoMonthYear(value) {
    //thiis is convert date to month and year only
    console.log(value) // = this.trailLicenseData['trialLicenseStartDate'];
    //let TregionFormat = this.trailLicenseForm.value.local;
    var d = new Date(value)
    let m = d.getMonth()+1;
    let y = d.getFullYear();
    let MonthYear
    if (m<10) {MonthYear = y+"-0"+m} else {MonthYear = y+"-"+m;}
    return MonthYear;
  }
}
