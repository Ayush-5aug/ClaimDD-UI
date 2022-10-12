import { Component, OnInit } from "@angular/core";
import config from "../../shared/configuration-data-import";
import * as moment from "moment";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ProjectService } from "../../services/project/project.service";
import { Router } from "@angular/router";
import * as XLSX from 'xlsx'; 
import { DatePipe } from '@angular/common'
import { ToastrService } from "ngx-toastr";
import { ITS_JUST_ANGULAR } from "@angular/core/src/r3_symbols";

@Component({
  selector: "app-preview",
  templateUrl: "./preview.component.html",
  styleUrls: ["./preview.component.css"],
})
export class PreviewComponent implements OnInit {
  actualProjectData: any;
  userData: any;
  editModalUtilityRef: any;
  monthList: any = []
  isMonthFeild: Boolean = false;
  addModalUtilityRef: any;
  licenseStartDate: Date;
  licenseEndDate: Date;
  selected: string;
  selectedHead: string;
  selectedPage: string;
  selectedRow: string;
  selectedCell: string;
  selectedRowIndex: number;
  selectedColumnIndex: number;
  previousLink: string;
  selectedConfig: any;
  projectData: any;
  AllDataArray: any;
  modifiedDataArray: any;
  selectedStartDate: any;
  selectedEndDate: any;
  isEditCell: any;
  editDeleteModalRef: any;
  deleteModalRef: any;
  isDeleteCell: any;
  selectedEditId: any;
  selectedEditIndexValue: any = {};
  selectedEditValue: any;
  addModalRef: any;
  editModalRef: any;
  editCellModalRef: any;
  addModalRefCellRow: any;
  selectedPreviewDataIndex: number;
  isDateField: Boolean;
  PreSelectedRowIndex:number = 1;
  PreSelectedColumnIndex:number = 2;
  ViewProjectData: any;
  TableType: any;           /// for applying desired format css
  isSearch: Boolean;

  constructor(private modalService: NgbModal,
    private projectService: ProjectService,
    private router: Router,
    public datepipe: DatePipe, private toastr: ToastrService,) {}

  ngOnInit(): void {
    console.log("spinner should up")
    //this.ViewProjectData = {};
    this.isSearch = false
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.selectedPreviewDataIndex = 0;
    this.selectedRow = "";
    const projectId = JSON.parse(localStorage.getItem("selectedProject"));
    this.projectService.getProjectDataById(projectId).subscribe((res) => {
      this.actualProjectData = res;
      console.log(res)
    })
    this.selected = JSON.parse(localStorage.getItem("selectedImport"));
    this.selectedHead = this.selected.replace (/[A-Z]/g, ' $&').trim();
    let selectedtab = JSON.parse(localStorage.getItem("selectedImportPage"));
    this.selectedPage = JSON.parse(localStorage.getItem("selectedImportPage"));
    this.selectedPage = this.selectedPage.split('/')[1];
    localStorage.setItem(
      "selectedRowIndexFromSearchData",
      JSON.stringify(-1)
    );
    const selectedProject = JSON.parse(localStorage.getItem("selectedProject"));
    this.projectService.getLicenseDates(selectedProject).subscribe((res) => {
      console.log(res)
      this.licenseStartDate = new Date (res['License start Date'])
      this.licenseEndDate = new Date (res['validity'])
    }), (err) => {
      this.toastr.error("You are not Paid");
    }
    
    this.projectService
            .getPreviewData(projectId, this.selected, selectedtab)
            .subscribe((res) => {
              console.log(res)
              localStorage.setItem(
                "ProjectData",
                JSON.stringify(res)
              );
            });
    this.selected = JSON.parse(localStorage.getItem("selectedImport"));
    console.log(config[this.selected].config)
    this.formatPreviewTableData (config[this.selected].config, this.selectedHead)
    
    setTimeout(() => {
      this.previousLink = JSON.parse(localStorage.getItem("selectedImportPage"));
      this.selectedConfig = config[`${this.selected}`];
      this.projectData = JSON.parse(localStorage.getItem("ProjectData"));
      console.log(this.projectData)
    }, 3000);
  }


  
  //formatting the data before showing
  formatPreviewTableData (dataType, selDTable){
    setTimeout(() => {
      if(dataType == "date") {
        this.isDateField = true;
        console.log(selDTable)
        if (selDTable == "work Resources Manpower Work" || selDTable == "labour Productivity" || selDTable == "actual Rates Labour") {
          this.formatResultsIntoDesiredDateFormats(2);
          this.TableType = "PDT2"
        }
        else if (selDTable == "site Resources Manpower Admin" || selDTable == "site Resources Equipment" || selDTable == "site Resources Transport") {
          this.formatResultsIntoDesiredDateFormats(1);
          this.TableType = "PDT1"
        }
      }
      else {
        this.isDateField = false;
        console.log(selDTable)
        if (selDTable == "work Resources Material") {
          //this.formatDateCol(0);
          //this.formatNumberColTwo(2, 4);
          this.formatOneDateTwoNumberCols (0, 2, 4)
          this.TableType = "FDT2"
        }
        else if (selDTable == "other Damages") {
          //this.formatDateCol(0);
          //this.formatNumberColSingle(2);
          this.formatOneDateOneNumberCols(0,2)
          this.TableType = "FDT3"
        }
        else if (selDTable == "labour Demobilisation" || selDTable == "labour Remobilisation") {
          //this.formatDateCol(1);
          //this.formatNumberColTwo(2, 4);
          //this.formatDemRem();
          this.formatOneDateTwoNumberCols (1, 2, 4)
          this.TableType = "FDT2"
        }
        else if (selDTable == "other Unpaid Claim") {
          //this.formatDateCol(2);
          //this.formatDateCol(3);
          //this.formatNumberColSingle(1);
          this.formatTwoDateOneNumberCols(2,3,1)
          this.TableType = "FDT1"
        }
        else if (selDTable == "work Resources Utilities") {
          this.isMonthFeild = true;
          this.formatMonthHeadNumberData(2)
          this.TableType = "PDT2"
          //number format needs to be added
        }
        else if (selDTable === "project Rates Contract Commitments" || selDTable === "project Rates Site Facilities" || selDTable === "project Rates Site Administration Staff" || selDTable === "project Rates Equipment Transport" || selDTable === "project Rates Utilities" || selDTable === "tender Rates Material" || selDTable === "tender Rates Labour" || selDTable === "other Subcontractor Claims") {
          this.formatOneNumberCol(1);
          this.TableType = "FDT1"
        }
      }
    }, 1000);
  }

