import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { ProjectService } from "src/app/services/project/project.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";

@Component({
  selector: "app-contract-particulars",
  templateUrl: "./contract-particulars.component.html",
  styleUrls: ["./contract-particulars.component.css"],
})
export class ContractParticularsComponent implements OnInit {
  userData: any;
  licenseStartDate: Date;
  licenseEndDate: Date;
  projectValue: any;
  isOriginalContract = true;
  isConditionOfContract = false;
  isContractAmendment = false;
  currency = "";
  licenseCurrency = ""; // coming from pricing page during license purchase
  duartionUnit = ""
  submitForm: FormGroup;
  constructor(private projectService: ProjectService, private router: Router, private toastr: ToastrService,) {}

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.submitForm = new FormGroup({
      nameOfDefendant: new FormControl(""),
      contractReference: new FormControl(""),
      originalContractPrice: new FormControl(""),
      originalContractPriceType: new FormControl(""),
      originalContractDurationSelect: new FormControl(""),
      originalContractDurationvalue: new FormControl(""),
      commencementDate: new FormControl(""),
      contractWorking: new FormControl(""),
      clauses: new FormControl(""),
      status: new FormControl(""),
      latestContractAmendmentReference: new FormControl(""),
      reviesdContractPriceType: new FormControl({value: '', disabled: true}),
      reviesdContractPriceValue: new FormControl(""),
      reviesdContractDurationSelect: new FormControl({value: '', disabled: true}),
      reviesdContractDuration: new FormControl(""),
    });
    const projectData = JSON.parse(localStorage.getItem("projectData"));
    const selectedProject = JSON.parse(localStorage.getItem("selectedProject"));

    // getting license currency
    let obj: any = {}
    obj.projectId = selectedProject;
    this.projectService.getLicenseCurrencyFromProjectId(obj).subscribe((res) => {
      this.licenseCurrency = res['currency'];
    }, (err) => {
      this.toastr.error(err.error.err)
    })

    //getting license dates
    this.projectService.getLicenseDates(selectedProject).subscribe((res) => {
      console.log(res)
      this.licenseStartDate = new Date (res['License start Date'])
      this.licenseEndDate = new Date (res['validity'])
      this.licenseStartDate = new Date (this.licenseStartDate.getUTCFullYear(), this.licenseStartDate.getUTCMonth(), this.licenseStartDate.getUTCDate())
      this.licenseEndDate = new Date (this.licenseEndDate.getUTCFullYear(), this.licenseEndDate.getUTCMonth(), this.licenseEndDate.getUTCDate())
      this.projectValue = Number(res['projectValue'])
    }), (err) => {
      this.toastr.error("You are not Paid");
    }

    console.log(projectData)
    if (projectData && selectedProject) {
      this.submitForm.patchValue({
        nameOfDefendant: projectData.nameOfDefendant,
        contractReference: projectData.contractReference,
        //originalContractPrice: new Intl.NumberFormat(projectData.regionFormat, {maximumFractionDigits: projectData.decimalPlaces}).format(projectData.originalContractPrice),
        originalContractPrice: this.formatNumber(projectData.originalContractPrice),
        originalContractPriceType: projectData.originalContractPriceType,
        originalContractDurationSelect:
          projectData.originalContractDurationSelect,
        originalContractDurationvalue:
        this.formatNumber(projectData.originalContractDurationvalue),
        commencementDate : new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date(projectData.commencementDate)),
        contractWorking: this.formatNumber(projectData.contractWorking),
        clauses: projectData.clauses,
        status: projectData.status,
        latestContractAmendmentReference:
          projectData.latestContractAmendmentReference,
        reviesdContractPriceType: projectData.originalContractPriceType,
        reviesdContractPriceValue: this.formatNumber(projectData.reviesdContractPriceValue),
        reviesdContractDurationSelect: projectData.originalContractDurationSelect,
        reviesdContractDuration: this.formatNumber(projectData.reviesdContractDuration),
      });
      this.currency = projectData.originalContractPriceType;
      console.log("currency set")
    }
  }

  onSubmitForm() {
    console.log("submit called")
    this.submitForm.value.originalContractPrice = this.removeComma(this.submitForm.value.originalContractPrice)
    this.submitForm.value.originalContractDurationvalue = this.removeComma(this.submitForm.value.originalContractDurationvalue)
    this.submitForm.value.reviesdContractPriceValue = this.removeComma(this.submitForm.value.reviesdContractPriceValue)
    this.submitForm.value.contractWorking = this.removeComma(this.submitForm.value.contractWorking)
    this.submitForm.value.reviesdContractDuration = this.removeComma(this.submitForm.value.reviesdContractDuration)
    let commencementDate = new Date(this.submitForm.value.commencementDate)
    console.log(commencementDate, this.licenseEndDate, this.licenseStartDate)
    if(this.submitForm.value.commencementDate && !(commencementDate.getTime() <= this.licenseEndDate.getTime() && commencementDate.getTime() >= this.licenseStartDate.getTime())) {
      this.toastr.error("Not valid Commencement Date");
      return
    } 

    if (this.submitForm.value.originalContractPrice) {
      this.convertPrice(this.submitForm.value.originalContractPrice);
    }
    /*if (this.submitForm.value.originalContractPrice && this.projectValue < this.submitForm.value.originalContractPrice) {
      this.toastr.error("Original Contract Price can't exceed License project Value limit");
      return
    }*/
  }

  setCurrency() {
    this.currency = (<HTMLInputElement>document.getElementById('currency')).value;
  }

  setDuration() {
    this.duartionUnit = (<HTMLInputElement>document.getElementById('durationUnit')).value
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

  convertPrice(price: any) {
    let isError: Number = 0
    let jsonData: any;
    console.log(this.currency)
    console.log(this.licenseCurrency)
    console.log(price)
    let obj1: any = {}
    obj1.code = this.currency;
    this.projectService.getCurrencyData(obj1).subscribe((res) => {
    jsonData = res['rates']
    console.log(jsonData)
    }, (err) => {
      isError = 1;
      this.toastr.error("Some Error in currency rates API")
    })

    setTimeout(() => {
      let finalAmountInLicenseCurrency = Number(jsonData[this.licenseCurrency]) * Number(price)
      //let finalAmountInLicenseCurrency = Number(Number(price) / Number(jsonData[this.currency]) * Number(jsonData[this.licenseCurrency]))
      console.log(this.projectValue, finalAmountInLicenseCurrency)
      if (this.projectValue < finalAmountInLicenseCurrency) {
        isError = 1
        this.toastr.error("Original Contract Price can't exceed License project Value limit");
      }
      console.log("Error Code-> ", isError)
      if (isError == 0) {
          const projectId = JSON.parse(localStorage.getItem("selectedProject"));
          this.projectService
          .updateProjectData(projectId, this.submitForm.value)
          .subscribe((res) => {
            localStorage.setItem("projectData", JSON.stringify(res.updateProject));
            this.SaveMessage();
            //this.router.navigate(["dashboard/financial-particulars"]);
          });
      }
    }, 3000);
  }

  SaveMessage() {
    Swal.fire({
      title: 'Saved',
      text: 'Data are saved.',
      icon: "info",
      });
  }

}
