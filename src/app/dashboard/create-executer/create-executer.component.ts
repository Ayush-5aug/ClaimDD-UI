import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { delay } from "rxjs/operators";
import { AuthService } from "src/app/services/auth/auth.service";
import { ClaimantService } from "src/app/services/claimant/claimant.service";
import { ProjectService } from "src/app/services/project/project.service";
import { Claimant } from "src/app/types/Claimant";
import { Project } from "src/app/types/Project";
import { User } from "src/app/types/User";
import { matchValidator } from "src/shared/matchValidator";

import Swal from "sweetalert2";

@Component({
  selector: "app-create-executer",
  templateUrl: "./create-executer.component.html",
  styleUrls: ["./create-executer.component.css"],
})
export class CreateExecuterComponent implements OnInit {
  userTypeReviwer: Boolean = false;
  userTypeExecutor: Boolean = false;
  selectedReviewerName: string;
  isClaimantUnlocked = false;
  claimantModalRef: any;
  addClaimantForm: FormGroup;
  resetPwdForm: FormGroup;
  isEditingClaimant = false;
  isManager = false;
  userData: User;
  addExecuterForm: FormGroup;
  assignExecuterForm: FormGroup;
  assignReviewerForm: FormGroup;
  executerList: Array<User>;
  selectedExecutorName: string;
  ReviewerList: Array<User>;
  modalReference: any;
  isEditingExecuter = false;
  editingExecuterId: string;
  editingReviewerId: string;
  setForm: FormGroup;
  claimantList: Array<Claimant>;
  projectList: Array<Project>;
  claimList: any = []
  selectedClaimant: string;
  selectedProject: string;
  selectedExecuter: string;
  selectedReviewer: string;
  selectedClaim: string;
  assignModalRef: any;
  resetPwdModal: any;
  assignRevModalRef: any;
  claimantAndProjectNameList: any = [];
  ReviewerDataList: any = [];
  showAssignedProjectModalRef: any;
  isProjectUnlocked = false;
  addProjectForm: FormGroup;
  projectModalRef: any;
  isEditingProject = false;
  isExecuter = false;
  availableLicenseKeys : any = []
  manageClaimantAndProject = true;
  manageExecutor = false;
  manageReviewer = false;
  executorResetEmail: string;
  isMyPage = false;
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private authService: AuthService,
    private toastr: ToastrService,
    private projectService: ProjectService,
    private claimantService: ClaimantService
  ) {}

  ngOnInit(): void {
    this.claimantList = []
    let obj: any = {}
    this.userData = JSON.parse(localStorage.getItem("userData"));
    localStorage.setItem(
      "initAppendixData",
      JSON.stringify("true")
    );
    console.log(this.userData)
    obj.email = this.userData['email']
    this.projectService
    .getAvailableLicenseKeys( 
      obj
    )
    .subscribe(
      (res) => {
        this.availableLicenseKeys = res
        if (!this.availableLicenseKeys[0]['licenseKeyStartDate']) {
          this.availableLicenseKeys[0]['licenseKeyStartDate'] = this.availableLicenseKeys[0]['trialLicenseStartDate']
        } 
        console.log(res)
      },
      (err) => this.toastr.error(err.error.err)
    );

    if (this.userData.isManager) {
      this.isManager = true;
    
    
      //this.getClaiment();
    }
    if (this.userData.isExecuter) {
      this.getExecuterClaimant();
      this.isExecuter = true;
    
    }
    this.addClaimantForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      address: new FormControl("", [Validators.required]),
      city: new FormControl("", [Validators.required]),
      country: new FormControl("", [Validators.required]),
    });

    this.resetPwdForm = new FormGroup({
      newPwd: new FormControl("", [Validators.required]),
      cnfPwd: new FormControl("", [Validators.required]),
    });

    this.addProjectForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      assignedLicenseKey: new FormControl("", [Validators.required]),
    });

    this.setForm = new FormGroup({
      contractAsSelected: new FormControl("Contract"),
      contractAsValue: new FormControl(""),
      claimantAsValue: new FormControl(""),
      claimantAsSelected: new FormControl("Claimant"),
      defendentAsSelected: new FormControl("Defendant"),
      defendentAsValue: new FormControl(""),
    });
    if (this.selectedProject) {
      const projectData = JSON.parse(localStorage.getItem("projectData"));
      if (projectData) {
        this.setForm.patchValue({
          contractAsSelected: projectData.contractAs.selected,
          contractAsValue: projectData.contractAs.valu,
          claimantAsValue: projectData.claimantAs.value,
          claimantAsSelected: projectData.claimantAs.selected,
          defendentAsSelected: projectData.defendentAs.selected,
          defendentAsValue: projectData.defendentAs.value,
        });
      }
    }
    if (!this.userData.isManager) this.router.navigate(["/User"]);
    this.getExecuter();
    this.getReviewer();
    this.addExecuterForm = new FormGroup({
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

    this.assignExecuterForm = new FormGroup({
      project: new FormControl(""),
      claimant: new FormControl(""),
    });

    this.assignReviewerForm = new FormGroup({
      project: new FormControl(""),
      claimant: new FormControl(""),
      claims: new FormControl(""),
    });
  }
  openAddExecuterModal(content: any) {
    this.modalReference = this.modalService.open(content);
    this.modalReference.closed.subscribe((data: any) => {
      this.addExecuterForm.reset();
    });
    this.modalReference.dismissed.subscribe((data: any) => {
      this.addExecuterForm.reset();
    });
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

  getExecuter() {
    let index = 0
    this.executerList = new Array<User>();
    this.authService.getExecuter().subscribe((res) => {
      res.forEach((user) => {
        if(user['isExecuter'] == true) {
          this.executerList[index] = user
          index = index + 1
        }
      })
    });
  }

  getReviewer() {
    let index = 0
    this.ReviewerList = new Array<User>();
    this.authService.getReviewer().subscribe((res) => {
      res.forEach((user) => {
        if(user['isReviewer'] == true) {
          this.ReviewerList[index] = user
          index = index + 1
        }
      })
    });
  }

  onAddExecuterSubmit() {
    console.log(this.addExecuterForm.value, 'from executor')
    if (!this.addExecuterForm.valid) return;

    this.addExecuterForm.value.createdBy = this.userData._id;

    this.authService.registerExecuter(this.addExecuterForm.value).subscribe(
      (res) => {
        this.getExecuter();
        let email = this.addExecuterForm.value.email
        console.log(email)
        this.modalReference.close();
        this.addExecuterForm.reset();
        let obj: any = {}
        obj.email = email
        obj.userType = "isExecuter";
        obj.managerEmail = this.userData.email
        obj.managerName = this.userData.userName

        this.authService.sendVerificationLinkforExecuter(obj).subscribe(
          (res) => {
            console.log(res)
          },
          (err) => {
            console.log({ err });
          });
        //this.toastr.success("Executer email ID is successfully added and verification email has been sent. He/she has to be verify the email to log in.");
        Swal.fire({
          title: "Executer Added",
          text: "Verification email has been sent to Executer's email. He/she has to verify the email to log in.",
          icon: "success",
        })
      },
      (err) => {
        this.toastr.error(err.error.err);
      }
    );
  }

  onAddReviewerSubmit() {
    console.log(this.addExecuterForm.value)
    if (!this.addExecuterForm.valid) return;

    this.addExecuterForm.value.createdBy = this.userData._id;

    this.authService.registerReviewer(this.addExecuterForm.value).subscribe(
      (res) => {
        this.getReviewer();
        let obj: any = {}
        obj.email = this.addExecuterForm.value.email
        obj.userType = "isReviewer";
        obj.managerEmail = this.userData.email
        obj.managerName = this.userData.userName
        this.modalReference.close();
        this.addExecuterForm.reset();
        this.authService.sendVerificationLinkforReviewer(obj).subscribe(
          (res) => {
            console.log(res)
          },
          (err) => {
            console.log({ err });
          });
        //this.toastr.success("Reviewer email ID is successfully added and verification email has been sent. He/she has to be verify the email to log in.");
        Swal.fire({
          title: "Reviewer Added",
          text: "Verification email has been sent to Reviewer's email. He/she has to verify the email to log in.",
          icon: "success",
        })

      },
      (err) => {
        this.toastr.error(err.error.err);
      }
    );
  }

  onExecuterEdit(id: string, content: any) {
    this.isEditingExecuter = true;
    this.executerList.forEach((executer) => {
      if (executer._id === id) {
        this.editingExecuterId = id;
        this.addExecuterForm.patchValue({
          userName: executer.userName,
          id: executer._id,
          email: executer.email,
        });
        this.modalReference = this.modalService.open(content);
        this.modalReference.dismissed
          .pipe(delay(500))
          .subscribe((data: any) => {
            this.addExecuterForm.reset();
            this.isEditingExecuter = false;
          });
        this.modalReference.closed.pipe(delay(500)).subscribe((data: any) => {
          this.addExecuterForm.reset();
          this.isEditingExecuter = false;
        });
      }
    });
  }

  onReveiwerEdit(id: string, content: any) {
    this.isEditingExecuter = true;
    this.ReviewerList.forEach((reviewer) => {
      if (reviewer._id === id) {
        this.editingReviewerId = id;
        this.addExecuterForm.patchValue({
          userName: reviewer.userName,
          id: reviewer._id,
          email: reviewer.email,
        });
        this.modalReference = this.modalService.open(content);
        this.modalReference.dismissed
          .pipe(delay(500))
          .subscribe((data: any) => {
            this.addExecuterForm.reset();
            this.isEditingExecuter = false;
          });
        this.modalReference.closed.pipe(delay(500)).subscribe((data: any) => {
          this.addExecuterForm.reset();
          this.isEditingExecuter = false;
        });
      }
    });
  }

  onExecuterEditSubmit() {
    this.authService
      .updateExecuter(this.addExecuterForm.value, this.editingExecuterId)
      .subscribe(
        (res) => {
          this.getExecuter();
          this.modalReference.close();
          this.addExecuterForm.reset();
        },
        (err) => {
          this.toastr.error(err.error.err);
        }
      );
  }

  onReveiwerEditSubmit() {
    this.authService
      .updateReviewer(this.addExecuterForm.value, this.editingReviewerId)
      .subscribe(
        (res) => {
          this.getReviewer();
          this.modalReference.close();
          this.addExecuterForm.reset();
        },
        (err) => {
          this.toastr.error(err.error.err);
        }
      );
  }
  onExecuterDelete(id: string, email: string) {
    Swal.fire({
      title: "Are you sure to delete the Executer, " + email + "?",
      text: "It cannot be reverted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.deleteExecuter(id).subscribe(
          (res) => {
            this.getExecuter();
            Swal.fire("Deleted!", "Executer has been deleted.", "success");
          },
          (err) => this.toastr.error(err.error.err)
        );
      }
    });
  }

  onReviewerDelete(id: string, email:string) {
    Swal.fire({
      title: "Are you sure to delete the Reviewer, " + email + "?",
      text: "It cannot be reverted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.deleteReviewer(id).subscribe(
          (res) => {
            this.getReviewer();
            Swal.fire("Deleted!", "Reviewer has been deleted.", "success");
          },
          (err) => this.toastr.error(err.error.err)
        );
      }
    });
  }


  onAssignExecuter(executerId: string, executorName, content) {
    this.selectedExecuter = executerId;
    this.selectedExecutorName = executorName;
    this.claimantService.getAllClaimant().subscribe(
      (res) => {
        this.claimantList = res;
        this.assignModalRef = this.modalService.open(content);
      },
      (err) => {
        this.toastr.error(err.error.err);
      }
    );
  }

  onAssignReviewer(reviewerId: string, reviewerName, content) {
    this.selectedReviewer = reviewerId;
    this.selectedReviewerName = reviewerName
    this.claimantService.getAllClaimant().subscribe(
      (res) => {
        this.claimantList = res;
        this.assignRevModalRef = this.modalService.open(content);
      },
      (err) => {
        this.toastr.error(err.error.err);
      }
    );
  }
  onAssignExecuterSubmit() {
    console.log("->",this.selectedProject,
      '->',this.selectedClaimant,
      '->',this.selectedExecuter)
    if (
      this.selectedProject == "undefined" ||
      this.selectedClaimant == "undefined" ||
      !this.selectedClaimant ||
      !this.selectedProject
    )
      return;
    this.projectService
      .assignExecuter(
        this.selectedProject,
        this.selectedClaimant,
        this.selectedExecuter
      )
      .subscribe(
        (res) => {
          this.assignModalRef.close();
          this.assignExecuterForm.reset();
          this.onSelectedClaimantChange();
        },
        (err) => this.toastr.error(err.error.err)
      );
  }

  onAssignReviewerSubmit() {
    if (
      this.selectedProject == "undefined" ||
      this.selectedClaimant == "undefined" ||
      !this.selectedClaimant ||
      !this.selectedProject
    )
      return;
      console.log(this.selectedProject, this.selectedClaimant, this.selectedClaim, this.selectedReviewer)
      let obj: any = {}
      obj.projectId = this.selectedProject
      obj.claimantId = this.selectedClaimant
      obj.claim = this.selectedClaim
      obj.reviewerId = this.selectedReviewer
    this.projectService
      .assignProjectToReviewer(obj)
      .subscribe(
        (res) => {
          this.assignRevModalRef.close();
          this.assignReviewerForm.reset();
        },
        (err) => this.toastr.error(err.error.err)
      );
  }
  removeExecuterFromProject(projectId: string, claimantId: string) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Unassign it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectService
          .deleteAssignedExecuter(projectId, claimantId, this.selectedExecuter)
          .subscribe(
            (res) => {
              this.showAssignedProjectModalRef.close();
            },
            (err) => {
              this.toastr.error(err.error.err);
            }
          );
      }
    });
  }
  onSelectedClaimantChange() {
    console.log(this.selectedClaimant)
    console.log(this.claimantList)
    if (this.selectedClaimant == "undefined") return;
    this.projectService.getAllProject(this.selectedClaimant).subscribe(
      (res) => {
        this.projectList = res;
        console.log(res)
      },
      (err) => {
        this.toastr.error(err.error.err);
      }
    );
  }

  /* Return the claims of a selected project from projectData DB*/
  getAllClaims(selectedProject) {
    console.log(selectedProject)
    if (selectedProject == "undefined") return;
    this.projectService.getAllClaims(selectedProject).subscribe(
      (res) => {
        this.claimList = res;
        console.log(res)
      },
      (err) => {
        this.toastr.error(err.error.err);
      }
    );
  }

  onShowAssignedProject(executerId: string, executorName, content) {
    this.selectedExecuter = executerId;
    this.selectedExecutorName = executorName;
    this.projectService.getAssignedExecuter(executerId).subscribe((res) => {
      this.claimantAndProjectNameList = res.project;
      console.log(this.claimantAndProjectNameList)
      this.showAssignedProjectModalRef = this.modalService.open(content);
    });
  }

  onShowAssignedProjectForReviewer(reviewerId: string, reviewerName, content) {
    this.selectedReviewerName = reviewerName
    this.selectedReviewer = reviewerId;
    this.projectService.showassignProjectOfReviewer(reviewerId).subscribe((res) => {
      this.ReviewerDataList = res;
      console.log(this.ReviewerDataList)
      this.showAssignedProjectModalRef = this.modalService.open(content);
    });
  }

  onDeleteProject(index) {
    let obj: any = {}
    this.selectedProject = this.projectList[index]['_id']
    Swal.fire({
      title: "Do you want to continue?",
      text: "Deleting Project shall delete complete project data permanently !",
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
            obj.email = this.userData['email'];
            this.projectService.getAvailableLicenseKeys(obj).subscribe((res) => {
              this.availableLicenseKeys = res },
              (err) => this.toastr.error(err.error.err));
            Swal.fire("Deleted!", "Project has been deleted.", "success");
          },
          (err) => this.toastr.error(err.error.err)
        );
      }
    });
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

  onAddProjectSubmit() {
    console.log(this.selectedClaimant)
    let obj: any = {}
    obj.email = this.userData['email']
    if (this.addProjectForm.value.assignedLicenseKey == '' || this.addProjectForm.value.name == '') {
      this.toastr.error("Fields can not be empty !!")
      return;
    }
    this.projectService
      .addProject(this.addProjectForm.value, this.selectedClaimant)
      .subscribe(
        (res) => {
          this.onSelectedClaimantChange();
          this.projectModalRef.close();
          this.selectedProject = res._id;
          this.projectService.getAvailableLicenseKeys(obj)
                              .subscribe((res) => {
                                                  this.availableLicenseKeys = res
                                                  console.log(res)
                                                  },(err) => this.toastr.error(err.error.err));
        },
        (err) => {
          this.projectModalRef.close();
          this.toastr.error(err.error.err)
        }
      );
  }

  onEditProject(content, index) {
    this.isEditingProject = true;
    let name = "";
    /*this.projectList.forEach((project) => {
      if (project._id == this.selectedProject) name = project.name;
    });*/
    this.selectedProject = this.projectList[index]['id']
    name = this.projectList[index]['name']
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

  onAddProject(content) {
    this.projectModalRef = this.modalService.open(content);
    this.projectModalRef.closed.subscribe((data: any) => {
      this.addProjectForm.reset();
    });
    this.projectModalRef.dismissed.subscribe((data: any) => {
      this.addProjectForm.reset();
    });
  }

  onClickProjectUnlock() {
    if (!this.isManager && !this.isExecuter) {
      this.toastr.error("You are not authorized!");
      return;
    }
    if (!this.selectedClaimant) {
      this.toastr.error("Please select a claimant");
      return;
    }
    this.isProjectUnlocked = !this.isProjectUnlocked;
  }

  onSelectedProjectChange() {
    localStorage.setItem(
      "selectedProject",
      JSON.stringify(this.selectedProject)
    );
    console.log(this.selectedProject)
    this.getAllClaims(this.selectedProject);
    this.projectService
      .getProjectDataById(this.selectedProject)
      .subscribe((res) => {
        console.log(res)
        /*this.setForm.patchValue({
          contractAsSelected: res.contractAs.selected,
          contractAsValue: res.contractAs.valu,
          claimantAsValue: res.claimantAs.value,
          claimantAsSelected: res.claimantAs.selected,
          defendentAsSelected: res.defendentAs.selected,
          defendentAsValue: res.defendentAs.value,
        });*/
        localStorage.setItem("projectData", JSON.stringify(res));
      });
  }

  onDeleteClaimant() {
    let obj: any = {}
    Swal.fire({
      title: "Do you want to Delete ?",
      text: "Deleting Claimant shall delete all projects and projects data permanently.",
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
            this.onSelectedClaimantChange();
            obj.email = this.userData['email']
            this.projectService.getAvailableLicenseKeys(obj).subscribe((res) => {
                                                                          this.availableLicenseKeys = res },
                                                                          (err) => this.toastr.error(err.error.err));
            Swal.fire("Deleted!", "Claimant has been deleted.", "success");
          },
          (err) => this.toastr.error(err.error.err)
        );
      }
    });
  }

  getClaiment() {
    this.claimantService.getAllClaimant().subscribe(
      (res) => {
        this.claimantList = res;
        this.selectedClaimant = res[0]['_id']
        console.log(res)
      },
      (err) => {
        this.toastr.error(err.error.err);
      }
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

  onAddClaimantSubmit() {
    this.claimantService.addClaimant(this.addClaimantForm.value).subscribe(
      (res) => {
        this.getClaiment();
        this.claimantModalRef.close();
        this.selectedClaimant = res._id;
        console.log(this.selectedClaimant);
      },
      (err) => {
        this.claimantModalRef.close();
        this.toastr.error(err.error.err)
      }
    );
  }

  onEditClaimant(content) {
    this.isEditingClaimant = true;
    let name = "";
    let address = "";
    let city = "";
    let country = "";
    this.claimantList.forEach((claimant) => {
      if (claimant._id == this.selectedClaimant)
      {
        name = claimant.name;
        address = claimant['address']
        city = claimant['city'];
        country = claimant['country'];
      }
    });
    this.addClaimantForm.patchValue({
      name, address, city, country
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

  onAddClaimant(content) {
    this.claimantModalRef = this.modalService.open(content);
    this.claimantModalRef.closed.subscribe((data: any) => {
      this.addClaimantForm.reset();
    });
    this.claimantModalRef.dismissed.subscribe((data: any) => {
      this.addClaimantForm.reset();
    });
  }

  onClickClaimantUnlock() {
    if (!this.isManager && !this.isExecuter) {
      this.toastr.error("You are not authorized!");
      return;
    }
    if (this.isClaimantUnlocked) {
      this.claimantList = []
    }
    else {
      this.getClaiment();
      setTimeout(() =>{
        this.onSelectedClaimantChange();
      }, 1300)
    }
    this.isClaimantUnlocked = !this.isClaimantUnlocked;
  }

  onExecuterResetPwd(email: string, content: any, userType: string) {
    this.executorResetEmail = email;
    if (userType == "isExecuter") {
      this.userTypeExecutor = true;
    }
    if (userType == "isReviewer") {
      this.userTypeReviwer = true;
    }
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
    obj.email = this.executorResetEmail
    obj.isOwner = false
    obj.isManager = false
    obj.isExecuter = this.userTypeExecutor
    obj.isReviewer = this.userTypeReviwer
    obj.newPwd = this.resetPwdForm.value.newPwd
    this.authService.changeUserPwd(obj).subscribe((res) => {
      localStorage.setItem("userData", JSON.stringify(res['user']));
      this.resetPwdModal.close();
    }), (err) => {
      this.toastr.error(err.error.err)
    }
  }

  unassignClaimFromReviewer(rev: any) {
    this.showAssignedProjectModalRef.close();
    Swal.fire({
      //title: "Do you want to Unassign Reviewer, " + this.selectedReviewerName + " ?", You won't be able to revert this!
      title: "Are you sure?",
      text: "You won't be able to revert this.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Unassign it!",
    }).then((result) => {
      if (result.isConfirmed) {
        let obj: any = {}
        obj.reviewerId = this.selectedReviewer
        obj.claim = rev.claim
        this.projectService.unassignClaimFromReviewer(obj).subscribe((res) => {
          this.toastr.success(res);
        }, (err) => {
          this.toastr.error(err.error.err);
        })
      }
      })
  }

  
  onLicenseAssignInfo() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'The License Key cannot be changed once it is assigned!',
      icon: "warning",
      });
  }

}