   //formatting the data before showing
   formatPreviewTableDataT2 (dataType, selDTable){
    setTimeout(() => {
      if(dataType == "date") {
        this.isDateField = true;
        console.log(selDTable)
        if (selDTable == "workResourcesManpowerWork" || selDTable == "labourProductivity" || selDTable == "actualRatesLabour") {
          this.formatResultsIntoDesiredDateFormats(2);
          this.TableType = "PDT2"
        }
        else if (selDTable == "siteResourcesManpowerAdmin" || selDTable == "site ResourcesEquipment" || selDTable == "site ResourcesTransport") {
          this.formatResultsIntoDesiredDateFormats(1);
          this.TableType = "PDT1"
        }
      }
      else {
        this.isDateField = false;
        console.log(selDTable)
        if (selDTable == "workResourcesMaterial") {
          //this.formatDateCol(0);
          //this.formatNumberColTwo(2, 4);
          this.formatOneDateTwoNumberCols (0, 2, 4)
          this.TableType = "FDT2"
        }
        else if (selDTable == "otherDamages") {
          //this.formatDateCol(0);
          //this.formatNumberColSingle(2);
          this.formatOneDateOneNumberCols(0,2)
          this.TableType = "FDT3"
        }
        else if (selDTable == "labourDemobilisation" || selDTable == "labourRemobilisation") {
          //this.formatDateCol(1);
          //this.formatNumberColTwo(2, 4);
          //this.formatDemRem();
          this.formatOneDateTwoNumberCols (1, 2, 4)
          this.TableType = "FDT2"
        }
        else if (selDTable == "otherUnpaidClaim") {
          //this.formatDateCol(2);
          //this.formatDateCol(3);
          //this.formatNumberColSingle(1);
          this.formatTwoDateOneNumberCols(2,3,1)
          this.TableType = "FDT1"
        }
        else if (selDTable == "workResourcesUtilities") {
          this.isMonthFeild = true;
          this.formatMonthHeadNumberData(2)
          this.TableType = "PDT2"
          //number format needs to be added
        }
        else if (selDTable === "projectRatesContractCommitments" || selDTable === "projectRatesSiteFacilities" || selDTable === "projectRatesSiteAdministrationStaff" || selDTable === "projectRatesEquipmentTransport" || selDTable === "projectRatesUtilities" || selDTable === "tenderRatesMaterial" || selDTable === "tenderRatesLabour" || selDTable === "otherSubcontractorClaims") {
          this.formatOneNumberCol(1);
          this.TableType = "FDT1"
        }
      }
    }, 1000);
  }

