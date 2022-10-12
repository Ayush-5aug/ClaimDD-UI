import { Component, OnInit } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { DatePipe } from "@angular/common";
import { NgForm, FormGroup, FormControl } from "@angular/forms";
import { ProjectService } from "src/app/services/project/project.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import * as XLSX from 'xlsx'; 
import * as moment from 'moment';
import Swal from "sweetalert2";

@Component({
  selector: "app-events",
  templateUrl: "./events.component.html",
  styleUrls: ["./events.component.css"],
})
export class EventsComponent implements OnInit {
  licenseStartDate: Date;
  editCellModalRef: any;
  licenseEndDate: Date;
  eventsList = [];
  submitForm: FormGroup;
  modalRef: any;
  selectedEventRow: any;
  userData: any;
  DataVisible: false;
  constructor(
    private modalService: NgbModal,
    private projectService: ProjectService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.DataVisible = false;
    this.userData = JSON.parse(localStorage.getItem("userData"));
    const projectData = JSON.parse(localStorage.getItem("projectData"));
    console.log(projectData)
    const selectedProject = JSON.parse(localStorage.getItem("selectedProject"));
      this.projectService.getLicenseDates(selectedProject).subscribe((res) => {
        console.log(res)
        this.licenseStartDate = new Date (res['License start Date'])
        this.licenseEndDate = new Date (res['validity'])
        this.licenseStartDate = new Date (this.licenseStartDate.getUTCFullYear(), this.licenseStartDate.getUTCMonth(), this.licenseStartDate.getUTCDate())
      this.licenseEndDate = new Date (this.licenseEndDate.getUTCFullYear(), this.licenseEndDate.getUTCMonth(), this.licenseEndDate.getUTCDate())
      }), (err) => {
        this.toastr.error("You are not Paid");
      }
    setTimeout(() => {
      let currDate = new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date());
      this.submitForm = new FormGroup({
        eventID: new FormControl(""),
        description: new FormControl(""),
        type: new FormControl(""),
        startDate: new FormControl(""),
        endDate: new FormControl(""),
        daysOnCompletion: new FormControl(""),
        extendedContractDuaration: new FormControl(""),
        pevAtStart: new FormControl(""),
        aevAtStart: new FormControl(""),
        pevAtEnd: new FormControl(""),
        aevAtEnd: new FormControl(""),
        costClaimable: new FormControl(""),
        timeClaimReference: new FormControl(""),
        addedBy: new FormControl(this.userData['userName']),
        addedOn: new FormControl(currDate),
    });
    console.log(projectData.events)
    if (projectData?.events && selectedProject) {
      console.log("Inside")
      this.formatEvents(projectData);
      //this.eventsList = projectData.events;
    }
    }, 1000);
  }

  formatEvents(projectData: any) {
    for (let i = 0; i < projectData.events.length; i++) {
      projectData.events[i].startDate = new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date(projectData.events[i].startDate));
      projectData.events[i].endDate = new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date(projectData.events[i].endDate));
      projectData.events[i].aevAtEnd = this.formatNumber(projectData.events[i].aevAtEnd)
      projectData.events[i].aevAtStart = this.formatNumber(projectData.events[i].aevAtStart)
      projectData.events[i].pevAtEnd = this.formatNumber(projectData.events[i].pevAtEnd)
      projectData.events[i].pevAtStart = this.formatNumber(projectData.events[i].pevAtStart)
      projectData.events[i].daysOnCompletion = this.formatNumber(projectData.events[i].daysOnCompletion)
      projectData.events[i].extendedContractDuaration = this.formatNumber(projectData.events[i].extendedContractDuaration)

    }
    this.eventsList = projectData.events;
    console.log(this.eventsList)
  }

  open(content: any) {
    this.modalRef = this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
    });
  }

  onExport() {
    var fileName= 'ClaimDD - Events.xlsx';
    const projectData = JSON.parse(localStorage.getItem("ProjectData"));
    /* table id is passed over here */   
    let element = document.getElementById('event-table'); 
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Events');

    /* save to file */
    XLSX.writeFile(wb, fileName);
  }

  onNext() {
    this.router.navigate(["dashboard/rates"]);
  }

  onSubmitForm() {
    console.log(this.submitForm.value.type)
    let eventStartDate = new Date(this.submitForm.value.startDate)
    let eventEndDate = new Date(this.submitForm.value.endDate)
    const date1 = eventStartDate
    const date2 = eventEndDate
    var diff = Math.abs(date1.getTime() - date2.getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
    if(!(eventStartDate.getTime() <= this.licenseEndDate.getTime() && eventStartDate.getTime() >= this.licenseStartDate.getTime())) {
      this.toastr.error("Event start date should be within the license validity period.");
      return
    } 
    if(!(eventEndDate.getTime() <= this.licenseEndDate.getTime() && eventEndDate.getTime() >= this.licenseStartDate.getTime())) {
      this.toastr.error("Event end date should be within the license validity period.");
      return
    } 
    /*if (diffDays > 30) {
      this.toastr.error("Difference between Event start date and end date can not be more then 30 days");
      return
    }*/
    if (date1.getMonth() != date2.getMonth()) {
      this.toastr.error("Event Start and End date should be in same month");
      return
    }
    // check for unique event id
    for (let i = 0; i < this.eventsList.length; i++) {
      if (this.eventsList[i]['eventID'] == this.submitForm.value.eventID){
        this.toastr.error("Event ID is already exist. Enter unique Event ID.")
        return;
      }
    }
    
    
    const events: any = { ...this.submitForm.value };
    const projectId = JSON.parse(localStorage.getItem("selectedProject"));
    this.projectService
      .updateProjectData(projectId, { events })
      .subscribe((res) => {
        localStorage.setItem("projectData", JSON.stringify(res.updateProject));
        //this.eventsList = res.updateProject.events;
        this.ngOnInit()
        this.modalRef.close();
      });
    
      console.log(this.eventsList)
  }

  onDeleteEvent(index: any) {

    let swalFunction : any;
    swalFunction = Swal.fire({
      title: "Deleting a Event?",
      text: "Deleting the Event shall delete Saved Claim, if any.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "No, Cancel Delete",
    })
    swalFunction.then((result) => {
      if (result.isConfirmed) {
          const projectId = JSON.parse(localStorage.getItem("selectedProject"));
          console.log(index)
          this.projectService.deleteEvent(projectId, index).subscribe((res) => {
            console.log(res)
            localStorage.setItem("projectData", JSON.stringify(res));
            this.eventsList = res.events;
            const projectData = JSON.parse(localStorage.getItem("projectData"));
            this.formatEvents(projectData);
          }), (err) => {
            console.log(err)
          }
        }
      });
  }

  onEditEvent(modelRef: any, index: any) {
    
    let swalFunction : any;
    swalFunction = Swal.fire({
      title: "Editing a Event?",
      text: "Editing the Event shall impact the Saved Claim, if any.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Edit",
      cancelButtonText: "No, Cancel Edit",
    })
    swalFunction.then((result) => {
      if (result.isConfirmed) {
        this.selectedEventRow = index;
        this.editCellModalRef = this.modalService.open(modelRef);
      }
    });
  }

  onEditRow() {
    var arr= []
    let obj: any = {}
    for(let i = 0; i<=12; i++) {
      arr.push((<HTMLInputElement>document.getElementById('eventEdit' + i)).value)
    }
    // validations
    let eventStartDate = new Date(arr[3])
    let eventEndDate = new Date(arr[4])
    const date1 = eventStartDate
    const date2 = eventEndDate
    if (date1.getMonth() != date2.getMonth()) {
      this.toastr.error("Event Start and End date should be in same month");
      return
    }
    if(!(eventStartDate.getTime() <= this.licenseEndDate.getTime() && eventStartDate.getTime() >= this.licenseStartDate.getTime())) {
      this.toastr.error("Event start date should be within the license validity period.");
      return
    } 
    if(!(eventEndDate.getTime() <= this.licenseEndDate.getTime() && eventEndDate.getTime() >= this.licenseStartDate.getTime())) {
      this.toastr.error("Event end date should be within the license validity period.");
      return
    } 
    const projectData = JSON.parse(localStorage.getItem("projectData"));
    let currDate = new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date());
    obj.eventID = arr[0]
    obj.description = arr[1]
    obj.type = arr[2]
    obj.startDate = arr[3]
    obj.endDate = arr[4]
    obj.daysOnCompletion = arr[5]
    obj.extendedContractDuaration = arr[6]
    obj.pevAtStart = arr[7]
    obj.aevAtStart = arr[8]
    obj.pevAtEnd = arr[9]
    obj.aevAtEnd = arr[10]
    obj.costClaimable = arr[11]
    obj.timeClaimReference = arr[12]
    obj.addedBy = this.userData['userName']
    obj.addedOn = currDate
    console.log(obj)
    const projectId = JSON.parse(localStorage.getItem("selectedProject"));
    this.projectService.editEvent(projectId, this.selectedEventRow, obj).subscribe((res) => {
      localStorage.setItem("projectData", JSON.stringify(res));
      this.formatEvents(res);
      this.editCellModalRef.close();
    }), (err) => {
      console.log(err)
    }
  }

  formatNumber(value: number) {
    if(value){
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    const formatSetting =  new Intl.NumberFormat(projectData.regionFormat, {minimumFractionDigits: projectData.decimalPlaces, maximumFractionDigits: projectData.decimalPlaces});
    var formattedNumber = formatSetting.format(value) 
    return formattedNumber
    }
    else{
      return ""
    }
  }


  formatDatetoDatePciker(value){
    if (value){
    var formatedDate = moment(value).format('YYYY-MM-DD')
    return formatedDate
    }
    else{return ""}
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
    if (value) {
      for(let i = 0; i < value.length; i++) { // for other regions
        if (value[i] != ',') {
          num = num + value[i]
        }
      }
    }
    return num
  }
  
}
