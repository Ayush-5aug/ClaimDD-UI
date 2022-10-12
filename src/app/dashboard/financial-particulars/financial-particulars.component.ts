import { Component, OnInit } from "@angular/core";
import { NgForm, FormGroup, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { ProjectService } from "src/app/services/project/project.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-financial-particulars",
  templateUrl: "./financial-particulars.component.html",
  styleUrls: ["./financial-particulars.component.css"],
})
export class FinancialParticularsComponent implements OnInit {
  userData: any;
  constructor(private router: Router, private projectService: ProjectService) {}
  submitForm: FormGroup;
  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    const projectData = JSON.parse(localStorage.getItem("projectData"));
    const selectedProject = JSON.parse(localStorage.getItem("selectedProject"));
    this.submitForm = new FormGroup({
      headOfficeOverheadPercentage: new FormControl(""),
      profitPercentage: new FormControl(""),
      yearlyInterest: new FormControl(""),
      interestType: new FormControl(""),
      compoundingPeriod: new FormControl(""),
      annualTurnoverOfCompany: new FormControl(""),
      actualTurnoverOfCompany: new FormControl(""),
      annualHOOverheadCost: new FormControl(""),
      actualHOOverheadCost: new FormControl(""),
      annualProfit: new FormControl(""),
      actualProfit: new FormControl(""),
    });

    if (projectData && selectedProject) {
      this.submitForm.patchValue({
        headOfficeOverheadPercentage: projectData.headOfficeOverheadPercentage,
        profitPercentage: projectData.profitPercentage,
        yearlyInterest: projectData.yearlyInterest,
        interestType: projectData.interestType,
        compoundingPeriod: projectData.compoundingPeriod,
        annualTurnoverOfCompany: this.formatNumber(projectData.annualTurnoverOfCompany),
        actualTurnoverOfCompany: this.formatNumber(projectData.actualTurnoverOfCompany),
        annualHOOverheadCost: this.formatNumber(projectData.annualHOOverheadCost),
        actualHOOverheadCost: this.formatNumber(projectData.actualHOOverheadCost),
        annualProfit: this.formatNumber(projectData.annualProfit),
        actualProfit: this.formatNumber(projectData.actualProfit),
      });
    }
  }

  onSubmitForm() {
      //unformat the number before storing the value
    this.submitForm.value.annualTurnoverOfCompany = this.removeComma(this.submitForm.value.annualTurnoverOfCompany)
    this.submitForm.value.actualTurnoverOfCompany = this.removeComma(this.submitForm.value.actualTurnoverOfCompany)
    this.submitForm.value.annualHOOverheadCost = this.removeComma(this.submitForm.value.annualHOOverheadCost)
    this.submitForm.value.actualHOOverheadCost = this.removeComma(this.submitForm.value.actualHOOverheadCost)
    this.submitForm.value.annualProfit = this.removeComma(this.submitForm.value.annualProfit)
    this.submitForm.value.actualProfit = this.removeComma(this.submitForm.value.actualProfit)

     //storing the data
    const projectId = JSON.parse(localStorage.getItem("selectedProject"));
    this.projectService
      .updateProjectData(projectId, this.submitForm.value)
      .subscribe((res) => {
        localStorage.setItem("projectData", JSON.stringify(res.updateProject));
        this.SaveMessage();
        //this.router.navigate(["dashboard/events"]);
      });
  }

  formatNumber(value: any) {
    console.log(value)
    if (value == undefined)
    {
      return "";
    }
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    const formatSetting =  new Intl.NumberFormat(projectData.regionFormat, {minimumFractionDigits: projectData.decimalPlaces, maximumFractionDigits: projectData.decimalPlaces});
    var formattedNumber = formatSetting.format(value)
    console.log(formattedNumber) 
    return formattedNumber
  }

  removeComma(value: any) { // germany and finnish ke liye condition lga do (because comma is not coming)
    //this is to remove commma or space (format) from the number data. 
    let num: String = ""
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    if (projectData.regionFormat == "en-DE") { // Germany (, with . and . with '')
      for(let i = 0; i < value.length; i++) {
        if (value[i] == ',') {
          num = num + '.'
          continue;
        }
        if (value[i] != '.') {
          num = num + value[i]
        }
      }
      return num
    }
    if (projectData.regionFormat == "en-fi") { // Finnish 
      for(let i = 0; i < value.length; i++) {
        if (value[i].charCodeAt(0) == 160) {
          continue;
        }
        if (value[i] === ',') {
          num = num + '.'
          continue;
        }
        num = num + value[i]
      }
      return num
    }
    for(let i = 0; i < value.length; i++) { // for other regions
      if (value[i] != ',') {
        num = num + value[i]
      }
    }
    return num
  }

  SaveMessage() {
    Swal.fire({
      title: 'Saved',
      text: 'Data are saved.',
      icon: "info",
      });
  }

}