  formatResultsIntoDesiredDateFormats(index : number) {
    console.log(this.selectedHead)
    let actualProjectData: any;
    const projectId = JSON.parse(localStorage.getItem("selectedProject"));
    let projectData = JSON.parse(localStorage.getItem("ProjectData"));
    this.ViewProjectData = JSON.parse(JSON.stringify(projectData));
    this.projectService.getProjectDataById(projectId).subscribe((res) => {
      actualProjectData = res;
      console.log(res)
    })
    setTimeout(() => {
      for (let i = 0; i < this.ViewProjectData.length; i++) { // 3 times
        for (let j = index; j < this.ViewProjectData[i][0].length; j++) {
          console.log(projectData[i][0][j])
          this.ViewProjectData[i][0][j] = new Intl.DateTimeFormat(actualProjectData.regionFormat, {year: actualProjectData.yearFormat, month: actualProjectData.monthFormat, day: actualProjectData.dayFormat}).format(new Date(this.ViewProjectData[i][0][j]));
        }
      }
      localStorage.setItem(
        "ProjectData",
        JSON.stringify(projectData)
      );
      console.log(projectData)
    }, 1000);
  }



formatOneNumberCol(NIndex: number) {
    // this is to format one date column and one number column
    console.log(this.selectedHead)
    let actualProjectData: any;
    const projectId = JSON.parse(localStorage.getItem("selectedProject"));
    let projectData = JSON.parse(localStorage.getItem("ProjectData")); // preview Data
    this.ViewProjectData = JSON.parse(JSON.stringify(projectData));
    this.projectService.getProjectDataById(projectId).subscribe((res) => {
      actualProjectData = res;
      console.log(res)
    })
    setTimeout(() => {
      for (let i = 1; i < this.ViewProjectData.length; i++) { // 3 times
        this.ViewProjectData[i][NIndex] =new Intl.NumberFormat(actualProjectData.regionFormat, {minimumFractionDigits: actualProjectData.decimalPlaces, maximumFractionDigits: actualProjectData.decimalPlaces}).format(Number(this.ViewProjectData[i][NIndex])); 
      }
      localStorage.setItem(
        "ProjectData",
        JSON.stringify(projectData)
      );
      console.log(projectData)
    }, 1500);
}
  
formatOneDateOneNumberCols(DIndex: number, NIndex: number) {
  // this is to format one date column and one number column
  console.log(this.selectedHead)
  let actualProjectData: any;
  const projectId = JSON.parse(localStorage.getItem("selectedProject"));
  let projectData = JSON.parse(localStorage.getItem("ProjectData")); // preview Data
  this.ViewProjectData = JSON.parse(JSON.stringify(projectData));
  this.projectService.getProjectDataById(projectId).subscribe((res) => {
    actualProjectData = res;
    console.log(res)
  })
  setTimeout(() => {
    for (let i = 1; i < this.ViewProjectData.length; i++) { // 3 times
      this.ViewProjectData[i][DIndex] = new Intl.DateTimeFormat(actualProjectData.regionFormat, {year: actualProjectData.yearFormat, month: actualProjectData.monthFormat, day: actualProjectData.dayFormat}).format(new Date(this.ViewProjectData[i][DIndex])); 
      this.ViewProjectData[i][NIndex] =new Intl.NumberFormat(actualProjectData.regionFormat, {minimumFractionDigits: actualProjectData.decimalPlaces, maximumFractionDigits: actualProjectData.decimalPlaces}).format(Number(this.ViewProjectData[i][NIndex])); 
    }
    localStorage.setItem(
      "ProjectData",
      JSON.stringify(projectData)
    );
    console.log(projectData)
  }, 1500);
}

formatOneDateTwoNumberCols(DIndex: number, NIndex1: number, NIndex2: number) {
  // this is to format one date column and two number columns
  console.log(this.selectedHead)
  let actualProjectData: any;
  const projectId = JSON.parse(localStorage.getItem("selectedProject"));
  let projectData = JSON.parse(localStorage.getItem("ProjectData")); // preview Data
  this.ViewProjectData = JSON.parse(JSON.stringify(projectData));
  this.projectService.getProjectDataById(projectId).subscribe((res) => {
    actualProjectData = res;
    console.log(res)
  })
  setTimeout(() => {

    for (let i = 1; i < this.ViewProjectData.length; i++) { // 3 times
      this.ViewProjectData[i][DIndex] = new Intl.DateTimeFormat(actualProjectData.regionFormat, {year: actualProjectData.yearFormat, month: actualProjectData.monthFormat, day: actualProjectData.dayFormat}).format(new Date(this.ViewProjectData[i][DIndex])); 
      this.ViewProjectData[i][NIndex1] =new Intl.NumberFormat(actualProjectData.regionFormat, {minimumFractionDigits: actualProjectData.decimalPlaces, maximumFractionDigits: actualProjectData.decimalPlaces}).format(Number(this.ViewProjectData[i][NIndex1])); 
      this.ViewProjectData[i][NIndex2] =new Intl.NumberFormat(actualProjectData.regionFormat, {minimumFractionDigits: actualProjectData.decimalPlaces, maximumFractionDigits: actualProjectData.decimalPlaces}).format(Number(this.ViewProjectData[i][NIndex2])); 
    }
    localStorage.setItem(
      "ProjectData",
      JSON.stringify(projectData)
    );
    console.log(projectData)
  }, 1500);
}

formatTwoDateOneNumberCols(DIndex1: number, DIndex2: number, NIndex: number) {
  // this is to format two date columns and one number column
  console.log(this.selectedHead)
  let actualProjectData: any;
  const projectId = JSON.parse(localStorage.getItem("selectedProject"));
  let projectData = JSON.parse(localStorage.getItem("ProjectData")); // preview Data
  this.ViewProjectData = JSON.parse(JSON.stringify(projectData));
  this.projectService.getProjectDataById(projectId).subscribe((res) => {
    actualProjectData = res;
    console.log(res)
  })
  setTimeout(() => {
    for (let i = 1; i < this.ViewProjectData.length; i++) { // 3 times
      this.ViewProjectData[i][DIndex1] = new Intl.DateTimeFormat(actualProjectData.regionFormat, {year: actualProjectData.yearFormat, month: actualProjectData.monthFormat, day: actualProjectData.dayFormat}).format(new Date(this.ViewProjectData[i][DIndex1])); 
      this.ViewProjectData[i][DIndex2] = new Intl.DateTimeFormat(actualProjectData.regionFormat, {year: actualProjectData.yearFormat, month: actualProjectData.monthFormat, day: actualProjectData.dayFormat}).format(new Date(this.ViewProjectData[i][DIndex2])); 
      this.ViewProjectData[i][NIndex] =new Intl.NumberFormat(actualProjectData.regionFormat, {minimumFractionDigits: actualProjectData.decimalPlaces, maximumFractionDigits: actualProjectData.decimalPlaces}).format(Number(this.ViewProjectData[i][NIndex])); 
    }
    localStorage.setItem(
      "ProjectData",
      JSON.stringify(projectData)
    );
    console.log(projectData)
  }, 1500);
}


formatMonthHeadNumberData(startIndex: number) {
  let actualProjectData: any;
  const projectId = JSON.parse(localStorage.getItem("selectedProject"));
  let projectData = JSON.parse(localStorage.getItem("ProjectData"));
  this.ViewProjectData = JSON.parse(JSON.stringify(projectData));
  this.projectService.getProjectDataById(projectId).subscribe((res) => {
    actualProjectData = res;
    console.log(res)
  })
  setTimeout(() => {
    for (let j = startIndex; j < this.ViewProjectData[0].length; j++) { 
      this.ViewProjectData[0][j] = new Intl.DateTimeFormat(actualProjectData.regionFormat, {year: actualProjectData.yearFormat, month: actualProjectData.monthFormat, day: actualProjectData.dayFormat}).format(new Date(this.ViewProjectData[0][j]));
      for (let i = 1; i < this.ViewProjectData.length; i++) { 
        this.ViewProjectData[i][j] =new Intl.NumberFormat(actualProjectData.regionFormat, {minimumFractionDigits: actualProjectData.decimalPlaces, maximumFractionDigits: actualProjectData.decimalPlaces}).format(Number(this.ViewProjectData[i][j])); 
      }
    }
    this.monthList = this.ViewProjectData[0].slice(2, this.ViewProjectData[0].length)
    // removing date part here
    for(let i = 2; i < this.ViewProjectData[0].length; i++) {
      this.ViewProjectData[0][i] = this.ViewProjectData[0][i].split(' ').slice(1, 5).join(' ');
    }
    console.log(this.ViewProjectData)
    localStorage.setItem(
      "ProjectData",
      JSON.stringify(projectData)
    );
    console.log(projectData)
  }, 2500);
}



  formatResultsForMonthsData(index: number) {
    let actualProjectData: any;
    const projectId = JSON.parse(localStorage.getItem("selectedProject"));
    let projectData = JSON.parse(localStorage.getItem("ProjectData"));
    this.projectService.getProjectDataById(projectId).subscribe((res) => {
      actualProjectData = res;
      console.log(res)
    })
    setTimeout(() => {
      for (let i = index; i < projectData[0].length; i++) { 
        //console.log(projectData[i][0][j])
        projectData[0][i] = new Intl.DateTimeFormat(actualProjectData.regionFormat, {year: actualProjectData.yearFormat, month: actualProjectData.monthFormat, day: actualProjectData.dayFormat}).format(new Date("1-"+projectData[0][i]));
      }
      localStorage.setItem(
        "ProjectData",
        JSON.stringify(projectData)
      );
      console.log(projectData)
    }, 1500);
  }

  
  formatDateCol(index: number) {
    console.log(this.selectedHead)
    let actualProjectData: any;
    const projectId = JSON.parse(localStorage.getItem("selectedProject"));
    let projectData = JSON.parse(localStorage.getItem("ProjectData")); // preview Data
    this.projectService.getProjectDataById(projectId).subscribe((res) => {
      actualProjectData = res;
      console.log(res)
    })
    setTimeout(() => {
      for (let i = 1; i < projectData.length; i++) { // 3 times
        projectData[i][index] = new Intl.DateTimeFormat(actualProjectData.regionFormat, {year: actualProjectData.yearFormat, month: actualProjectData.monthFormat, day: actualProjectData.dayFormat}).format(new Date(projectData[i][index])); 
      }
      localStorage.setItem(
        "ProjectData",
        JSON.stringify(projectData)
      );
      console.log(projectData)
    }, 1000);
  }

