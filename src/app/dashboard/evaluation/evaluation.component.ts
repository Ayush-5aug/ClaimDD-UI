import { flatten } from "@angular/compiler";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AnyRecordWithTtl } from "dns";
import { ProjectService } from "../../services/project/project.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-evaluation",
  templateUrl: "./evaluation.component.html",
  styleUrls: ["./evaluation.component.css"],
})
export class EvaluationComponent implements OnInit {
  isOtherSelected : Boolean;
  eventList : any = [];
  isButtonDisabled : Boolean;
  selectedFormula: any;
  originalContractPriceType: any
  HOOHpDay: any;
  LOPpDay: any;
  Evaluation: Boolean

  constructor(
    private router: Router,
    private projectService: ProjectService,
  ) {}

  

  ngOnInit(): void {
  this.selectedFormula = "Hudson";
  this.isButtonDisabled = true;
  this.isOtherSelected = false;
  this.Evaluation = false;
  const projectId = JSON.parse(localStorage.getItem("selectedProject"));
  this.projectService
            .getEvents(projectId)
            .subscribe((res) => {
              console.log(res['data'])
              this.eventList = res['data'];
              if (this.eventList.length > 0) {
                localStorage.setItem(
                  "selectedEvent",
                  JSON.stringify(this.eventList[0])
                );
              }
            });
  }

  changeOtherStatus() {
    var x = (<HTMLInputElement>document.getElementById("exampleFormControlSelect2")).value
    this.selectedFormula = x
    if (x === "Other") {
      this.isOtherSelected = true

    }
    else {
      this.isOtherSelected = false
    }
  }

  evaluateClicked() {
    this.progressLoading()
    this.Evaluation = true;
    let selectedOptions: any = []
    var elements = document.getElementsByClassName("form-check-input")
    for(var i = 0; i < elements.length; i++) {
      if((<HTMLInputElement>elements[i]).checked) {
        selectedOptions.push((<HTMLInputElement>elements[i]).value)
      }
    }
    
    if (this.isOtherSelected){
    this.HOOHpDay = (<HTMLInputElement>document.getElementById("HOOHPDay")).value
    this.LOPpDay = (<HTMLInputElement>document.getElementById("LOPPDay")).value
    }
    else {
    this.HOOHpDay = 0
    this.LOPpDay = 0
    }
    
    localStorage.setItem(
      "selectedOptions",
      JSON.stringify(selectedOptions)
    );
    localStorage.setItem(
      "selectedFormula",
      JSON.stringify(this.selectedFormula)
    );
    localStorage.setItem(
      "HOOHpDay",
      JSON.stringify(this.HOOHpDay)
    );
    localStorage.setItem(
      "LOPpDay",
      JSON.stringify(this.LOPpDay)
    );
    localStorage.setItem(
      "Evaluation",
      JSON.stringify(this.Evaluation)
    );


    localStorage.setItem(
      "claimName",
      JSON.stringify("NEW CLAIM")
    );
 //alert (this.HOOHpDay +-+  this.LOPpDay)

    this.router.navigate(["User/claim"]);
  }

  setEventSelected() {
    var index = (<HTMLInputElement>document.getElementById("exampleFormControlSelect1")).value
    localStorage.setItem(
      "selectedEvent",
      JSON.stringify(this.eventList[index])
    );
  }

  clicked() {
    let flag = 0
    var elements = document.getElementsByClassName("form-check-input")
    for(var i = 0; i < elements.length; i++) {
      if((<HTMLInputElement>elements[i]).checked) {
        this.isButtonDisabled = false;
        flag = 1
      }
    }
    if (flag == 0) {
      this.isButtonDisabled = true;
    }
  }

  allClicked() {
    var mainElement = document.getElementsByClassName("form-check-input-all")
    if ((<HTMLInputElement>mainElement[0]).checked) {
      var elements = document.getElementsByClassName("form-check-input")
      for(var i = 0; i < elements.length; i++) {
        (<HTMLInputElement>elements[i]).checked = true; 
      }
      this.isButtonDisabled = false;
    }
    else {
      (<HTMLInputElement>mainElement[0]).checked = false;
      var elements = document.getElementsByClassName("form-check-input")
      for(var i = 0; i < elements.length; i++) {
        (<HTMLInputElement>elements[i]).checked = false; 
      }
      this.isButtonDisabled = true;

    }
  }

  formatDate(value) {
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
      var formattedDate = new Intl.DateTimeFormat(undefined, {year: "numeric", month: "long", day: "numeric"}).format(date);
      return formattedDate
    }
  }

  progressLoading() {
    Swal.fire({
      title: "Evaluating...",
      allowEscapeKey: false,
      allowOutsideClick: false,
      background: '#fbb335',
   
      showConfirmButton:false,
      timer: 3500,
      timerProgressBar: true,
    })
  }

}
