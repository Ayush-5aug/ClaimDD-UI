import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ProjectService } from "../../services/project/project.service";
import * as fileSaver from 'file-saver';
import Swal from "sweetalert2";

@Component({
  selector: "app-rates",
  templateUrl: "./rates.component.html",
  styleUrls: ["./rates.component.css"],
})
export class RatesComponent implements OnInit {
  selected: string;
  userData: any;
  constructor(private router: Router,
    private projectService: ProjectService) {}

  ngOnInit(): void {
    this.selected = "";
    this.userData = JSON.parse(localStorage.getItem("userData"));
  }

  onImport() {
    if (this.selected) {
      localStorage.setItem("selectedImport", JSON.stringify(this.selected));
      localStorage.setItem(
        "selectedImportPage",
        JSON.stringify("User/rates")
      );
      this.router.navigate(["User/data-import"]);
    }
    else { 
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You have not selected any heading to Import!',
        //footer: '<a href="">Why do I have this issue?</a>'
      })
    }
  }

  returnBlob(res): Blob {
    console.log(res)
    console.log('file Downloaded...')
    return new Blob([res], {type : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
  }

  // for downloading template
  onSeeTemplate() {
    if (this.selected) {
      var fileName = this.selected;
      this.projectService.downloadTemplate(fileName).subscribe((res) => {
        console.log(res)
        if (res) {
          fileSaver.saveAs(this.returnBlob(res), fileName);
        }
      });
   }
   else { 
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'You have not selected any heading to Download the Template!',
      //footer: '<a href="">Why do I have this issue?</a>'
    })
  }
  }


  onPreview() {
    console.log('Preview clicked')
    console.log(this.selected)
    const projectId = JSON.parse(localStorage.getItem("selectedProject"));
    console.log(projectId)
    /*this.projectService
            .getPreviewData(projectId, this.selected)
            .subscribe((res) => {
              console.log(res)
              localStorage.setItem(
                "projectData",
                JSON.stringify(res)
              );
            });*/
    if (this.selected) {
      localStorage.setItem("selectedImport", JSON.stringify(this.selected));
      localStorage.setItem(
        "selectedImportPage",
        JSON.stringify("User/rates")
      );
      this.router.navigate(["User/preview"]);
    }
    else { 
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You have not selected any heading to Preview the Data!',
        //footer: '<a href="">Why do I have this issue?</a>'
      })
    }
  }

  onNext() {
    this.router.navigate(["User/quantum"])
  }
}