  onView(event) {
    event.preventDefault();

    this.selectedStartDate = moment(this.selectedStartDate).add(-1, "days");
    this.selectedEndDate = moment(this.selectedEndDate).add(1, "days");
    const selectedMonthIndex = [];
    const headerIndex = [];
    this.AllDataArray[0].map((val, index) => {
      if (!moment(val, "DD-MMM-YY").isValid()) {
        headerIndex.push(index);
      }
      const compareDate = moment(moment(val, "DD-MMM-YY").format("YYYY-MM-DD"));
      if (compareDate.isBetween(this.selectedStartDate, this.selectedEndDate)) {
        selectedMonthIndex.push(index);
      }
    });

    const modifiedArrayIndex = [...headerIndex, ...selectedMonthIndex];
    const modifiedFinalArray = [];
    this.AllDataArray.forEach((col) => {
      let output;

      output = modifiedArrayIndex.map((i: number) => col[i]);

      modifiedFinalArray.push(output);
    });
    this.modifiedDataArray = modifiedFinalArray;
  }

  nextMonth() {
    this.selectedPreviewDataIndex = (this.selectedPreviewDataIndex + 1) % this.projectData.length
    this.router.navigate(["User/preview"]);
  }

  goBack() {
    let url = "User/" + this.selectedPage
    this.router.navigate([url]);
  }

  prevMonth() {
    if (this.selectedPreviewDataIndex == 0) {
      this.selectedPreviewDataIndex = this.projectData.length - 1
    }
    else {
      this.selectedPreviewDataIndex = this.selectedPreviewDataIndex - 1
    }
    this.router.navigate(["User/preview"]); 
  }

  onAddCellNewRow() {
    const projectId = JSON.parse(localStorage.getItem("selectedProject"));
    const projectData = JSON.parse(localStorage.getItem("ProjectData"));
    var data = (<HTMLInputElement>document.getElementById('xyz')).value
    console.log(data)
    var date = (<HTMLInputElement>document.getElementById('date')).value
    if(!(new Date(date).getTime() <= this.licenseEndDate.getTime() && new Date(date).getTime() >= this.licenseStartDate.getTime())) {
      this.toastr.error("Not valid Date");
      return
    } 
    let latest_date =this.datepipe.transform(date, 'MM-dd-yy');
    if (latest_date[0] == '0') {
      latest_date = latest_date.substring(1)
    }
    var arr1 = []
    this.selectedConfig.headers.forEach(function (headers) {
      var x = (<HTMLInputElement>document.getElementById(headers)).value
      arr1.push(x)
    }); 
    let x : string
    x = latest_date.split('-', 2)[1]
    let month = config["getMonth"][x]
    var splitted_date = latest_date.split('-', 3)
    let finalDate : string
    finalDate = splitted_date[0] + '-' + month + '-' + splitted_date[2]
    finalDate= new Intl.DateTimeFormat(this.actualProjectData.regionFormat, {year: this.actualProjectData.yearFormat, month: this.actualProjectData.monthFormat, day: this.actualProjectData.dayFormat}).format(new Date(latest_date))
    console.log(finalDate) 
    // Now we will check whether this final date is present or not, if not then new column will be inserted
    let k = 0
    let flag = 0
    for (k = 0; k < projectData.length; k++) {
      if(new Date(projectData[k][0][3]).getMonth() === new Date(finalDate).getMonth()) {
        console.log("Month is present, add here only")
        this.selectedPreviewDataIndex = k
        flag = 1
        break 
      }
    }
    if (flag == 1) {
        if(projectData[this.selectedPreviewDataIndex][0].includes(finalDate)) {
          console.log("Date is present, row jo append hogi")
          let index = projectData[this.selectedPreviewDataIndex][0].indexOf(finalDate)
          const array = new Array(projectData[this.selectedPreviewDataIndex][0].length).fill("0")
          array[0] = arr1[0]
          console.log(arr1)
          if (this.checkForDuplicacyForDates(arr1, this.selected) == -1) {
            this.addModalRefCellRow.close();
            this.toastr.error("Duplicate value for " + arr1)
            return 
          }
          array[1] = arr1[1]
          array[index] = data
          projectData[this.selectedPreviewDataIndex].push(array)
          console.log(projectData)
        }
        else {
          let len = projectData[this.selectedPreviewDataIndex].length
          let arr = new Array(len).fill("0")
          arr[0] = finalDate
          console.log("Date is not present, new column will be added")
          let i = 0
          projectData[this.selectedPreviewDataIndex].forEach(function (row) {
            row.push(arr[i])
            i = i + 1
          });
          const array = new Array(projectData[this.selectedPreviewDataIndex][0].length).fill("0")
          array[0] = arr1[0]
          console.log(arr1)
          if (this.checkForDuplicacyForDates(arr1, this.selected) == -1) {
            this.addModalRefCellRow.close();
            this.toastr.error("Duplicate value for " + arr1)
            return 
          }
          array[1] = arr1[1]
          array[projectData[this.selectedPreviewDataIndex][0].length - 1] = data 
          projectData[this.selectedPreviewDataIndex].push(array)
          console.log(projectData)
        }
    }
    if(flag == 0) {
      // month not found,  add a new entry
      console.log("month not found,  add a new entry")
    }
    
    // Now save the projectData into DB
    let obj: any = {};
    obj.attribute = this.selected
    obj.data = projectData
    obj.projectId = projectId
    obj.selectedtab = JSON.parse(localStorage.getItem("selectedImportPage"));
    this.projectService
            .addDataToProjectwithDate(obj)
            .subscribe((res) => {
              console.log(res)
              localStorage.setItem(
                "ProjectData",
                JSON.stringify(res)
              );
              this.projectData = res
              this.addModalRefCellRow.close();
              this.ngOnInit();
              //window.location.reload()
              //this.router.navigate(["dashboard/preview"]);
            });
      this.toastr.success("Added Successfully.");
  }

