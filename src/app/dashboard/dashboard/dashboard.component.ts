import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Claimant } from "src/app/types/Claimant";
import { Project } from "src/app/types/Project";
import { ClaimantService } from "src/app/services/claimant/claimant.service";
import { ProjectService } from "src/app/services/project/project.service";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { User } from "src/app/types/User";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  images : any;
  userData: User;
  claimantList: Array<Claimant>;
  projectList: Array<Project>;
  isManager = false;
  isOwner = false;
  isExecuter = false;
  isReviewer = false;
  selectedClaimant: string = "";
  selectedProject: string = "";
  isClaimantUnlocked = false;
  isProjectUnlocked = false;
  isEditingClaimant = false;
  isEditingProject = false;
  claimantModalRef: any;
  projectModalRef: any;
  imagePath: any;
  addClaimantForm: FormGroup;
  addProjectForm: FormGroup;
  setForm: FormGroup;
  licenseData: any;
  licenseCurrency = ""; // coming from pricing page during license purchase
  claimantAndProject = true;
  settings = false;

  constructor(
    public claimantService: ClaimantService,
    public projectService: ProjectService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    //this.computeDate()
  
    this.userData = JSON.parse(localStorage.getItem("userData"));
    localStorage.setItem(
      "initAppendixData",
      JSON.stringify("true")
    );
    if (this.userData.isManager) {
      this.isManager = true;
      this.getClaiment();
    }
    if (this.userData.isOwner) {
      this.isOwner = true;
    }
    if (this.userData.isExecuter) {
      this.getExecuterClaimant();
      this.isExecuter = true;
    }
    if (this.userData.isReviewer) {
      this.isReviewer = true;
      //this.getClaiment();
    }
    this.addClaimantForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
    });

    this.addProjectForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
    });

    this.setForm = new FormGroup({
      contractAsSelected: new FormControl("Contract"),
      contractAsValue: new FormControl(""),
      claimantAsValue: new FormControl(""),
      claimantAsSelected: new FormControl("Claimant"),
      defendentAsSelected: new FormControl("Defendant"),
      defendentAsValue: new FormControl(""),
      regionFormat: new FormControl("en-US"),
      dayFormat: new FormControl("2-digit"),
      monthFormat: new FormControl("2-digit"),
      yearFormat: new FormControl("2-digit"),
      decimalPlaces: new FormControl("0"),
      example: new FormControl("----"),
      currExample: new FormControl("----"),
    });
    setTimeout(() => {
      if (this.selectedProject) {
        console.log("Hello")
        const projectData = JSON.parse(localStorage.getItem("projectData"));
        if (projectData) {
          console.log(projectData)
          if(projectData['image']) {
            this.imagePath = projectData['image'].split('\\')[2]
          }
          console.log(this.imagePath)
          this.setForm.patchValue({
            contractAsSelected: projectData.contractAs.selected,
            contractAsValue: projectData.contractAs.value,
            claimantAsValue: projectData.claimantAs.value,
            claimantAsSelected: projectData.claimantAs.selected,
            defendentAsSelected: projectData.defendentAs.selected,
            defendentAsValue: projectData.defendentAs.value,
            decimalPlaces: projectData.decimalPlaces,
            regionFormat: projectData.regionFormat,
            dayFormat: projectData.dayFormat,
            monthFormat: projectData.monthFormat,
            yearFormat: projectData.yearFormat,
          })
          this.runFormat();
        }
      }
    }, 2000);
    this.computeDate();

  }
  
  getClaiment() {
    this.claimantService.getAllClaimant().subscribe(
      (res) => {
        this.claimantList = res;
        this.selectedClaimant =
          JSON.parse(localStorage.getItem("selectedClaimant")) || "";
        if (this.selectedClaimant) {
          this.onSelectedClaimantChange();
        }
      },
      (err) => {
        this.toastr.error(err.error.err);
      }
    );
  }

  getExecuterClaimant() {
    this.claimantService.getExecuterCliamant().subscribe(
      (res) => {
        this.claimantList = res;
        this.selectedClaimant =
          JSON.parse(localStorage.getItem("selectedClaimant")) || "";
        if (this.selectedClaimant) {
          this.onSelectedClaimantChange();
        }
      },
      (err) => {
        this.toastr.error(err.error.err);
      }
    );
  }
  onSelectedClaimantChange() {
    localStorage.setItem(
      "selectedClaimant",
      JSON.stringify(this.selectedClaimant)
    );
    if (this.userData.isExecuter) {
      this.projectService.getExecuterProject(this.selectedClaimant).subscribe(
        (res) => {
          this.projectList = res;
          console.log(this.projectList)
          this.selectedProject =
            JSON.parse(localStorage.getItem("selectedProject")) || "";
          if (this.selectedProject) {
            this.onSelectedProjectChange();
          }
        },
        (err) => {}
      );
    } else {
      this.projectService.getAllProject(this.selectedClaimant).subscribe(
        (res) => {
          this.projectList = res;
          console.log(this.projectList)
          console.log(this.selectedClaimant)
          console.log(this.selectedProject)
          this.selectedProject =
            JSON.parse(localStorage.getItem("selectedProject")) || "";
          if (this.selectedProject) {
            this.onSelectedProjectChange();
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
  onSelectedProjectChange() {
    console.log(this.selectedProject)
    this.licenseData = []
    let ProjectDataById: any;
    localStorage.setItem(
      "selectedProject",
      JSON.stringify(this.selectedProject)
    );

    this.projectService
      .getProjectDataById(this.selectedProject)
      .subscribe((res) => {
        ProjectDataById = res
        console.log(res)
        if (res.contractAs) {
          this.setForm.patchValue({
            contractAsSelected: res.contractAs.selected,
            contractAsValue: res.contractAs.value,
            claimantAsValue: res.claimantAs.value,
            claimantAsSelected: res.claimantAs.selected,
            defendentAsSelected: res.defendentAs.selected,
            defendentAsValue: res.defendentAs.value,
            decimalPlaces: res.decimalPlaces,
            regionFormat: res.regionFormat,
            dayFormat: res.dayFormat,
            monthFormat: res.monthFormat,
            yearFormat: res.yearFormat,
          });
        }
        if (res['image']) {
          this.imagePath = res['image'].split('\\')[2]
        }
        localStorage.setItem("projectData", JSON.stringify(res));
        console.log(res)
        let obj: any = {}
        obj.selectedProject = res.projectId
        obj.defendantName = res.nameOfDefendant
        obj.claimaintList = this.claimantList
        obj.selectedClaimant = this.selectedClaimant
        this.projectService.sendSelectedProjectData(obj);
      });
      setTimeout(() => {
        let obj:any = {}
        obj.projectId = this.selectedProject
        console.log(this.selectedProject)
        this.projectService.getLicenseDataFromProjectId(obj).subscribe((res) => {
          this.licenseData = res['data']
          console.log(this.licenseData)
        }, (err) => {
          this.toastr.error(err.error.err);
          this.licenseData = null;
        });
      }, 1000)
  }
  onAddClaimant(content) {
    this.claimantModalRef = this.modalService.open(content);
    this.claimantModalRef.closed.subscribe((data: any) => {
      this.addClaimantForm.reset();
    });
    this.claimantModalRef.dismissed.subscribe((data: any) => {
      this.addClaimantForm.reset();
    });
  }
  onEditClaimant(content) {
    this.isEditingClaimant = true;
    let name = "";
    this.claimantList.forEach((claimant) => {
      if (claimant._id == this.selectedClaimant) name = claimant.name;
    });
    this.addClaimantForm.patchValue({
      name,
    });
    this.claimantModalRef = this.modalService.open(content);
    this.claimantModalRef.closed.subscribe((data: any) => {
      this.addClaimantForm.reset();
      this.isEditingClaimant = false;
    });
    this.claimantModalRef.dismissed.subscribe((data: any) => {
      this.addClaimantForm.reset();
      this.isEditingClaimant = false;
    });
  }
  onDeleteClaimant() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.claimantService.deleteClaimant(this.selectedClaimant).subscribe(
          (res) => {
            this.getClaiment();
            Swal.fire("Deleted!", "Claimant has been deleted.", "success");
          },
          (err) => this.toastr.error(err.error.err)
        );
      }
    });
  }

  onAddProject(content) {
    this.projectModalRef = this.modalService.open(content);
    this.projectModalRef.closed.subscribe((data: any) => {
      this.addProjectForm.reset();
    });
    this.projectModalRef.dismissed.subscribe((data: any) => {
      this.addProjectForm.reset();
    });
  }
  onEditProject(content) {
    this.isEditingProject = true;
    let name = "";
    this.projectList.forEach((project) => {
      if (project._id == this.selectedProject) name = project.name;
    });
    this.addProjectForm.patchValue({
      name,
    });
    this.projectModalRef = this.modalService.open(content);
    this.projectModalRef.closed.subscribe((data: any) => {
      this.addProjectForm.reset();
      this.isEditingProject = false;
    });
    this.projectModalRef.dismissed.subscribe((data: any) => {
      this.addProjectForm.reset();
      this.isEditingProject = false;
    });
  }
  onDeleteProject() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectService.deleteProject(this.selectedProject).subscribe(
          (res) => {
            this.onSelectedClaimantChange();
            Swal.fire("Deleted!", "Project has been deleted.", "success");
          },
          (err) => this.toastr.error(err.error.err)
        );
      }
    });
  }
  onAddClaimantSubmit() {
    this.claimantService.addClaimant(this.addClaimantForm.value).subscribe(
      (res) => {
        this.getClaiment();
        this.claimantModalRef.close();
        this.selectedClaimant = res._id;
        console.log(this.selectedClaimant);
      },
      (err) => this.toastr.error(err.error.err)
    );
  }
  onAddProjectSubmit() {
    this.projectService
      .addProject(this.addProjectForm.value, this.selectedClaimant)
      .subscribe(
        (res) => {
          this.onSelectedClaimantChange();
          this.projectModalRef.close();
          this.selectedProject = res._id;
        },
        (err) => this.toastr.error(err.error.err)
      );
  }
  onClaimantEditSubmit() {
    this.claimantService
      .editClaimant(this.addClaimantForm.value, this.selectedClaimant)
      .subscribe(
        (res) => {
          this.getClaiment();
          this.claimantModalRef.close();
          this.selectedClaimant = res.updateClaimant._id;
          console.log(this.selectedClaimant);
        },
        (err) => this.toastr.error(err.error.err)
      );
  }
  onProjectEditSubmit() {
    this.projectService
      .editProject(this.addProjectForm.value, this.selectedProject)
      .subscribe(
        (res) => {
          this.onSelectedClaimantChange();
          this.projectModalRef.close();
          this.selectedClaimant = res._id;
        },
        (err) => this.toastr.error(err.error.err)
      );
  }

  onClickProjectUnlock() {
    if (!this.isOwner && !this.isManager && !this.isExecuter) {
      this.toastr.error("You are not authorized!");
      return;
    }
    if (!this.selectedClaimant) {
      this.toastr.error("Please select a claimant");
      return;
    }
    this.isProjectUnlocked = !this.isProjectUnlocked;
  }
  onClickClaimantUnlock() {
    if (!this.isOwner && !this.isManager && !this.isExecuter) {
      this.toastr.error("You are not authorized!");
      return;
    }
    this.isClaimantUnlocked = !this.isClaimantUnlocked;
  }
  next() {
    this.router.navigateByUrl("contract-particulars");
  }

  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.images = file;
    }
  }

  onUploadImage() {
    if (!this.selectedProject) {
      this.toastr.error("Please select a project!");
      return;
    }
    const formData: FormData = new FormData();
    formData.append('file', this.images);
    this.projectService.uploadImage(this.selectedProject, formData).subscribe((res) => {
      console.log(res)
        localStorage.setItem("projectData", JSON.stringify(res['updateProject']));
        this.router.navigate(["User/contract-particulars"]);
      },
      (err) => {
        this.toastr.error(err.error.err);
      }
    )}

  onSetFormSubmit() {
    if (!this.selectedProject) {
      this.toastr.error("Please select a project!");
      return;
    }
    console.log(this.setForm.value.decimalPlaces)
    
    const obj = {
      contractAs: {
        selected: this.setForm.value.contractAsSelected,
        value: this.setForm.value.contractAsValue,
      },
      claimantAs: {
        selected: this.setForm.value.claimantAsSelected,
        value: this.setForm.value.claimantAsValue,
      },
      defendentAs: {
        selected: this.setForm.value.defendentAsSelected,
        value: this.setForm.value.defendentAsValue,
      },
      decimalPlaces: this.setForm.value.decimalPlaces,
      regionFormat: this.setForm.value.regionFormat,
      dayFormat: this.setForm.value.dayFormat,
      monthFormat: this.setForm.value.monthFormat,
      yearFormat: this.setForm.value.yearFormat,
    };

    this.projectService.updateProjectData(this.selectedProject, obj).subscribe(
      (res) => {
        localStorage.setItem("projectData", JSON.stringify(res.updateProject));
        let obj: any = {}
        obj.selectedProject = res.updateProject.projectId
        obj.defendantName = res.updateProject.nameOfDefendant
        obj.claimaintList = this.claimantList
        obj.selectedClaimant = this.selectedClaimant
        this.projectService.sendSelectedProjectData(obj);
        this.SaveMessage()
        //this.router.navigate(["dashboard/contract-particulars"]);

      },
      (err) => {
        this.toastr.error(err.error.err);
      }
    );
  }

  computeDate() {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    if (projectData) {
      let regionFormat = projectData.regionFormat;
      let dayFormat = projectData.dayFormat;
      let monthFormat = projectData.monthFormat;
      let yearFormat = projectData.yearFormat;
      let date = new Date();
      let amount = 1234.5678;
      console.log(new Intl.DateTimeFormat(regionFormat, {year: yearFormat, month: monthFormat, day: dayFormat}).format(date));
      this.setForm.patchValue({
      example: new Intl.DateTimeFormat(regionFormat, {year: yearFormat, month: monthFormat, day: dayFormat}).format(date),
      //currExample: new Intl.NumberFormat(regionFormat, {style: "decimal", maximumFractionDigits: 2}).format(amount)
      currExample: this.formatNumber(amount)

    })
  }
  }

  formatNumber(value: number) {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    const formatSetting =  new Intl.NumberFormat(projectData.regionFormat, {minimumFractionDigits: projectData.decimalPlaces, maximumFractionDigits: projectData.decimalPlaces});
    var formattedNumber = formatSetting.format(value) 
    return formattedNumber
  }
  

  runFormat() {
    let TdecimalPlaces = this.setForm.value.decimalPlaces;
    let TregionFormat = this.setForm.value.regionFormat;
    let TdayFormat =  this.setForm.value.dayFormat;
    let TmonthFormat = this.setForm.value.monthFormat;
    let TyearFormat =  this.setForm.value.yearFormat;

    let date = new Date();
    let amount = 123456789.98765;
    
    this.setForm.patchValue({
    example: new Intl.DateTimeFormat(TregionFormat, {year: TyearFormat, month: TmonthFormat, day: TdayFormat}).format(date),
    currExample: new Intl.NumberFormat(TregionFormat, {minimumFractionDigits: TdecimalPlaces, maximumFractionDigits: TdecimalPlaces}).format(amount),
    })
  }
  
  SaveMessage() {
    Swal.fire({
      title: 'Saved',
      text: 'Data are saved.',
      icon: "info",
      });
  }

  formatDate(value) {
    if (value) {
        let projectData = JSON.parse(localStorage.getItem("projectData"));

        if (projectData) {
          let regionFormat = projectData.regionFormat;
          let dayFormat = projectData.dayFormat;
          let monthFormat = projectData.monthFormat;
          let yearFormat = projectData.yearFormat;
          let date = new Date(value);
          var formattedDate = new Intl.DateTimeFormat(regionFormat, {year: yearFormat, month: monthFormat, day: dayFormat}).format(date);
          return formattedDate
        }
        else{
          let date = new Date(value);
          var formattedDate = new Intl.DateTimeFormat("en-us", {year: "numeric", month: "long", day: "numeric"}).format(date);
          return formattedDate
        }
      }
      else {return ""}
    }
  
}
