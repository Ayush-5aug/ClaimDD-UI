import { Component, OnInit } from "@angular/core";
import { columns } from "ngx-bootstrap-icons";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import * as moment from "moment";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import config from "../../shared/configuration-data-import";
import { ProjectService } from "../../services/project/project.service";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-data-import",
  templateUrl: "./data-import.component.html",
  styleUrls: ["./data-import.component.css"],
})
export class DataImportComponent implements OnInit {
  data = [];
  licenseStartDate: Date;
  licenseEndDate: Date;

  isFileUploaded = false;
  importMonthFirst: string;
  previousLink: string;
  selected: string;
  selectedHead: string;
  selectedPage: string;
  selectedConfig: { headers: [string]; config: string; unique: boolean };
  removeDateHeader: Array<any> = [];
  selectedHeaderIndex: any = {};
  modifiedFinalArray: Array<any> = [];
  headerModalRef: any;
  ViewmodifiedFinalArray: Array<any> = [];

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private projectService: ProjectService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.selected = JSON.parse(localStorage.getItem("selectedImport"));
    this.selectedHead = this.selected.replace (/[A-Z]/g, ' $&').trim();
    this.selectedPage = JSON.parse(localStorage.getItem("selectedImportPage"));
    this.selectedPage = this.selectedPage.split('/')[1]
    // this.selected = "siteResourcesManpowerAdmin";
    this.previousLink = JSON.parse(localStorage.getItem("selectedImportPage"));
    this.selectedConfig = config[`${this.selected}`];
    const selectedProject = JSON.parse(localStorage.getItem("selectedProject"));
    this.projectService.getLicenseDates(selectedProject).subscribe((res) => {
      console.log(res)
      this.licenseStartDate = new Date (res['License start Date'])
      this.licenseEndDate = new Date (res['validity'])
    }), (err) => {
      this.toastr.error("You are not Paid");
    }
  }

  clear(evt: any) {
    //this.modifiedFinalArray = []
    //this.removeDateHeader = []
    (<HTMLInputElement>document.getElementById('fileInput')).value = ""
  }

  onFileChange(evt: any, modalContent: any) {
    this.modifiedFinalArray = []
    this.removeDateHeader = []
    const traget: DataTransfer = <DataTransfer>evt.target;

    if (traget.files.length !== 1) throw new Error("cannot use multiple files");

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {
        type: "binary",
        cellText: false,
        cellDates: true,
        dateNF: "dd.M.yyyy",
      });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      this.data = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        raw: false,
        dateNF: "DD.MM.YYYY;@",
        defval: "0",
      });
      console.log(this.data) // yha data aaya
      this.data[0].forEach((header, index) => {
        if (!moment(header).isValid()) {
          this.removeDateHeader.push({ header, index });
        }
      });
      console.log(this.removeDateHeader)
      this.headerModalRef = this.modalService.open(modalContent);
    };

    reader.readAsBinaryString(traget.files[0]);
  }

  //getting users selected month from dropdown
  onSelectedMonthChange(event: any) {
    this.importMonthFirst = event.target.value;
  }

  //data iumport function
  importData() {
    let swalFunction : any;
    if (this.selected == "labourDemobilisation" || this.selected == "labourRemobilisation" || this.selected == "otherSubcontractorClaims"
      || this.selected == "otherDamages") {
        swalFunction = Swal.fire({
          title: "Importing...",
          text: "Do you Want to update the existing data?",
          icon: "question",
          showCancelButton: true,
          showDenyButton: true,
          confirmButtonText: "Yes, update",
          cancelButtonText: "No, Cancel Import",
          denyButtonText: `No Don't update`,
        })
    }
    else {
      swalFunction = Swal.fire({
        title: "Importing...",
        text: "Do you want to update the existing data?",
        icon: "question",
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: "Yes, update",
        cancelButtonText: "No, Cancel Import",
        denyButtonText: `No Don't update`,
      })
    }
    swalFunction.then((result) => {
      console.log('dhgdh', result)
      if (result.isConfirmed || result.isDenied) {
        //this.toastr.success("Import is Successfull")
        if (this.selectedConfig.config === "date") {
          console.log('Hello Date')
          const firstDate = `${this.importMonthFirst}-01`;
          const lastDate = moment(firstDate)
            .endOf("month")
            .format("YYYY-MM-DD");
          const selectedMonthIndex = [];
          
          console.log(firstDate) /////////////////////////////////////////// yha date aa rha h yhi check krlo
          let selectedDate = new Date(firstDate);
          if(!(selectedDate.getTime() <= this.licenseEndDate.getTime() && selectedDate.getTime() >= this.licenseStartDate.getTime())) {
            this.toastr.error("Not valid Import Date");
            return
          } 
          this.modifiedFinalArray[0].map((val, index) => {
            const compareDate = moment(
              moment(val, "DD-MMM-YY").format("YYYY-MM-DD")
            );
            if (compareDate.isBetween(firstDate, lastDate)) {
              selectedMonthIndex.push(index);
            }
          });
          console.log('Bye')
          const finalHeaderIndex = Object.values(this.selectedHeaderIndex);
          console.log(finalHeaderIndex)
          const modifieldArray = [...finalHeaderIndex, ...selectedMonthIndex];
          console.log(modifieldArray)
          const modifiedFinalArray = [];
          console.log(this.modifiedFinalArray)
          let projectData = JSON.parse(localStorage.getItem("projectData"));
          let startIndex : Date = this.modifiedFinalArray[0].indexOf(new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date(firstDate)))
          let endIndex : Date = this.modifiedFinalArray[0].indexOf(new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date(lastDate)))
          this.modifiedFinalArray.forEach((col) => { // here preparing data for API
            let output = [];
            for(let i: any = 0; i < this.selectedConfig.headers.length; i++) {
              output.push(col[i]) // pushing descs
            } 
            for (let j : any = startIndex; j <= endIndex; j++) {
              output.push(col[j]) // pushing data
            }
            modifiedFinalArray.push(output);
          });
          const projectId = JSON.parse(localStorage.getItem("selectedProject"));
          const selected = this.selected;
          const obj = {};
          obj[selected] = modifiedFinalArray;
          if (result.isConfirmed) {
            obj['flag'] = 1
          }
          else {
            obj['flag'] = 0
          }
          console.log('Hello', modifiedFinalArray, this.selectedHead)
          this.projectService
            .updateProjectData(projectId, obj)
            .subscribe((res) => {
              localStorage.setItem(
                "projectData",
                JSON.stringify(res.updateProject)
              );
              this.toastr.success("Import is Successfull")
              this.router.navigate([`${this.previousLink}`]);
            });
        } 
        else if(this.selectedConfig.config === "monthlyDate") {
          console.log(this.ViewmodifiedFinalArray)
          var finalArray = new Array(this.modifiedFinalArray.length);
          const array = new Array(this.selectedConfig.headers.length + 1)
          let index = 0
          this.selectedConfig.headers.forEach((header) => {
            array[index] = header
            index = index + 1
          });
          console.log(this.modifiedFinalArray)
          let projectData = JSON.parse(localStorage.getItem("projectData"));
          var selectedMonth = new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date(this.importMonthFirst + "-1"));
          ///var selectedMonth = config["getMonth"][this.importMonthFirst.split('-', 2)[1]] + '-' + this.importMonthFirst.split('-', 1)[0].substring(2)
          array[index] = selectedMonth;
          var selectedMonth = selectedMonth.split(' ').slice(1, 5).join(' ')
          console.log(selectedMonth)
          let foundIndex = this.ViewmodifiedFinalArray[0].indexOf(selectedMonth)
          if (this.ViewmodifiedFinalArray[0].includes(selectedMonth)) {
              //array[index] = selectedMonth;
              finalArray[0] = array;
              let mainIndex = 1
              for(index = 1; index < this.ViewmodifiedFinalArray.length; index++) {
                const array = new Array(this.selectedConfig.headers.length + 1)
                array[0] = this.ViewmodifiedFinalArray[index][0]
                array[1] = this.ViewmodifiedFinalArray[index][1]
                array[2] = this.modifiedFinalArray[index][foundIndex] // taking values without ,
                finalArray[mainIndex] = array
                mainIndex = mainIndex + 1
              }
              const projectId = JSON.parse(localStorage.getItem("selectedProject"));
              const selected = this.selected;
              const obj = {};
              obj[selected] = finalArray;
              if (result.isConfirmed) {
                obj['flag'] = 1
              }
              else {
                obj['flag'] = 0
              }
              this.projectService
              .updateProjectData(projectId, obj)
              .subscribe((res) => {
                localStorage.setItem(
                  "projectData",
                  JSON.stringify(res.updateProject)
                );
                this.toastr.success("Import is Successfull")
                this.router.navigate([`${this.previousLink}`]);
              });
          }
          else {
            this.toastr.error("Please select a month which is present in the data you imported")
            return;
          }
        } 
        else { // for rates
          const projectId = JSON.parse(localStorage.getItem("selectedProject"));
          const selected = this.selected;
          const obj = {};
          obj[selected] = this.modifiedFinalArray;
          if (result.isConfirmed) {
            obj['flag'] = 1
          }
          else {
            obj['flag'] = 0
          }
          this.projectService
            .updateProjectData(projectId, obj)
            .subscribe((res) => {
              localStorage.setItem(
                "projectData",
                JSON.stringify(res.updateProject)
              );
              this.toastr.success("Import is Successfull")
              this.router.navigate([`${this.previousLink}`]);
            });
        }
      }
    });
  }

  modifyHeadersBasedOnMappedValues() {
    if (this.selectedConfig.config === "date") {
      for(let i: any = 0; i < this.selectedConfig.headers.length; i++) {
        this.modifiedFinalArray[0][i] = this.selectedConfig.headers[i]
      }
    }
    else {
      for(let i: any = 0; i < this.selectedConfig.headers.length; i++) {
        this.modifiedFinalArray[0][i] = this.selectedConfig.headers[i]
      }
    }
  }

  removeEmptyRows() {
    for (let i = 0; i < this.modifiedFinalArray.length; i++) {
      console.log(this.modifiedFinalArray[i][0])
      if (this.modifiedFinalArray[i][0] === '0') {
        console.log("removed")
        this.modifiedFinalArray.splice(i, i)
      }
    }
  }

  onSelectTableHeaderSubmit() {
    console.log(this.selectedHeaderIndex);
    const finalHeaderIndex = Object.values(this.selectedHeaderIndex);
    finalHeaderIndex.unshift();
    for (let i = 0; i < 1; i++) {
      for (let j = 0; j < this.data[0].length; j++) {
        if (
          moment(this.data[0][j], "DD-MMM-YY").isValid() &&
          (this.selectedConfig.config === "date" || this.selectedConfig.config === "monthlyDate")
        ) {
          finalHeaderIndex.push(j);
        }
      }
    }
    console.log(this.data)
    this.data.forEach((col) => {
      let output;

      output = finalHeaderIndex.map((i: number) => col[i]);

      this.modifiedFinalArray.push(output);
    });
    this.isFileUploaded = true;
    this.headerModalRef.close();
    this.modifyHeadersBasedOnMappedValues(); // here changing headers based on mapped headings
    console.log('Hello', this.modifiedFinalArray, this.selectedHead)

    setTimeout(() => {

    if (this.selectedHead == "work Resources Manpower Work" || this.selectedHead == "labour Productivity" || this.selectedHead == "actual Rates Labour") {
      this.formatDatesInHeader(2);
    }
    else if (this.selectedHead == "work Resources Material") {
      //this.formatDatesInCols(0);
      //this.formatNumberColTwo(2, 4);
      this.formatOneDateTwoNumberCols (0, 2, 4)
    }
    else if (this.selectedHead == "other Damages") {
      //this.formatDatesInCols(0);
      //this.formatNumberColSingle(2);
      this.formatOneDateOneNumberCols(0,2)
    }
    else if (this.selectedHead == "site Resources Manpower Admin" || this.selectedHead == "site Resources Equipment" || this.selectedHead == "site Resources Transport") {
      this.formatDatesInHeader(1);
    }
    else if (this.selectedHead == "labour Demobilisation" || this.selectedHead == "labour Remobilisation") {
      //this.formatDatesInCols(1);
      //this.formatNumberColTwo(2, 4);
      this.formatOneDateTwoNumberCols (1, 2, 4)
    }
    else if (this.selectedHead == "other Unpaid Claim") {
      //this.formatDatesInCols(2);
      //this.formatDatesInCols(3);
      //this.formatNumberColSingle(1);
      this.formatTwoDateOneNumberCols(2,3,1)
    }
    else if (this.selectedHead == "work Resources Utilities") {
      //this.formatDatesForMonthData(2);
      //this.formatNumberColAll(2);
      this.formatMonthHeadNumberData(2)
    }
    else if (this.selectedHead === "project Rates Contract Commitments" || this.selectedHead === "project Rates Site Facilities" || this.selectedHead === "project Rates Site Administration Staff" || this.selectedHead === "project Rates Equipment Transport" || this.selectedHead === "project Rates Utilities" || this.selectedHead === "tender Rates Material" || this.selectedHead === "tender Rates Labour" || this.selectedHead === "other Subcontractor Claims") {
      this.formatOneNumberCol(1);
    }
  }, 1500);
  console.log('formatted', this.ViewmodifiedFinalArray, this.selectedHead)
  console.log('Saving Data', this.modifiedFinalArray, this.selectedHead)
  
  }

  onClickBack() {
    this.router.navigate([`${this.previousLink}`]);
  }

  formatDatesInHeader(index: number) {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    this.ViewmodifiedFinalArray = JSON.parse(JSON.stringify(this.modifiedFinalArray));
    for (let i = index; i < this.ViewmodifiedFinalArray[0].length; i++) {  
      this.ViewmodifiedFinalArray[0][i] = new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date(this.ViewmodifiedFinalArray[0][i]));
      this.modifiedFinalArray[0][i] = new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date(this.modifiedFinalArray[0][i]));
    }
  }


  formatOneNumberCol(index: number) {
      //this is for formatting single column in the table
    let projectData = JSON.parse(localStorage.getItem("projectData")); // locale data
    console.log(projectData)
    this.ViewmodifiedFinalArray = JSON.parse(JSON.stringify(this.modifiedFinalArray));
    console.log(projectData.regionFormat, projectData.decimalPlaces)
    setTimeout(() => {
    for (let i = 1; i <  this.ViewmodifiedFinalArray.length; i++) { // 3 times
      this.ViewmodifiedFinalArray[i][index] =new Intl.NumberFormat(projectData.regionFormat, {minimumFractionDigits: projectData.decimalPlaces, maximumFractionDigits: projectData.decimalPlaces}).format(Number(this.ViewmodifiedFinalArray[i][index])); 
      }
    }, 500);
  }

  formatOneDateOneNumberCols(DIndex: number, NIndex: number) {
      //this is for formatting single column in the table
    let projectData = JSON.parse(localStorage.getItem("projectData")); // locale data
    console.log(projectData)
    this.ViewmodifiedFinalArray = JSON.parse(JSON.stringify(this.modifiedFinalArray));
    console.log(projectData.regionFormat, projectData.decimalPlaces)
    setTimeout(() => {
    for (let i = 1; i <  this.ViewmodifiedFinalArray.length; i++) { // 3 times
      this.ViewmodifiedFinalArray[i][DIndex] = new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date(this.ViewmodifiedFinalArray[i][DIndex])); 
      this.ViewmodifiedFinalArray[i][NIndex] =new Intl.NumberFormat(projectData.regionFormat, {minimumFractionDigits: projectData.decimalPlaces, maximumFractionDigits: projectData.decimalPlaces}).format(Number(this.ViewmodifiedFinalArray[i][NIndex])); 
      }
    }, 1500);
  }

  formatOneDateTwoNumberCols(DIndex: number, NIndex1: number, NIndex2: number) {
      //this is for formatting single column in the table
    let projectData = JSON.parse(localStorage.getItem("projectData")); // locale data
    console.log(projectData)
    this.ViewmodifiedFinalArray = JSON.parse(JSON.stringify(this.modifiedFinalArray));
    console.log(projectData.regionFormat, projectData.decimalPlaces)
    setTimeout(() => {
    for (let i = 1; i <  this.ViewmodifiedFinalArray.length; i++) { // 3 times
      this.ViewmodifiedFinalArray[i][DIndex] = new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date(this.ViewmodifiedFinalArray[i][DIndex])); 
      this.ViewmodifiedFinalArray[i][NIndex1] =new Intl.NumberFormat(projectData.regionFormat, {minimumFractionDigits: projectData.decimalPlaces, maximumFractionDigits: projectData.decimalPlaces}).format(Number(this.ViewmodifiedFinalArray[i][NIndex1])); 
      this.ViewmodifiedFinalArray[i][NIndex2] =new Intl.NumberFormat(projectData.regionFormat, {minimumFractionDigits: projectData.decimalPlaces, maximumFractionDigits: projectData.decimalPlaces}).format(Number(this.ViewmodifiedFinalArray[i][NIndex2])); 
      }
    }, 1500);
  }

  formatTwoDateOneNumberCols(DIndex1: number, DIndex2: number, NIndex: number) {
      //this is for formatting single column in the table
    let projectData = JSON.parse(localStorage.getItem("projectData")); // locale data
    console.log(projectData)
    this.ViewmodifiedFinalArray = JSON.parse(JSON.stringify(this.modifiedFinalArray));
    console.log(projectData.regionFormat, projectData.decimalPlaces)
    setTimeout(() => {
    for (let i = 1; i <  this.ViewmodifiedFinalArray.length; i++) { // 3 times
      this.ViewmodifiedFinalArray[i][DIndex1] = new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date(this.ViewmodifiedFinalArray[i][DIndex1])); 
      this.ViewmodifiedFinalArray[i][DIndex2] = new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date(this.ViewmodifiedFinalArray[i][DIndex2])); 
      this.ViewmodifiedFinalArray[i][NIndex] =new Intl.NumberFormat(projectData.regionFormat, {minimumFractionDigits: projectData.decimalPlaces, maximumFractionDigits: projectData.decimalPlaces}).format(Number(this.ViewmodifiedFinalArray[i][NIndex])); 
      }
    }, 1500);
  }


  formatMonthHeadNumberData(startIndex: number) {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    this.ViewmodifiedFinalArray = JSON.parse(JSON.stringify(this.modifiedFinalArray));
    setTimeout(() => {
      for (let j = startIndex; j < this.ViewmodifiedFinalArray[0].length; j++) { 
        this.ViewmodifiedFinalArray[0][j] = new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date(this.ViewmodifiedFinalArray[0][j]));
        for (let i = 1; i < projectData.length; i++) { // 3 times
          this.ViewmodifiedFinalArray[i][j] =new Intl.NumberFormat(projectData.regionFormat, {minimumFractionDigits: projectData.decimalPlaces, maximumFractionDigits: projectData.decimalPlaces}).format(Number(this.ViewmodifiedFinalArray[i][j])); 
        }
      }
      // removing date part here
      for(let i = 2; i < this.ViewmodifiedFinalArray[0].length; i++) {
      this.ViewmodifiedFinalArray[0][i] = this.ViewmodifiedFinalArray[0][i].split(' ').slice(1, 5).join(' ');
    }
    }, 1500);
   }

  formatDatesInCols(index: number) {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    //alert(projectData.regionFormat);
    for (let i = 1; i < this.modifiedFinalArray.length; i++) {
      this.modifiedFinalArray[i][index] = new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date(this.modifiedFinalArray[i][index])); 
    }
  }

  formatDatesForMonthData(index: number) {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    for (let i = index; i < this.modifiedFinalArray[0].length; i++) {  
      this.modifiedFinalArray[0][i] = new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date("1-"+this.modifiedFinalArray[0][i]));
    }
  }

  formatNumber(value: number) {
    // this is for formatting single value/number
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    const formatSetting =  new Intl.NumberFormat(projectData.regionFormat, {minimumFractionDigits: projectData.decimalPlaces, maximumFractionDigits: projectData.decimalPlaces});
    var formattedNumber = formatSetting.format(value) 
    return formattedNumber
  }

}