  onAdd() {
    var arr = []
    this.selectedConfig.headers.forEach(function (headers) {
      var x = (<HTMLInputElement>document.getElementById(headers)).value
      arr.push(x)
    }); 
    const projectId = JSON.parse(localStorage.getItem("selectedProject"));
    let obj: any = {};
    obj.attribute = this.selected
    obj.data = arr
    obj.projectId = projectId
    obj.selectedtab = JSON.parse(localStorage.getItem("selectedImportPage"));
    console.log(this.projectData)
    if (this.checkForDuplicacy(arr, obj.attribute, -1) == -1) {
      this.addModalRef.close();
      this.toastr.error("Duplicate value for " + arr[0])
      return 
    }
    this.projectService
            .addDataToProject(obj)
            .subscribe((res) => {
              console.log(res)
              localStorage.setItem(
                "ProjectData",
                JSON.stringify(res)
              );
              this.projectData = res;
              this.addModalRef.close();
              this.formatPreviewTableDataT2("notDate",this.selected)
              //this.ngOnInit();
              //window.location.reload()
              //this.router.navigate(["dashboard/preview"]);
            });
      this.toastr.success("Added Successfully.");
  }

  onAddUtility() {
    let projectData = JSON.parse(localStorage.getItem("ProjectData"));
    console.log(projectData)
    var arr = []
    this.selectedConfig.headers.forEach(function (headers) {
      var x = (<HTMLInputElement>document.getElementById(headers)).value
      arr.push(x)
    }); 
    let monthIndex = (<HTMLInputElement>document.getElementById("getMonth")).value
    let utilityValue = (<HTMLInputElement>document.getElementById("utilityValue")).value
    // check for duplicacy
    for (let i = 1; i < projectData.length; i++) {
      if (arr[0].toLowerCase() == projectData[i][0].toLowerCase()) {
        this.addModalUtilityRef.close();
        this.toastr.error("Duplicate value for " + arr[0])
        return 
      }
    }
    // Now prepare data
    const projectId = JSON.parse(localStorage.getItem("selectedProject"));
    let obj: any = {}
    let temp = new Array(this.projectData[0].length).fill('0')
    temp[0] = arr[0]
    temp[1] = arr[1]
    temp[Number(monthIndex) + 2] = utilityValue
    this.projectData.push(temp)
    obj.projectId = projectId
    obj.data = this.projectData
    this.projectService.updateUtility(obj).subscribe((res) => {
      localStorage.setItem(
        "ProjectData",
        JSON.stringify(res)
      );
      this.formatMonthHeadNumberData(2);
      this.toastr.success("Added successfully")
    }, (err) => {
      this.toastr.error(err.error.err)
    })
    this.addModalUtilityRef.close();
  }

  checkForDuplicacy(arr: any, pTableType: string, sRIndex: any) {
      //sRIndex - editing data row which is applicable when editing
    let actualData : any = this.projectData
    console.log(arr, pTableType, sRIndex)
    for (let i = 0; i < actualData.length; i++) {

      if (pTableType == "otherSubcontractorClaims"){        //need to check col 0 & 2
        if (actualData[i][0] == arr[0] && actualData[i][2] == arr[2] && i != sRIndex ) {
          return -1
          break;
        }
      }
      else if (pTableType == "labourDemobilisation" || pTableType == "labourRemobilisation" || pTableType == "workResourcesMaterial" || pTableType == "otherDamages"){        //need to check col 0 & 1
        if (actualData[i][0] === arr[0] && actualData[i][1] === arr[1] && i != sRIndex ) {
          return -1
          break;
        }
      }
      else if (pTableType == "workResourcesMaterial"){        //no need to check any as their might be different supplier
          return 0
          break;
      }
      else {
          if (actualData[i][0] == arr[0] && i != sRIndex ) {
          return -1
          break;
          }
      }
    }
    return 0
  }

  checkForDuplicacyForDates(arr: any, pTableType: string,) {
    let actualData : any = this.projectData[this.selectedPreviewDataIndex]
    console.log(arr, actualData)
    for (let i = 0; i < actualData.length; i++) {
      if (pTableType == "workResourcesManpowerWork" || pTableType == "actualRatesLabour"){        //need to check col 0 & 1
        if (actualData[i][0] == arr[0] && actualData[i][1] == arr[1] ) {
          return -1
          break;
        }
      }
      else {
        if (actualData[i][0] == arr[0]) {
          return -1
          break;
        }
      }
    }
    return 0
  }

  onEditCell() {
    //console.log ("DateCellEditing")
    var x = (<HTMLInputElement>document.getElementById("cellData")).value
    const projectId = JSON.parse(localStorage.getItem("selectedProject"));
    const rowIndexPreviewDataWithDates = JSON.parse(localStorage.getItem("selectedRowIndexFromSearchDataWithDates"));
    let obj: any = {};
    obj.attribute = this.selected
    obj.data = x
    obj.projectId = projectId
    obj.rowIndex = rowIndexPreviewDataWithDates ? rowIndexPreviewDataWithDates[this.selectedRowIndex - 1] : this.selectedRowIndex
    obj.columnIndex = this.selectedColumnIndex 
    obj.dataIndex = this.selectedPreviewDataIndex
    console.log (obj.rowIndex, obj.columnIndex, obj.dataIndex)
    obj.selectedtab = JSON.parse(localStorage.getItem("selectedImportPage"));
    this.projectService
            .editCellData(obj)
            .subscribe((res) => {
              console.log(res)
              localStorage.setItem(
                "ProjectData",
                JSON.stringify(res)
              );
              this.projectData = res;
              //this.ViewProjectData[obj.rowIndex][obj.dataIndex][obj.columnIndex] = this.formatNumber(this.projectData[obj.rowIndex][obj.dataIndex][obj.columnIndex]) //this is formatted data of edited data
              this.editCellModalRef.close();
              localStorage.setItem(
                "selectedRowIndexFromSearchDataWithDates",
                JSON.stringify(null)
              );
              this.ngOnInit();
             // window.location.reload()
             // this.router.navigate(["dashboard/preview"]);
            });

  }

  onEditRow() {
    //this is for editing individual cell value of non-date data type table
    console.log("editing Row")
    var arr = []
    this.selectedConfig.headers.forEach(function (headers) {
      var x = (<HTMLInputElement>document.getElementById(headers)).value
      arr.push(x)
    }); 
    const projectId = JSON.parse(localStorage.getItem("selectedProject"));
    console.log(JSON.parse(localStorage.getItem("selectedRowIndexFromSearchData")))
    const selectedRowIndexFromSearchData = JSON.parse(localStorage.getItem("selectedRowIndexFromSearchData"));
    let obj: any = {};
    obj.attribute = this.selected
    obj.data = arr
    obj.projectId = projectId
    obj.index = selectedRowIndexFromSearchData != -1 ? selectedRowIndexFromSearchData : this.selectedRowIndex 
    obj.selectedtab = JSON.parse(localStorage.getItem("selectedImportPage"));
    
    if (this.checkForDuplicacy(arr, obj.attribute, obj.index) == -1) {
      this.editModalRef.close();
      this.toastr.error("Duplicate value for " + arr[0])
      return 
    }
    this.projectService
            .editRowData(obj)
            .subscribe((res) => {
              console.log(res)
              localStorage.setItem(
                "ProjectData",
                JSON.stringify(res)
              );
              this.projectData = res
              this.editModalRef.close();
              localStorage.setItem(
                "selectedRowIndexFromSearchData",
                JSON.stringify(-1)
              );
              
             /*  
              this.ViewProjectData[obj.index][this.selectedColumnIndex] = this.formatNumber(this.projectData[obj.index][this.selectedColumnIndex]) //this is formatted data of edited data
                
              if (this.ViewProjectData[obj.index][this.selectedColumnIndex]) {
              this.ViewProjectData[obj.index][this.selectedColumnIndex] =  this.formatNumber(this.projectData[obj.index][this.selectedColumnIndex])
              }
              */

              this.formatPreviewTableDataT2("notDate", this.selected)
               
              //this.ngOnInit();
              //window.location.reload()
              //this.router.navigate(["dashboard/preview"]);
            });
  }

  openAddModalCellRow(modelRef: any) {
    this.addModalRefCellRow = this.modalService.open(modelRef);
  }

  openAddModal(modelRef: any) {
    this.addModalRef = this.modalService.open(modelRef);
  }

  openAddModalUtility(modelRef: any) {
    this.addModalUtilityRef = this.modalService.open(modelRef);
  }

  openEditCellModal(modelRef: any) {
    this.projectData = JSON.parse(localStorage.getItem("ProjectData"));
    console.log(this.selectedColumnIndex)
    console.log(this.projectData)
    this.editCellModalRef = this.modalService.open(modelRef);
  }

  openEditModal(modelRef: any) {
      this.editModalRef = this.modalService.open(modelRef);
  }

  openEditModalUtility(modelRef: any) {
    this.editModalUtilityRef = this.modalService.open(modelRef);
  }

  onEdit(content) {
    console.log(this.selectedConfig)
    console.log(this.projectData)
    this.isEditCell = true;
    this.editDeleteModalRef = this.modalService.open(content);
    this.editDeleteModalRef.closed.subscribe(() => (this.isEditCell = false));
    this.editDeleteModalRef.dismissed.subscribe(
      () => (this.isEditCell = false)
    );
  }
  onDeleteCell(content) {
    this.isDeleteCell = true;
    this.editDeleteModalRef = this.modalService.open(content);
    this.editDeleteModalRef.closed.subscribe(() => (this.isDeleteCell = false));
    this.editDeleteModalRef.dismissed.subscribe(
      () => (this.isDeleteCell = false)
    );
  }

  onDeleteButtonClicked(modelRef: any) {
    this.deleteModalRef = this.modalService.open(modelRef)
  }

  onEditDeleteSubmit() {
    this.selectedConfig.edit.forEach((val) => {
      if (val !== "0") {
        this.modifiedDataArray[Number(this.selectedEditId)][Number(val)] =
          Number(this.selectedEditIndexValue[val]);
      }
    });
    this.editDeleteModalRef.close();
  }
  onDateChange(event) {
    let date = moment(`${event}`, "YYYY-MM-DD");
    this.modifiedDataArray[Number(this.selectedEditId - 1)].forEach(
      (val, index) => {
        if (date.isSame(moment(val).format("YYYY-MM-DD"))) {
          this.selectedEditValue = this.modifiedDataArray[1][index];
        }
      }
    );
  }
  selectedEditIdChange(event) {
    this.selectedEditId = event;
    this.modifiedDataArray[Number(this.selectedEditId)].forEach(
      (val, index) => {
        this.selectedEditIndexValue;
      }
    );
  }

  cellDelete() {
      // this for deleting compelte row of Fixed Data row
    const projectId = JSON.parse(localStorage.getItem("selectedProject"));
    const rowIndexPreviewDataWithDates = JSON.parse(localStorage.getItem("selectedRowIndexFromSearchDataWithDates"));
    console.log(this.selectedColumnIndex)
    console.log(this.selectedRowIndex)
    let obj: any = {};
    obj.projectId = projectId
    obj.rowIndex = rowIndexPreviewDataWithDates ? rowIndexPreviewDataWithDates[this.selectedRowIndex - 1] : this.selectedRowIndex
    obj.columnIndex = this.selectedColumnIndex
    obj.dataIndex = this.selectedPreviewDataIndex
    obj.field = this.selected;
    obj.selectedtab = JSON.parse(localStorage.getItem("selectedImportPage"));
    this.projectService
            .deleteCellPreviewData(obj)
            .subscribe((res) => {
              console.log(res)
              localStorage.setItem(
                "ProjectData",
                JSON.stringify(res)
              );
              this.projectData = res;
              localStorage.setItem(
                "selectedRowIndexFromSearchDataWithDates",
                JSON.stringify(null)
              );
              this.ViewProjectData = this.projectData
              this.ngOnInit();
              // call formatted func to format the data
             // this.selectedHead = this.selected.replace (/[A-Z]/g, ' $&').trim();
              //this.formatPreviewTableData ("NotDate", this.selectedHead)

              //this.formatOneNumberCol(1);
              this.toastr.success("Deleted Successfully.");
              //this.ngOnInit();
             // window.location.reload()
              //this.router.navigate(["dashboard/preview"]);
      });
  }

  deleteUtility() {
    let projectData = JSON.parse(localStorage.getItem("ProjectData"));
    const projectId = JSON.parse(localStorage.getItem("selectedProject"));
    projectData[this.selectedRowIndex][this.selectedColumnIndex] = '0'
    let obj : any = {}
    obj.projectId = projectId
    obj.data = projectData
    this.projectService.updateUtility(obj).subscribe((res) => {
      localStorage.setItem(
        "ProjectData",
        JSON.stringify(res)
      );
      this.formatMonthHeadNumberData(2);
      this.toastr.success("Deleted successfully");
    }, (err) => {
      this.toastr.error(err.error.err)
    })
  }

  onEditUtility() {
    let projectData = JSON.parse(localStorage.getItem("ProjectData"));
    const projectId = JSON.parse(localStorage.getItem("selectedProject"));
    let data = (<HTMLInputElement>document.getElementById("editedData")).value
    projectData[this.selectedRowIndex][this.selectedColumnIndex] = data
    let obj : any = {}
    obj.projectId = projectId
    obj.data = projectData
    this.projectService.updateUtility(obj).subscribe((res) => {
      localStorage.setItem(
        "ProjectData",
        JSON.stringify(res)
      );
      this.projectData = res;
      this.formatMonthHeadNumberData(2);
      this.toastr.success("Edited successfully");
      this.editModalUtilityRef.close();
    }, (err) => {
      this.toastr.error(err.error.err)
    })
  } 

  onDelete() {
    if(this.isDateField) {
      this.cellDelete();
      this.deleteModalRef.close();
    }
    else if (this.isMonthFeild) {
      this.deleteUtility();
      this.deleteModalRef.close();
    }
    else{
      const projectId = JSON.parse(localStorage.getItem("selectedProject"));
      console.log("Delete this:- ", this.selectedRow)
      let obj: any = {};
      obj.projectId = projectId;
      obj.field = this.selected;
      //obj.deleteRow = this.selectedRow
      obj.deleteRow = this.projectData[this.selectedRowIndex]
      obj.selectedtab = JSON.parse(localStorage.getItem("selectedImportPage"));
      this.projectService
            .deletePreviewData(obj)
            .subscribe((res) => {
              console.log(res)
              localStorage.setItem(
                "ProjectData",
                JSON.stringify(res)
              );
              this.projectData = res;
              //this.ViewProjectData = this.projectData
              // call formatted func to format the data
             // this.selectedHead = this.selected.replace (/[A-Z]/g, ' $&').trim();
              //this.formatPreviewTableData ("NotDate", this.selectedHead)

              //this.formatOneNumberCol(1);
              this.toastr.success("Deleted Successfully.");
              this.ngOnInit();
               //window.location.reload()
              //this.router.navigate(["dashboard/preview"]);
      });
      this.deleteModalRef.close();
    }
  }

  onExport() {
    var fileName= this.selected + '.xlsx';
    const projectData = JSON.parse(localStorage.getItem("ProjectData"));
    console.log(projectData) // export this data
    /* table id is passed over here */   
    let element = document.getElementById('excel-table'); 
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, fileName);
    this.toastr.success("Data file is exported as Excel file");
  }

  returnSelectedEditHeader(index) {
    return this.selectedConfig.headers[Number(index)];
  }

  convertUtilityData(data: any) {
    let searchData = []
    let tempArray = []
    config[this.selected].headers.forEach(element => {
      tempArray.push(element)     
    });
    this.monthList.forEach(ele => {
      tempArray.push(ele)
    });
    searchData.push(tempArray)
    data.forEach(ele => {
      searchData.push(ele['data'])
    })
    return searchData;
  }

  convertSearchData(data: any) {
    let searchedData = []
    let tempArray = []
    if (this.isMonthFeild) {
      searchedData = this.convertUtilityData(data)
      return searchedData;
    }
    config[this.selected].headers.forEach(element => {
      tempArray.push(element)     
    });
    searchedData.push(tempArray)
    data.forEach(ele => {
      searchedData.push(ele['data'])
    })
    console.log(searchedData)
    return searchedData
  }

  convertSearchDataWithDates(data: any) {
    let mainData = []
    let searchedData = []
    let indexArr = []
    const projectDataLength = JSON.parse(localStorage.getItem("ProjectData")).length
    const projectData = JSON.parse(localStorage.getItem("ProjectData"))[this.selectedPreviewDataIndex];
    searchedData.push(projectData[0])
    let i = 0
    for(i=0;i<data.length;i++) {
      searchedData.push(data[i]['data'])
      indexArr.push(data[i]['index'])
    }
    for(i=0;i<projectDataLength;i++) {
      if(i == this.selectedPreviewDataIndex) {
        mainData.push(searchedData)
      }
      else {
        mainData.push(0)
      }
    }
    
    localStorage.setItem(
      "selectedRowIndexFromSearchDataWithDates",
      JSON.stringify(indexArr)
    );
    return mainData
  }

  onSearch() {
    this.isSearch = true
    const projectId = JSON.parse(localStorage.getItem("selectedProject"));
    let obj: any = {};
      obj.projectId = projectId;
      obj.field = this.selected;
      obj.selectedtab = JSON.parse(localStorage.getItem("selectedImportPage"));
      obj.searchedItem = (<HTMLInputElement>document.getElementById("searchItem")).value
      console.log(obj.searchedItem)
      this.projectService
            .searchData(obj)
            .subscribe((res) => {
              console.log(res)
              let selectedRowIndexFromSearchData = res['index']
              let searchedData = this.convertSearchData(res)
              localStorage.setItem(
                "ProjectData",
                JSON.stringify(searchedData)
              );
              localStorage.setItem(
                "selectedRowIndexFromSearchData",
                JSON.stringify(selectedRowIndexFromSearchData)
              );
              this.projectData = searchedData
              this.ViewProjectData = searchedData
              // call formatted func to format the data
              this.selectedHead = this.selected.replace (/[A-Z]/g, ' $&').trim();
              this.formatPreviewTableData ("NotDate", this.selectedHead)
      });

  }

  onSearchWithDates() {
    this.isSearch = true
    const projectId = JSON.parse(localStorage.getItem("selectedProject"));
    let obj: any = {};
      obj.projectId = projectId;
      obj.field = this.selected;
      obj.selectedtab = JSON.parse(localStorage.getItem("selectedImportPage"));
      obj.searchedItem = (<HTMLInputElement>document.getElementById("searchItem")).value
      obj.dataIndex = this.selectedPreviewDataIndex
      console.log(obj.searchedItem)
      this.projectService
            .searchDataWithDates(obj)
            .subscribe((res) => {
              console.log(res)
              let selectedRowIndexFromSearchData = res['index']
              let searchedData = this.convertSearchDataWithDates(res)
              console.log(searchedData)
              
              localStorage.setItem(
                "ProjectData",
                JSON.stringify(searchedData)
              );
              localStorage.setItem(
                "selectedRowIndexFromSearchData",
                JSON.stringify(selectedRowIndexFromSearchData)
              );
              this.projectData = searchedData;
              this.ViewProjectData = searchedData
             // window.location.reload()
              //this.router.navigate(["dashboard/preview"]);
              // call formatted func to format the data
              this.selectedHead = this.selected.replace (/[A-Z]/g, ' $&').trim();
              this.formatPreviewTableData ("date", this.selectedHead)

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
    //console.log(formattedNumber) 
    return formattedNumber
  }

  formatNumberColSingle(index: number) {
      //this is for formatting single column in the table
    console.log(this.selectedHead)
    let actualProjectData: any;
    const projectId = JSON.parse(localStorage.getItem("selectedProject"));
    let projectData = JSON.parse(localStorage.getItem("ProjectData")); // preview Data
    this.projectService.getProjectDataById(projectId).subscribe((res) => {
      actualProjectData = res;
      console.log(res)
    })
    setTimeout(() => {
      for (let i = 1; i < projectData.length; i++) { // 3 times
        projectData[i][index] =new Intl.NumberFormat(actualProjectData.regionFormat, {minimumFractionDigits: actualProjectData.decimalPlaces, maximumFractionDigits: actualProjectData.decimalPlaces}).format(Number(projectData[i][index])); 
      }
      localStorage.setItem(
        "ProjectData",
        JSON.stringify(projectData)
      );
      console.log(projectData)
    }, 1000);
  }

  formatNumberColTwo(index1: number, index2: number) {
    //this is for formatting two columns in the table
    console.log(this.selectedHead)
    let actualProjectData: any;
    const projectId = JSON.parse(localStorage.getItem("selectedProject"));
    let projectData = JSON.parse(localStorage.getItem("ProjectData")); // preview Data
    this.projectService.getProjectDataById(projectId).subscribe((res) => {
      actualProjectData = res;
      console.log(res)
    })
    setTimeout(() => {
      for (let i = 1; i < projectData.length; i++) { // 3 times
        projectData[i][index1] =new Intl.NumberFormat(actualProjectData.regionFormat, {minimumFractionDigits: actualProjectData.decimalPlaces, maximumFractionDigits: actualProjectData.decimalPlaces}).format(Number(projectData[i][index1])); 
        projectData[i][index2] =new Intl.NumberFormat(actualProjectData.regionFormat, {minimumFractionDigits: actualProjectData.decimalPlaces, maximumFractionDigits: actualProjectData.decimalPlaces}).format(Number(projectData[i][index2])); 
      }
      localStorage.setItem(
        "ProjectData",
        JSON.stringify(projectData)
      );
      console.log(projectData)
    }, 3000);
  }

  formatNumberColAll(startIndex: number) {
     //this is for formatting all the columns in the table - startIndex is begining column number
    let actualProjectData: any;
    const projectId = JSON.parse(localStorage.getItem("selectedProject"));
    let projectData = JSON.parse(localStorage.getItem("ProjectData"));
    this.projectService.getProjectDataById(projectId).subscribe((res) => {
      actualProjectData = res;
      console.log(res)
    })
    setTimeout(() => {
      for (let j = startIndex; j < projectData[0].length; j++) { 
        for (let i = 1; i < projectData.length; i++) { // 3 times
          projectData[i][j] =new Intl.NumberFormat(actualProjectData.regionFormat, {minimumFractionDigits: actualProjectData.decimalPlaces, maximumFractionDigits: actualProjectData.decimalPlaces}).format(Number(projectData[i][j])); 
        }
      }
      localStorage.setItem(
        "ProjectData",
        JSON.stringify(projectData)
      );
      console.log(projectData)
    }, 1500);
  }

  cellSelection(element) {
    //this is for highlighting currently selected cell in preview table
  var flag = 1
  console.log(this.selectedRowIndex, this.selectedColumnIndex, this.selected, this.isDateField)

  if (this.isDateField) {
    if (this.selected === "workResourcesManpowerWork" || this.selected === "actualRatesLabour") {         //need to avoid selection for col 1 & 2
      if (this.selectedRowIndex === 0 || this.selectedColumnIndex === 0 || this.selectedColumnIndex === 1) {flag = 0}     //no action - 

    }
    else {                                    // other only first col
      if (this.selectedRowIndex === 0 || this.selectedColumnIndex === 0 ) {flag = 0}     //no action - 

    }
  }
  else{                                 //non date data tbales
    if (this.selectedRowIndex === 0){flag = 0}
  }

  //based on selection show format

  
  if (flag= 1) {                                         //  show selection
  var table = document.getElementById("excel-table") as HTMLTableElement;
  table.rows[this.PreSelectedRowIndex].cells[this.PreSelectedColumnIndex].style.border = 'none'
  table.rows[this.PreSelectedRowIndex].cells[this.PreSelectedColumnIndex].style.borderLeft ='0.5pt solid #305496';
  table.rows[this.PreSelectedRowIndex].cells[this.PreSelectedColumnIndex].style.borderRight ='0.5pt solid #305496';

  table.rows[this.selectedRowIndex].cells[this.selectedColumnIndex + 1].style.border = '4pt solid #fbb335';

  this.PreSelectedRowIndex = this.selectedRowIndex;
  this.PreSelectedColumnIndex = this.selectedColumnIndex + 1
  }
  
  
}

showAllData() {
  //window.location.reload()
  //this.router.navigate(["dashboard/preview"]);
  this.ngOnInit();
}

formatDatetoDatePciker(value){
  var formatedDate = moment(value).format('YYYY-MM-DD')
  return formatedDate
}



}
