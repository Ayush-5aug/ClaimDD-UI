import { Component, OnInit } from '@angular/core';
import { ClaimantService } from "src/app/services/claimant/claimant.service";
import { Router } from "@angular/router";
import { ProjectService } from "../../services/project/project.service";
import { DatePipe } from '@angular/common'
import config from "../../shared/configuration-data-import";
import * as moment from 'moment';
import * as XLSX from 'xlsx'; 
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { jsPDF, ShadingPattern } from "jspdf";
import { applyPlugin } from 'jspdf-autotable'
applyPlugin(jsPDF)
import {Document, Footer, Header, HeadingLevel, UnderlineType, Numbering, LevelFormat, AlignmentType, HorizontalPositionAlign, HorizontalPositionRelativeFrom, ImageRun, Packer, Paragraph, Table, TableCell, TableRow, WidthType, ShadingType, convertInchesToTwip, VerticalPositionAlign, VerticalPositionRelativeFrom, BorderStyle, StyleLevel, TextRun, SimpleField, PageNumber, TableOfContents, TableBorders, RelativeHorizontalPosition, TableAnchorType, RelativeVerticalPosition, OverlapType, TextWrappingType, FrameAnchorType } from 'docx'
import { saveAs } from 'file-saver'
import * as fs from 'fs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { threadId } from 'worker_threads';
import { rootCertificates } from 'tls';
import { file } from 'ngx-bootstrap-icons';
import { promises } from 'dns';
import { EventEmitter } from 'stream';
import { event } from 'jquery';

import * as fileSaver from 'file-saver';
import * as Excel from 'exceljs';
import { Buffer } from 'buffer';
import { stringify } from 'querystring';
import { truncate } from 'fs';
import Swal from "sweetalert2";
import { HeadingStyle } from 'docx/build/file/styles/style';
import { eventNames } from 'process';

  // for Evaluations Table - Crating Appendix Dynamic Number
var R:number
var M:string
var A1:number
var B1:number
  // for Summary Table - creating dynamic Main Heading Serial Number A, B, C, D
var SM: string[]
var SMAll: string[]


@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.css']
})
export class ClaimComponent implements OnInit {
  projectName: any
  claimName: any;
  reportView : Boolean;
  ClaimReport: any;
  appendix_Abb_Data : any = []
  appendix_1_Data : any = []
  appendix_5_Data : any = []
  appendix_10_Data : any = []
  appendix_11_Data : any = []
  appendix_13_Data : any = []
  appendix_18_Data : any = []
  appendix_2B_Data: any = []
  appendix_2A_Data: any = []
  appendix_3B_Data: any = []
  appendix_3A_Data: any = []
  appendix_6B_Data: any = []
  appendix_6A_Data: any = []
  appendix_9C_Data: any = []
  appendix_9B_Data: any = []
  appendix_9A_Data: any = []
  appendix_16_Data: any = []
  appendix_7_Data: any = []
  appendix_8C_Data: any = []
  appendix_8B_Data: any = []
  appendix_8A_Data: any = []
  appendix_4B_Data: any = []
  appendix_4A_Data: any = []
  appendix_12_Data: any = []
  appendix_15_Data: any = []
  appendix_17_Data: any = []
  appendix_14_Data: any = []
  summaryTable: any = []
  cuurentAppendixData: any = []
  currentAppendixHeader: any

      //creating dummy array to show it in front end and using for print & export without
  source: string = 'data';

  daysOnCompletion : number
  currentEventId : any
  currentEventDes : any
  currentEventType : any
  startDate: any
  endDate: any
  delayDuration: any
  commencementDate: any
  dates: any = []
  datesFromCommencementDate: any = []
  contractWorking: any
  originalContractDurationvalue: any
  extendedContractDuaration: any
  originalContractPrice: any 
  originalContractDurationSelect: any
  headOfficeOverheadPercentage: any
  originalContractPriceType: any
  actualTurnoverOfCompany: any
  actualHOOverheadCost: any
  reviesdContractDuration: any = 0
  reviesdContractPriceValue: any = 0
  profitPercentage: any
  annualTurnoverOfCompany: any
  annualHOOverheadCost: any
  annualProfit: any
  actualProfit: any
  yearlyInterest: any
  interestType: any
  compoundingPeriod: any
  nameOfDefendant: any
  clauses: any;

  regionFormat: any;
  dayFormat: any;
  monthFormat: any;
  yearFormat: any;
  decimalPlaces: any;

  selectedOptions: any = []
  listOfAppendixToBeDisplayed: any = []
  saveAppendixDataRef: any
  openClaimSelectionRef: any
  showAbbreviationDataRef: any
  openExportOptionsRef: any
  savedClaimsOptionWise: any
  savedClaimsAppendixData: any
  savedClaims: any
  eventList : any = [];

  allClaimData: any = []
  userData: any;


  projectRatesContractCommitments : any = []
  projectRatesSiteFacilities : any = []
  labourDemobilisation : any = []
  labourRemobilisation : any = []
  otherSubcontractorClaims: any = []
  otherUnpaidClaim: any = []
  siteResourcesManpowerAdmin: any = []
  projectRatesSiteAdministrationStaff: any = []
  siteResourcesEquipment: any = []
  projectRatesEquipmentTransport: any = []
  siteResourcesTransport: any = []
  workResourcesManpowerWork: any = []
  labourProductivity: any = []
  tenderRatesLabour: any = []
  actualRatesLabour:any =[]
  otherDamages: any = []
  workResourcesMaterial: any = []
  tenderRatesMaterial : any = []
  workResourcesUtilities: any = []
  projectRatesUtilities: any = []
  // for dynami Appendix Numbers
  AN:number[]
  // for storing appendix values
  sumA:number[]
  // for storing identification of selected appendix to use it in CSS Class
  AppN: string
  // report variabbles
  OCD: any;  
  selectedEvent: any;
  claimantName: any;
  StmtFreqCompoundInterest: any;
  contractUpdate: any;
  StatusContract: any;
  StatusPlan: any;
  StatusContractSecurities: any;
  rccd: any;
  EventDeclaration: any;
  contractAs: any;
  claimantAs: any;
  claimantAss: any;           // it is for adddding 's to the claimant Claimant's
  defendantAs: any;
  eventPeriodDes: any;
  impactedPeriodDes: any;
  claimJustification:any;
  selectedFormula:any;
  selectedOptionSC: boolean;        // as there is issue assesing Subcontractor's Claims name in html it is created.
  EstartDate: any;
  EendDate: any;
  EDuration: any;
  contractReference: any;
  status: any;
  OpeningClaim: Boolean;          // to identify whether the page is loading from Sidemenu of OpenClaim
  isReviewer: Boolean;
  costSum: any;
  Evaluation: any;              
  //Excelformat Styles  i        below varibles stores Excel styles
  crfill: any;
  hrfill: any;
  nfill: any;
  rightAlign: any;
  leftAlign: any;
  wrap: any;
  NFormat: any;
  DFormat: any;
  cfont: any;
  hfont: any;
  bfont: any;
  curBorder: any;
  CELCTborder: any;
  CERCTborder: any;
  CETborder: any;
  CELCBborder: any;
  CERCBborder: any;
  CEBborder: any;
  CELborder: any;
  CERborder: any;
  CEborder: any;
    //excel creation variables
  totalRow: boolean;              // to identify whether Appendix has total row or not
  leftAlignCol:number;            // which column need leftaginment apart from col 1 & 2 
  dateCol1: number;               // which col has date (Cost) or non-date (data) information to set the necessary format (which)
  dateCol2:number;
  dateData:boolean;               // to identify the Appendix is Date wise appendix or not
  sheetName:string;               // name of the sheet
  tType: string;
      //empty cell valu identifier
  SH:string = "No";                     //word report table subheading format sh identifier
  notationRow: boolean;              // to identify whether Appendix has notation row or not such as A, B, C at top
  defendentName: any;
  showExportLinks: Boolean = false;
  constructor(
    private projectService: ProjectService,
    public datepipe: DatePipe,
    private modalService: NgbModal,
    private router: Router,
    private claimantService: ClaimantService
  ) { }

  ngOnInit(): void {
    const projectId = JSON.parse(localStorage.getItem("selectedProject"));
    this.reportView = false
    this.selectedOptionSC = false             //initiate with false
    this.Evaluation = JSON.parse(localStorage.getItem("Evaluation"))

    this.claimName = JSON.parse(localStorage.getItem("claimName"));
    this.projectService
            .getProjectDataById(projectId)
            .subscribe((res) => {
              console.log(res, res['contractAs']['selected'])
              this.setDaysOnCompletion(res['events'])
              this.setCurrentEventId()
              this.setExtendedContractDuaration()
              this.defendentName = res['nameOfDefendant']
              this.commencementDate = res['commencementDate']
              this.nameOfDefendant = res['nameOfDefendant']
              this.contractWorking = res['contractWorking']
              this.originalContractDurationSelect = res['originalContractDurationSelect']
              this.originalContractDurationvalue = res['originalContractDurationvalue']
              this.originalContractPrice = res['originalContractPrice']
              this.headOfficeOverheadPercentage = res['headOfficeOverheadPercentage']
              this.originalContractPriceType = res['originalContractPriceType']
              this.actualTurnoverOfCompany = res['actualTurnoverOfCompany']
              this.actualHOOverheadCost = res['actualHOOverheadCost']
              this.actualProfit = res['actualProfit']
              this.reviesdContractDuration = res['reviesdContractDuration']
              this.reviesdContractPriceValue = res['reviesdContractPriceValue']
              this.profitPercentage= res['profitPercentage']
              this.annualTurnoverOfCompany = res['annualTurnoverOfCompany']
              this.annualHOOverheadCost = res['annualHOOverheadCost']
              this.annualProfit = res['annualProfit']
              this.yearlyInterest = res['yearlyInterest']
              this.interestType = res['interestType']
              this.compoundingPeriod = res['compoundingPeriod']
              this.clauses = res['clauses']
              console.log("Bye1")
              this.savedClaims = res['claims']
              console.log(this.savedClaims)
              //this.setDatesFromCommencementDate()
             this.contractAs = res['contractAs']['selected']
             this.claimantAs = res['claimantAs']['selected']
             this.defendantAs = res['defendentAs']['selected']
             this.regionFormat = res['regionFormat']
             this.dayFormat = res['dayFormat']
             this.monthFormat = res['monthFormat']
             this.yearFormat = res['yearFormat']
             this.decimalPlaces = res['decimalPlaces']
             this.contractReference = res['contractReference']
             this.status = res['status']            // project status
            this.source = "data"
              console.log("Bye2")
            });
            /* checking for reveiwer User */
    this.userData = JSON.parse(localStorage.getItem("userData"));
    if (this.userData.isReviewer) {
      this.openingtheClaim()
      this.isReviewer = true;
      setTimeout(() => {
        let selectedReveiwerData = JSON.parse(localStorage.getItem("selectedReviewerData"));
        let obj: any = {}
        obj.selectedProject = selectedReveiwerData.projectId
        obj.defendantName = this.defendentName
        obj.claimaintList = []
        obj.selectedClaimant = selectedReveiwerData.claimantId
        this.projectService.sendSelectedProjectData(obj);
        this.currentAppendixHeader = "Cost Summary";
        console.log("Reviewer Bhai")
        console.log(this.savedClaims)
        this.generateDataForReviewer(projectId)
            // set project Name - added by Sagaya
        this.projectName = JSON.parse(localStorage.getItem("SelectedProjectName"));

      }, 2100);
    }
    else {
      this.isReviewer = false;
      let initAppendixData: any;
      setTimeout(() => {
      this.setDates()
      this.setDatesFromCommencementDate()
      console.log(this.listOfAppendixToBeDisplayed)
      console.log(this.appendix_1_Data)
      initAppendixData = JSON.parse(localStorage.getItem("initAppendixData"))
      this.currentAppendixHeader = "Cost Summary";
 
      this.selectedOptions = JSON.parse(localStorage.getItem("selectedOptions"));
      console.log(this.selectedOptions)
      console.log("Hello")
      this.generateAppendixAndMainHeadingsNotations()
      this.generateReportVariable()
      this.generateAbbreviation()
    //}, 500)

    this.projectService
            .getRatesById(projectId)
            .subscribe((res) => {
              console.log(res)
              this.setProjectRatesContractCommitments(res['projectRatesContractCommitments'])
              this.setProjectRatesSiteFacilities(res['projectRatesSiteFacilities'])
              this.setProjectRatesSiteAdministrationStaff(res['projectRatesSiteAdministrationStaff'])
              this.setProjectRatesEquipmentTransport(res['projectRatesEquipmentTransport'])
              this.setTenderRatesLabour(res['tenderRatesLabour'])
              this.setTenderRatesMaterial(res['tenderRatesMaterial'])
              this.setProjectRatesUtilities(res['projectRatesUtilities'])
              this.setActualRatesLabour(res['actualRatesLabour'])
            });
    this.projectService
            .getQuantumById(projectId)
            .subscribe((res) => {
              this.setLabourDemobilisation(res['labourDemobilisation'])
              this.setLabourRemobilisation(res['labourRemobilisation'])
              this.setOtherSubcontractorClaims(res['otherSubcontractorClaims'])
              this.setOtherUnpaidClaim(res['otherUnpaidClaim'])
              this.setSiteResourcesManpowerAdmin(res['siteResourcesManpowerAdmin'])
              this.setSiteResourcesEquipment(res['siteResourcesEquipment'])
              this.setSiteResourcesTransport(res['siteResourcesTransport'])
              this.setWorkResourcesManpowerWork(res['workResourcesManpowerWork'])
              this.setLabourProductivity(res['labourProductivity'])
              this.setOtherDamages(res['otherDamages'])
              this.setWorkResourcesMaterial(res['workResourcesMaterial'])
              this.setWorkResourcesUtilities(res['workResourcesUtilities'])
            });
      }, 1500)
    setTimeout(() => {
      
      if(this.selectedOptions.includes('Site Preliminaries') && initAppendixData != "false"){
        console.log("INIT")
        this.listOfAppendixToBeDisplayed.push("Cost - Contractual Requirements") //Appendix 1
        this.listOfAppendixToBeDisplayed.push("Cost - Resources, Manpower (Staff)") //Appendix 2A
        this.listOfAppendixToBeDisplayed.push("Quantum - Resources, Manpower (Staff)") //Appendix 2B
        this.listOfAppendixToBeDisplayed.push("Cost - Resources, Equipment") //Appendix 3a
        this.listOfAppendixToBeDisplayed.push("Quantum - Resources, Equipment") //Appendix 3b
        this.listOfAppendixToBeDisplayed.push("Cost - Resources, Utility") //Appendix 4a
        this.listOfAppendixToBeDisplayed.push("Quantum - Resources, Utility") //Appendix 4b
        this.listOfAppendixToBeDisplayed.push("Cost - Facility, Site Administration")  //Appendix 5
        this.listOfAppendixToBeDisplayed.push("Cost - Facility, Transportation") //Appendix 6A
        this.listOfAppendixToBeDisplayed.push("Quantum - Facility, Transporation") //Appendix 6B
        this.generateAppendix1()
        this.generateAppendix2B()
        this.generateAppendix2A()
        this.generateAppendix3B()
        this.generateAppendix3A()
        this.generateAppendix4B()
        this.generateAppendix4A()
        this.generateAppendix5()
        this.generateAppendix6B()
        this.generateAppendix6A()
        this.allClaimData.push({'appendixName': 'Appendix 1', 'actualData': this.appendix_1_Data})
        this.allClaimData.push({'appendixName': 'Appendix 2A', 'actualData': this.appendix_2A_Data})
        this.allClaimData.push({'appendixName': 'Appendix 2B', 'actualData': this.appendix_2B_Data})
        this.allClaimData.push({'appendixName': 'Appendix 3A', 'actualData': this.appendix_3A_Data})
        this.allClaimData.push({'appendixName': 'Appendix 3B', 'actualData': this.appendix_3B_Data})
        this.allClaimData.push({'appendixName': 'Appendix 4A', 'actualData': this.appendix_4A_Data})
        this.allClaimData.push({'appendixName': 'Appendix 4B', 'actualData': this.appendix_4B_Data})
        this.allClaimData.push({'appendixName': 'Appendix 5', 'actualData': this.appendix_5_Data})
        this.allClaimData.push({'appendixName': 'Appendix 6A', 'actualData': this.appendix_6A_Data})
        this.allClaimData.push({'appendixName': 'Appendix 6B', 'actualData': this.appendix_6B_Data})
          //number formatting the calculated Appendix data
        this.formatCurrentAppendixNumberCol("tF1")
        this.formatCurrentAppendixNumberCol("tF2A")
        this.formatCurrentAppendixNumberCol("tF2B")
        this.formatCurrentAppendixNumberCol("tF3A")
        this.formatCurrentAppendixNumberCol("tF3B")
        this.formatCurrentAppendixNumberCol("tF4A")
        this.formatCurrentAppendixNumberCol("tF4B")
        this.formatCurrentAppendixNumberCol("tF5")
        this.formatCurrentAppendixNumberCol("tF6A")
        this.formatCurrentAppendixNumberCol("tF6B")
   
      }
      if(this.selectedOptions.includes('Escalation - Material') && initAppendixData != "false"){
        this.listOfAppendixToBeDisplayed.push("Cost - Escalation, Material")  //Appendix 7
        this.generateAppendix7()
        this.allClaimData.push({'appendixName': 'Appendix 7', 'actualData': this.appendix_7_Data})
        this.formatCurrentAppendixNumberCol("tF7")
        
      }
      if(this.selectedOptions.includes('Escalation - Labour') && initAppendixData != "false"){
        this.listOfAppendixToBeDisplayed.push("Cost - Escalation, Labour") //Appendix 8A
        this.listOfAppendixToBeDisplayed.push("Quantum - Escalation, Labour")  //Appendix 8B
        this.listOfAppendixToBeDisplayed.push("Rate - Escalation, Labour")  //Appendix 8C
        this.generateAppendix8B()
        this.generateAppendix8C()
        this.generateAppendix8A()
        this.allClaimData.push({'appendixName': 'Appendix 8A', 'actualData': this.appendix_8A_Data})
        this.allClaimData.push({'appendixName': 'Appendix 8B', 'actualData': this.appendix_8B_Data})
        this.allClaimData.push({'appendixName': 'Appendix 8C', 'actualData': this.appendix_8C_Data})
        this.formatCurrentAppendixNumberCol("tF8A")
        this.formatCurrentAppendixNumberCol("tF8B")
        this.formatCurrentAppendixNumberCol("tF8C")
      }
      if(this.selectedOptions.includes('Loss of Productivity') && initAppendixData != "false"){
        this.listOfAppendixToBeDisplayed.push("Cost - Loss of Productivity")  //Appendix 9A
        this.listOfAppendixToBeDisplayed.push("Quantum (Impact) - Loss of Productivity")  //Appendix 9B
        this.listOfAppendixToBeDisplayed.push("Quantum (Max) - Loss of Productivity")  //Appendix 9C
        this.generateAppendix9C()
        this.generateAppendix9B()
        this.generateAppendix9A()
        this.allClaimData.push({'appendixName': 'Appendix 9A', 'actualData': this.appendix_9A_Data})
        this.allClaimData.push({'appendixName': 'Appendix 9B', 'actualData': this.appendix_9B_Data})
        this.allClaimData.push({'appendixName': 'Appendix 9C', 'actualData': this.appendix_9C_Data})
        this.formatCurrentAppendixNumberCol("tF9A")
        this.formatCurrentAppendixNumberCol("tF9B")
        this.formatCurrentAppendixNumberCol("tF9C")
      }
      if(this.selectedOptions.includes('De-moblisation') && initAppendixData != "false"){
         
        this.listOfAppendixToBeDisplayed.push("Cost - Demobilisation")  //Appendix 10
        this.generateAppendix10()
        this.allClaimData.push({'appendixName': 'Appendix 10', 'actualData': this.appendix_10_Data})
        this.formatCurrentAppendixNumberCol("tF10")
      }
      if(this.selectedOptions.includes('Re-moblisation') && initAppendixData != "false"){
        this.listOfAppendixToBeDisplayed.push("Cost - Remobilisation")  //Appendix 11
        this.generateAppendix11()
        this.allClaimData.push({'appendixName': 'Appendix 11', 'actualData': this.appendix_11_Data})
        this.formatCurrentAppendixNumberCol("tF11")
      }
      if(this.selectedOptions.includes('Head Office Overheads') && initAppendixData != "false"){
        this.listOfAppendixToBeDisplayed.push("Head Office Overheads") //Appendix 12
        this.generateAppendix12()
        this.allClaimData.push({'appendixName': 'Appendix 12', 'actualData': this.appendix_12_Data})
        this.formatCurrentAppendixNumberCol("tF12")
      }
      if(this.selectedOptions.includes("Subcontractor's Claims") && initAppendixData != "false"){
        this.listOfAppendixToBeDisplayed.push("Subcontractor's Claims")  //Appendix 13
        this.generateAppendix13()
        this.allClaimData.push({'appendixName': 'Appendix 13', 'actualData': this.appendix_13_Data})
        this.formatCurrentAppendixNumberCol("tF13")
      }
      if(this.selectedOptions.includes('Profit on Claim') && initAppendixData != "false"){
        this.listOfAppendixToBeDisplayed.push("Profit on the Cost")  //Appendix 14
        this.generateAppendix14()
        this.allClaimData.push({'appendixName': 'Appendix 14', 'actualData': this.appendix_14_Data})
        this.formatCurrentAppendixNumberCol("tF14")
      }
      if(this.selectedOptions.includes('Loss of Profit') && initAppendixData != "false"){
        this.listOfAppendixToBeDisplayed.push("Loss of Profit")  //Appendix 15
        this.generateAppendix15()
        this.allClaimData.push({'appendixName': 'Appendix 15', 'actualData': this.appendix_15_Data})
        this.formatCurrentAppendixNumberCol("tF15")
      }
      if(this.selectedOptions.includes('Damages') && initAppendixData != "false"){
        this.listOfAppendixToBeDisplayed.push("Other Damages")  //Appendix 16
        this.generateAppendix16()
        this.allClaimData.push({'appendixName': 'Appendix 16', 'actualData': this.appendix_16_Data})
        this.formatCurrentAppendixNumberCol("tF16")
      }
      if(this.selectedOptions.includes('Financiaal Charge on Delayed Profit') && initAppendixData != "false"){
        this.listOfAppendixToBeDisplayed.push("Financial Charge on Delayed Profit")  //Appendix 17
        this.generateAppendix17()
        this.allClaimData.push({'appendixName': 'Appendix 17', 'actualData': this.appendix_17_Data})
        this.formatCurrentAppendixNumberCol("tF17")
      }
      if(this.selectedOptions.includes('Financiaal Charge (Interest) on Unsettled Payment') && initAppendixData != "false"){
        this.listOfAppendixToBeDisplayed.push("Financial Charge on Delayed/Unsettled Payment")  //Appendix 18
        console.log(this.listOfAppendixToBeDisplayed)
        this.generateAppendix18()
        this.allClaimData.push({'appendixName': 'Appendix 18', 'actualData': this.appendix_18_Data})
        this.formatCurrentAppendixNumberCol("tF18")
      }
      if(this.currentEventId  && initAppendixData != "false") {
        this.generateSummaryTable()
        // this.allClaimData.push({'appendixName': 'Cost Summary', 'actualData': this.summaryTable})
        this.allClaimData.splice(0,0,{'appendixName': 'Cost Summary', 'actualData': this.summaryTable})
        this.formatCurrentAppendixNumberCol("tF0")
      }
      this.cuurentAppendixData = this.summaryTable
      
    }, 3000);
    if(initAppendixData === "false") {
      localStorage.setItem(
        "initAppendixData",
        JSON.stringify("true")
      );
    }
    // set project Name
    let selectedClaimant = JSON.parse(localStorage.getItem("selectedClaimant"))
    this.projectService.getExecuterProject(selectedClaimant).subscribe(
      (res) => {
        for(let i = 0;i < res.length; i++) {
          if(res[i]['_id'] == JSON.parse(localStorage.getItem("selectedProject"))) {
            this.projectName = res[i]['name']
          }
        }
      },
      (err) => {})
    }
    let obj: any = {};
    obj.projectId = projectId
    this.projectService.checkTrailProject(obj).subscribe((res) => {
      console.log(res)
      if (res['data'] == false) // paid 
      this.showExportLinks = true
    } , (err) => {
    })
  }

  setDaysOnCompletion(eventList : any) {
    let currentEvent = JSON.parse(localStorage.getItem("selectedEvent"))
    if(currentEvent) {
      eventList.forEach(element => {
        if(element['_id'] === currentEvent['_id']) {
          this.daysOnCompletion = element['daysOnCompletion']
        }
      });
    }
  }

  getAllDatesInBetween(starDate, endDate) {
    this.dates.push(starDate)
    let newDate = starDate
    let i = 0
    while(true) {
      if(newDate.split('-', 1)[0] != endDate.split('-', 1)[0]) {
        if(newDate.split('-', 1)[0].length == 1) {
          newDate = String(Number(newDate.split('-', 2)[0]) + 1) + newDate.substring(1)
          this.dates.push(newDate)  
        }
        else {
          newDate = String(Number(newDate.split('-', 2)[0]) + 1) + newDate.substring(2)
          this.dates.push(newDate)
        }
      }
      else {
        break;
      }
    }
    //console.log(this.dates)
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    for (let i = 0; i < this.dates.length; i++) { 
        this.dates[i] = new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date(this.dates[i]));
      }
  }

  convertDateType(date : any) {
    let latest_date =this.datepipe.transform(date, 'dd-MM-yy');
    if (latest_date[0] == '0') {
      latest_date = latest_date.substring(1)
    }
    let x : string
    x = latest_date.split('-', 2)[1]
    let month = config["getMonth"][x]
    var splitted_date = latest_date.split('-', 3)
    let finalDate : string
    finalDate = splitted_date[0] + '-' + month + '-' + splitted_date[2]
    return finalDate
  }

  setDates() {
    let currentEvent = JSON.parse(localStorage.getItem("selectedEvent"))
    if(currentEvent) {
      this.startDate =  currentEvent['startDate']
      this.endDate = currentEvent['endDate']
      this.startDate = this.convertDateType(this.startDate)
      this.endDate = this.convertDateType(this.endDate)
      this.getAllDatesInBetween(this.startDate, this.endDate)

    
    }
  }

  setDatesFromCommencementDate() {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    let currentEvent = JSON.parse(localStorage.getItem("selectedEvent"))
    if (currentEvent){
      let startDate = this.commencementDate
      let endDate = currentEvent['endDate']
      //startDate = this.convertDateType(startDate)
      //endDate = this.convertDateType(endDate)
        var currentDate = moment(startDate);
        var stopDate = moment(endDate);
        while (currentDate <= stopDate) {
            this.datesFromCommencementDate.push( moment(currentDate).format('YYYY-MM-DD') )
            currentDate = moment(currentDate).add(1, 'days');
        }
        for (let j = 0; j < this.datesFromCommencementDate.length; j++) {
          this.datesFromCommencementDate[j] = new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date(this.datesFromCommencementDate[j]));
        }
    }
  }

  setProjectRatesContractCommitments(projectRatesContractCommitments : any) {
    projectRatesContractCommitments.forEach(element => {
      this.projectRatesContractCommitments.push(element)
    });
  }

  setProjectRatesUtilities(projectRatesUtilities: any) {
    projectRatesUtilities.forEach(element => {
      this.projectRatesUtilities.push(element)
    });
  }

  setWorkResourcesUtilities(workResourcesUtilities: any) {
    workResourcesUtilities.forEach(element => {
      this.workResourcesUtilities.push(element)
    });
  }

  setTenderRatesMaterial(tenderRatesMaterial: any) {
    tenderRatesMaterial.forEach(element => {
      this.tenderRatesMaterial.push(element)
    });
  }


  setWorkResourcesMaterial(workResourcesMaterial: any) {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    workResourcesMaterial.forEach(element => {
      this.workResourcesMaterial.push(element)
    });
    for (let j = 1; j < this.workResourcesMaterial.length; j++) {
      this.workResourcesMaterial[j][0] = new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date(this.workResourcesMaterial[j][0]));
    }
  }

  setOtherDamages(otherDamages: any) {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    otherDamages.forEach(element => {
      this.otherDamages.push(element)
    });
    for (let j = 1; j < this.otherDamages.length; j++) {
      this.otherDamages[j][0] = new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date(this.otherDamages[j][0]));
    }
  }

  setLabourProductivity(labourProductivity: any) {
    labourProductivity.forEach(element => {
      this.labourProductivity.push(element)
    });
  }

  setWorkResourcesManpowerWork(workResourcesManpowerWork : any) {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    workResourcesManpowerWork.forEach(element => {
      this.workResourcesManpowerWork.push(element)
    });
    for (let i = 0; i < this.workResourcesManpowerWork.length; i++) { 
      for (let j = 2; j < this.workResourcesManpowerWork[i][0].length; j++) {
        this.workResourcesManpowerWork[i][0][j] = new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date(this.workResourcesManpowerWork[i][0][j]));
      }
    }
  }

  setSiteResourcesTransport(siteResourcesTransport : any) {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    siteResourcesTransport.forEach(element => {
      this.siteResourcesTransport.push(element)
    });
    for (let i = 0; i < this.siteResourcesTransport.length; i++) { 
      for (let j = 1; j < this.siteResourcesTransport[i][0].length; j++) {
        this.siteResourcesTransport[i][0][j] = new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date(this.siteResourcesTransport[i][0][j]));
      }
    }
  }

  setTenderRatesLabour(tenderRatesLabour: any) {
    tenderRatesLabour.forEach(element => {
      this.tenderRatesLabour.push(element)
    });
  }

  setSiteResourcesEquipment(siteResourcesEquipment: any) {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    siteResourcesEquipment.forEach(element => {
      this.siteResourcesEquipment.push(element)
    });
    
    for (let i = 0; i < this.siteResourcesEquipment.length; i++) { 
      for (let j = 1; j < this.siteResourcesEquipment[i][0].length; j++) {
        this.siteResourcesEquipment[i][0][j] = new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date(this.siteResourcesEquipment[i][0][j]));
      }
    }
  
  }

  setProjectRatesEquipmentTransport(projectRatesEquipmentTransport: any) {
    projectRatesEquipmentTransport.forEach(element => {
      this.projectRatesEquipmentTransport.push(element)
    });
  }

  setProjectRatesSiteFacilities(projectRatesSiteFacilities : any) {
    projectRatesSiteFacilities.forEach(element => {
      this.projectRatesSiteFacilities.push(element)
    });
  }
  setLabourDemobilisation(labourDemobilisation : any) {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    labourDemobilisation.forEach(element => {
      this.labourDemobilisation.push(element)
    });
    for (let j = 1; j < this.labourDemobilisation.length; j++) {
      this.labourDemobilisation[j][1] = new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date(this.labourDemobilisation[j][1]));
    }
  }

  setSiteResourcesManpowerAdmin(siteResourcesManpowerAdmin: any) {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    siteResourcesManpowerAdmin.forEach(element => {
      this.siteResourcesManpowerAdmin.push(element)
    });
    console.log(this.siteResourcesManpowerAdmin)
    for (let i = 0; i < this.siteResourcesManpowerAdmin.length; i++) { 
      for (let j = 1; j < this.siteResourcesManpowerAdmin[i][0].length; j++) {
        this.siteResourcesManpowerAdmin[i][0][j] = new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date(this.siteResourcesManpowerAdmin[i][0][j]));
      }
    }
    console.log(this.siteResourcesManpowerAdmin)
  }

  setLabourRemobilisation(labourRemobilisation : any) {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    labourRemobilisation.forEach(element => {
      this.labourRemobilisation.push(element)
    });
    for (let j = 1; j < this.labourRemobilisation.length; j++) {
      this.labourRemobilisation[j][1] = new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date(this.labourRemobilisation[j][1]));
    }
  }

  setOtherSubcontractorClaims(otherSubcontractorClaims : any) {
    otherSubcontractorClaims.forEach(element => {
      this.otherSubcontractorClaims.push(element)
    });
  }

  
  setActualRatesLabour(actualRatesLabour: any) {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    actualRatesLabour.forEach(element => {
      this.actualRatesLabour.push(element)
    });
    
    for (let j = 0; j < this.actualRatesLabour.length; j++) {
      console.log("dsdsds")
      for (let k = 2; k < this.actualRatesLabour[j][0].length; k++) {
        console.log("dsdfdf")
        this.actualRatesLabour[j][0][k] = new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date(this.actualRatesLabour[j][0][k]));
      }
    }
  
  }


  setCurrentEventId() {
    let currentEvent = JSON.parse(localStorage.getItem("selectedEvent"))
    if(currentEvent) {
      this.currentEventId =  currentEvent['eventID']
      this.startDate = currentEvent['startDate']
      this.endDate = currentEvent['endDate']
      //this.delayDuration = currentEvent['extendedContractDuaration']
      this.delayDuration = currentEvent['daysOnCompletion']
    }
  }

  setExtendedContractDuaration() {
    let currentEvent = JSON.parse(localStorage.getItem("selectedEvent"))
    if(currentEvent) {
      this.extendedContractDuaration =  currentEvent['extendedContractDuaration']
    }
  }

  setOtherUnpaidClaim(otherUnpaidClaim: any) {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    otherUnpaidClaim.forEach(element => {
      this.otherUnpaidClaim.push(element)
    });
    for (let j = 1; j < this.otherUnpaidClaim.length; j++) {
      this.otherUnpaidClaim[j][2] = new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date(this.otherUnpaidClaim[j][2]));
      this.otherUnpaidClaim[j][3] = new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date(this.otherUnpaidClaim[j][3]));
    }
  }

  setProjectRatesSiteAdministrationStaff(projectRatesSiteAdministrationStaff: any) {
    projectRatesSiteAdministrationStaff.forEach(element => {
      this.projectRatesSiteAdministrationStaff.push(element)
    });
  }

  // to general Dynami Appendix and Main Headings Notations/Numbers
  generateAppendixAndMainHeadingsNotations() {
    let SMID:number = 0
    A1 = 0
    B1 = 0
    this.AN = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    SMAll = ["", "A", "B", "C", "D", "E", "F", "G", "H","I"]
    SM = ["","","","","","","", "","",""]
    this.sumA = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    if(this.selectedOptions.includes('Site Preliminaries')) {
    SMID = SMID + 1
    SM[1] = SMAll[SMID]
    A1 = A1 + 1
    B1 = 5
    }

    this.selectedOptions = JSON.parse(localStorage.getItem("selectedOptions"));
    if(this.selectedOptions.includes('Escalation - Material') || this.selectedOptions.includes('Escalation - Labour')) {
      SMID = SMID+1
      SM[2] = SMAll[SMID]
      if(this.selectedOptions.includes('Escalation - Material')) {
      A1 = A1 + 1
      this.AN[7] = A1 + B1

      }
      if(this.selectedOptions.includes('Escalation - Labour')) {
      A1 = A1 + 1
      this.AN[8] = A1 + B1
      }
    }

    if(this.selectedOptions.includes('Loss of Productivity')) {
    SMID = SMID+1
    SM[3] = SMAll[SMID]
    A1 = A1 + 1
    this.AN[9] = A1 + B1
    }

    if(this.selectedOptions.includes('De-moblisation') || this.selectedOptions.includes('Re-moblisation')) {
      SMID = SMID+1
      SM[4] = SMAll[SMID]
      //SOption[4] = true
      if(this.selectedOptions.includes('De-moblisation')) {
      A1 = A1 + 1
      this.AN[10] = A1 + B1
      
      }
      if(this.selectedOptions.includes('Re-moblisation')) {
      A1 = A1 + 1
      this.AN[11] = A1 + B1
      } 
    }
    
    if(this.selectedOptions.includes('Head Office Overheads')) {
    SMID = SMID+1
    SM[5] = SMAll[SMID]
    A1 = A1 + 1
    this.AN[12] = A1 + B1
    }

    if(this.selectedOptions.includes("Subcontractor's Claims")) {
    SMID = SMID+1
    SM[6] = SMAll[SMID]
    A1 = A1 + 1
    this.AN[13] = A1 + B1
    this.selectedOptionSC = true
    }

    if(this.selectedOptions.includes('Profit on Claim') || this.selectedOptions.includes('Loss of Profit')) {
      SMID = SMID+1
      SM[7] = SMAll[SMID]
      if(this.selectedOptions.includes('Profit on Claim')) {
      A1 = A1 + 1
      this.AN[14] = A1 + B1
      }
      
      if(this.selectedOptions.includes('Loss of Profit')) {
      A1 = A1 + 1
      this.AN[15] = A1 + B1
      }
    }

    if(this.selectedOptions.includes('Damages')) {    
    SMID = SMID+1
    SM[8] = SMAll[SMID]
    A1 = A1 + 1
    this.AN[16] = A1 + B1
    }

    if (this.selectedOptions.includes("Financiaal Charge on Delayed Profit") || this.selectedOptions.includes("Financiaal Charge (Interest) on Unsettled Payment")) {
    SMID = SMID+1
    SM[9] = SMAll[SMID]
      if(this.selectedOptions.includes('Financiaal Charge on Delayed Profit')) {
      A1 = A1 + 1
      this.AN[17] = A1 + B1
      }

      if(this.selectedOptions.includes('Financiaal Charge (Interest) on Unsettled Payment')) {
      A1 = A1 + 1
      this.AN[18] = A1 + B1
      }
    }
  }

  generateAbbreviation() {
      //this for Abbreviation Table
    this.appendix_Abb_Data.push(["S.No", "Abbreviation", "Details"])
    this.appendix_Abb_Data.push(["1", "[RQT]", "Refer Quantum Table"])
    this.appendix_Abb_Data.push(["2", "Am Quantity", "Average Monthly Quantity"])
    this.appendix_Abb_Data.push(["3", "Avg.Prod.", "Average Productivity"])
    this.appendix_Abb_Data.push(["4", "DeMob", "Demobilisation"])
    this.appendix_Abb_Data.push(["5", "DWHrs", "Daily Working Hours as per the " + this.contractAs])
    this.appendix_Abb_Data.push(["6", "EOT", "Extension of Time"])
    this.appendix_Abb_Data.push(["7", "FOI", "Factor of Impact"])
    this.appendix_Abb_Data.push(["8", "FOI-D", "Factor of Impact of Days = Delay Days / Impacted Days"])
    this.appendix_Abb_Data.push(["9", "FOI-M", "Factor of Impact of Month = Delay Days /30"])
    this.appendix_Abb_Data.push(["10", "LOP", "Loss of Productivity"])
    this.appendix_Abb_Data.push(["11", "LOPF", "Loss of Productivity Factor"])
    this.appendix_Abb_Data.push(["12", "Max.Prod.", "Maximum Productivity"])
    this.appendix_Abb_Data.push(["13", "MP", "Manpower"])
    this.appendix_Abb_Data.push(["14", "PA Date", "Productivity Achieved Date"])
    this.appendix_Abb_Data.push(["15", "ReMob", "Remobilisation"])
    this.appendix_Abb_Data.push(["16", "TI Quantity", "Total Impacted Quantity"])
  
    console.log(this.appendix_Abb_Data)
  }

  
  generateAppendix1() {
    let index = 1
    let sum = 0
    let tempArray : any = []
    this.appendix_1_Data.push(["S.No", "Description", "Quantity", "Unit", "Rate", "Amount"])
    this.appendix_1_Data.push(["", "", "(A)", "", "(B)", "(A x B)"])
    for(index = 1; index < this.projectRatesContractCommitments.length; index++) {
      console.log("aandar app1")
      tempArray.push(index)
      tempArray.push(this.projectRatesContractCommitments[index][0])
      tempArray.push(this.daysOnCompletion)
      tempArray.push("Days")
      tempArray.push(this.projectRatesContractCommitments[index][1])
      tempArray.push(this.daysOnCompletion * this.projectRatesContractCommitments[index][1])
      sum = sum + this.daysOnCompletion * this.projectRatesContractCommitments[index][1]
      this.sumA[1] = sum
      this.appendix_1_Data.push(tempArray)
      tempArray = []
    }

    this.appendix_1_Data.push(["", "", "", "", "", ""])    
    this.appendix_1_Data.push(["", "Note:", "", "", "", ""])
    this.appendix_1_Data.push(["", "(A): Assessed EOT.", "", "", "", ""])

    this.appendix_1_Data.push(["", "Total", "", "", "", sum])
    console.log(this.appendix_1_Data)
  }

  generateAppendix5() {
    let index = 1
    let sum = 0
    let tempArray : any = []
    this.appendix_5_Data.push(["S.No", "Description", "Quantity", "Unit", "Rate", "Amount"])
    this.appendix_5_Data.push(["", "", "(A)", "", "(B)", "(A x B)"])
    for(index = 1; index < this.projectRatesSiteFacilities.length; index++) {
      tempArray.push(index)
      tempArray.push(this.projectRatesSiteFacilities[index][0])
      tempArray.push(this.daysOnCompletion)
      tempArray.push("Days")
      tempArray.push(this.projectRatesSiteFacilities[index][1])
      tempArray.push(this.daysOnCompletion * this.projectRatesSiteFacilities[index][1])
      sum = sum + this.daysOnCompletion * this.projectRatesSiteFacilities[index][1]
      this.sumA[5] = sum
      this.appendix_5_Data.push(tempArray)
      tempArray = []
    }
    
    this.appendix_5_Data.push(["", "", "", "", "", ""])    
    this.appendix_5_Data.push(["", "Note:", "", "", "", ""])
    this.appendix_5_Data.push(["", "(A): Assessed EOT.", "", "", "", ""])

    this.appendix_5_Data.push(["", "Total", "", "", "", sum])
  }

  generateAppendix10() {
    let index = 1
    let sum = 0
    let i = 0
    let tempArray : any = []
    console.log(this.dates, this.labourDemobilisation)
    this.appendix_10_Data.push(["S.No", "Description", "DeMob. Date", "Quantity", "Unit", "Rate", "Amount"])
    this.appendix_10_Data.push(["", "", "", "(A)", "", "(B)", "(A x B)"])
    for(index = 1; index < this.labourDemobilisation.length; index++) {
      if (this.dates.includes(this.labourDemobilisation[index][1])) {
        i = i+1
        tempArray.push(i)
        tempArray.push(this.labourDemobilisation[index][0])
        tempArray.push(this.labourDemobilisation[index][1])
        tempArray.push(this.labourDemobilisation[index][2])
        tempArray.push(this.labourDemobilisation[index][3])
        tempArray.push(this.labourDemobilisation[index][4])
        tempArray.push(Number(this.labourDemobilisation[index][2]) * Number(this.labourDemobilisation[index][4]))
        sum = sum + (Number(this.labourDemobilisation[index][2]) * Number(this.labourDemobilisation[index][4]))
        this.sumA[10] = sum  // changed
        this.appendix_10_Data.push(tempArray)
        tempArray = []
      }
    }
    this.appendix_10_Data.push(["", "Total", "", "", "", "", sum])
  }

  generateAppendix11() {
    let index = 1
    let sum = 0
    let i = 0
    let tempArray : any = []
    this.appendix_11_Data.push(["S.No", "Description", "ReMob. Date", "Quantity", "Unit", "Rate", "Amount"])
    this.appendix_11_Data.push(["", "", "", "(A)", "", "(B)", "(A x B)"])
    for(index = 1; index < this.labourRemobilisation.length; index++) {
      if (this.dates.includes(this.labourRemobilisation[index][1])) {
        i = i+1
        tempArray.push(i)
        tempArray.push(this.labourRemobilisation[index][0])
        tempArray.push(this.labourRemobilisation[index][1])
        tempArray.push(this.labourRemobilisation[index][2])
        tempArray.push(this.labourRemobilisation[index][3])
        tempArray.push(this.labourRemobilisation[index][4])
        tempArray.push(this.labourRemobilisation[index][2] * this.labourRemobilisation[index][4])
        sum = sum + (this.labourRemobilisation[index][2] * this.labourRemobilisation[index][4])
        this.sumA[11] = sum
        this.appendix_11_Data.push(tempArray)
        tempArray = []
      }
    }
    this.appendix_11_Data.push(["", "Total", "", "", "", "", sum])
  }

  generateAppendix13() {
    let index = 1
    let sum = 0
    let i = 0;
    let tempArray : any = []
    console.log(this.currentEventId)
    this.appendix_13_Data.push(["S.No", "Description", "Amount"])
    for(index = 1; index < this.otherSubcontractorClaims.length; index++) {
      if (this.otherSubcontractorClaims[index][2] === this.currentEventId) {
        i=i+1
        tempArray.push(i);
        tempArray.push(this.otherSubcontractorClaims[index][0])
        tempArray.push(this.otherSubcontractorClaims[index][1])
        sum = sum + Number(this.otherSubcontractorClaims[index][1])
        this.sumA[13] = sum
        this.appendix_13_Data.push(tempArray)
        tempArray = []
      }
    }
    this.appendix_13_Data.push(["", "Total", sum])
  }

  getDiffDates(date1, date2) {
    let oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    let firstDate : any = new Date(date1);
    let secondDate : any = new Date(date2);
    const diffDays = Math.round(Math.abs(((firstDate - secondDate) / oneDay)));
    return diffDays;
  }

  generateAppendix18() {
   
    let FC : any;
    let A, B, C, D : any;
    let notF0, notF1, notF2, notF3 : any
    let index = 1
    let sum = 0
    let tempArray : any = []
    this.appendix_18_Data.push(["S.No", "Description", "Due Amount", "Due Date", "Settlement Date", "Annual Interest", "Interest Type", "Financial Charges"])
    this.appendix_18_Data.push(["", "", "(A)", "(B)", "(C)", "(D)", "(E)", "(F)*"])
    for(index = 1; index < this.otherUnpaidClaim.length; index++) {
      tempArray.push(index)
      tempArray.push(this.otherUnpaidClaim[index][0])
      A = this.otherUnpaidClaim[index][1]
      tempArray.push(A) // A
      B = this.otherUnpaidClaim[index][2]
      tempArray.push(B) // B
      C = this.otherUnpaidClaim[index][3]
      tempArray.push(C) // C
      D = this.yearlyInterest
      tempArray.push(D) // D

      if (this.interestType === "simple")
      tempArray.push("Simple") // E
      else {
      tempArray.push("Compound, " +this.compoundingPeriod) // E
      }
    
      console.log(this.getDiffDates(C, B))

      if (this.interestType === "simple" || this.compoundingPeriod == "None") {
        FC = Number(A) * (Number(this.getDiffDates(C, B))) * ((Number(D)/365)/100)
      }
      else {
        let F = this.getCompoundingPeriodFactor(this.compoundingPeriod)
        FC = Number(A) * Math.pow((1 + D/F/100), (((Number(this.getDiffDates(C, B)))/365) * Number(F))) - Number(A)
      }
    
      tempArray.push(FC)
      sum = sum + Number(FC)
      this.appendix_18_Data.push(tempArray)
      tempArray = []
    }
    this.sumA[18] = sum

        // finding heading notation Amount
        if (this.interestType === "simple" || this.compoundingPeriod == "None") {
          notF0 = "Note*: Financial Charge (FC) Formula"          
          notF1 = "FC = (A x D/365 x [C-B])"
          this.appendix_18_Data.push(["","", "" ,"","","","",""])
          this.appendix_18_Data.push(["",notF0, "" ,"","","","",""])
          this.appendix_18_Data.push(["",notF1, "" ,"","","","",""])

          this.appendix_18_Data.push(["","Total", "" ,"","","","",sum])
      
        }
        else {
         // notF = "(A x [(1 + D/CP/100) ^ ((C-B) x CP/365))  - 1])"
          notF0 = "Note*: Financial Charge (FC) Formula"          
          notF1 = "FC = (A x [F1 - 1])"
          notF2 = "F1 = [1 + D/CP/100] ^ [(C-B) x CP/365]"
          notF3 = "CP that varies based on Compunding Period."
          this.appendix_18_Data.push(["","", "" ,"","","","",""])
          this.appendix_18_Data.push(["",notF0, "" ,"","","","",""])
          this.appendix_18_Data.push(["",notF1, "" ,"","","","",""])
          this.appendix_18_Data.push(["",notF2, "" ,"","","","",""])
          this.appendix_18_Data.push(["",notF3, "" ,"","","","",""])

          this.appendix_18_Data.push(["","Total", "" ,"","","","",sum])

        }
    
//    this.appendix_18_Data.push(["","Note: F*", "A x" ,"","","","",sum])
 //   this.appendix_18_Data.push(["","Total", "" ,"","","","",sum])
  }

  generateAppendix2B() {
    console.log(this.dates)
    console.log(this.siteResourcesManpowerAdmin)
    let tempArray : any = []
    tempArray.push("S.No.")
    tempArray.push("Resources")
    this.dates.forEach(element => {
      tempArray.push(element)
    });
    tempArray.push("Total, [A]")
    this.appendix_2B_Data.push(tempArray)
    tempArray = []
    let i = 0
    let j = 0
    let sum = 0
    for(i = 0; i < this.siteResourcesManpowerAdmin.length; i++) {
      //if (this.siteResourcesManpowerAdmin[i][0][1].split('-', 2)[1] === this.dates[0].split('-', 2)[1]) {
        if (new Date(this.siteResourcesManpowerAdmin[i][0][1]).getMonth() == new Date(this.dates[0]).getMonth()) {
        for(j = 1; j < this.siteResourcesManpowerAdmin[i].length; j++) {
          tempArray.push(j)
          tempArray.push(this.siteResourcesManpowerAdmin[i][j][0])
          this.dates.forEach(element => {
            let index = this.siteResourcesManpowerAdmin[i][0].indexOf(element)
            if(index == -1) {
              tempArray.push("0")
            }
            else {
              tempArray.push(this.siteResourcesManpowerAdmin[i][j][index])
              sum = sum + Number(this.siteResourcesManpowerAdmin[i][j][index])
              
            }
          });
          tempArray.push(sum)
          this.appendix_2B_Data.push(tempArray)
          tempArray = []
          sum = 0
        }
      }
    }
  }

  generateAppendix2A() {
    let tempArray: any = []
    let i = 0
    let j = 0
    var flag = 0
    let sum = 0
    console.log(this.dates.length)
    this.appendix_2A_Data.push(["S.No", "Description", "TI Quantity", "Unit", "FoI-D", "Rate", "Amount"])
    this.appendix_2A_Data.push(["", "", "(A - [RQT])", "", "(B)", "(C)", "(AxBxC)"])

    var diff = Math.abs(new Date(this.dates[this.dates.length - 1]).getTime() - new Date(this.dates[0]).getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
    let impactFactor = Number(this.daysOnCompletion) / (Math.floor(diffDays) + Number(1))
    for(i = 1; i < this.appendix_2B_Data.length; i++) {
      tempArray.push(i)
      tempArray.push(this.appendix_2B_Data[i][1])
      tempArray.push(this.appendix_2B_Data[i][this.appendix_2B_Data[i].length - 1])
      tempArray.push("Days")
      tempArray.push(impactFactor);
      let amount = impactFactor * Number(this.appendix_2B_Data[i][this.appendix_2B_Data[i].length - 1]) 
      for (j = 0; j < this.projectRatesSiteAdministrationStaff.length; j++) {
        if(this.projectRatesSiteAdministrationStaff[j][0] === this.appendix_2B_Data[i][1]) {
          flag = 1
          tempArray.push(this.projectRatesSiteAdministrationStaff[j][1])
          amount = amount * Number(this.projectRatesSiteAdministrationStaff[j][1])
        }
      }
      if (flag == 0) {
        tempArray.push(0)
        amount = 0
      }
      tempArray.push(amount)
      sum = sum + Number(amount)
      this.sumA[2] = sum
      this.appendix_2A_Data.push(tempArray)
      tempArray = []
      flag = 0
    }
    /*
    this.appendix_2A_Data.push(["", "", "", "", "", "", ""])    
    this.appendix_2A_Data.push(["", "Note:", "", "", "", "", ""])
    this.appendix_2A_Data.push(["", "*Refer Details.", "", "", "", "", ""])
    this.appendix_2A_Data.push(["", "(B): Delay Days/Impacted Days.", "", "", "", "", ""])
    */
    this.appendix_2A_Data.push(["", "Total", "", "", "", "", sum])
  }

  generateAppendix3B() {
    let tempArray : any = []
    tempArray.push("S.No.")
    tempArray.push("Resources")
    this.dates.forEach(element => {
      tempArray.push(element)
    });
    tempArray.push("Total, [A]")
    this.appendix_3B_Data.push(tempArray)
    tempArray = []
    let i = 0
    let j = 0
    let sum = 0
    for(i = 0; i < this.siteResourcesEquipment.length; i++) {
      //if (this.siteResourcesEquipment[i][0][1].split('-', 2)[1] === this.dates[0].split('-', 2)[1]) {
        if (new Date(this.siteResourcesEquipment[i][0][1]).getMonth() == new Date(this.dates[0]).getMonth()) {
        for(j = 1; j < this.siteResourcesEquipment[i].length; j++) {
          tempArray.push(j)
          tempArray.push(this.siteResourcesEquipment[i][j][0])
          this.dates.forEach(element => {
            let index = this.siteResourcesEquipment[i][0].indexOf(element)
            if(index == -1) {
              tempArray.push("0")
            }
            else {
              tempArray.push(this.siteResourcesEquipment[i][j][index])
              sum = sum + Number(this.siteResourcesEquipment[i][j][index])
              
            }
          });
          tempArray.push(sum)
          this.appendix_3B_Data.push(tempArray)
          tempArray = []
          sum = 0
        }
      }
    }
  }

  generateAppendix3A() {
    let tempArray: any = []
    let i = 0
    let j = 0
    var flag = 0
    let sum = 0
    this.appendix_3A_Data.push(["S.No", "Description", "TI Quantity", "Unit", "FoI-D", "Rate", "Amount"])
    this.appendix_3A_Data.push(["", "", "(A - [RQT])", "", "(B)", "(C)", "(AxBxC)"])
    var diff = Math.abs(new Date(this.dates[this.dates.length - 1]).getTime() - new Date(this.dates[0]).getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
    let impactFactor = Number(this.daysOnCompletion) / (Math.floor(diffDays) + Number(1))
    for(i = 1; i < this.appendix_3B_Data.length; i++) {
      tempArray.push(i)
      tempArray.push(this.appendix_3B_Data[i][1])
      tempArray.push(this.appendix_3B_Data[i][this.appendix_3B_Data[i].length - 1])
      tempArray.push("Days")
      tempArray.push(impactFactor);
      let amount = impactFactor * Number(this.appendix_3B_Data[i][this.appendix_3B_Data[i].length - 1]) 
      for (j = 0; j < this.projectRatesEquipmentTransport.length; j++) {
        if(this.projectRatesEquipmentTransport[j][0] === this.appendix_3B_Data[i][1]) {
          flag = 1
          tempArray.push(this.projectRatesEquipmentTransport[j][1])
          amount = amount * Number(this.projectRatesEquipmentTransport[j][1])
        }
      }
      if (flag == 0) {
        tempArray.push(0)
        amount = 0
      }
      tempArray.push(amount)
      sum = sum + Number(amount)
      this.sumA[3] = sum
      this.appendix_3A_Data.push(tempArray)
      tempArray = []
      flag = 0
    }
       /*
    this.appendix_3A_Data.push(["", "", "", "", "", "", ""])    
    this.appendix_3A_Data.push(["", "Note:", "", "", "", "", ""])
    this.appendix_3A_Data.push(["", "*Refer Details", "", "", "", "", ""])
    this.appendix_3A_Data.push(["", "(B): Delay Days/Impacted Days.", "", "", "", "", ""])
      */
    this.appendix_3A_Data.push(["", "Total", "", "", "", "", sum])
  }

  generateAppendix6B() {
    let tempArray : any = []
    tempArray.push("S.No.")
    tempArray.push("Resources")
    this.dates.forEach(element => {
      tempArray.push(element)
    });
    tempArray.push("Total,[A]")
    this.appendix_6B_Data.push(tempArray)
    tempArray = []
    let i = 0
    let j = 0
    let sum = 0
    for(i = 0; i < this.siteResourcesTransport.length; i++) {
      //if (this.siteResourcesTransport[i][0][1].split('-', 2)[1] === this.dates[0].split('-', 2)[1]) {
        if (new Date(this.siteResourcesTransport[i][0][1]).getMonth() == new Date(this.dates[0]).getMonth()) {
        for(j = 1; j < this.siteResourcesTransport[i].length; j++) {
          tempArray.push(j)
          tempArray.push(this.siteResourcesTransport[i][j][0])
          this.dates.forEach(element => {
            let index = this.siteResourcesTransport[i][0].indexOf(element)
            if(index == -1) {
              tempArray.push("0")
            }
            else {
              tempArray.push(this.siteResourcesTransport[i][j][index])
              sum = sum + Number(this.siteResourcesTransport[i][j][index])
            }
          });
          tempArray.push(sum)
          this.appendix_6B_Data.push(tempArray)
          tempArray = []
          sum = 0
        }
      }
    }
  }

  generateAppendix6A() {
    let tempArray: any = []
    let i = 0
    let j = 0
    var flag = 0
    let sum = 0
    this.appendix_6A_Data.push(["S.No", "Description", "TI Quantity", "Unit", "FoI-D", "Rate", "Amount"])
    this.appendix_6A_Data.push(["", "", "(A - [RQT])", "", "(B)", "(C)", "(AxBxC)"])
    var diff = Math.abs(new Date(this.dates[this.dates.length - 1]).getTime() - new Date(this.dates[0]).getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
    let impactFactor = Number(this.daysOnCompletion) / (Math.floor(diffDays) + Number(1))
    for(i = 1; i < this.appendix_6B_Data.length; i++) {
      tempArray.push(i)
      tempArray.push(this.appendix_6B_Data[i][1])
      tempArray.push(this.appendix_6B_Data[i][this.appendix_6B_Data[i].length - 1])
      tempArray.push("Days")
      tempArray.push(impactFactor);
      let amount = impactFactor * Number(this.appendix_6B_Data[i][this.appendix_6B_Data[i].length - 1]) 
      for (j = 0; j < this.projectRatesEquipmentTransport.length; j++) {
        if(this.projectRatesEquipmentTransport[j][0] === this.appendix_6B_Data[i][1]) {
          flag = 1
          tempArray.push(this.projectRatesEquipmentTransport[j][1])
          amount = amount * Number(this.projectRatesEquipmentTransport[j][1])
          break;
        }
      }
      if (flag == 0) {
        tempArray.push(0)
        amount = 0
      }
      tempArray.push(amount)
      sum = sum + Number(amount)
      this.sumA[6] = sum
      this.appendix_6A_Data.push(tempArray)
      tempArray = []
      flag = 0
    }
      /*
    this.appendix_6A_Data.push(["", "", "", "", "", "", ""])    
    this.appendix_6A_Data.push(["", "Note:", "", "", "", "", ""])
    this.appendix_6A_Data.push(["", "*Refer Details", "", "", "", "", ""])
    this.appendix_6A_Data.push(["", "(B): Delay Days/Impacted Days.", "", "", "", "", ""])
      */
    this.appendix_6A_Data.push(["", "Total", "", "", "", "", sum])
  }

  getUnitsFromProductivity(trade: any) {
    let i = 0
    let j = 0
    for(i = 0; i < this.labourProductivity.length; i++) {
      for(j = 1; j< this.labourProductivity[i].length; j++) {
        if(this.labourProductivity[i][j][0] === trade) {
          return this.labourProductivity[i][j][1];
        }
    }
  }
  return "NA"
  }

  generateAppendix9C() {
    let tempArray: any = []
    tempArray.push("S.No.")
    tempArray.push("Description")
    tempArray.push("Trade")
    tempArray.push("Unit")
    tempArray.push("Max.Prod. / hr [A]")
    tempArray.push("PA Date [B] ")
    this.appendix_9C_Data.push(tempArray)
    tempArray = []
    let i = 0
    let j = 0
    let prevDateMonth : any;
    for (i = 0; i < this.workResourcesManpowerWork.length; i++) {
        //if (new Date(this.workResourcesManpowerWork[i][0][2]).getMonth() == new Date(this.dates[0]).getMonth()) {
          for (let k = 0; k < this.datesFromCommencementDate.length; k++) {
            if (new Date(this.workResourcesManpowerWork[i][0][2]).getMonth() == new Date(this.datesFromCommencementDate[k]).getMonth() && prevDateMonth != new Date(this.datesFromCommencementDate[k]).getMonth()) {
              prevDateMonth = new Date(this.datesFromCommencementDate[k]).getMonth()

        console.log(this.workResourcesManpowerWork[i])
        for(j = 1; j < this.workResourcesManpowerWork[i].length; j++) {
          tempArray.push(j)
          tempArray.push(this.workResourcesManpowerWork[i][j][0])
          tempArray.push(this.workResourcesManpowerWork[i][j][1])
          tempArray.push(this.getUnitsFromProductivity(this.workResourcesManpowerWork[i][j][1]))
          let max = -1
          let dateWhereMaxFind;
          this.datesFromCommencementDate.forEach(element => {
            //element = this.convertDateType(element)
            let index = this.workResourcesManpowerWork[i][0].indexOf(element)
            if(index == -1) {
              // do nothing
            }
            else {
              let flag = 0
              let value : number =  0
              this.labourProductivity[i].forEach((row) => {
                if (row[0] == this.workResourcesManpowerWork[i][j][1]) {
                  flag = 1
                  value = Number(row[index]) / Number(this.workResourcesManpowerWork[i][j][index])
                  if (max < Number(value)) {
                    max = Number(value)
                    dateWhereMaxFind = this.workResourcesManpowerWork[i][0][index]
                  }
                }
              })
              if (flag == 0) {
                max = 0
                dateWhereMaxFind = "NA"
              }
            }
          })
          tempArray.push(max.toFixed(2))
          tempArray.push(dateWhereMaxFind)
          this.appendix_9C_Data.push(tempArray)
          tempArray = []
        }
      }
    }
      //}
    }
    this.formatAppendix9C();
  }

  formatAppendix9C() {
    let i = 0
    let j = 0
    for (i = 1; i < this.appendix_9C_Data.length; i++) {
      for (j= i + 1 ; j < this.appendix_9C_Data.length; j++) {
        if (this.appendix_9C_Data[i][1] == this.appendix_9C_Data[j][1] && this.appendix_9C_Data[i][2] == this.appendix_9C_Data[j][2]) {
          if (Number(this.appendix_9C_Data[i][4]) < Number(this.appendix_9C_Data[j][4])) {
            this.appendix_9C_Data.splice(i, 1);
            i = i - 1
          }
          else {
            this.appendix_9C_Data.splice(j, 1);
            j = j - 1
          }
        }
      }
      this.appendix_9C_Data[i][0] = i;
    }
  }

  generateAppendix9B() {
    console.log(this.workResourcesManpowerWork)
    console.log(this.labourProductivity)
    let count = Number(this.dates.length)
    let tempArray: any = []
    tempArray.push("S.No.")
    tempArray.push("Description")
    tempArray.push("Trade")
    tempArray.push("Unit")
    this.dates.forEach(element => {
      tempArray.push(element)
    })
    tempArray.push("Average [A]")
    tempArray.push("Sum [B]")
    tempArray.push("MP [B/A = E]")
    this.appendix_9B_Data.push(tempArray)
    tempArray = []

    let i = 0
    let j = 0
    let sum = 0
    for (i = 0; i < this.workResourcesManpowerWork.length; i++) {
      //if (this.workResourcesManpowerWork[i][0][2].split('-', 2)[1] === this.dates[0].split('-', 2)[1]) {
        if (new Date(this.workResourcesManpowerWork[i][0][2]).getMonth() == new Date(this.dates[0]).getMonth()) {
        for(j = 1; j < this.workResourcesManpowerWork[i].length; j++) {
          tempArray.push (j)
          tempArray.push(this.workResourcesManpowerWork[i][j][0])
          tempArray.push(this.workResourcesManpowerWork[i][j][1])
          tempArray.push(this.getUnitsFromProductivity(this.workResourcesManpowerWork[i][j][1]))
          this.dates.forEach(element => {
            let index = this.workResourcesManpowerWork[i][0].indexOf(element)
            if(index == -1) {
              tempArray.push("0")
            }
            else {
              let flag = 0
              this.labourProductivity[i].forEach((row) => {
                if (row[0] == this.workResourcesManpowerWork[i][j][1]) {
                  flag = 1
                  tempArray.push((Number(row[index]) / Number(this.workResourcesManpowerWork[i][j][index])).toFixed(2))
                  sum = sum + (Number(row[index]) / Number(this.workResourcesManpowerWork[i][j][index]))
                }
              })
              if (flag == 0) {
                tempArray.push("0")
              }
              //tempArray.push(this.workResourcesManpowerWork[i][j][index])
              //sum = sum + Number(this.workResourcesManpowerWork[i][j][index])
            }
          });
          tempArray.push((Number(sum/count)).toFixed(2))
          tempArray.push(sum.toFixed(2))
          if (Number(sum) == 0) {
            tempArray.push("0")
          }
          else {
            tempArray.push((Number(sum)/Number(sum/count)).toFixed(2))
          }
          sum = 0
          this.appendix_9B_Data.push(tempArray)
          tempArray = []
        }
      }
    }
  }

  generateAppendix9A() {
    console.log(this.tenderRatesLabour)
    console.log(this.appendix_9B_Data)
    let tempArray: any = []
    this.appendix_9A_Data.push(["S.No", "Item", "Trade", "Unit", "Max. Prod. / no.", "PA Date", "Ave. Prod. / no.", "LOP /no.", "LOPF", "Total MP in Hrs.", "Hourly Rate", "Amount"])
    this.appendix_9A_Data.push(["", "", "", "", "(A - [RQT])", "", "(B - [RQT])", "(C = A -B)", "(D = C/A)", "(E=E[RQT]xDWHrs)", "(F)", "(DxExF)"])
    //this.appendix_9A_Data.push(tempArray)
    tempArray = []
    let i = 0
    let A = 0, B = 0, C = 0
    let prod = 1
    let found = 0
    let totalSum = 0
    for(i = 1; i < this.appendix_9B_Data.length; i++) {
      tempArray.push(i)
      tempArray.push(this.appendix_9B_Data[i][1])
      tempArray.push(this.appendix_9B_Data[i][2])
      tempArray.push(this.appendix_9B_Data[i][3])
      console.log(this.appendix_9C_Data[i])
      A = this.appendix_9C_Data[i][this.appendix_9C_Data[i].length - 2]
      B = this.appendix_9B_Data[i][this.appendix_9B_Data[i].length - 3]
      tempArray.push(A)
      tempArray.push(this.appendix_9C_Data[i][this.appendix_9C_Data[i].length - 1])
      tempArray.push(B)
      tempArray.push((A - B).toFixed(2))  // C
      if (Number(A) == 0) {
        tempArray.push("0")
        prod = 0
      }
      else {
        tempArray.push(Number((A - B)/A).toFixed(2)) // D
        prod = Number((A - B)/A)
      }
      tempArray.push(this.appendix_9B_Data[i][this.appendix_9B_Data[i].length - 1] * this.contractWorking)    //E
      prod = prod * Number(this.appendix_9B_Data[i][this.appendix_9B_Data[i].length - 1] * this.contractWorking)
      found = 0
      this.tenderRatesLabour.forEach(element => {
        if(element[0] === this.appendix_9B_Data[i][1]) {
          tempArray.push(element[1])
          prod = prod * Number(element[1])
          found = 1
          console.log("Found hai")
        }
      })
      if (found == 0) {
        tempArray.push(0)
        prod = 0
      }
      tempArray.push(prod)
      totalSum = totalSum + Number(prod)
      this.sumA[9] = totalSum
      this.appendix_9A_Data.push(tempArray)
      tempArray = []
      prod = 1
    }
      /*
    this.appendix_9A_Data.push(["", "", "", "", "", "", "", "", "", "", "", ""])    
    this.appendix_9A_Data.push(["", "Note:", "", "", "", "", "", "", "", "", "", ""])
    this.appendix_9A_Data.push(["", "*: Refer Details", "", "", "", "", "", "", "", "", "", ""])
    this.appendix_9A_Data.push(["", "DWHrs: Daily Working Hrs.", "", "", "", "", "", "", "", "", "", ""])
      */
  
  this.appendix_9A_Data.push(["","Total", "", "", "", "", "", "", "", "", "", totalSum])

  }

  generateAppendix16Ayush() {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    console.log(this.otherDamages)
    let tempDateList: any = []
    this.appendix_16_Data.push(["S.No.","Date", "Description", "Amount"])

    var startDate = moment(this.commencementDate);
    startDate = moment(startDate).add(this.originalContractDurationvalue, 'days');
    startDate = moment(startDate).add(this.extendedContractDuaration, 'days');			//removed +1

    var endDate = moment(startDate).add(this.daysOnCompletion -1, 'days');			//added -1

    while (startDate <= endDate) {
      tempDateList.push( this.convertDateType(moment(startDate).format('YYYY-MM-DD')) )
      startDate = moment(startDate).add(1, 'days');
    }
    for (let j = 0; j < tempDateList.length; j++) {
      tempDateList[j] = new Intl.DateTimeFormat(projectData.regionFormat, {year: projectData.yearFormat, month: projectData.monthFormat, day: projectData.dayFormat}).format(new Date(tempDateList[j]));
    }
    console.log(tempDateList, this.otherDamages)
    let total = 0
    let serialNo = 1
    let tempArray : any = []
    this.otherDamages.forEach(element => {
      if(tempDateList.includes(element[0])) {
        tempArray.push(serialNo)
        element.forEach((data) => {
          tempArray.push(data)
        })
        total = total + Number(element[2])
        serialNo = serialNo + 1
        this.appendix_16_Data.push(tempArray)
        tempArray = []
      }
    })
    this.sumA[16] = total
    this.appendix_16_Data.push(["", "Total", "", total])
  }

  generateAppendix16() {
    let index = 1
    let sum = 0
    let i = 0
    let tempArray : any = []
    this.appendix_16_Data.push(["S.No.","Date", "Description", "Amount"])
   
    for(index = 1; index < this.otherDamages.length; index++) {
      if (this.dates.includes(this.otherDamages[index][0])) {
        i = i+1
        tempArray.push(i)
        tempArray.push(this.otherDamages[index][0])
        tempArray.push(this.otherDamages[index][1])
        tempArray.push(this.otherDamages[index][2])
        sum = sum + Number((this.otherDamages[index][2]))
        this.sumA[16] = sum
        this.appendix_16_Data.push(tempArray)
        tempArray = []
      }
    }
    this.appendix_16_Data.push(["", "Total", "", sum])
  }

  generateAppendix7() {
    let index = 1
    let sum = 0
    let i = 0
    let j = 0
    let tenderRate = 0
    let tempArray : any = []
    this.appendix_7_Data.push(["S.No.", "Purchase Date", "Description", "Impacted Quantity", "Unit", "Tender Rate", "Actual Rate", "Rate Variance","Amount"])
    this.appendix_7_Data.push(["", "", "", "(A)", "", "(B)", "(C)", "(D = C - B)","(A X D)"])
   
    for(index = 1; index < this.workResourcesMaterial.length; index++) {
      let flag = 0
      if (this.dates.includes(this.workResourcesMaterial[index][0])) {
        i = i+1
        tempArray.push(i)
        tempArray.push(this.workResourcesMaterial[index][0])
        tempArray.push(this.workResourcesMaterial[index][1])
        tempArray.push(this.workResourcesMaterial[index][2])
        tempArray.push(this.workResourcesMaterial[index][3])
        for(j = 0; j < this.tenderRatesMaterial.length; j++){
          if(this.tenderRatesMaterial[j][0] === this.workResourcesMaterial[index][1]) {
            tenderRate = this.tenderRatesMaterial[j][1]
            tempArray.push(this.tenderRatesMaterial[j][1])
            flag = 1
            break;
          }
	        else {
		      flag = 0
		      }
        }
	
        if(flag == 0) {
        tempArray.push(0)
	      tenderRate = 0
        }
        tempArray.push(this.workResourcesMaterial[index][4])
        tempArray.push(Number(this.workResourcesMaterial[index][4]) - Number(tenderRate))
        tempArray.push((Number(this.workResourcesMaterial[index][4]) - Number(tenderRate)) * Number(this.workResourcesMaterial[index][2]))
        sum = sum + (Number(this.workResourcesMaterial[index][4]) - Number(tenderRate)) * Number(this.workResourcesMaterial[index][2])
        this.appendix_7_Data.push(tempArray)
        tempArray = []
      }
    }
    this.sumA[7] = sum
    this.appendix_7_Data.push(["", "Total", "", "", "", "", "", "", sum])
  
  }



  generateAppendix8C() {
    console.log(this.workResourcesManpowerWork)
    console.log(this.actualRatesLabour)
    let count = Number(this.dates.length)
    let tempArray: any = []
    tempArray.push("S.No.")
    tempArray.push("Description")
    tempArray.push("Trade")
    this.dates.forEach(element => {
      tempArray.push(element)
    })
    tempArray.push("Average [A]")
    this.appendix_8C_Data.push(tempArray)
    tempArray = []

    let i = 0
    let j = 0
    let k = 0
    let sum = 0
    for (i = 0; i < this.workResourcesManpowerWork.length; i++) {
      //if (this.workResourcesManpowerWork[i][0][2].split('-', 2)[1] === this.dates[0].split('-', 2)[1]) {
        if (new Date(this.workResourcesManpowerWork[i][0][2]).getMonth() == new Date(this.dates[0]).getMonth()) {
        for(j = 1; j < this.workResourcesManpowerWork[i].length; j++) {
          tempArray.push (j)
          tempArray.push(this.workResourcesManpowerWork[i][j][0])
          tempArray.push(this.workResourcesManpowerWork[i][j][1])
          this.dates.forEach(element => {
            let index = this.workResourcesManpowerWork[i][0].indexOf(element)
            if(index == -1) {
              tempArray.push("0")
            }
            else {
              let flag = 0
              
              this.actualRatesLabour[i].forEach((row) => {
                if (row[0] == this.workResourcesManpowerWork[i][j][0] && row[1] == this.workResourcesManpowerWork[i][j][1]) {
                  flag = 1
                  tempArray.push(Number(row[index]))
                  sum = sum + Number(row[index])
                  // code needs to break here
                }
              })
          
                /*  trying other option to reduce the count and 
              for (k = 0; k < this.actualRatesLabour.length; k++) {
                console.log (this.actualRatesLabour[k][j][0], this.actualRatesLabour[k][j][1], index,  this.actualRatesLabour[k][j][index],)
                console.log (this.workResourcesManpowerWork[i][j][0], this.workResourcesManpowerWork[i][j][1], index)
                if (this.actualRatesLabour[k][j][0] == this.workResourcesManpowerWork[i][j][0] && this.actualRatesLabour[k][j][1] == this.workResourcesManpowerWork[i][j][1]) {
                  flag = 1
                  tempArray.push(this.actualRatesLabour[k][j][index])
                  sum = sum + this.actualRatesLabour[k][j][index]
                  break;
                }
              }
              */
              if (flag == 0) {
                tempArray.push("0")
               //count = count -1
              }
            }
          });
          tempArray.push((Number(sum/count)).toFixed(2))
          sum = 0
          this.appendix_8C_Data.push(tempArray)
          tempArray = []
        }
      }
    }
  }

  generateAppendix8B() {
    console.log(this.workResourcesManpowerWork)
    let tempArray: any = []
    tempArray.push("S.No.")
    tempArray.push("Description")
    tempArray.push("Trade")
    this.dates.forEach(element => {
      tempArray.push(element)
    })
    tempArray.push("Sum [B]")
    this.appendix_8B_Data.push(tempArray)
    tempArray = []

    let i = 0
    let j = 0
    let sum = 0
    for (i = 0; i < this.workResourcesManpowerWork.length; i++) {
      //if (this.workResourcesManpowerWork[i][0][2].split('-', 2)[1] === this.dates[0].split('-', 2)[1]) {
        if (new Date(this.workResourcesManpowerWork[i][0][2]).getMonth() == new Date(this.dates[0]).getMonth()) {
        for(j = 1; j < this.workResourcesManpowerWork[i].length; j++) {
          tempArray.push (j)
          tempArray.push(this.workResourcesManpowerWork[i][j][0])
          tempArray.push(this.workResourcesManpowerWork[i][j][1])
          this.dates.forEach(element => {
            let index = this.workResourcesManpowerWork[i][0].indexOf(element)
            if(index == -1) {
              tempArray.push("0")
            }
            else {
                  tempArray.push(this.workResourcesManpowerWork[i][j][index])
                  sum = sum +  Number(this.workResourcesManpowerWork[i][j][index])
            }
          });
          tempArray.push(sum)
          sum = 0
          this.appendix_8B_Data.push(tempArray)
          tempArray = []
        }
      }
    }
  }

  generateAppendix8A() {
    let tempArray: any = []
    console.log(this.appendix_8B_Data)
    this.appendix_8A_Data.push(["S.No.", "Description", "Trade", "TI Quantity", "Unit", "Tender Rate", "Actual Rate", "Rate Variance", "Amount"])
    this.appendix_8A_Data.push(["", "", "", "(A - [RQT])", "", "(B)", "(C - [RQT])", "(D = C - B)", "(AxDxDWHrs)"])
    let i = 0
    let j = 0
    let B = 0
    let D = 0
    let C = 0
    let A = 0
    let sum = 0
    let flag = 0
    for(i=1; i<this.appendix_8B_Data.length; i++) {
      tempArray.push(i)
      tempArray.push(this.appendix_8B_Data[i][1])
      tempArray.push(this.appendix_8B_Data[i][2])
      //A = this.appendix_8B_Data[i][1]
      A = this.appendix_8B_Data[i][this.appendix_8B_Data[i].length - 1]
      tempArray.push(this.appendix_8B_Data[i][this.appendix_8B_Data[i].length - 1])
      tempArray.push("Days")
      /*
      this.tenderRatesLabour.forEach(element => {
        if(element[0] === this.appendix_8B_Data[i][1]) {
        tempArray.push(element[1])
        B = element[1]
	      flag = 1
	  		}
	      else {				
		    flag = 0			
		    }   			
      })
      */
      for (j = 0; j < this.tenderRatesLabour.length; j++) {
        if(this.tenderRatesLabour[j][0] === this.appendix_8B_Data[i][1]) {
          flag = 1
          tempArray.push(this.tenderRatesLabour[j][1])
          B = this.tenderRatesLabour[j][1]
          break;
        }
      }

      if(flag === 0) {			
      tempArray.push(0)		
	    B = 0				
      }

      console.log(this.appendix_8C_Data)				
      tempArray.push(this.appendix_8C_Data[i][this.appendix_8C_Data[i].length - 1])
      C = this.appendix_8C_Data[i][this.appendix_8C_Data[i].length - 1]
      D = C - B
      tempArray.push(D)
      tempArray.push(A * D * Number(this.contractWorking))
      sum = sum + (A * D * Number(this.contractWorking))
      this.appendix_8A_Data.push(tempArray)
      tempArray = []
    }
    this.sumA[8] = sum
      /*
    this.appendix_8A_Data.push(["", "", "", "", "", "", "", "", ""])    
    this.appendix_8A_Data.push(["", "Note:", "", "", "", "", "", "", ""])
    this.appendix_8A_Data.push(["", "*: Refer Details", "", "", "", "", "", "", ""])
    this.appendix_8A_Data.push(["", "DWHrs: Daily Working Hrs.", "", "", "", "", "", "", ""])
      */
    this.appendix_8A_Data.push(["", "Total", "", "", "", "", "", "", sum])
  }

  getMonthsList(dateList: any) {
    let monthList: any = []
    let i = 0
    for(i=0;i<dateList.length;i++) {
      if(i==0){
       // monthList.push(dateList[i].substring(dateList[i].indexOf('-') + 1))
       monthList.push(dateList[i])
       continue;
      }
      /*if(!monthList.includes(dateList[i].substring(dateList[i].indexOf('-') + 1))) {
        monthList.push(dateList[i].substring(dateList[i].indexOf('-') + 1))
      }*/
      if (new Date(monthList[0]).getMonth() != new Date(dateList[i]).getMonth()) {
        monthList.push(dateList[i])
      }
    }
    return monthList
  }

  generateAppendix4B() {
    let ViewWorkResourceUtilities = this.workResourcesUtilities
    console.log(ViewWorkResourceUtilities)
    // removing date part here
    for(let i = 2; i < ViewWorkResourceUtilities[0].length; i++) {
      ViewWorkResourceUtilities[0][i] = ViewWorkResourceUtilities[0][i].split(' ').slice(1, 5).join(' ');
    }
    let monthList = this.getMonthsList(this.dates)
    let tempArray: any = []
    tempArray.push("S.No.")
    tempArray.push("Description")
    tempArray.push("Unit")
    monthList.forEach(date => {
      date = date.split(' ').slice(1, 5).join(' ')
      tempArray.push(date)
    })
    tempArray.push("Average,[A]")
    this.appendix_4B_Data.push(tempArray)
    tempArray = []

    for(let j = 1;j<this.workResourcesUtilities.length;j++){
      tempArray.push(j)
      tempArray.push(this.workResourcesUtilities[j][0])
      tempArray.push(this.workResourcesUtilities[j][1])
      let sum = 0
      let count = 0
      monthList.forEach(date => {
        date = date.split(' ').slice(1, 5).join(' '); // picking month part only
        let index = ViewWorkResourceUtilities[0].indexOf(date)
        console.log(index)
        if(index == -1) {
          tempArray.push(0)
        }
        else {
          sum = sum + Number(ViewWorkResourceUtilities[j][index])
          tempArray.push(ViewWorkResourceUtilities[j][index])
        }
        count = count + 1
      })
      tempArray.push(sum/count)
      this.appendix_4B_Data.push(tempArray)
      tempArray = []
    }
  }

  generateAppendix4A() {
    this.appendix_4A_Data.push(["S.No.", "Description", "AM Quantity", "Unit", "FoI-M", "Rate", "Amount"])
    this.appendix_4A_Data.push(["", "", "(A - [RQT])", "", "(B)", "(C)", "(AxBxC)"])
    let tempArray: any = []
    let amount = 0
    for(let i = 1; i< this.appendix_4B_Data.length; i++) {
      let A, B, C
      tempArray.push(i)
      tempArray.push(this.appendix_4B_Data[i][1])
      tempArray.push(this.appendix_4B_Data[i][this.appendix_4B_Data[i].length - 1])
      A = this.appendix_4B_Data[i][this.appendix_4B_Data[i].length - 1]
      let flag = 0
      for (let j = 0; j < this.projectRatesUtilities.length; j++ ){
        if(this.projectRatesUtilities[j][0] === this.appendix_4B_Data[i][1]) {
          tempArray.push(this.projectRatesUtilities[j][2])
          C = this.projectRatesUtilities[j][1]
          flag = 1
          break;
        }
      }
      if(flag == 0) {
        tempArray.push("NA")
        C = 0
      }
      tempArray.push(this.daysOnCompletion/30)
      B = this.daysOnCompletion/30
      tempArray.push(C)
      tempArray.push(A*B*C)
      amount = amount + (A*B*C)
      this.appendix_4A_Data.push(tempArray)
      tempArray = []
    }
    this.sumA[4] = amount
       /*
    this.appendix_4A_Data.push(["", "", "", "", "", "", ""])    
    this.appendix_4A_Data.push(["", "Note:", "", "", "", "", ""])
    this.appendix_4A_Data.push(["", "*Refer Details", "", "", "", "", ""])
    this.appendix_4A_Data.push(["", "(B): Delay Days/30.", "", "", "", "", ""])
      */
    this.appendix_4A_Data.push(["", "Total", "", "", "", "", amount])
  }

  generateAppendix12() {
    const selectedFormula = JSON.parse(localStorage.getItem("selectedFormula"));
    const HOOHpDay = JSON.parse(localStorage.getItem("HOOHpDay"));
    //alert (selectedFormula);
    let total = 0
    let data: any;
    this.appendix_12_Data.push(["Item", "Description", "Amount"])
    this.appendix_12_Data.push(["1", "The Head Office Overhead (HOOH) expense is the cost/expense incurred (shall be incurred) by the Head Office to support the project team during the project duration. As the ' + this.contractAs + ' Price includes such cost only for the original ' + this.contractAs + ' period, the such cost for the delay period is claimed here.", ""])
   
    // Dev Note:- OHProFormula_DB2 is "Hudson"
    if (selectedFormula == "Hudson") {
      this.appendix_12_Data.push(["2", "Hudson provides an internationally accepted formula for calculating the additional and reimbursable overhead costs. Thus, this formula has been used in calculating the Head Office Overhead cost resulting from the delayed Works.", ""])
      this.appendix_12_Data.push(["3", "The Formula is:", ""])
      this.appendix_12_Data.push(["", "               " + this.contractAs + " Price / " + this.contractAs + " Period x Delay Period x Head Office Overhead %", ""])
      this.appendix_12_Data.push(["4", "Data:", ""])
      this.appendix_12_Data.push(["", "a. " + this.contractAs + " Price: " + this.originalContractPriceType + " " + this.formatNumber(this.originalContractPrice), ""])
      this.appendix_12_Data.push(["", "b. " + this.contractAs + " Period: " + this.originalContractDurationvalue + " Days", ""])
      this.appendix_12_Data.push(["", "c. Delay Period: " +  this.daysOnCompletion + " Days", ""])
      this.appendix_12_Data.push(["", "d. Overhead Percentage " + this.formatNumberInPercent(this.headOfficeOverheadPercentage), ""])
      this.appendix_12_Data.push(["5", "Computation", ""])
      data = (this.originalContractPrice  / this.originalContractDurationvalue) * this.daysOnCompletion * this.headOfficeOverheadPercentage / 100
      this.appendix_12_Data.push(["", "a. Head Office Overhead for the Delayed Period as per above formula is", data])
      total = total + Number(data)
    }

    // Dev Note:- OHProFormula_DB2 is "Hudson-corrected by SCL"
    if (selectedFormula == "Hudson - Corrected by SCL") {
      this.appendix_12_Data.push(["2", "Hudson (which was further corrected by SCL) provides an internationally accepted formula for calculating the additional and reimbursable overhead costs. Thus, this formula has been used in calculating the Head Office Overhead cost resulting from the delayed Works.", ""])
      this.appendix_12_Data.push(["3", "The formula is:", ""])
      this.appendix_12_Data.push(["", "{ " + this.contractAs + " Price x (1 - Head office Overhead % - Profit %) / " + this.contractAs + " Period } x Delay Period x Head Office Overhead %", ""])
      this.appendix_12_Data.push(["4", "Data:", ""])
      this.appendix_12_Data.push(["", "a. " + this.contractAs + " Price: " +  this.originalContractPriceType + " " + this.formatNumber(this.originalContractPrice), ""])
      this.appendix_12_Data.push(["", "b. " + this.contractAs + " Period: " +  this.originalContractDurationvalue + " Days", ""])
      this.appendix_12_Data.push(["", "c. Delay Period: " +  this.daysOnCompletion + " Days", ""])
      this.appendix_12_Data.push(["", "d. Overhead Percentage: " +  this.formatNumberInPercent(this.headOfficeOverheadPercentage), ""])
      this.appendix_12_Data.push(["", "e. Profit Percentage: " +  this.formatNumberInPercent(this.profitPercentage), ""])
      this.appendix_12_Data.push(["5", "Computation", ""])
      data = ((this.originalContractPrice * (1 - this.headOfficeOverheadPercentage / 100 - this.profitPercentage / 100)) / this.originalContractDurationvalue) * this.daysOnCompletion * this.headOfficeOverheadPercentage / 100
      this.appendix_12_Data.push(["", "a. Head Office Overhead for the Delayed Period as per above formula is", data])
      total = total + Number(data)
    }

    // Dev Note:- OHProFormula_DB2 is "Emden"
    if (selectedFormula == "Emden") {
      this.appendix_12_Data.push(["2", "Emden provides an internationally accepted formula for calculating the additional and reimbursable overhead costs.  Thus, this formula has been used in calculating the Head Office Overhead cost resulting from the delayed Works.", ""])
      this.appendix_12_Data.push(["3", "The formula is:", ""])
      this.appendix_12_Data.push(["", "(" + this.contractAs + " Price / " + this.contractAs + " Period) x Delay Period x (Head Office Overhead Cost Per Annum / Turnover of Claimant per Annum)", ""])
      this.appendix_12_Data.push(["4", "Data:", ""])
      this.appendix_12_Data.push(["", "a. " + this.contractAs + " Price: " +  this.originalContractPriceType + " " + this.formatNumber(this.originalContractPrice), ""])
      this.appendix_12_Data.push(["", "b. " + this.contractAs + " Period: " +  this.originalContractDurationvalue + " Days", ""])
      this.appendix_12_Data.push(["", "c. Delay Period: " +  this.daysOnCompletion + " Days", ""])
      this.appendix_12_Data.push(["", "d. Head office Overhead Cost PerAnnum: " +  this.originalContractPriceType + " " + this.formatNumber(this.annualHOOverheadCost), ""])
      this.appendix_12_Data.push(["", "e. Turnover per Annum: " +  this.originalContractPriceType + " " + this.formatNumber(this.annualTurnoverOfCompany), ""])
      this.appendix_12_Data.push(["5", "Computation", ""])
      data = (this.originalContractPrice / this.originalContractDurationvalue) * this.daysOnCompletion * (this.annualHOOverheadCost / this.annualTurnoverOfCompany)
      this.appendix_12_Data.push(["", "a. Head Office Overhead for the Delayed Period as per above formula is", data])
      total = total + Number(data)
    }

    // Dev Note:- OHProFormula_DB2 is "Eichleay"
    if (selectedFormula == "Eichleay") {
      this.appendix_12_Data.push(["2", "Eichleay provides an internationally accepted formula for calculating the additional and reimbursable overhead costs. Thus, this formula has been used in calculating the Head Office Overhead cost resulting from the delayed Works.", ""])
      this.appendix_12_Data.push(["3", "The formula is:", ""])
      this.appendix_12_Data.push(["", "(Revised " + this.contractAs + " Price / Revised " + this.contractAs + " Period) x Delay Period x (Head Office Overhead Cost During Acutal Period of Performance / Turnover During Actual Period of Performance)", ""])
      this.appendix_12_Data.push(["4", "Data:", ""])
	    let a
	    let b
      console.log(this.reviesdContractPriceValue, this.reviesdContractDuration)
	    if (Number(this.reviesdContractPriceValue) === 0) {
	      this.appendix_12_Data.push(["", "a. As the " + this.contractAs + " Price is not yet revised, Revised " + this.contractAs + " Price is same as " + this.contractAs + " Price: " +  this.originalContractPriceType + " " + this.formatNumber(this.originalContractPrice), ""])
	      a = Number(this.originalContractPrice)
	    } 
	    else {
	      this.appendix_12_Data.push(["", "a. Revised " + this.contractAs + " Price: " +  this.originalContractPriceType + " " + this.formatNumber(this.reviesdContractPriceValue), ""])
    	  a = Number(this.originalContractPrice)
	    }
	
	    if (Number(this.reviesdContractDuration) === 0) {    
	      this.appendix_12_Data.push(["", "b. As the " + this.contractAs + " Price is not yet revised, Revised " + this.contractAs + " Period is same as " + this.contractAs + " Period: " +  this.originalContractDurationvalue + " Days", ""])
	      b = Number (this.originalContractDurationvalue)
	    } 
	    else {
	      this.appendix_12_Data.push(["", "b. Revised " + this.contractAs + " Period: " +  this.reviesdContractDuration + " Days", ""])
	      b = Number (this.reviesdContractDuration)
	    }

      this.appendix_12_Data.push(["", "c. Delay Period: " +  this.daysOnCompletion + " Days", ""])
      this.appendix_12_Data.push(["", "d. Head office Overhead Cost During Actual Period of Perdformance: " +  this.originalContractPriceType + " " + this.formatNumber(this.actualHOOverheadCost), ""])
      this.appendix_12_Data.push(["", "e. Turnover During Actual Period of Performance: " +  this.originalContractPriceType + " " + this.formatNumber(this.actualTurnoverOfCompany), ""])
      this.appendix_12_Data.push(["5", "Computation", ""])
      data = (a / b) * this.daysOnCompletion * (this.actualHOOverheadCost / this.actualTurnoverOfCompany)
      this.appendix_12_Data.push(["", "a. Head Office Overhead for the Delayed Period as per above formula is", data])
      total = total + Number(data)
    }

    // Dev Note:- OHProFormula_DB2 is "Good Faith Hudson- Corrected Hudson"
    if (selectedFormula == "Good Faith Hudson - Corrected Hudson") {
      this.appendix_12_Data.push(["2", "Good Faith has corrected the Hudson formula (which is an internationally accepted formula for calculating the additional and reimbursable overhead and profit cost) by excluding Head office Overhead and Profit amounts from the original " + this.contractAs + " Price. The SCL recommended a similar correction; however, Good Faith had found an accounting error in such corrected SCL formula. Thus, Good Faith has corrected such errors and introduced new formula from the Hudson formula (Good Faith Hudson). Therefore, the Good Faith Hudson formula has been used in calculating the Head Office Overhead cost resulting from the delayed Works.", ""])
      this.appendix_12_Data.push(["3", "The formula is:", ""])
      this.appendix_12_Data.push(["", "{ " + this.contractAs + " Price / [(1 + Head office Overhead %) x (1 + Profit %) ] } x { Delay Period / " + this.contractAs + " Period } x Head Office Overhead % ", ""])
      this.appendix_12_Data.push(["4", "Data:", ""])
      this.appendix_12_Data.push(["", "a. " + this.contractAs + " Price: " +  this.originalContractPriceType + " " + this.formatNumber(this.originalContractPrice), ""])
      this.appendix_12_Data.push(["", "b. " + this.contractAs + " Period: " +  this.originalContractDurationvalue + " Days", ""])
      this.appendix_12_Data.push(["", "c. Delay Period: " +  this.daysOnCompletion + " Days", ""])
      this.appendix_12_Data.push(["", "d. Overhead Percentage: " +  this.formatNumberInPercent(this.headOfficeOverheadPercentage), ""])
      this.appendix_12_Data.push(["", "e. Profit Percentage: " +  this.formatNumberInPercent(this.profitPercentage), ""])
      this.appendix_12_Data.push(["5", "Computation", ""])
      data = (this.originalContractPrice / ((1 + this.headOfficeOverheadPercentage / 100) * (1+this.profitPercentage / 100))) * ((this.daysOnCompletion * this.headOfficeOverheadPercentage / 100) / this.originalContractDurationvalue)
      this.appendix_12_Data.push(["", "a. Head Office Overhead for the Delayed Period as per above formula is", data])
      total = total + Number(data)
    }

    // Dev Note:- OHProFormula_DB2 is "Good Faith Emden- Corrected Emden"
    if (selectedFormula == "Good Faith Emden - Corrected Emden") {
      this.appendix_12_Data.push(["2", "Good Faith has corrected the Emden formula (which is an internationally accepted formula for calculating the additional and reimbursable overhead and profit cost) by excluding Head office Overhead and Profit amounts from the original " + this.contractAs + " Price. The SCL recommended a similar correction; however, Good Faith had found an accounting error in such corrected SCL formula. Thus, Good Faith has corrected such errors and introduced new formula from the Hudson formula (Good Faith Hudson). Therefore, the Good Faith Hudson formula has been used in calculating the Head Office Overhead cost resulting from the delayed Works.", ""])
      this.appendix_12_Data.push(["3", "The formula is:", ""])
      this.appendix_12_Data.push(["", "{ " + this.contractAs + " Price / [(1 + Head office Overhead %) x (1 + Profit %) ] } x { Delay Period / " + this.contractAs + " Period } x Head Office Overhead %", ""])
      this.appendix_12_Data.push(["4", "Data:", ""])
      this.appendix_12_Data.push(["", "a. " + this.contractAs + " Price: " +  this.originalContractPriceType + " " + this.formatNumber(this.originalContractPrice), ""])
      this.appendix_12_Data.push(["", "b. " + this.contractAs + " Period: " +  this.originalContractDurationvalue + " Days", ""])
      this.appendix_12_Data.push(["", "c. Delay Period: " +  this.daysOnCompletion + " Days", ""])
      this.appendix_12_Data.push(["", "d. Head office Overhead Cost Per Annum: " +  this.originalContractPriceType + " " +  this.formatNumber(this.annualHOOverheadCost), ""])
      this.appendix_12_Data.push(["", "e. Profit Cost Per Annum: " +  this.originalContractPriceType + " " + this.formatNumber(this.annualProfit), ""])
      this.appendix_12_Data.push(["", "f. Turnover of per Annum: " +  this.originalContractPriceType + " " + this.formatNumber(this.annualTurnoverOfCompany), ""])
      this.appendix_12_Data.push(["", "g. The Head Office Overhead and Profit % are calculated as below:", ""])
      this.appendix_12_Data.push(["", "g1. Head Office Overhead % = Head Office Overhead Cost Per Annum / Turnover Per Annum = " + this.formatNumberInPercent(this.annualHOOverheadCost/ this.annualTurnoverOfCompany * 100), ""])
      this.appendix_12_Data.push(["", "g2. Profit % = Profit Per Annum / Turnover Per Annum = " + this.formatNumberInPercent(this.annualProfit/ this.annualTurnoverOfCompany * 100), ""])
      this.appendix_12_Data.push(["5", "Computation", ""])
      data = (this.originalContractPrice / ((1 + this.annualHOOverheadCost / this.annualTurnoverOfCompany) * (1 + this.annualProfit / this.annualTurnoverOfCompany ))) * (this.daysOnCompletion / this.originalContractDurationvalue) * this.annualHOOverheadCost / this.annualTurnoverOfCompany
      this.appendix_12_Data.push(["", "a. Head Office Overhead for the Delayed Period as per above formula is", data])
      total = total + Number(data)
    }

    // Dev Note:- OHProFormula_DB2 is "Other"
    if (selectedFormula == "Other") {
      this.appendix_12_Data.push(["2", "It is estimated that Head Office shall incur (or incurs) the cost of " + this.originalContractPriceType + " " + this.formatNumber(HOOHpDay) + " per day for supporting the project team and office. Thus, we have used the following formula in calculating the Head Office Overhead cost resulting from the delayed Works.", ""])
      this.appendix_12_Data.push(["3", "The formula is:", ""])
      this.appendix_12_Data.push(["", "Head office cost per day x Delay Period", ""])
      this.appendix_12_Data.push(["4", "Data:", ""])
      this.appendix_12_Data.push(["", "a. Head office cost per day: " +  this.originalContractPriceType + " " + this.formatNumber(HOOHpDay), ""]) // evaluation page se
      this.appendix_12_Data.push(["", "b. Delay Period: " +  this.daysOnCompletion + " Days", ""])
      this.appendix_12_Data.push(["5", "Computation", ""])
      data = Number(HOOHpDay) * Number(this.daysOnCompletion)
      this.appendix_12_Data.push(["", "a. Head Office Overhead for the Delayed Period as per above formula is", data])
      total = total + Number(data)
    }
    this.sumA[12] = total
    this.appendix_12_Data.push(["", "Head Office Overhead for the Delayed Period is", total])
  }

  generateAppendix15() {
    const LOPpDay = JSON.parse(localStorage.getItem("LOPpDay"));
    let total = 0
    let data: any;
    this.appendix_15_Data.push(["Item", "Description", "Amount"])
    this.appendix_15_Data.push(["1", "The Loss of Profit is the profit that could have been earned from the other project that has not been secured due to a delay in the Project that tied up the resources.",""])
    const selectedFormula = JSON.parse(localStorage.getItem("selectedFormula"));
    // Dev Note:- OHProFormula_DB2 is "Hudson"
    if (selectedFormula == "Hudson") {
      this.appendix_15_Data.push(["2", "Hudson provides an internationally accepted formula for calculating the additional and reimbursable loss of profit. Thus, this formula has been used in calculating such loss of profit resulting from the delayed Works.", ""])
      this.appendix_15_Data.push(["3", "The Formula is:",""])
      this.appendix_15_Data.push(["", "" + this.contractAs + " Price / " + this.contractAs + " Period x Delay Period x Profit %",""])
      this.appendix_15_Data.push(["4", "Data:",""])
      this.appendix_15_Data.push(["", "a. " + this.contractAs + " Price: " + this.originalContractPriceType + " " + this.formatNumber(this.originalContractPrice),""])
      this.appendix_15_Data.push(["", "b. " + this.contractAs + " Period: " + this.originalContractDurationvalue + " Days",""])
      this.appendix_15_Data.push(["", "c. Delay Period: " + this.daysOnCompletion + " Days",""])
      this.appendix_15_Data.push(["", "d. Profit Percentage: " +  this.formatNumberInPercent(this.profitPercentage),""])
      this.appendix_15_Data.push(["5", "Computation",""])
      data = (this.originalContractPrice / this.originalContractDurationvalue) * this.daysOnCompletion * this.profitPercentage / 100
      this.appendix_15_Data.push(["", "a. Loss of Profit for the Delayed Period as per above formula is", data])
      total = total + Number(data)
    }

    // Dev Note:- OHProFormula_DB2 is "Hudson-corrected by SCL"
    if (selectedFormula == "Hudson - Corrected by SCL") {
      this.appendix_15_Data.push(["2", "Hudson (which was further corrected by SCL) provides an internationally accepted formula for calculating the additional and reimbursable loss of profit. Thus, this formula has been used in calculating such loss of profit resulting from the delayed Works.",""])
      this.appendix_15_Data.push(["3", "The formula is:",""])
      this.appendix_15_Data.push(["", "{ " + this.contractAs + " Price x (1 - Head Office Overhead % - Profit %) }  / " + this.contractAs + " Period x Delay Period x Profit %",""])
      this.appendix_15_Data.push(["4", "Data:",""])
      this.appendix_15_Data.push(["", "a. " + this.contractAs + " Price: " + this.originalContractPriceType + " " + this.formatNumber(this.originalContractPrice),""])
      this.appendix_15_Data.push(["", "b. " + this.contractAs + " Period: " + this.originalContractDurationvalue + " Days",""])
      this.appendix_15_Data.push(["", "c. Delay Period: " + this.daysOnCompletion + " Days",""])
      this.appendix_15_Data.push(["", "d. Overhead Percentage: " + this.headOfficeOverheadPercentage + " %",""])
      this.appendix_15_Data.push(["", "e. Profit Percentage: " + this.formatNumberInPercent(this.profitPercentage),""])
      this.appendix_15_Data.push(["5", "Computation",""])
      data = ((this.originalContractPrice * (1 - this.headOfficeOverheadPercentage / 100 - this.profitPercentage / 100)) / this.originalContractDurationvalue) * this.daysOnCompletion * this.profitPercentage / 100
      this.appendix_15_Data.push(["", "a. Loss of Profit for the Delayed Period as per above formula is", data])
      total = total + Number(data)
    }

    // Dev Note:- OHProFormula_DB2 is "Emden"
    if (selectedFormula == "Emden") {
      this.appendix_15_Data.push(["2", "Emden provides an internationally accepted formula for calculating the additional and reimbursable loss of profit. Thus, this formula has been used in calculating the loss of profit resulting from the delayed Works..",""])
      this.appendix_15_Data.push(["3", "The formula is:",""])
      this.appendix_15_Data.push(["", "(" + this.contractAs + " Price / " + this.contractAs + " Period) x Delay Period x (Profit Amount Per Annum / Turnover of Claimant per Annum)",""])
      this.appendix_15_Data.push(["4", "Data:",""])
      this.appendix_15_Data.push(["", "a. " + this.contractAs + " Price: " + this.originalContractPriceType + " " + this.formatNumber(this.originalContractPrice),""])
      this.appendix_15_Data.push(["", "b. " + this.contractAs + " Period: " + this.originalContractDurationvalue + " Days",""])
      this.appendix_15_Data.push(["", "c. Delay Period: " + this.daysOnCompletion + " Days",""])
      this.appendix_15_Data.push(["", "d. Profit PerAnnum: " + this.originalContractPriceType + " " + this.formatNumber(this.annualProfit),""])
      this.appendix_15_Data.push(["", "e. Turnover per Annum: " + this.originalContractPriceType + " " + this.formatNumber(this.annualTurnoverOfCompany),""])
      this.appendix_15_Data.push(["5", "Computation",""])
      data = (this.originalContractPrice / this.originalContractDurationvalue) * this.daysOnCompletion * (this.annualProfit / this.annualTurnoverOfCompany)
      this.appendix_15_Data.push(["", "a. Loss of Profit for the Delayed Period as per above formula is", data])
      total = total + Number(data)
    }

    // Dev Note:- OHProFormula_DB2 is "Eichleay"
    if (selectedFormula == "Eichleay") {
      this.appendix_15_Data.push(["2", "Eichleay provides an internationally accepted formula for calculating the additional and reimbursable loss of profit cost. Thus, this formula has been used in calculating the loss of profit resulting from the delayed Works..",""])
      this.appendix_15_Data.push(["3", "The formula is:",""])
      this.appendix_15_Data.push(["", "(Revised " + this.contractAs + " Price / Revised " + this.contractAs + " Period) x Delay Period x (Profit Amount During Acutal Period of Performance / Turnover During Actual Period of Performance)",""])
      this.appendix_15_Data.push(["4", "Data:",""])
	    let a
	    let b
	    if (Number(this.reviesdContractPriceValue) === 0) {
	      this.appendix_15_Data.push(["", "a. As the " + this.contractAs + " Price is not yet revised, Revised " + this.contractAs + " Price is same as " + this.contractAs + " Price: " + this.originalContractPriceType + " " + this.formatNumber(this.originalContractPrice),""])
	      a = Number(this.originalContractPrice)
	    } 
	    else {
	      this.appendix_15_Data.push(["", "a. Revised " + this.contractAs + " Price: " + this.originalContractPriceType + " " + this.formatNumber(this.reviesdContractPriceValue),""])
    	  a = Number(this.originalContractPrice)
	    }
	
	    if (Number(this.reviesdContractDuration) === 0) {    
	      this.appendix_15_Data.push(["", "b. As the " + this.contractAs + " Price is not yet revised, Revised " + this.contractAs + " Period is same as " + this.contractAs + " Period: " + this.originalContractDurationvalue + " Days",""])
	      b = Number (this.originalContractDurationvalue)
	    } 
	    else {
	      this.appendix_15_Data.push(["", "b. Revised " + this.contractAs + " Period: " + this.reviesdContractDuration + " Days",""])
	      b = Number (this.reviesdContractDuration)
	    }

      this.appendix_15_Data.push(["", "c. Delay Period: " + this.daysOnCompletion + " Days",""])
      this.appendix_15_Data.push(["", "d. Profit Amount During Acutal Period of Performance: " + this.originalContractPriceType + " " + this.formatNumber(this.annualProfit),""])
      this.appendix_15_Data.push(["", "e. Turnover During Actual Period of Performance: " + this.originalContractPriceType + " " + this.formatNumber(this.actualTurnoverOfCompany),""])
      this.appendix_15_Data.push(["5", "Computation",""])
      data = (a / b) * this.daysOnCompletion * (this.annualProfit / this.actualTurnoverOfCompany)
      this.appendix_15_Data.push(["", "a. Loss of Profit for the Delayed Period as per above formula is", data])
      total = total + Number(data)
    }

    // Dev Note:- OHProFormula_DB2 is "Good Faith Hudson- Corrected Hudson"
    if (selectedFormula == "Good Faith Hudson - Corrected Hudson") {
      this.appendix_15_Data.push(["2", "Good Faith has corrected the Hudson formula (which is an internationally accepted formula for calculating the additional and reimbursable overhead and profit cost) by excluding Head office Overhead and Profit amounts from the original " + this.contractAs + " Price. The SCL recommended a similar correction; however, Good Faith had found an accounting error in such corrected SCL formula. Thus, Good Faith has corrected such errors and introduced new formula from the Hudson formula (Good Faith Hudson). Therefore, the Good Faith Hudson formula has been used in calculating the loss of profit resulting from the delayed Works.", ""])
      this.appendix_15_Data.push(["3", "The formula is:",""])
      this.appendix_15_Data.push(["", "{ " + this.contractAs + " Price / (1 + Profit %) } x { (Delay Period / " + this.contractAs + " Period ) x Profit %) }"])
      this.appendix_15_Data.push(["4", "Data:",""])
      this.appendix_15_Data.push(["", "a. " + this.contractAs + " Price: " + this.originalContractPriceType + " " + this.formatNumber(this.originalContractPrice),""])
      this.appendix_15_Data.push(["", "b. " + this.contractAs + " Period: " + this.originalContractDurationvalue + " Days",""])
      this.appendix_15_Data.push(["", "c. Delay Period: " + this.daysOnCompletion + " Days",""])
      this.appendix_15_Data.push(["", "d. Profit Percentage: " + this.formatNumberInPercent(this.profitPercentage),""])
      this.appendix_15_Data.push(["5", "Computation",""])
      data = (this.originalContractPrice / (1 + this.profitPercentage / 100)) * ((this.daysOnCompletion * this.profitPercentage / 100) / this.originalContractDurationvalue)
      this.appendix_15_Data.push(["", "a. Loss of Profit for the Delayed Period as per above formula is", data])
      total = total + Number(data)
    }

    // Dev Note:- OHProFormula_DB2 is "Good Faith Emden- Corrected Emden"
    if (selectedFormula == "Good Faith Emden - Corrected Emden") {
      this.appendix_15_Data.push(["2", "Good Faith has corrected the Emden formula (which is an internationally accepted formula for calculating the additional and reimbursable overhead and profit cost) by excluding Head office Overhead and Profit amounts from the original " + this.contractAs + " Price. The SCL recommended a similar correction; however, Good Faith had found an accounting error in such corrected SCL formula. Thus, Good Faith has corrected such errors and introduced new formula from the Hudson formula (Good Faith Hudson). Therefore, the Good Faith Hudson formula has been used in calculating the loss of profit resulting from the delayed Works.",""])
      this.appendix_15_Data.push(["3", "The formula is:",""])
      this.appendix_15_Data.push(["", "{ " + this.contractAs + " Price / (1 + Profit %) } x { (Delay Period / " + this.contractAs + " Period) x Profit % }",""])
      this.appendix_15_Data.push(["4", "Data:",""])
      this.appendix_15_Data.push(["", "a. " + this.contractAs + " Price: " + this.originalContractPriceType + " " + this.formatNumber(this.originalContractPrice),""])
      this.appendix_15_Data.push(["", "b. " + this.contractAs + " Period: " + this.originalContractDurationvalue + " Days",""])
      this.appendix_15_Data.push(["", "c. Delay Period: " + this.daysOnCompletion + " Days",""])
      this.appendix_15_Data.push(["", "d. Head office Overhead Cost Per Annum: " + this.originalContractPriceType + " " +  this.formatNumber(this.annualHOOverheadCost),""])
      this.appendix_15_Data.push(["", "e. Profit Cost Per Annum: " + this.originalContractPriceType + " " + this.formatNumber(this.annualProfit),""])
      this.appendix_15_Data.push(["", "f. Turnover per Annum: " + this.originalContractPriceType + " " + this.formatNumber(this.annualTurnoverOfCompany),""])
      this.appendix_15_Data.push(["", "g. The Profit % is calculated as below:", ""])
      this.appendix_15_Data.push(["", "g1. Profit % = Profit Amount Per Annum / Turnover Per Annum = " + this.formatNumberInPercent(this.annualProfit / this.annualTurnoverOfCompany * 100),""])
      this.appendix_15_Data.push(["5", "Computation",""])
      data = (this.originalContractPrice / (1 + this.annualProfit / this.annualTurnoverOfCompany )) * (this.daysOnCompletion / this.originalContractDurationvalue) * this.annualProfit / this.annualTurnoverOfCompany
      this.appendix_15_Data.push(["", "a. Loss of Profit for the Delayed Period as per above formula is", data])
      total = total + Number(data)
    }

    // Dev Note:- OHProFormula_DB2 is "Other"
    if (selectedFormula == "Other") {
      this.appendix_15_Data.push(["2", "It is estimated that we lose the profit of " + this.originalContractPriceType + " " + this.formatNumber(LOPpDay) + " per day due to delay in the project. Thus, we have used the following formula in calculating the loss of profit resulting from the delayed Works.",""])
      this.appendix_15_Data.push(["3", "The formula is:",""])
      this.appendix_15_Data.push(["", "Profit per day x Delay Period",""])
      this.appendix_15_Data.push(["4", "Data:",""])
      this.appendix_15_Data.push(["", "a. Profit Amount per day: " + this.originalContractPriceType + " " + this.formatNumber(LOPpDay),""]) // evaluation page se
      this.appendix_15_Data.push(["", "b. Delay Period: " + this.daysOnCompletion + " Days",""])
      this.appendix_15_Data.push(["5", "Computation",""])
      data = Number(LOPpDay) * Number(this.daysOnCompletion)
      this.appendix_15_Data.push(["", "a. Loss of Profit for the Delayed Period as per above formula is", data])
      total = total + Number(data)
    }
    this.sumA[15] = total
    this.appendix_15_Data.push(["", "Loss of Profit for the Delayed Period is", total])
  }

  getCompoundingPeriodFactor(period:string) {
    //calcuate compunding period based on period text such as yearly, daily, weekly etc.,
  var CompoundPeriodFactor:number

  if(period == "Daily") {
    CompoundPeriodFactor = 365
  }
 else  if(period == "Weekly") {
    CompoundPeriodFactor = 365/7
  }
  else if(period == "Monthly") {
    CompoundPeriodFactor = 12
  }
  else if(period == "Quarterly") {
    CompoundPeriodFactor = 4
  }
  else if(period == "Half-yearly") {
    CompoundPeriodFactor = 2
  }
  else if(period == "Yearly") {
    CompoundPeriodFactor = 1
  }
  else 
  {
    CompoundPeriodFactor = 0
  }

  return CompoundPeriodFactor

}

generateAppendix17() {
  this.appendix_17_Data.push(["Item", "Desciption", "Amount"])
  this.appendix_17_Data.push(["1", "The delay in completion of the Works shall impact our earning value at the time of delay. Thus, it shall impact our profit earning at the time of delay.",""])
  this.appendix_17_Data.push(["2", "We shall earn such profit one day. However, such delayed earnings shall result in (i) loss of earnings (at least interest) from such profit and/or (ii) delay in settling our debut with the borrower, which shall result in us paying the financial charges (interest) to them. Thus, we claim such loss and/or expenses as Financial Charges on Delayed Profit.",""])
  this.appendix_17_Data.push(["3", "Good Faith provides the below formula for calculating such loss of earnings (interest on delayed profit) for the delayed period. ",""])
  this.appendix_17_Data.push(["4", "The formula is:",""])
  
  let formula1 = false
  if(this.interestType === "simple" || this.compoundingPeriod === "None" ) {
    formula1 = true
    this.appendix_17_Data.push(["", "( EV Diff x Profit % ) x ( Annual Interest % x  Total Delay Period / 365)",""]) 
  }
  else {
    this.appendix_17_Data.push(["", "{ EV Diff x Profit % } x { ( 1 + Annual Interest % / CP per year ) ^ ( CP per year x Total Delay Period / 365 ) - 1 }",""])
  }
 // this.appendix_17_Data.push(["5", "Profit Percentage",""])

  const selectedFormula = JSON.parse(localStorage.getItem("selectedFormula"));
  let case1=false, case2=false, case3 = false
  let profit;
  if(selectedFormula === "Hudson" || selectedFormula === "Hudson - Corrected by SCL" || selectedFormula === "Good Faith Hudson - Corrected Hudson" || selectedFormula === "Other") {
    case1=true
    profit = this.profitPercentage
  }
  else if (selectedFormula === "Eichleay") {
    case2 = true 

    profit = (this.actualProfit/ this.actualTurnoverOfCompany) * 100
 
  }
  else {
    case3 =  true

    profit = (this.annualProfit/this.annualTurnoverOfCompany)* 100
    
  }

  let currentEvent = JSON.parse(localStorage.getItem("selectedEvent"))
  this.appendix_17_Data.push(["5", "Data:",""])
  let A = currentEvent['pevAtStart']
  let B = currentEvent['aevAtStart']
  let C = currentEvent['pevAtEnd']
  let D = currentEvent['aevAtEnd']
  let F1 = Number(currentEvent['daysOnCompletion'])
  let F2 = Number(currentEvent['extendedContractDuaration'])
  this.appendix_17_Data.push(["", "a. Planned Earned Value at start (A): " + this.originalContractPriceType + " " + this.formatNumber(currentEvent['pevAtStart']),""])
  this.appendix_17_Data.push(["", "b. Actual Earned Value at start (B): " + this.originalContractPriceType + " " + this.formatNumber(currentEvent['aevAtStart']),""])
  this.appendix_17_Data.push(["", "c. Planned Earned Value at end (C): " + this.originalContractPriceType + " " + this.formatNumber(currentEvent['pevAtEnd']),""])
  this.appendix_17_Data.push(["", "d. Actual Earned Value at end (D): " + this.originalContractPriceType + " " + this.formatNumber(currentEvent['aevAtEnd']),""])
  this.appendix_17_Data.push(["", "e. Difference in Earned Value (EV Diff.): " + this.originalContractPriceType + " " + this.formatNumber((C-D-Math.abs(A-B))),""])   // should abs only 
  this.appendix_17_Data.push(["", "f. Total Delay Period: " + (F1 + F2) + " Days",""])
  this.appendix_17_Data.push(["", "g. Annual Interest: " + this.formatNumberInPercent(this.yearlyInterest),""])
  this.appendix_17_Data.push(["", "h. Interest Type: " + this.interestType,""])
  
  if (this.interestType === "simple")
  this.appendix_17_Data.push(["", "i. Compounding Period (CP): " + "Not Applicable",""])
  else {
  this.appendix_17_Data.push(["", "i. Compounding Period (CP): " + this.compoundingPeriod,""])
  }

  if(case1) {
    this.appendix_17_Data.push(["", "j. The Profit Percentage is considered same as Tender Profit % as recommended by Hudson.",""])
    this.appendix_17_Data.push(["", "j1. Thus, the Profit = " + this.formatNumberInPercent(this.profitPercentage),""])

  }
  else if(case2) {
    this.appendix_17_Data.push(["", "j. Profit Amount During Acutal Period of Performance: " + this.originalContractPriceType + " " + this.formatNumber(this.actualProfit),""])
    this.appendix_17_Data.push(["", "k. Turnover During Actual Period of Performance: " + this.originalContractPriceType + " " + this.formatNumber(this.actualTurnoverOfCompany),""])
    this.appendix_17_Data.push(["", "l. The Profit Percentage is considered based on Eichleay formula.",""])
    this.appendix_17_Data.push(["", "l1. Thus, the Profit = Profit Amount During Acutal Period of Performance / Turnover of Claimant During Actual Period of Performance = " + this.formatNumberInPercent(profit),""])
  }
  else if(case3) {
    this.appendix_17_Data.push(["", "j. Profit Amount Per Annum: " + this.originalContractPriceType + " " + this.formatNumber(this.annualProfit),""])
    this.appendix_17_Data.push(["", "k. Turnover per Annum: " + this.originalContractPriceType + " " + this.formatNumber(this.annualTurnoverOfCompany),""])
    this.appendix_17_Data.push(["", "l. The Profit Percentage is considered based on Emden Formula.",""])
    this.appendix_17_Data.push(["", "l1. Thus, the Profit = Profit Amount per annum / Turnover of claimant per annum = " + this.formatNumberInPercent(profit),""])
 
  }
  
  let result;
  let N = this.getCompoundingPeriodFactor(this.compoundingPeriod)
  if(formula1) {
    result = ((C-D-Math.abs(A-B)) * (profit/ 100) * (this.yearlyInterest / 100)) *  (F1 + F2)/365         // abolute is used overperformed or under performed should be deducted
  }
  else {
  let x = Math.pow((1+(this.yearlyInterest/100/N)), (F1 + F2)/365 * N)
  result = ((C-D-Math.abs(A-B)) * profit/100) * (x-1)
  }
  

  this.sumA[17] = result
  
  this.appendix_17_Data.push(["6", "Computation",""])
  this.appendix_17_Data.push(["", "a. Interest on Delayed profit due to delay is ( in " + this.originalContractPriceType + " )", result])
  this.appendix_17_Data.push(["", "Interest on Delayed profit due to delay is ( in " + this.originalContractPriceType + " )",  result])
  
}


  generateAppendix14() {
    let totalcost = 0
    let ProPer = 0

    this.appendix_14_Data.push(["S.No", "Description", "Amount", "Reference"])
    this.appendix_14_Data.push(["I", "COST","",""])
    
    if(this.selectedOptions.includes('Site Preliminaries')) {
    this.appendix_14_Data.push([SM[1], "Project/Site Overheads", "", ""])
    this.appendix_14_Data.push(["1", "Contractual Requirement - Bonds and Insurances", this.sumA[1], "Appendix 1"])
    this.appendix_14_Data.push(["2", "Resources - Manpower", this.sumA[2], "Appendix 2"])
    this.appendix_14_Data.push(["3", "Resources - Equipment", this.sumA[3], "Appendix 3"])
    this.appendix_14_Data.push(["4", "Resources - Utility", this.sumA[4], "Appendix 4"])
    this.appendix_14_Data.push(["5", "Facility - Site Administration", this.sumA[5], "Appendix 5"])
    this.appendix_14_Data.push(["6", "Facility - Transportation", this.sumA[6], "Appendix 6"])
    /*
    let l = 1
    for (let l = 1; l < 7; l++) {
      if (this.sumA[l] ==="") {
      this.sumA[0] = this.sumA[0] + this.sumA[l]
      }
    }*/
    this.sumA[0] = Number(this.sumA[1]) + Number(this.sumA[2])+ Number(this.sumA[3])+ Number(this.sumA[4])+ Number(this.sumA[5])+ Number(this.sumA[6])

    this.appendix_14_Data.push(["","","",""])
    }

    if(this.selectedOptions.includes('Escalation - Material') || this.selectedOptions.includes('Escalation - Labour')) {
      this.appendix_14_Data.push([SM[2], "Escalation","",""])
      R = 0
      if(this.selectedOptions.includes('Escalation - Material')) {
      R = R+1
      this.appendix_14_Data.push([R, "Impact due to change in Material cost", this.sumA[7], "Appendix " + this.AN[7]])
      }
      if(this.selectedOptions.includes('Escalation - Labour')) {
      R = R + 1
      this.appendix_14_Data.push([R, "Impact due to change in Labour cost", this.sumA[8], "Appendix " + this.AN[8]])
      }
      this.appendix_14_Data.push(["","","",""])
    }

    if(this.selectedOptions.includes('Loss of Productivity')) {
    this.appendix_14_Data.push ([SM[3], "Loss of Productivity","",""])
    this.appendix_14_Data.push(["1", "Loss of Productivity due to disruption", this.sumA[9], "Appendix " + this.AN[9]])
    this.appendix_14_Data.push(["","","",""])
    }

    if(this.selectedOptions.includes('De-moblisation') || this.selectedOptions.includes('Re-moblisation')) {
    this.appendix_14_Data.push([SM[4], "Mobilization Cost","",""])
    R = 0
      if(this.selectedOptions.includes('De-moblisation')) {
      R = R+1
      this.appendix_14_Data.push([R, "Demobilization cost", this.sumA[10], "Appendix " + this.AN[10]])
      }
      if(this.selectedOptions.includes('Re-moblisation')) {
      R = R+1
      this.appendix_14_Data.push([R, "Remobilization cost", this.sumA[11], "Appendix " + this.AN[11]])
      } 
    this.appendix_14_Data.push(["","","",""])
    }
    
    if(this.selectedOptions.includes('Head Office Overheads')) {
    this.appendix_14_Data.push([SM[5], "Head office Overheads","",""])
    this.appendix_14_Data.push(["1", "Head office Overheads for the delayed period", this.sumA[12], "Appendix " + this.AN[12]])

    this.appendix_14_Data.push(["","","",""])
    }

    if(this.selectedOptions.includes("Subcontractor's Claims")) {
    this.appendix_14_Data.push([SM[6], "Subcontractor's Claim","",""])
    this.appendix_14_Data.push(["1", "Claim made by the Subcontractors", this.sumA[13], "Appendix " + this.AN[13]])
    this.appendix_14_Data.push(["","","",""])
    }

    
    totalcost = this.sumA[1] + this.sumA[2]+ this.sumA[3]+ this.sumA[4]+ this.sumA[5]+ this.sumA[6]+ this.sumA[7]+ this.sumA[8]+ this.sumA[9]+ this.sumA[10]+ this.sumA[11]+ this.sumA[12]+ this.sumA[13]
    this.appendix_14_Data.push(["", "Total Costs", totalcost, "(A)"])
    this.appendix_14_Data.push(["","","",""])

    this.appendix_14_Data.push(["II", "PROFIT PERCENTAGE","",""])
    const selectedFormula = JSON.parse(localStorage.getItem("selectedFormula"));
    if(selectedFormula === "Hudson" || selectedFormula === "Hudson - Corrected by SCL" || selectedFormula === "Good Faith Hudson - Corrected Hudson" || selectedFormula === "Other") {
      this.appendix_14_Data.push(["", "The Profit Percentage is considered same as Tender Profit % as recommended by Hudson.","",""])
      this.appendix_14_Data.push(["1", "Thus, the Profit = ", this.profitPercentage, "(B)"])
      ProPer = this.profitPercentage
    }
    else if (selectedFormula === "Eichleay") {
      this.appendix_14_Data.push(["", "The Profit Percentage is computed based on Eichleay formula.","",""])
      this.appendix_14_Data.push(["1", "Thus, the Profit  = (Profit Amount During Acutal Period of Performance / Turnover During Actual Period of Performance) %  = " + this.originalContractPriceType + " " + this.formatNumber(this.actualHOOverheadCost) + " / " + this.originalContractPriceType + " " + this.formatNumber(this.actualTurnoverOfCompany) + " x 100 %", (this.actualHOOverheadCost/ this.actualTurnoverOfCompany) * 100, "(B)" ])
      ProPer = (this.actualHOOverheadCost/ this.actualTurnoverOfCompany) * 100
    }
    else {
      this.appendix_14_Data.push(["", "The Profit Percentage is computed based on Emden formula.","",""])
      ProPer = (this.annualHOOverheadCost/this.annualTurnoverOfCompany)* 100
      this.appendix_14_Data.push(["1", "Thus, the Profit  = (Profit Amount per annum / Turnover per annum) % = " + this.originalContractPriceType + " " + this.formatNumber(this.annualHOOverheadCost) + " / " + this.originalContractPriceType + " " + this.formatNumber(this.annualTurnoverOfCompany) + " x 100 %", ProPer, "(B)"])
      
    }
    this.sumA[14] = totalcost * ProPer /100
    this.appendix_14_Data.push(["","","",""])
    this.appendix_14_Data.push(["III", "PROFIT", this.sumA[14], "A*B/100"])
    this.appendix_14_Data.push(["", "The Profit on the cost is", this.sumA[14],""])

  }

  generateSummaryTable() {
    this.summaryTable.push(["S.No", "Description", "Amount", "Reference"])
    
    if(this.selectedOptions.includes('Site Preliminaries')) {
    this.summaryTable.push([SM[1], "Project/Site Overheads", "", ""])
    this.summaryTable.push(["1", "Contractual Requirement - Bonds and Insurances", this.sumA[1], "Appendix 1"])
    this.summaryTable.push(["2", "Resources - Manpower (Staff)", this.sumA[2], "Appendix 2"])
    this.summaryTable.push(["3", "Resources - Equipment", this.sumA[3], "Appendix 3"])
    this.summaryTable.push(["4", "Resources - Utility", this.sumA[4], "Appendix 4"])
    this.summaryTable.push(["5", "Facility - Site Administration", this.sumA[5], "Appendix 5"])
    this.summaryTable.push(["6", "Facility - Transportation", this.sumA[6], "Appendix 6"])
    this.sumA[0] = this.sumA[1] + this.sumA[2]+ this.sumA[3]+ this.sumA[4]+ this.sumA[5]+ this.sumA[6]
    this.summaryTable.push(["", "Subtotal", this.sumA[0], ""])

    }

    if(this.selectedOptions.includes('Escalation - Material') || this.selectedOptions.includes('Escalation - Labour')) {
      this.summaryTable.push([SM[2], "Escalation", "", ""])
      R = 0
      if(this.selectedOptions.includes('Escalation - Material')) {
      R = R+1
      this.summaryTable.push([R, "Impact due to change in Material cost", this.sumA[7], "Appendix " + this.AN[7]])
      }
      if(this.selectedOptions.includes('Escalation - Labour')) {
      R = R + 1
      this.summaryTable.push([R, "Impact due to change in Labour cost", this.sumA[8], "Appendix " + this.AN[8]])
      }
  
    }

    if(this.selectedOptions.includes('Loss of Productivity')) {
    this.summaryTable.push ([SM[3], "Loss of Productivity", "", ""])
    this.summaryTable.push(["1", "Loss of Productivity due to disruption", this.sumA[9], "Appendix " + this.AN[9]])

    }

    if(this.selectedOptions.includes('De-moblisation') || this.selectedOptions.includes('Re-moblisation')) {
    this.summaryTable.push([SM[4], "Mobilisation Cost", "", ""])
    R = 0
      if(this.selectedOptions.includes('De-moblisation')) {
      R = R+1
      this.summaryTable.push([R, "Demobilisation cost", this.sumA[10], "Appendix " + this.AN[10]])
      }
      if(this.selectedOptions.includes('Re-moblisation')) {
      R = R+1
      this.summaryTable.push([R, "Remobilisation cost", this.sumA[11], "Appendix " + this.AN[11]])
      } 
 
    }
    
    if(this.selectedOptions.includes('Head Office Overheads')) {
    this.summaryTable.push([SM[5], "Head office Overhead", "", ""])
    this.summaryTable.push(["1", "Head Office Overhead for the delayed period", this.sumA[12], "Appendix " + this.AN[12]])

  
    }

    if(this.selectedOptions.includes("Subcontractor's Claims")) {
    this.summaryTable.push([SM[6], "Subcontractor's Claim", "", ""])
    this.summaryTable.push(["1", "Claim made by the Subcontractors", this.sumA[13], "Appendix " + this.AN[13]])
  
    }

    if(this.selectedOptions.includes('Profit on Claim') || this.selectedOptions.includes('Loss of Profit')) {
     
    this.summaryTable.push([SM[7], "Profit", "", ""])
    R = 0
      if(this.selectedOptions.includes('Profit on Claim')) {
      R = R+1
      this.summaryTable.push([R, "Profit on the cost claim", this.sumA[14], "Appendix " + this.AN[14]])
      }
      
      if(this.selectedOptions.includes('Loss of Profit')) {
      R = R+1
      this.summaryTable.push([R, "Loss of Profit due to delay in the work", this.sumA[15], "Appendix " + this.AN[15]])
      }

    }

    if(this.selectedOptions.includes('Damages')) {    
    this.summaryTable.push([SM[8], "Other Damages", "", ""])
    this.summaryTable.push(["1", "Other Damages incurred in the business", this.sumA[16], "Appendix " + this.AN[16]])

    }

    if (this.selectedOptions.includes("Financiaal Charge on Delayed Profit") || this.selectedOptions.includes("Financiaal Charge (Interest) on Unsettled Payment")) {
      this.summaryTable.push([SM[9], "Financial Charges", "", ""])
    R = 0
      if(this.selectedOptions.includes('Financiaal Charge on Delayed Profit')) {
      R = R+1
      this.summaryTable.push([R, "Financial Charge on Delayed Profit", this.sumA[17], "Appendix " + this.AN[17]])
      }

      if(this.selectedOptions.includes('Financiaal Charge (Interest) on Unsettled Payment')) {
      R = R+1
      this.summaryTable.push([R, "Financial Charge on Delayed or Unpaid Payment", this.sumA[18], "Appendix " + this.AN[18]])
      }
 
    }
    this.sumA[19] = Number (this.sumA[1]) + Number (this.sumA[2]) + Number (this.sumA[3]) + Number (this.sumA[4]) + Number (this.sumA[5]) + Number (this.sumA[6]) + Number (this.sumA[7]) + Number (this.sumA[8]) + Number (this.sumA[9]) + Number (this.sumA[10]) + Number (this.sumA[11]) + Number (this.sumA[12]) + Number (this.sumA[13]) + Number (this.sumA[14]) + Number (this.sumA[15]) + Number (this.sumA[16]) + Number (this.sumA[17]) + Number (this.sumA[18])
    this.summaryTable.push(["", "Total", this.sumA[19], ""])
    this.AppN = "tF0"
  }

  getSelectedAppendix(i: any) {
    this.reportView = false
    //var selectedAppendix = (<HTMLInputElement>document.getElementById('exampleFormControlSelect1')).value
    let selectedAppendix = i
    if(selectedAppendix === "Cost Summary") {
      this.AppN = "tF0"
      this.cuurentAppendixData = this.summaryTable
      this.currentAppendixHeader = "Cost Summary"
    
    }
  
    if(this.listOfAppendixToBeDisplayed[selectedAppendix] === "Cost - Contractual Requirements" ) {
      this.AppN = "tF1"
      this.cuurentAppendixData = this.appendix_1_Data
      this.currentAppendixHeader = "Appendix 1: " + this.listOfAppendixToBeDisplayed[selectedAppendix]  
    }
    if(this.listOfAppendixToBeDisplayed[selectedAppendix] === "Quantum - Resources, Manpower (Staff)" ) {
      this.AppN = "tF2B"
      this.cuurentAppendixData = this.appendix_2B_Data
      this.currentAppendixHeader = "Appendix 2B: " + this.listOfAppendixToBeDisplayed[selectedAppendix]  
     }
    if(this.listOfAppendixToBeDisplayed[selectedAppendix] === "Cost - Resources, Manpower (Staff)" ) {
      this.AppN = "tF2A"
      this.cuurentAppendixData = this.appendix_2A_Data
      this.currentAppendixHeader = "Appendix 2A: " + this.listOfAppendixToBeDisplayed[selectedAppendix]  
      
    }
    if(this.listOfAppendixToBeDisplayed[selectedAppendix] === "Quantum - Resources, Equipment" ) {
      this.AppN = "tF3B"
      this.cuurentAppendixData = this.appendix_3B_Data
      this.currentAppendixHeader = "Appendix 3B: " + this.listOfAppendixToBeDisplayed[selectedAppendix]  
    }
    if(this.listOfAppendixToBeDisplayed[selectedAppendix] === "Cost - Resources, Equipment" ) {
      this.AppN = "tF3A"
      this.cuurentAppendixData = this.appendix_3A_Data
      this.currentAppendixHeader = "Appendix 3A: " + this.listOfAppendixToBeDisplayed[selectedAppendix]  

    }
    if(this.listOfAppendixToBeDisplayed[selectedAppendix] === "Quantum - Resources, Utility" ) {
      this.AppN = "tF4B"
      this.cuurentAppendixData = this.appendix_4B_Data
      this.currentAppendixHeader = "Appendix 4B: " + this.listOfAppendixToBeDisplayed[selectedAppendix]  
    }
    if(this.listOfAppendixToBeDisplayed[selectedAppendix] === "Cost - Resources, Utility" ) {
      this.AppN = "tF4A"
      this.cuurentAppendixData = this.appendix_4A_Data
      this.currentAppendixHeader = "Appendix 4A: " + this.listOfAppendixToBeDisplayed[selectedAppendix]  
    }
    if(this.listOfAppendixToBeDisplayed[selectedAppendix] === "Cost - Facility, Site Administration" ) {
      this.AppN = "tF5"
      this.cuurentAppendixData = this.appendix_5_Data
      this.currentAppendixHeader = "Appendix 5: " + this.listOfAppendixToBeDisplayed[selectedAppendix]  
    }
    if(this.listOfAppendixToBeDisplayed[selectedAppendix] === "Quantum - Facility, Transporation" ) {
      this.AppN = "tF6B"
      this.cuurentAppendixData = this.appendix_6B_Data
      this.currentAppendixHeader = "Appendix 6B: " + this.listOfAppendixToBeDisplayed[selectedAppendix]  
    }
    if(this.listOfAppendixToBeDisplayed[selectedAppendix] === "Cost - Facility, Transportation" ) {
      this.AppN = "tF6A"
      this.cuurentAppendixData = this.appendix_6A_Data
      this.currentAppendixHeader = "Appendix 6A: " + this.listOfAppendixToBeDisplayed[selectedAppendix]  
    }
    if(this.listOfAppendixToBeDisplayed[selectedAppendix] === "Cost - Escalation, Material" ) {
      this.AppN = "tF7"
      this.cuurentAppendixData = this.appendix_7_Data
      this.currentAppendixHeader = "Appendix " + this.AN[7] + ": " + this.listOfAppendixToBeDisplayed[selectedAppendix]  
    }
    if(this.listOfAppendixToBeDisplayed[selectedAppendix] === "Rate - Escalation, Labour" ) {
      this.AppN = "tF8C"
      this.cuurentAppendixData = this.appendix_8C_Data
      this.currentAppendixHeader = "Appendix " + this.AN[8] + "C: "  + this.listOfAppendixToBeDisplayed[selectedAppendix]  
    }
    if(this.listOfAppendixToBeDisplayed[selectedAppendix] === "Quantum - Escalation, Labour" ) {
      this.AppN = "tF8B"
      this.cuurentAppendixData = this.appendix_8B_Data
      this.currentAppendixHeader = "Appendix " + this.AN[8] + "B: " + this.listOfAppendixToBeDisplayed[selectedAppendix]  
    }
    if(this.listOfAppendixToBeDisplayed[selectedAppendix] === "Cost - Escalation, Labour" ) {
      this.AppN = "tF8A"
      this.cuurentAppendixData = this.appendix_8A_Data
      this.currentAppendixHeader = "Appendix " + this.AN[8] + "A: " + this.listOfAppendixToBeDisplayed[selectedAppendix]  
    }
    if(this.listOfAppendixToBeDisplayed[selectedAppendix] === "Quantum (Max) - Loss of Productivity" ) {
      this.AppN = "tF9C"
      this.cuurentAppendixData = this.appendix_9C_Data
      this.currentAppendixHeader = "Appendix " + this.AN[9] + "C: " + this.listOfAppendixToBeDisplayed[selectedAppendix]  
    }
    if(this.listOfAppendixToBeDisplayed[selectedAppendix] === "Quantum (Impact) - Loss of Productivity" ) {
      this.AppN = "tF9B"
      this.cuurentAppendixData = this.appendix_9B_Data
      this.currentAppendixHeader = "Appendix " + this.AN[9] + "B: " + this.listOfAppendixToBeDisplayed[selectedAppendix]  
    }
    if(this.listOfAppendixToBeDisplayed[selectedAppendix] === "Cost - Loss of Productivity" ) {
      this.AppN = "tF9A"
      this.cuurentAppendixData = this.appendix_9A_Data
      this.currentAppendixHeader = "Appendix " + this.AN[9] + "A: " + this.listOfAppendixToBeDisplayed[selectedAppendix]  
    }
    if(this.listOfAppendixToBeDisplayed[selectedAppendix] === "Cost - Demobilisation" ) {
      this.AppN = "tF10"
      this.cuurentAppendixData = this.appendix_10_Data
      this.currentAppendixHeader = "Appendix " + this.AN[10] + ": " + this.listOfAppendixToBeDisplayed[selectedAppendix]  
    }
    if(this.listOfAppendixToBeDisplayed[selectedAppendix] === "Cost - Remobilisation" ) {
      this.AppN = "tF11"
      this.cuurentAppendixData = this.appendix_11_Data
      this.currentAppendixHeader = "Appendix " + this.AN[11] + ": " + this.listOfAppendixToBeDisplayed[selectedAppendix]  
    }
    if(this.listOfAppendixToBeDisplayed[selectedAppendix] === "Head Office Overheads" ) {
      this.AppN = "tF12"
      this.cuurentAppendixData = this.appendix_12_Data
      this.currentAppendixHeader = "Appendix " + this.AN[12] + ": " + this.listOfAppendixToBeDisplayed[selectedAppendix]  
    }
    if(this.listOfAppendixToBeDisplayed[selectedAppendix] === "Subcontractor's Claims" ) {
      this.AppN = "tF13"
      this.cuurentAppendixData = this.appendix_13_Data
      this.currentAppendixHeader = "Appendix " + this.AN[13] + ": " + this.listOfAppendixToBeDisplayed[selectedAppendix]  
    }
    if(this.listOfAppendixToBeDisplayed[selectedAppendix] === "Profit on the Cost" ) {
      this.AppN = "tF14"
      this.cuurentAppendixData = this.appendix_14_Data
      this.currentAppendixHeader = "Appendix " + this.AN[14] + ": " + this.listOfAppendixToBeDisplayed[selectedAppendix]  
    }
    if(this.listOfAppendixToBeDisplayed[selectedAppendix] === "Loss of Profit" ) {
      this.AppN = "tF15"
      this.cuurentAppendixData = this.appendix_15_Data
      this.currentAppendixHeader = "Appendix " + this.AN[15] + ": " + this.listOfAppendixToBeDisplayed[selectedAppendix]  
    }
    if(this.listOfAppendixToBeDisplayed[selectedAppendix] === "Other Damages" ) {
      this.AppN = "tF16"
      this.cuurentAppendixData = this.appendix_16_Data
      this.currentAppendixHeader = "Appendix " + this.AN[16] + ": " + this.listOfAppendixToBeDisplayed[selectedAppendix]  
    }
    if(this.listOfAppendixToBeDisplayed[selectedAppendix] === "Financial Charge on Delayed Profit" ) {
      this.AppN = "tF17"
      this.cuurentAppendixData = this.appendix_17_Data
      this.currentAppendixHeader = "Appendix " + this.AN[17] + ": " + this.listOfAppendixToBeDisplayed[selectedAppendix]  
    }
    if(this.listOfAppendixToBeDisplayed[selectedAppendix] === "Financial Charge on Delayed/Unsettled Payment" ) {
      this.AppN = "tF18"
      this.cuurentAppendixData = this.appendix_18_Data
      this.currentAppendixHeader = "Appendix " + this.AN[18] + ": " + this.listOfAppendixToBeDisplayed[selectedAppendix]  
    }
  }

  identifySubHeading (row:number, tName:string ){
    //this is identify the empty cell to identify the subheading row in summary table to apply bold format
    if (tName === "tF0") {
      if (row+3 < this.summaryTable.length) {
        var CContent = this.summaryTable[row+2][3]
        if (CContent ==="" || CContent === null) {
        this.SH ="Yes"} else  {this.SH = "No"}   
      }     else  {this.SH = "No"}
    }
    else if (tName === "tF14") {                  //Profit on the Cost
      if (row+3 < this.appendix_14_Data.length) {
        var CContentS = this.appendix_14_Data[row+2][0]
        var CContentL = this.appendix_14_Data[row+2][3]
        if (CContentL ==="" || CContentL === null || CContentS ==="" || CContentS === null) {
        this.SH ="Yes"}

        else  {this.SH = "No"}   
      }     else  {this.SH = "No"}
    }
    else  {this.SH = "No"}
  
    }


  saveAppendix(modelRef: any) {
    this.saveAppendixDataRef = this.modalService.open(modelRef);
  }

  openClaimSelection(modelRef: any) {
    this.openClaimSelectionRef = this.modalService.open(modelRef);
  }

  showAbbreviation(modelRef: any) {
    this.showAbbreviationDataRef = this.modalService.open(modelRef);
  }


  // save appendix
  saveApp() {
    const projectId = JSON.parse(localStorage.getItem("selectedProject"));
    const selectedFormula = JSON.parse(localStorage.getItem("selectedFormula"));
    let claimName = (<HTMLInputElement>document.getElementById('claimName')).value
    let eventID = this.currentEventId
    let options: any = []
    options = this.selectedOptions
    let claims: any = {}
    claims.eventId = eventID
    claims.options = options
    claims.claimName = claimName
    claims.formula = selectedFormula
    claims.data = this.allClaimData
    this.projectService.updateProjectData(projectId, { claims }).subscribe((res) => {
          localStorage.setItem("projectData", JSON.stringify(res.updateProject));
          this.saveAppendixDataRef.close();
    });
  }

  openClaim() {
    
    this.openingtheClaim()
    this.reportView = false
    this.Evaluation = true
    let selectedClaimIndex
 
    selectedClaimIndex = (<HTMLInputElement>document.getElementById("savedClaims")).value
     
    this.sumA = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    console.log(this.savedClaims)
    console.log(this.source, selectedClaimIndex)
    this.claimName = this.savedClaims[selectedClaimIndex]['claimName']
    //for(var i = 0;i<this.savedClaims.length;i++) {
        if(this.source === "options") {             //current data
          this.currentEventId = this.savedClaims[selectedClaimIndex]['eventId']
          localStorage.setItem("selectedOptions", JSON.stringify(this.savedClaims[selectedClaimIndex]['options']));
          localStorage.setItem("selectedFormula",JSON.stringify(this.savedClaims[selectedClaimIndex]['formula']));
          localStorage.setItem("claimName",JSON.stringify(this.claimName));
          const projectId = JSON.parse(localStorage.getItem("selectedProject"));
          this.getProjectData(projectId);       //added by sagaya
          this.projectService
            .getEvents(projectId)
            .subscribe((res) => {
              this.eventList = res['data'];
              this.eventList.forEach(event => {
                if(event['eventID'] === this.currentEventId) {
                  this.startDate = event['startDate']
                  this.endDate = event['endDate']
                  this.daysOnCompletion = event['daysOnCompletion']
                  this.EendDate = this.endDate
                  this.EstartDate = this.startDate
                  this.delayDuration = this.daysOnCompletion
                  localStorage.setItem(
                    "selectedEvent",
                    JSON.stringify(event)
                  );
                 // this.openClaimSelectionRef.close();
                //window.location.reload()
                //this.Evaluation = true
                //this.router.navigate(["dashboard/claim"]);
                this.customNgOnint();
                
                //this.ngOnInit
                 console.log("$$$$$$$$$$$$$$$$$$$$$$$$$")
                }

              })
              
            });
   
        }
        else {
          this.selectedOptions =  this.savedClaims[selectedClaimIndex]['options']
          localStorage.setItem("selectedOptions", JSON.stringify(this.savedClaims[selectedClaimIndex]['options']));

          this.selectedFormula =  this.savedClaims[selectedClaimIndex]['formula']
          localStorage.setItem("selectedFormula",JSON.stringify(this.savedClaims[selectedClaimIndex]['formula']));

          this.currentEventId = this.savedClaims[selectedClaimIndex]['eventId']
          console.log(this.currentEventId, this.selectedFormula, this.selectedOptions)
          const projectId = JSON.parse(localStorage.getItem("selectedProject"));
          this.projectService
            .getEvents(projectId)
            .subscribe((res) => {
              this.eventList = res['data'];
              console.log(this.eventList)
              this.eventList.forEach(event => {
                if(event['eventID'] === this.currentEventId) {
                  this.startDate = event['startDate']
                  this.endDate = event['endDate']
                  this.currentEventDes = event['description']
                  this.daysOnCompletion = event['daysOnCompletion']
                  this.EendDate = this.endDate
                  this.EstartDate = this.startDate
                  this.delayDuration = this.daysOnCompletion
                  localStorage.setItem(
                    "selectedEvent",
                    JSON.stringify(event)
                  );
                }
               })
          
           });
    
          console.log("Hello")
          this.generateAppendixAndMainHeadingsNotations()
          this.listOfAppendixToBeDisplayed = []
          let appendixData: any = []
          appendixData = this.savedClaims[selectedClaimIndex]['data']
          for(var j = 0; j< appendixData.length; j++) {
              //if(appendixData[j]['appendixName'] != "Cost Summary" )
                
              if(appendixData[j]['appendixName'] === "Cost Summary" ) {
                this.summaryTable = appendixData[j]['actualData']
               // this.formatCurrentAppendixNumberCol("tF0")                // format is not needed as formatted data is getting stored
                this.cuurentAppendixData = this.summaryTable
                let index = appendixData[j]['actualData'].length
                this.sumA[19] = appendixData[j]['actualData'][index - 1][2]
              
              }
              if(appendixData[j]['appendixName'] === "Appendix 1" ) {
                this.listOfAppendixToBeDisplayed.push("Cost - Contractual Requirements") //Appendix 1
                this.appendix_1_Data = appendixData[j]['actualData']
               // this.formatCurrentAppendixNumberCol("tF1")
               let index = appendixData[j]['actualData'].length
               this.sumA[1] = appendixData[j]['actualData'][index - 1][5]
              }
              
              if(appendixData[j]['appendixName'] === "Appendix 2A" ) {
                this.listOfAppendixToBeDisplayed.push("Cost - Resources, Manpower (Staff)") //Appendix 2A
                this.appendix_2A_Data = appendixData[j]['actualData']
               //this.formatCurrentAppendixNumberCol("tF2A")
               let index = appendixData[j]['actualData'].length
               this.sumA[2] = appendixData[j]['actualData'][index - 1][6]
              }
              if(appendixData[j]['appendixName'] === "Appendix 2B" ) {
                this.listOfAppendixToBeDisplayed.push("Quantum - Resources, Manpower (Staff)") //Appendix 2B
                this.appendix_2B_Data =  appendixData[j]['actualData']
                //this.formatCurrentAppendixNumberCol("tF2B")
               
              }
              
              if(appendixData[j]['appendixName'] === "Appendix 3A" ) {
                this.listOfAppendixToBeDisplayed.push("Cost - Resources, Equipment") //Appendix 3a
                this.appendix_3A_Data = appendixData[j]['actualData']
                //this.formatCurrentAppendixNumberCol("tF3A")
                let index = appendixData[j]['actualData'].length
                this.sumA[3] = appendixData[j]['actualData'][index - 1][6]
  
              }
              if(appendixData[j]['appendixName'] === "Appendix 3B" ) {
                this.listOfAppendixToBeDisplayed.push("Quantum - Resources, Equipment") //Appendix 3b
                this.appendix_3B_Data = appendixData[j]['actualData']
                //this.formatCurrentAppendixNumberCol("tF3B")
              }
              
              if(appendixData[j]['appendixName'] === "Appendix 4A" ) {
                this.listOfAppendixToBeDisplayed.push("Cost - Resources, Utility") //Appendix 4a
                this.appendix_4A_Data = appendixData[j]['actualData']
                //this.formatCurrentAppendixNumberCol("tF4A")
                let index = appendixData[j]['actualData'].length
                this.sumA[4] = appendixData[j]['actualData'][index - 1][6]
              }
              if(appendixData[j]['appendixName'] === "Appendix 4B" ) {
                this.listOfAppendixToBeDisplayed.push("Quantum - Resources, Utility") //Appendix 4b
                this.appendix_4B_Data = appendixData[j]['actualData']
               // this.formatCurrentAppendixNumberCol("tF4B")
              }
              if(appendixData[j]['appendixName'] === "Appendix 5" ) {
                this.listOfAppendixToBeDisplayed.push("Cost - Facility, Site Administration")  //Appendix 5
                this.appendix_5_Data = appendixData[j]['actualData']
               // this.formatCurrentAppendixNumberCol("tF5")
               let index = appendixData[j]['actualData'].length
               this.sumA[5] = appendixData[j]['actualData'][index - 1][5]
 
              }
              
              if(appendixData[j]['appendixName'] === "Appendix 6A" ) {
                this.listOfAppendixToBeDisplayed.push("Cost - Facility, Transportation") //Appendix 6A
                this.appendix_6A_Data = appendixData[j]['actualData']
               // this.formatCurrentAppendixNumberCol("tF6A")
               let index = appendixData[j]['actualData'].length
               this.sumA[6] = appendixData[j]['actualData'][index - 1][6]
              }
              if(appendixData[j]['appendixName'] === "Appendix 6B" ) {
                this.listOfAppendixToBeDisplayed.push("Quantum - Facility, Transporation") //Appendix 6B
                this.appendix_6B_Data = appendixData[j]['actualData']
                //this.formatCurrentAppendixNumberCol("tF6B")

              }
              if(appendixData[j]['appendixName'] === "Appendix 7" ) {
                this.listOfAppendixToBeDisplayed.push("Cost - Escalation, Material")  //Appendix 7
                this.appendix_7_Data = appendixData[j]['actualData']
               // this.formatCurrentAppendixNumberCol("tF7")
               let index = appendixData[j]['actualData'].length
               this.sumA[7] = appendixData[j]['actualData'][index - 1][8]

              }
              
              if(appendixData[j]['appendixName'] === "Appendix 8A" ) {
                this.listOfAppendixToBeDisplayed.push("Cost - Escalation, Labour") //Appendix 8A
                this.appendix_8A_Data = appendixData[j]['actualData']
                //this.formatCurrentAppendixNumberCol("tF8A")
                let index = appendixData[j]['actualData'].length
                this.sumA[8] = appendixData[j]['actualData'][index - 1][8]
 
              }
              if(appendixData[j]['appendixName'] === "Appendix 8B" ) {
                this.listOfAppendixToBeDisplayed.push("Quantum - Escalation, Labour")  //Appendix 8B
                this.appendix_8B_Data = appendixData[j]['actualData']
               // this.formatCurrentAppendixNumberCol("tF8B")
              }
              if(appendixData[j]['appendixName'] === "Appendix 8C" ) {
                this.listOfAppendixToBeDisplayed.push("Rate - Escalation, Labour")  //Appendix 8C
                this.appendix_8C_Data = appendixData[j]['actualData']
               // this.formatCurrentAppendixNumberCol("tF8C")
              }
              
              if(appendixData[j]['appendixName'] === "Appendix 9A" ) {
                this.listOfAppendixToBeDisplayed.push("Cost - Loss of Productivity")  //Appendix 9A
                this.appendix_9A_Data = appendixData[j]['actualData']
                //this.formatCurrentAppendixNumberCol("tF9A")
                let index = appendixData[j]['actualData'].length
                this.sumA[9] = appendixData[j]['actualData'][index - 1][11]
 
              }
              if(appendixData[j]['appendixName'] === "Appendix 9B" ) {
                this.listOfAppendixToBeDisplayed.push("Quantum (Impact) - Loss of Productivity")  //Appendix 9B
                this.appendix_9B_Data = appendixData[j]['actualData']
                //this.formatCurrentAppendixNumberCol("tF9B")
                
              }
              if(appendixData[j]['appendixName'] === "Appendix 9C" ) {
                this.listOfAppendixToBeDisplayed.push("Quantum (Max) - Loss of Productivity")  //Appendix 9C
                this.appendix_9C_Data = appendixData[j]['actualData']
               // this.formatCurrentAppendixNumberCol("tF9C")
              }
              
              if(appendixData[j]['appendixName'] === "Appendix 10" ) {
                this.listOfAppendixToBeDisplayed.push("Cost - Demobilisation")  //Appendix 10
                this.appendix_10_Data = appendixData[j]['actualData']
                //this.formatCurrentAppendixNumberCol("tF10")
                let index = appendixData[j]['actualData'].length
                this.sumA[10] = appendixData[j]['actualData'][index - 1][6]
 
              }
              if(appendixData[j]['appendixName'] === "Appendix 11" ) {
                this.listOfAppendixToBeDisplayed.push("Cost - Remobilisation")  //Appendix 11
                this.appendix_11_Data = appendixData[j]['actualData']
                //this.formatCurrentAppendixNumberCol("tF11")
                let index = appendixData[j]['actualData'].length
                this.sumA[11] = appendixData[j]['actualData'][index - 1][6]
 
              }
              if(appendixData[j]['appendixName'] === "Appendix 12" ) {
                this.listOfAppendixToBeDisplayed.push("Head Office Overheads") //Appendix 12
                this.appendix_12_Data = appendixData[j]['actualData']
                //this.formatCurrentAppendixNumberCol("tF12")
                let index = appendixData[j]['actualData'].length
                this.sumA[12] = appendixData[j]['actualData'][index - 1][2]
 
              }
              if(appendixData[j]['appendixName'] === "Appendix 13" ) {
                this.listOfAppendixToBeDisplayed.push("Subcontractor's Claims")  //Appendix 13
                this.appendix_13_Data = appendixData[j]['actualData']
               // this.formatCurrentAppendixNumberCol("tF13")
               let index = appendixData[j]['actualData'].length
               this.sumA[13] = appendixData[j]['actualData'][index - 1][2]

              }
              if(appendixData[j]['appendixName'] === "Appendix 14" ) {
                this.listOfAppendixToBeDisplayed.push("Profit on the Cost")  //Appendix 14
                this.appendix_14_Data = appendixData[j]['actualData']
                //this.formatCurrentAppendixNumberCol("tF14")
                let index = appendixData[j]['actualData'].length
                this.sumA[14] = appendixData[j]['actualData'][index - 1][2]
 
              }
              if(appendixData[j]['appendixName'] === "Appendix 15" ) {
                this.listOfAppendixToBeDisplayed.push("Loss of Profit")  //Appendix 15
                this.appendix_15_Data = appendixData[j]['actualData']
                //this.formatCurrentAppendixNumberCol("tF15")
                let index = appendixData[j]['actualData'].length
                this.sumA[15] = appendixData[j]['actualData'][index - 1][2]
 
              }
              if(appendixData[j]['appendixName'] === "Appendix 16" ) {
                this.listOfAppendixToBeDisplayed.push("Other Damages")  //Appendix 16
                this.appendix_16_Data = appendixData[j]['actualData']
                //this.formatCurrentAppendixNumberCol("tF16")
                let index = appendixData[j]['actualData'].length
                this.sumA[16] = appendixData[j]['actualData'][index - 1][3]
 
              }
              if(appendixData[j]['appendixName'] === "Appendix 17" ) {
                this.listOfAppendixToBeDisplayed.push("Financial Charge on Delayed Profit")  //Appendix 17
                this.appendix_17_Data = appendixData[j]['actualData']
                //this.formatCurrentAppendixNumberCol("tF17")
                let index = appendixData[j]['actualData'].length
                this.sumA[17] = appendixData[j]['actualData'][index - 1][2]
 
              }
              if(appendixData[j]['appendixName'] === "Appendix 18" ) {
                this.listOfAppendixToBeDisplayed.push("Financial Charge on Delayed/Unsettled Payment")  //Appendix 18
                this.appendix_18_Data = appendixData[j]['actualData']
                let index = appendixData[j]['actualData'].length
                this.sumA[18] = appendixData[j]['actualData'][index - 1][7]

              }
          }
     
          //this.ngOnInit()
          this.getBasicProjectDataForReviewer()         // this is applicable for the Executer too when open saved claim without any other operation            

          localStorage.setItem(
            "initAppendixData",
            JSON.stringify("false")
          );
          this.openClaimSelectionRef.close();
      }
   // }
    //this.ngOnInit()
    console.log(this.listOfAppendixToBeDisplayed)
  }

  openExportPopUp(modelRef: any) {
    this.openExportOptionsRef = this.modalService.open(modelRef);
  }

  
  onExport(typeOfExport: string) {
    // Create Excel Export workbook & add worksheet
    let workbook = new Excel.Workbook();
    var ws_data: any; 
    let heading: string;
    //this.msgEvaluationExporting()           // not required as it is executing fast and shown success msg
    this.generateReportVariable()  
        // create default style constant
    this.createExcelStyles();
        //export summary table
    workbook = this.exportSummaryTable(workbook)
            //export abbreviation table
    this.tType = "tFAbb"        
    this.totalRow = false
    this.sheetName = "Abb"
    this.dateData= false
    workbook = this.exportAbbreviationTable(workbook, "ABBREVIATION", this.appendix_Abb_Data)

      //export Selected Appendix Table
    for(let i = 0; i< this.listOfAppendixToBeDisplayed.length;i++) {
      if(this.listOfAppendixToBeDisplayed[i] === "Cost - Contractual Requirements" ) {
        heading = "Appendix 1: Cost - Contractual Requirements"
        ws_data = this.appendix_1_Data
        this.totalRow = true
        this.leftAlignCol = 4
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A1-Cost-CR"
        this.tType = "tF1"
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Cost - Resources, Manpower (Staff)" ) {
        var ws_data = this.appendix_2A_Data
        heading = "Appendix 2A: Cost - Resources, Manpower (Staff)"
        this.totalRow = true
        this.leftAlignCol = 4
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A2A-Cost-PA"
        this.tType = "tF2A"
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Quantum - Resources, Manpower (Staff)" ) {
        ws_data = this.appendix_2B_Data
        heading = "Appendix 2B: Quantum - Resources, Manpower (Staff)"
        this.totalRow = false
        this.leftAlignCol = 1
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = true
        this.sheetName = "A2B-Qty-PA"
        this.tType = "tF2B"
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Cost - Resources, Equipment" ) {
        var ws_data = this.appendix_3A_Data
        heading = "Appendix 3A: Cost - Resources, Equipment"
        this.totalRow = true
        this.leftAlignCol = 4
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A3A-Cost-Eq"
        this.tType = "tF2A"
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Quantum - Resources, Equipment" ) {
        var ws_data = this.appendix_3B_Data
        heading = "Appendix 3B: Quantum - Resources, Equipment"
        this.totalRow = false
        this.leftAlignCol = 1
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = true
        this.sheetName = "A3B-Qty-Eq"
        this.tType = "tF2B"
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Cost - Resources, Utility" ) {
        var ws_data = this.appendix_4A_Data
        heading = "Appendix 4A: Cost - Resources, Utility"
        this.totalRow = true
        this.leftAlignCol = 4
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A4A-Cost-Ut"
        this.tType = "tF2A"
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Quantum - Resources, Utility" ) {
        var ws_data = this.appendix_4B_Data
        heading = "Appendix 4B: Quantum - Resources, Utility"
        this.totalRow = false
        this.leftAlignCol = 3
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = true
        this.sheetName = "A4B-Qty-Ut"
        this.tType = "tF4B"
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Cost - Facility, Site Administration" ) {
        var ws_data = this.appendix_5_Data
        heading = "Appendix 5: Cost - Facility, Site Administration"
        this.totalRow = true
        this.leftAlignCol = 4
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A5-Cost-F_SA"
        this.tType = "tF1"
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Cost - Facility, Transportation" ) {
        var ws_data = this.appendix_6A_Data
        heading = "Appendix 6A: Cost - Facility, Transportation"
        this.totalRow = true
        this.leftAlignCol = 4
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A6A-Cost-F_Tra"
        this.tType = "tF2A"
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Quantum - Facility, Transporation" ) {
        var ws_data = this.appendix_6B_Data
        heading = "Appendix 6B: Quantum - Facility, Transporation"
        this.totalRow = false
        this.leftAlignCol = 1
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = true
        this.sheetName = "A6B-Qty-F_Tra"
        this.tType = "tF2B"
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Cost - Escalation, Material" ) {
        var ws_data = this.appendix_7_Data
        heading = "Appendix " + this.AN[7] + ": Cost - Escalation, Material"
        this.totalRow = true
        this.leftAlignCol = 5
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A" + this.AN[7] +"-Cost-Esc(Mat)"
        this.tType = "tF7"
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Cost - Escalation, Labour" ) {
        var ws_data = this.appendix_8A_Data
        heading = "Appendix " + this.AN[8] + "A: Cost - Escalation, Labour"
        this.totalRow = true
        this.leftAlignCol = 4
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A" + this.AN[8] +"A-Cost-Esc(Lab)"
        this.tType = "tF8A"
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Quantum - Escalation, Labour" ) {
        var ws_data = this.appendix_8B_Data
        heading = "Appendix " + this.AN[8] + "B: Quantum - Escalation, Labour"
        this.totalRow = false
        this.leftAlignCol = 3
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = true
        this.sheetName = "A" + this.AN[8] +"B-Qty-Esc(Lab)"
        this.tType = "tF8B"
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Rate - Escalation, Labour" ) {
        var ws_data = this.appendix_8C_Data
        heading = "Appendix " + this.AN[8] + "C: Rate - Escalation, Labour"
        this.totalRow = false
        this.leftAlignCol = 3
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = true
        this.sheetName = "A" + this.AN[8] +"C-Rate-Esc(Lab)"
        this.tType = "tF8C"
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Cost - Loss of Productivity" ) {
        var ws_data = this.appendix_9A_Data
        heading = "Appendix " + this.AN[9] + "A: Cost - Loss of Productivity"
        this.totalRow = true
        this.leftAlignCol = 3
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A" + this.AN[9] +"A-Cost-LOP"
        this.tType = "tF9A"
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Quantum (Impact) - Loss of Productivity" ) {
        var ws_data = this.appendix_9B_Data
        heading = "Appendix " + this.AN[9] + "B: Quantum (Impact) - Loss of Productivity"
        this.totalRow = false
        this.leftAlignCol = 3
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = true
        this.sheetName = "A" + this.AN[9] +"B-Qty(I)-LOP"
        this.tType = "tF9B"
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Quantum (Max) - Loss of Productivity" ) {
        var ws_data = this.appendix_9C_Data
        heading = "Appendix " + this.AN[9] + "C: Quantum (Max) - Loss of Productivity"
        this.totalRow = false
        this.leftAlignCol = 3
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = true
        this.sheetName = "A" + this.AN[9] +"C-Qty(M)-LOP"
        this.tType = "tF9C"
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Cost - Demobilisation" ) {
        var ws_data = this.appendix_10_Data
        heading = "Appendix " + this.AN[10] + ": Cost - Demobilisation"
        this.totalRow = true
        this.leftAlignCol = 5
        this.dateCol1 = 3
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A" + this.AN[10] +"-Cost-DeM"
        this.tType = "tF10"
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Cost - Remobilisation" ) {
        var ws_data = this.appendix_11_Data
        heading = "Appendix " + this.AN[11] + ": Cost - Remobilisation"
        this.totalRow = true
        this.leftAlignCol = 4
        this.dateCol1 = 3
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A" + this.AN[11] +"-Cost-ReM"
        this.tType = "tF10"
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Head Office Overheads" ) {
        var ws_data = this.appendix_12_Data
        heading = "Appendix " + this.AN[12] + ": Head Office Overheads"
        this.totalRow = true
        this.leftAlignCol = 1
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A" + this.AN[12] +"-HOOH"
        this.tType = "tF12"
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Subcontractor's Claims" ) {
        var ws_data = this.appendix_13_Data
        heading = "Appendix " + this.AN[13] + ": Subcontractor's Claims"
        this.totalRow = true
        this.leftAlignCol = 4
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A" + this.AN[13] +"-SC"
        this.tType = "tF12"
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Profit on the Cost" ) {
        var ws_data = this.appendix_14_Data
        heading = "Appendix " + this.AN[14] + ": Profit on the Cost"
        this.totalRow = true
        this.leftAlignCol = 4
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A" + this.AN[14] +"-Profit"
        this.tType = "tF0"
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Loss of Profit" ) {
        var ws_data = this.appendix_15_Data
        heading = "Appendix " + this.AN[15] + ": Loss of Profit"
        this.totalRow = true
        this.leftAlignCol = 4
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A" + this.AN[15] +"-LOPro"
        this.tType = "tF12"
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Other Damages" ) {
        var ws_data = this.appendix_16_Data
        heading = "Appendix " + this.AN[16] + ": Other Damages"
        this.totalRow = true
        this.leftAlignCol = 3
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A" + this.AN[16] +"-Damages"
        this.tType = "tF16"
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Financial Charge on Delayed Profit" ) {
        var ws_data = this.appendix_17_Data
        heading = "Appendix " + this.AN[17] + ": Financial Charge on Delayed Profit"
        this.totalRow = true
        this.leftAlignCol = 4
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A" + this.AN[17] +"-FC-Pro"
        this.tType = "tF12"
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Financial Charge on Delayed/Unsettled Payment" ) {
        var ws_data = this.appendix_18_Data
        heading = "Appendix " + this.AN[18] + ": Financial Charge on Delayed/Unsettled Payment"
        this.totalRow = true
        this.leftAlignCol = 4
        this.dateCol1 = 4
        this.dateCol2 = 5
        this.dateData = false
        this.sheetName = "A" + this.AN[18] +"-FC-Del"
        this.tType = "tF18"
      }
      this.exportAppendixTable(workbook, heading, ws_data)
    }

    // save workbook to disk
    workbook.xlsx.writeBuffer()
    .then(buffer => fileSaver.saveAs(new Blob([buffer]), `Claim Cost Evaluation.xlsx`))
        .catch((err) => {
            console.log("err", err);
        });

    this.msgExportSucessfullEvaluation()    
  }

  createExcelStyles() {
    // this is for creating needed Exceljs styles
    this.crfill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFFFF3CC'}, bgColor: {argb: 'FFFFF3CC'}};
    this.hrfill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FF305496'}, bgColor: {argb: 'FF305496'}};
    this.nfill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFFFFFFF'}, bgColor: {argb: 'FFFFFFFF'}};
    this.rightAlign = {vertical: 'top', horizontal: 'right', wrapText: true, };
    this.leftAlign = {vertical: 'top', horizontal: 'left', wrapText: true, };
    this.wrap = {wrapText: true, vertical: 'top'};
    this.NFormat = {numFmt: '0.00'};
    this.DFormat = {numFmt: 'dd/mm/yyyy'};
    this.cfont = {name: 'Calibri', size: 12, color: {argb: 'FF203764'}};
    this.hfont = {name: "Calibri", size: 12, bold: true, color: {argb: 'FFFFFFFF'}};
    this.bfont = {name: "Calibri", size: 12, bold: true, color: {argb: 'FF203764'}};
    this.curBorder = {top: {style: 'thick',  color: {argb: 'FF305496'}}, left: {style: 'thick',  color: {argb: 'FF305496'}},bottom: {style: 'thick',  color: {argb: 'FF305496'}},right: {style: 'thick',  color: {argb: 'FF305496'}},};
      // border based on cell location
    this.CELCTborder = {left: {style: 'thick', color: {argb: 'FF305496'}},top: {style: 'thick', color: {argb: 'FF305496'}}};
    this.CERCTborder = {right: {style: 'thick', color: {argb: 'FF305496'}},top: {style: 'thick', color: {argb: 'FF305496'}}};
    this.CETborder = {left: {style: 'thin', color: {argb: 'FF305496'}},top: {style: 'thick', color: {argb: 'FF305496'}}};
    this.CELCBborder = {left: {style: 'thick', color: {argb: 'FF305496'}},bottom: {style: 'thick', color: {argb: 'FF305496'}}};
    this.CERCBborder = {right: {style: 'thick', color: {argb: 'FF305496'}},bottom: {style: 'thick', color: {argb: 'FF305496'}}};
    this.CEBborder = {left: {style: 'thin', color: {argb: 'FF305496'}},bottom: {style: 'thick', color: {argb: 'FF305496'}}};
    this.CELborder = {left: {style: 'thick', color: {argb: 'FF305496'}},top: {style: 'thin', color: {argb: 'FF305496'}},right: {style: 'thin', color: {argb: 'FF305496'}}};
    this.CERborder = {right: {style: 'thick', color: {argb: 'FF305496'}},top: {style: 'thin', color: {argb: 'FF305496'}},left: {style: 'thin', color: {argb: 'FF305496'}}};
    this.CEborder = {left: {style: 'thin', color: {argb: 'FF305496'}},top: {style: 'thin', color: {argb: 'FF305496'}},right: {style: 'thin', color: {argb: 'FF305496'}}};
  }

  formatExcelSummaryTable(worksheet: any, tR: number, tc:number){ 
    // this is to format Excel Summary Table

    // general table format
    let tsrn:number = 12;      // table starting row number
    worksheet.eachRow ((row, rowNumber) => {
        // formatting font at row level
      if (rowNumber === 2 || rowNumber ===tsrn) {
      row.font= this.hfont;
      }
      else if  (rowNumber === 4 || rowNumber=== 8) {
        row.font= this.bfont;
      }
      else if  (rowNumber === tR) {
        row.font= this.hfont;
      }
      else {
        row.font= this.cfont;
      }
  
      row.eachCell((cell, colNumber) =>{
        if (rowNumber === 2){
          cell.fill = this.hrfill;
        } 
        else if (rowNumber ===1 || rowNumber===5 || rowNumber===6 || rowNumber===7|| rowNumber===9|| rowNumber===10|| rowNumber==11) {
          cell.fill = this.nfill;
        }
        else if (rowNumber ===4 || rowNumber===8) {
          cell.fill = this.crfill;
        }
        else if (rowNumber === tsrn) {        // formatting table top row
          cell.fill = this.hrfill;
          if (colNumber ===1) {
            cell.border = this.CELCTborder;
          }
          else if (colNumber === tc) {
            cell.border = this.CERCTborder;
          } 
          else {
            cell.border = this.CETborder;
          } 
        }
        else if (rowNumber === tR) {          // formating last row
          cell.fill = this.hrfill;
          if (colNumber ===1) {
            cell.border = this.CELCBborder;
          }
          else if (colNumber === tc) {
            cell.border = this.CERCBborder;
          } 
          else {
            cell.border = this.CEBborder;
          } 
        }
        else if (rowNumber > tsrn) {                              // formatting all data row
          //cell.fill = this.nfill;
          if (colNumber ===1) {
            cell.border = this.CELborder;
          }
          else if (colNumber === tc) {
            cell.border = this.CERborder;
          } 
          else {
            cell.border = this.CEborder;
          } 
        }
            // bold subheadings
        if (rowNumber != tR && colNumber === tc && cell.value === "" ) {
        row.font = this.bfont;
        }    
      })
      //row.commit();
    });
    
    return worksheet
  }
  
  formatExcelAppendixTable(worksheet: any, tR: number, tc:number){ 
    // this is to format Excel Summary Table  such font, filling & border
    // general table format
    let tsrn:number = 8;      // table starting row number

    worksheet.eachRow ((row, rowNumber) => {
        // formatting font at row level
      if (rowNumber === 2) {
        row.font= this.bfont;
        worksheet.mergeCells(rowNumber,1,rowNumber,tc);
      }
      else if  (rowNumber === 4) {
        row.font= this.hfont;
        worksheet.mergeCells(rowNumber,1,rowNumber,tc);
      }
      else if  (rowNumber === tsrn) {
        row.font= this.hfont;
        //row.alignment = this.wrap;
      }
      else if  (rowNumber === tR) {               // format based on cost table or quantum table
        if (this.totalRow===true) {
        row.font= this.hfont;
        }
        else {row.font = this.cfont}
      }
      else {
        row.font= this.cfont;
      }

      // for Abbreviation table
      if (this.tType === "tFAbb" &&  rowNumber === 6) {worksheet.mergeCells(rowNumber,1,rowNumber,tc)};

              //filling at each cell
      row.eachCell((cell, colNumber) =>{
        if (rowNumber === 4){
          cell.fill = this.hrfill;
        } 
        else if (rowNumber ===1 || rowNumber===3 || rowNumber===5 ||rowNumber===6 || rowNumber===7) {
          cell.fill = this.nfill;
        }
        else if (rowNumber ===2 ) {
          cell.fill = this.crfill;
        }
        else if (rowNumber === tsrn) {        // formatting table top row with filling and border
          cell.fill = this.hrfill;
          let ht = Math.ceil((cell.value).length/ cell.width)
          row.height = ht * 20
          if (colNumber ===1) {
            cell.border = this.CELCTborder; 
          }
          else if (colNumber === tc) {
            cell.border = this.CERCTborder;
          } 
          else {
            cell.border = this.CETborder;
          } 
        }
        else if (rowNumber === tR) {          // formating last row
          if (this.totalRow === true) {     // if last row is total row such as summary than
            cell.fill = this.hrfill;
            }           
          
          if (colNumber ===1) {
            cell.border = this.CELCBborder;
          }
          else if (colNumber === tc) {
            cell.border = this.CERCBborder;
          } 
          else {
            cell.border = this.CEBborder;
          } 
        }
        else if (rowNumber > tsrn) {                              // formatting all data row
          //cell.fill = this.nfill;
          if (colNumber ===1) {
            cell.border = this.CELborder;
          }
          else if (colNumber === tc) {
            cell.border = this.CERborder;
          } 
          else {
            cell.border = this.CEborder;
          } 
        }

      })
      //row.commit();
    });
        
      // placing currency value (not for abbreviation table)
    if (this.tType != "tFAbb")  {
    worksheet.getRow(6).getCell(tc).value = 'Currency: ' + this.originalContractPriceType;
    worksheet.getRow(6).getCell(tc).border = this.curBorder;
   
    }
    else {
      worksheet.getColumn(1).alignment = this.leftAlign;
    }
    return worksheet
  }

  formatExcelRowHeight(worksheet: any){
    // this will set the row heiht sbased on the content lenght and widht of column
    worksheet.eachRow ((row, rowNumber) => {
      let cell = row.getCell(2)
      let cv = cell.value
      if (cv === "" || cv === null){
          //no action
      } 
      else {
      let htf = Math.ceil (cv.length/ cell.width)
      row.height = htf * 20
      }
    });
  }

  formatExcelColumns(worksheet: any, tc:number){
    // this is to format the columns such as width, alignment, wrapping, number and date format
    let row = worksheet.getRow(8);

    row.eachCell((cell, colNumber)=>{
      let ht = Math.ceil((cell.value).length/ cell.width) * 20
      if (ht > row.height ) {row.height = ht};

        //formatting based on cost or quantum page
      if (this.dateData === false) {                          // this is for cost tables such as 1,2A,3A etc  
        if (colNumber === 1) {
          worksheet.getColumn(colNumber).width = 6;
          worksheet.getColumn(colNumber).alignment = this.leftAlign;
        }
        else if (colNumber === 2) {
          if (this.tType === "tF0") {
            worksheet.getColumn(colNumber).width = 50;
          }
          else if (colNumber === (tc-1)) {         // this is for Appendix that has only 3 columns such as Appendix A12,13,15,17 
            worksheet.getColumn(colNumber).width = 66;
          }
          else if (this.tType === "tF7" || this.tType === "tF16") {
            worksheet.getColumn(colNumber).width = 15;
          }
          else if (this.tType === "tF8A" || this.tType === "tF8B" || this.tType === "tF8C" || this.tType === "tF9A" || this.tType === "tF9B" || this.tType === "tF9C") {
            worksheet.getColumn(colNumber).width = 25;
          }
          else if (this.tType = "tF2A") {
            worksheet.getColumn(colNumber).width = 25;
          }
          else {
            worksheet.getColumn(colNumber).width = 30;
          }
        worksheet.getColumn(colNumber).alignment = this.leftAlign;
        //worksheet.getColumn(colNumber).alignment = this.wrap;

          }
        else if (colNumber === this.leftAlignCol) {                                   // unit column - generally
          worksheet.getColumn(colNumber).width = 10;
          worksheet.getColumn(colNumber).alignment = this.leftAlign;
          }
        else if (colNumber === tc) {                                              // last column
          worksheet.getColumn(colNumber).width = 17;
          worksheet.getColumn(colNumber).alignment = this.rightAlign
          }    
        else if (colNumber === this.dateCol1||colNumber === this.dateCol2) {                                   // date columns 3, 4 or 5
            worksheet.getColumn(colNumber).width = 13;
            worksheet.getColumn(colNumber).alignment = this.rightAlign
            worksheet.getColumn(colNumber).numFmt = this.DFormat;  
            }
        else {                                   // all other number columns
          worksheet.getColumn(colNumber).width = 13;
          worksheet.getColumn(colNumber).alignment = this.rightAlign;
          worksheet.getColumn(colNumber).numFmt = this.NFormat;
          }
              // correcting wrongly formatted columns based on table type
          if (this.tType === "tFAbb"){
            if (colNumber === 2) {
              worksheet.getColumn(colNumber).width = 30;
            }
            else if (colNumber === 3) {
              worksheet.getColumn(colNumber).width = 55;
              worksheet.getColumn(colNumber).alignment = this.leftAlign;
            }
          }
          else if (this.tType === "tF0"){
            if (colNumber === 3 || colNumber === 4) {
              worksheet.getColumn(colNumber).width = 20;
            }
          }
          else if (this.tType === "tF7"){
            if (colNumber === 3) {
              worksheet.getColumn(colNumber).width = 25;
              worksheet.getColumn(colNumber).alignment = this.leftAlign;
            }
          }
          else if (this.tType === "tF8A"){
            if (colNumber === 3) {
              worksheet.getColumn(colNumber).width = 20;
              worksheet.getColumn(colNumber).alignment = this.leftAlign;
            }
            else if (colNumber === 4) {
              worksheet.getColumn(colNumber).width = 14;
              worksheet.getColumn(colNumber).alignment = this.rightAlign;
            }
            else if (colNumber === 5) {
              worksheet.getColumn(colNumber).width = 10;
              worksheet.getColumn(colNumber).alignment = this.leftAlign;
            }
          }
          else if (this.tType === "tF9A"){
            if (colNumber === 3) {
              worksheet.getColumn(colNumber).width = 20;
              worksheet.getColumn(colNumber).alignment = this.leftAlign;
            }
            else if (colNumber === 4) {
              worksheet.getColumn(colNumber).width = 10;
              worksheet.getColumn(colNumber).alignment = this.leftAlign;
            }
          }
          else if (this.tType === "tF10"){
            if (colNumber === 3) {
              worksheet.getColumn(colNumber).alignment = this.leftAlign;
            }
            else if (colNumber === 4) {
              worksheet.getColumn(colNumber).alignment = this.rightAlign;
            }
            else if (colNumber === 5) {
              worksheet.getColumn(colNumber).alignment = this.leftAlign;
            }

          }
          else if (this.tType === "tF16"){
            if (colNumber === 3) {
              worksheet.getColumn(colNumber).width = 45;
            }
            else if (colNumber === 4) {
              worksheet.getColumn(colNumber).width = 20;
            }
          }
          else if (this.tType === "tF18"){
            if (colNumber === 4 || colNumber === 5) {
              worksheet.getColumn(colNumber).width = 13;
              worksheet.getColumn(colNumber).alignment = this.leftAlign;
            }
            else if (colNumber === 7) {
              worksheet.getColumn(colNumber).width = 25;
              worksheet.getColumn(colNumber).alignment = this.leftAlign;
            }
          }
      }

      else {                                                              // this is for dates table such as 2B, 3B
        if (colNumber === 1) {
          worksheet.getColumn(colNumber).width = 6;
          worksheet.getColumn(colNumber).alignment = this.leftAlign;
        }
        else if (colNumber === 2) {
            worksheet.getColumn(colNumber).width = 30;
            worksheet.getColumn(colNumber).alignment = this.leftAlign;
           // worksheet.getColumn(colNumber).alignment = this.wrap;

          }
        else if (colNumber === this.leftAlignCol) {                                   // unit column - generally
          worksheet.getColumn(colNumber).width = 10;
          worksheet.getColumn(colNumber).alignment = this.leftAlign;
            }
        else if (colNumber === tc) {                                   // last column
          worksheet.getColumn(colNumber).width = 17;
          worksheet.getColumn(colNumber).alignment = this.rightAlign;
          worksheet.getColumn(colNumber).numFmt = this.NFormat;
            }
        else if (colNumber === this.dateCol1||colNumber === this.dateCol2) {                                   // in Date Appendix this is non-date column 3 or 4 if applicable
          worksheet.getColumn(colNumber).width = 13;
          worksheet.getColumn(colNumber).alignment = this.leftAlign;
          }
        else {                                   // other date columns format
          worksheet.getColumn(colNumber).width = 13;
          worksheet.getColumn(colNumber).alignment = this.rightAlign;
          worksheet.getColumn(colNumber).numFmt = this.DFormat;
          }      
     
            // correcting wrongly formatted columns based on table type

            if (this.tType === "tF8B" || this.tType === "tF8C"){
              if (colNumber === 2) {
                worksheet.getColumn(colNumber).width = 22;
              }
              else if (colNumber === 3) {
                worksheet.getColumn(colNumber).width = 20;
              }
            }
            else if (this.tType === "tF9B" || this.tType === "tF9C"){
              if (colNumber === 2) {
                worksheet.getColumn(colNumber).width = 22;
              }
              else if (colNumber === 3) {
                worksheet.getColumn(colNumber).width = 20;
              }
              else if (colNumber === 4) {
                worksheet.getColumn(colNumber).width = 10;
                worksheet.getColumn(colNumber).alignment = this.leftAlign;
              }
            }
        }
      
    });
          // aligning two header rows
    worksheet.getRow(2).getCell(tc).alignment = this.leftAlign;
    worksheet.getRow(4).getCell(tc).alignment = this.leftAlign;
    return worksheet
  }
  

  exportSummaryTable(workbook: any) {
    // this is to export summary table as Excel sheet

    const worksheet = workbook.addWorksheet('Summary Table',
      {properties: {defaultColWidth: 25, defaultRowHeight: 25}},
      {pageSetup: {papersize: 'A4', orientation: 'portrait'}}
      );
      
      // header informtions
    worksheet.getCell('A2').value = 'ANNEXURE B - COST EVALUATION'
    worksheet.getCell('A4').value =  this.claimantAs + ': ' + this.claimantName
    worksheet.getCell('A5').value =  this.defendantAs + ': ' + this.nameOfDefendant
    worksheet.getCell('C5').value =  this.contractAs + ' Ref.: ' + this.contractReference  
    worksheet.getCell('A6').value =  'Project: ' + this.projectName
    worksheet.getCell('C6').value =  'Status: ' + this.status  
    worksheet.getCell('A8').value =  'Subject: Cost due to '+ this.currentEventDes + ' that occurred ' + this.eventPeriodDes 
    worksheet.getCell('A10').value =  'COST SUMMARY'
    worksheet.getCell('D10').value =  'Currency: ' + this.originalContractPriceType
    worksheet.addRow([]);     // blank row
    
      //getting Data
    this.summaryTable.forEach((row) => {
      worksheet.addRow(row);
    })

      // general table format
    const tsrn:number = 12;      // table starting row number'  

      // add formatting
    let tR:number = tsrn - 1 + this.summaryTable.length
    const tc:number = this.summaryTable[0].length
    this.formatExcelSummaryTable (worksheet,tR,tc)
    
      //setting specific additional styles
      // header merging cells
    worksheet.mergeCells('A1', 'D1');
    worksheet.mergeCells('A2', 'D2');
    worksheet.mergeCells('A3', 'D3');
    worksheet.mergeCells('A4', 'D4');
    worksheet.mergeCells('A5', 'B5');
    worksheet.mergeCells('C5', 'D5');
    worksheet.mergeCells('A6', 'B6');
    worksheet.mergeCells('C6', 'D6');
    worksheet.mergeCells('A7', 'D7');
    worksheet.mergeCells('A8', 'D8');
    worksheet.mergeCells('A9', 'D9');
    worksheet.mergeCells('A10', 'B10');
    //worksheet.mergeCells('C10', 'D10');
    worksheet.mergeCells('A11', 'D11');
    
      // setting column width
    worksheet.getColumn('A').width = 10;
    worksheet.getColumn('B').width = 50;
    worksheet.getColumn('C').width = 20;
    worksheet.getColumn('D').width = 20;
    
    worksheet.getColumn('B').alignment = this.wrap;
    
    worksheet.getColumn('A').alignment = this.leftAlign;
    worksheet.getColumn('B').alignment = this.leftAlign;
    worksheet.getColumn('C').alignment = this.rightAlign;
    worksheet.getColumn('D').alignment = this.leftAlign;
    
    worksheet.getColumn('C').numFmt = this.NFormat;

      // setting row heights
    worksheet.getRow(1).height = 7;
    worksheet.getRow(3).height = 7;
    worksheet.getRow(7).height = 7;
    worksheet.getRow(9).height = 7;
    worksheet.getRow(11).height = 7;
    worksheet.getRow(12).height = 20;
 
     //uniq formats
    worksheet.getCell('D10').border = this.curBorder;
    worksheet.getCell('A10').font = this.bfont;
    //worksheet.commit();  
    return workbook
  }

  exportAbbreviationTable(workbook: any, heading: string, dataTable:any) {
    // this is to export Abrreviation Table as Excel sheet

    const worksheet = workbook.addWorksheet(this.sheetName,
      {properties: {defaultColWidth: 20, defaultRowHeight: 25}},
      {pageSetup: {papersize: 'A4', orientation: 'portrait'}}
      );
      
      // header informtions
    worksheet.getCell('A2').value =  'Subject: Cost due to '  + this.currentEventDes + ' that occurred ' + this.eventPeriodDes 
    worksheet.getCell('A4').value = heading
    worksheet.addRow([]);     // blank row
    worksheet.getCell('A6').value =  "The following abbreviations are used in the tables' headings." 
    worksheet.addRow([]);     // blank row
    
      //getting Data
    dataTable.forEach((row) => {
      worksheet.addRow(row);
    })

      // general table format
    let tsrn:number = 8;      // table starting row number'  
    let tR:number = tsrn - 1 + dataTable.length
    let tc:number = dataTable[0].length

      //formatting all Cells in table mainly filling,  border & header wrapping
    this.formatExcelAppendixTable (worksheet,tR,tc)

      // formatting all columns mainly width
    this.formatExcelColumns (worksheet, tc)

      // setting row heights
    worksheet.getRow(1).height = 7;
    worksheet.getRow(3).height = 7;
    worksheet.getRow(5).height = 4;
    worksheet.getRow(7).height = 4;
    worksheet.getRow(9).height = 20;
 
    return workbook
  }

  exportAppendixTable(workbook: any, heading: string, dataTable:any) {
    // this is to export summary table as Excel sheet

    const worksheet = workbook.addWorksheet(this.sheetName,
      {properties: {defaultColWidth: 20, defaultRowHeight: 25}},
      {pageSetup: {papersize: 'A4', orientation: 'portrait'}}
      );
      
      // header informtions
    worksheet.getCell('A2').value =  'Subject: Cost due to ' + this.currentEventDes + ' that occurred ' + this.eventPeriodDes 
    worksheet.getCell('A4').value = heading
    worksheet.addRow([]);     // blank row
    worksheet.addRow([]);     // blank row  // dummy row no. 6 to pace actula cirrency later
    worksheet.addRow([]);     // blank row
    
      //getting Data
    dataTable.forEach((row) => {
      worksheet.addRow(row);
    })

      // general table format
    let tsrn:number = 8;      // table starting row number'  
    let tR:number = tsrn - 1 + dataTable.length
    let tc:number = dataTable[0].length

      //formatting all Cells in table mainly filling,  border & header wrapping
    this.formatExcelAppendixTable (worksheet,tR,tc)

      // formatting all columns mainly width
    this.formatExcelColumns (worksheet, tc)

      // setting row heights
    worksheet.getRow(1).height = 7;
    worksheet.getRow(3).height = 7;
    worksheet.getRow(5).height = 4;
    worksheet.getRow(7).height = 4;
    worksheet.getRow(9).height = 20;
      // setting row height for mainly App 11 & 14 where HOOH involves
    if (tc === 3) {
      this.formatExcelRowHeight (worksheet)
    }
    return workbook
  }

    // printing functions start here
onPrint(orientationType: string) {
    // This printing all Tables - Word Report is separeate function
    // this can print A4Portrait, A4 Landscape and  pre set by ClaimDD some page portrait & some page landsacep based on number of columns

      //emptying existing content
    document.body.innerHTML = "";  

    let heading: string;
    var ws_data: any;
    let POrientationType: string;
    let FootHtClass: string;
    let ColAlignClass: string;
    this.generateReportVariable()         // ensure that all the required variables are develope and formatted
      //Front Cover & abrreviatons
 
    if (orientationType === "Landscape") {
      this.createFrontCoverPTable ("PLSF", "forFCPTable", "Cost Evaluation")        
          //Abbreviation Table
       this.createAbbreviationTableForPrint("PLSOnly", "FooterHtLS")
    }
    else {
      this.createFrontCoverPTable ("PPorF", "forFCPTable", "Cost Evaluation")
          //Abbreviation Table
      this.createAbbreviationTableForPrint("PPor","FooterHtPor")
    }

   

      // for summary table
    ws_data = this.summaryTable
    heading = "Cost Summary"
    this.totalRow = true;
    this.notationRow = false;
          //setting orientation based on user selection    for the Summary Appendix
    if (orientationType === "Landscape") {
      POrientationType = "PLSOnly"         
      FootHtClass = "FooterHtLS"          
      this.createTableForPrintPor (ws_data, POrientationType, FootHtClass, "tF0", heading, this.totalRow)       //fuunction is Portrait but Orientation is LS
    }
    else {
      POrientationType = "PPor"
      FootHtClass = "FooterHtPor"
      this.createTableForPrintPor (ws_data, POrientationType, FootHtClass, "tF0", heading, this.totalRow)
    }
   

       // other appendices - loop all appendices
    for(let i = 0; i< this.listOfAppendixToBeDisplayed.length;i++) {
      if(this.listOfAppendixToBeDisplayed[i] === "Cost - Contractual Requirements" ) {
        heading = "Appendix 1: Cost - Contractual Requirements"
        ws_data = this.appendix_1_Data
        this.totalRow = true
        this.leftAlignCol = 4
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A1-Cost-CR"
        ColAlignClass = "tF1"
        this.notationRow = true;
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Cost - Resources, Manpower (Staff)" ) {
        var ws_data = this.appendix_2A_Data
        heading = "Appendix 2A: Cost - Resources, Manpower (Staff)"
        this.totalRow = true
        this.leftAlignCol = 4
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A2A-Cost-PA"
        ColAlignClass = "tF2A"
        this.notationRow = true
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Quantum - Resources, Manpower (Staff)" ) {
        ws_data = this.appendix_2B_Data
        heading = "Appendix 2B: Quantum - Resources, Manpower (Staff)"
        this.totalRow = false
        this.leftAlignCol = 1
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = true
        this.sheetName = "A2B-Qty-PA"
        ColAlignClass = "tF2B1"
        this.notationRow = false;
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Cost - Resources, Equipment" ) {
        var ws_data = this.appendix_3A_Data
        heading = "Appendix 3A: Cost - Resources, Equipment"
        this.totalRow = true
        this.leftAlignCol = 4
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A3A-Cost-Eq"
        ColAlignClass = "tF2A"
        this.notationRow = true
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Quantum - Resources, Equipment" ) {
        var ws_data = this.appendix_3B_Data
        heading = "Appendix 3B: Quantum - Resources, Equipment"
        this.totalRow = false
        this.leftAlignCol = 1
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = true
        this.sheetName = "A3B-Qty-Eq"
        ColAlignClass = "tF2B1"
        this.notationRow = false;
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Cost - Resources, Utility" ) {
        var ws_data = this.appendix_4A_Data
        heading = "Appendix 4A: Cost - Resources, Utility"
        this.totalRow = true
        this.leftAlignCol = 4
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A4A-Cost-Ut"
        ColAlignClass = "tF2A"
        this.notationRow = true
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Quantum - Resources, Utility" ) {
        var ws_data = this.appendix_4B_Data
        heading = "Appendix 4B: Quantum - Resources, Utility"
        this.totalRow = false
        this.leftAlignCol = 3
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = true
        this.sheetName = "A4B-Qty-Ut"
        ColAlignClass = "tF4B1"
        this.notationRow = false;
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Cost - Facility, Site Administration" ) {
        var ws_data = this.appendix_5_Data
        heading = "Appendix 5: Cost - Facility, Site Administration"
        this.totalRow = true
        this.leftAlignCol = 4
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A5-Cost-F_SA"
        ColAlignClass = "tF1"
        this.notationRow = true
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Cost - Facility, Transportation" ) {
        var ws_data = this.appendix_6A_Data
        heading = "Appendix 6A: Cost - Facility, Transportation"
        this.totalRow = true
        this.leftAlignCol = 4
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A6A-Cost-F_Tra"
        ColAlignClass = "tF2A"
        this.notationRow = true
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Quantum - Facility, Transporation" ) {
        var ws_data = this.appendix_6B_Data
        heading = "Appendix 6B: Quantum - Facility, Transporation"
        this.totalRow = false
        this.leftAlignCol = 1
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = true
        this.sheetName = "A6B-Qty-F_Tra"
        ColAlignClass = "tF2B1"
        this.notationRow = false;
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Cost - Escalation, Material" ) {
        var ws_data = this.appendix_7_Data
        heading = "Appendix " + this.AN[7] + ": Cost - Escalation, Material"
        this.totalRow = true
        this.leftAlignCol = 5
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A" + this.AN[7] +"-Cost-Esc(Mat)"
        ColAlignClass = "tF7"
        this.notationRow = true
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Cost - Escalation, Labour" ) {
        var ws_data = this.appendix_8A_Data
        heading = "Appendix " + this.AN[8] + "A: Cost - Escalation, Labour"
        this.totalRow = true
        this.leftAlignCol = 4
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A" + this.AN[8] +"A-Cost-Esc(Lab)"
        ColAlignClass = "tF8A"
        this.notationRow = true;
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Quantum - Escalation, Labour" ) {
        var ws_data = this.appendix_8B_Data
        heading = "Appendix " + this.AN[8] + "B: Quantum - Escalation, Labour"
        this.totalRow = false
        this.leftAlignCol = 3
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = true
        this.sheetName = "A" + this.AN[8] +"B-Qty-Esc(Lab)"
        ColAlignClass = "tF8B2"
        this.notationRow = false;
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Rate - Escalation, Labour" ) {
        var ws_data = this.appendix_8C_Data
        heading = "Appendix " + this.AN[8] + "C: Rate - Escalation, Labour"
        this.totalRow = false
        this.leftAlignCol = 3
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = true
        this.sheetName = "A" + this.AN[8] +"C-Rate-Esc(Lab)"
        ColAlignClass = "tF8B2"
        this.notationRow = false;
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Cost - Loss of Productivity" ) {
        var ws_data = this.appendix_9A_Data
        heading = "Appendix " + this.AN[9] + "A: Cost - Loss of Productivity"
        this.totalRow = true
        this.leftAlignCol = 3
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A" + this.AN[9] +"A-Cost-LOP"
        ColAlignClass = "tF9A"
        this.notationRow = true
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Quantum (Impact) - Loss of Productivity" ) {
        var ws_data = this.appendix_9B_Data
        heading = "Appendix " + this.AN[9] + "B: Quantum (Impact) - Loss of Productivity"
        this.totalRow = false
        this.leftAlignCol = 3
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = true
        this.sheetName = "A" + this.AN[9] +"B-Qty(I)-LOP"
        ColAlignClass = "tF9B"
        this.notationRow = false
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Quantum (Max) - Loss of Productivity" ) {
        var ws_data = this.appendix_9C_Data
        heading = "Appendix " + this.AN[9] + "C: Quantum (Max) - Loss of Productivity"
        this.totalRow = false
        this.leftAlignCol = 3
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = true
        this.sheetName = "A" + this.AN[9] +"C-Qty(M)-LOP"
        ColAlignClass = "tF9C"
        this.notationRow = false;
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Cost - Demobilisation" ) {
        var ws_data = this.appendix_10_Data
        heading = "Appendix " + this.AN[10] + ": Cost - Demobilisation"
        this.totalRow = true
        this.leftAlignCol = 5
        this.dateCol1 = 3
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A" + this.AN[10] +"-Cost-DeM"
        ColAlignClass = "tF10"
        this.notationRow = true
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Cost - Remobilisation" ) {
        var ws_data = this.appendix_11_Data
        heading = "Appendix " + this.AN[11] + ": Cost - Remobilisation"
        this.totalRow = true
        this.leftAlignCol = 4
        this.dateCol1 = 3
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A" + this.AN[11] +"-Cost-ReM"
        ColAlignClass = "tF10"
        this.notationRow = true
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Head Office Overheads" ) {
        var ws_data = this.appendix_12_Data
        heading = "Appendix " + this.AN[12] + ": Head Office Overheads"
        this.totalRow = true
        this.leftAlignCol = 1
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A" + this.AN[12] +"-HOOH"
        ColAlignClass = "tF12"
        this.notationRow = false;
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Subcontractor's Claims" ) {
        var ws_data = this.appendix_13_Data
        heading = "Appendix " + this.AN[13] + ": Subcontractor's Claims"
        this.totalRow = true
        this.leftAlignCol = 4
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A" + this.AN[13] +"-SC"
        ColAlignClass = "tF12"
        this.notationRow = false;
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Profit on the Cost" ) {
        var ws_data = this.appendix_14_Data
        heading = "Appendix " + this.AN[14] + ": Profit on the Cost"
        this.totalRow = true
        this.leftAlignCol = 4
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A" + this.AN[14] +"-Profit"
        ColAlignClass = "tF14"
        this.notationRow = false;
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Loss of Profit" ) {
        var ws_data = this.appendix_15_Data
        heading = "Appendix " + this.AN[15] + ": Loss of Profit"
        this.totalRow = true
        this.leftAlignCol = 4
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A" + this.AN[15] +"-LOPro"
        ColAlignClass = "tF12"
        this.notationRow = false;
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Other Damages" ) {
        var ws_data = this.appendix_16_Data
        heading = "Appendix " + this.AN[16] + ": Other Damages"
        this.totalRow = true
        this.leftAlignCol = 3
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A" + this.AN[16] +"-Damages"
        ColAlignClass = "tF16"
        this.notationRow = false;
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Financial Charge on Delayed Profit" ) {
        var ws_data = this.appendix_17_Data
        heading = "Appendix " + this.AN[17] + ": Financial Charge on Delayed Profit"
        this.totalRow = true
        this.leftAlignCol = 4
        this.dateCol1 = 1
        this.dateCol2 = 1
        this.dateData = false
        this.sheetName = "A" + this.AN[17] +"-FC-Pro"
        ColAlignClass = "tF12"
        this.notationRow = false;
      }
      else if(this.listOfAppendixToBeDisplayed[i] === "Financial Charge on Delayed/Unsettled Payment" ) {
        var ws_data = this.appendix_18_Data
        heading = "Appendix " + this.AN[18] + ": Financial Charge on Delayed/Unsettled Payment"
        this.totalRow = true
        this.leftAlignCol = 4
        this.dateCol1 = 4
        this.dateCol2 = 5
        this.dateData = false
        this.sheetName = "A" + this.AN[18] +"-FC-Del"
        ColAlignClass = "tF18"
        this.notationRow = true
      }
            // deciding orientation based on user selection for the Appendices
      if (orientationType === "AutoFix") {
                //setting table orientation Portrait or LS based on no of colums
          if ( ws_data[0].length <= 7) {
            POrientationType = "PPor"
            FootHtClass = "FooterHtPor"
            this.createTableForPrintPor (ws_data, POrientationType, FootHtClass, ColAlignClass, heading, this.totalRow) 
          }
          else {
            POrientationType = "PLS"
            FootHtClass = "FooterHtLS"
            this.createTableForPrintLS (ws_data, POrientationType, FootHtClass, ColAlignClass, heading, this.totalRow) 
          } 
      }
      else if (orientationType ==="Landscape") {    
         // POrientationType = "PLSOnly"            /1st implementations
         POrientationType = "PLSOnly"
         FootHtClass = "FooterHtLS"
         // this.createTableForPrintPor (ws_data, POrientationType, FootHtClass, ColAlignClass, heading, this.totalRow) 
         this.createTableForPrintLS (ws_data, POrientationType, FootHtClass, ColAlignClass, heading, this.totalRow) 

        }
      else {                      // this is not implemented
          POrientationType = "PPor"
          FootHtClass = "FooterHtPor"
          this.createTableForPrintPor (ws_data, POrientationType, FootHtClass, ColAlignClass, heading, this.totalRow)           
      }
      
   }          // loop end

  window.print();
  localStorage.setItem(
    "Evaluation",
    JSON.stringify(true)
  );
  location.reload();         // it will reload the original page
  //this.router.navigate(["/User"]);
  }



 createFrontCoverPTable(POriClass:string, ForClass:string, ReportName:string) {
      //Font Cover Page for Printing
       // ceating table of 23r x 6co - refer Xl picture make file

      var table = document.createElement('table');     
 
      if (POriClass==="") {                         // this is applicable for word report
        table.classList.add(ForClass)
      }
      else {table.classList.add(POriClass, ForClass)}
      
        //creaating thead for Header
      var tbody = document.createElement('tbody');
      //tbody.setAttribute ("class", PosClass);
          //Top Row - 1
      var row = document.createElement('tr');
        var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 1;
        var Div = document.createElement('div');
        Div.classList.add ("FCHBorderRow")
        Div.appendChild(document.createTextNode(""));
        cell.appendChild(Div);
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.rowSpan = 22;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        tbody.appendChild(row);
        //space row - 2
      var row = document.createElement('tr');
      var cell = document.createElement('td');
      cell.colSpan = 1;
      cell.appendChild(document.createTextNode(""));
      row.appendChild(cell);
      var cell = document.createElement('td');
        cell.colSpan = 4;
        var Div = document.createElement('div');
        Div.classList.add ("FCSpaceRow")
        Div.appendChild(document.createTextNode(""));
        cell.appendChild(Div);
        row.appendChild(cell);
        tbody.appendChild(row);
        //space row - 3
      var row = document.createElement('tr');
      var cell = document.createElement('td');
      cell.colSpan = 1;
      cell.appendChild(document.createTextNode(""));
      row.appendChild(cell);
      var cell = document.createElement('td');
        cell.colSpan = 4;
        var Div = document.createElement('div');
        Div.classList.add ("FCSpaceRow")
        Div.appendChild(document.createTextNode(""));
        cell.appendChild(Div);
        row.appendChild(cell);
        tbody.appendChild(row);
          //Claimant row - 4
      var row = document.createElement('tr');
        var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 2;
        cell.appendChild(document.createTextNode(this.claimantName));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        tbody.appendChild(row);
          //Claimant row - 5
      var row = document.createElement('tr');
      var cell = document.createElement('td');
      cell.colSpan = 1;
      cell.appendChild(document.createTextNode(""));
      row.appendChild(cell);
      var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 2;
        cell.appendChild(document.createTextNode(("(" + this.claimantAs + ")")));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        tbody.appendChild(row);
        //space row - 6
      var row = document.createElement('tr');
        var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 4;
        var Div = document.createElement('div');
        Div.classList.add ("FCSpaceRow")
        Div.appendChild(document.createTextNode(""));
        cell.appendChild(Div);
        row.appendChild(cell);
        tbody.appendChild(row); 
          //Presents row - 7
      var row = document.createElement('tr');
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 2;
        cell.appendChild(document.createTextNode("presents"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        tbody.appendChild(row);
          //Claim row - 8
      var row = document.createElement('tr');
        var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 2;
        cell.appendChild(document.createTextNode(ReportName));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        tbody.appendChild(row);
          //Appendix row - 9
          var row = document.createElement('tr');
          var cell = document.createElement('td');
          cell.colSpan = 1;
          cell.appendChild(document.createTextNode(""));
          row.appendChild(cell);
          var cell = document.createElement('td');
          cell.colSpan = 1;
          cell.appendChild(document.createTextNode(""));
          row.appendChild(cell);
          var cell = document.createElement('td');
          cell.colSpan = 2;
          cell.appendChild(document.createTextNode("(Appendix A)"));
          row.appendChild(cell);
          var cell = document.createElement('td');
          cell.colSpan = 1;
          cell.appendChild(document.createTextNode(""));
          row.appendChild(cell);
          tbody.appendChild(row);
  
        //for row - 10
      var row = document.createElement('tr');
        var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 2;
        cell.appendChild(document.createTextNode("for"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        tbody.appendChild(row);
          //Subject - 11
      var row = document.createElement('tr');
      var cell = document.createElement('td');
      cell.colSpan = 1;
      cell.appendChild(document.createTextNode(""));
      row.appendChild(cell);
      var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 2;
        cell.appendChild(document.createTextNode(this.currentEventType + ' due to ' + this.currentEventDes));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        tbody.appendChild(row);
          //Subject 2nd row - 12
          var row = document.createElement('tr');
          var cell = document.createElement('td');
          cell.colSpan = 1;
          cell.appendChild(document.createTextNode(""));
          row.appendChild(cell);
          var cell = document.createElement('td');
            cell.colSpan = 1;
            cell.appendChild(document.createTextNode(""));
            row.appendChild(cell);
            var cell = document.createElement('td');
            cell.colSpan = 2;
            cell.appendChild(document.createTextNode('Occurred ' + this.eventPeriodDes));
            row.appendChild(cell);
            var cell = document.createElement('td');
            cell.colSpan = 1;
            cell.appendChild(document.createTextNode(""));
            row.appendChild(cell);
            tbody.appendChild(row);
              //on row - 13
      var row = document.createElement('tr');
      var cell = document.createElement('td');
      cell.colSpan = 1;
      cell.appendChild(document.createTextNode(""));
      row.appendChild(cell);
        var cell = document.createElement('td');
          cell.colSpan = 1;
          cell.appendChild(document.createTextNode(""));
          row.appendChild(cell);
          var cell = document.createElement('td');
          cell.colSpan = 2;
          cell.appendChild(document.createTextNode("on"));
          row.appendChild(cell);
          var cell = document.createElement('td');
          cell.colSpan = 1;
          cell.appendChild(document.createTextNode(""));
          row.appendChild(cell);
          tbody.appendChild(row);
          //Project row - 14
      var row = document.createElement('tr');
      var cell = document.createElement('td');
      cell.colSpan = 1;
      cell.appendChild(document.createTextNode(""));
      row.appendChild(cell);
      var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 2;
        cell.appendChild(document.createTextNode(this.projectName));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        tbody.appendChild(row);
          //of row - 15
      var row = document.createElement('tr');
      var cell = document.createElement('td');
      cell.colSpan = 1;
      cell.appendChild(document.createTextNode(""));
      row.appendChild(cell);
      var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 2;
        cell.appendChild(document.createTextNode("of"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        tbody.appendChild(row);
        //space row - 16
      var row = document.createElement('tr');
      var cell = document.createElement('td');
      cell.colSpan = 1;
      cell.appendChild(document.createTextNode(""));
      row.appendChild(cell);
      var cell = document.createElement('td');
        cell.colSpan = 4;
        var Div = document.createElement('div');
        Div.classList.add ("FCSpaceRow")
        Div.appendChild(document.createTextNode(""));
        cell.appendChild(Div);
        row.appendChild(cell);
        tbody.appendChild(row); 
          //Defendant row - 17
      var row = document.createElement('tr');
      var cell = document.createElement('td');
      cell.colSpan = 1;
      cell.appendChild(document.createTextNode(""));
      row.appendChild(cell);
      var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 2;
        cell.appendChild(document.createTextNode(this.defendentName));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        tbody.appendChild(row);
          //Defendant row - 18
      var row = document.createElement('tr');
      var cell = document.createElement('td');
      cell.colSpan = 1;
      cell.appendChild(document.createTextNode(""));
      row.appendChild(cell);
      var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 2;
        cell.appendChild(document.createTextNode("(" + this.defendantAs + ")"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        tbody.appendChild(row);
        //space row - 19
      var row = document.createElement('tr');
      var cell = document.createElement('td');
      cell.colSpan = 1;
      cell.appendChild(document.createTextNode(""));
      row.appendChild(cell);
      var cell = document.createElement('td');
        cell.colSpan = 4;
        var Div = document.createElement('div');
        Div.classList.add ("FCSpaceRow")
        Div.appendChild(document.createTextNode(""));
        cell.appendChild(Div);
        row.appendChild(cell);
        tbody.appendChild(row); 
        //space row - 20
      var row = document.createElement('tr');
      var cell = document.createElement('td');
      cell.colSpan = 1;
      cell.appendChild(document.createTextNode(""));
      row.appendChild(cell);
      var cell = document.createElement('td');
        cell.colSpan = 4;
        var Div = document.createElement('div');
        Div.classList.add ("FCSpaceRow")
        Div.appendChild(document.createTextNode(""));
        cell.appendChild(Div);
        row.appendChild(cell);
        tbody.appendChild(row); 
          //Ref row - 21
      var row = document.createElement('tr');
      var cell = document.createElement('td');
      cell.colSpan = 1;
      cell.appendChild(document.createTextNode(""));
      row.appendChild(cell);
      var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode("ClaimDD-" + this.currentEventId));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode("Rev. 0  - " +  this.formatDate(new Date())));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        tbody.appendChild(row);
          //Prepared row - 22
      var row = document.createElement('tr');
      var cell = document.createElement('td');
      cell.colSpan = 1;
      cell.appendChild(document.createTextNode(""));
      row.appendChild(cell);
      var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 2;
        cell.appendChild(document.createTextNode("Source: Prepared Using Good Faith's ClaimDD Web App"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
        tbody.appendChild(row);
                  
          //Border row - 23
        var row = document.createElement('tr');
        var cell = document.createElement('td');
        cell.colSpan = 1;
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
          var cell = document.createElement('td');
          cell.colSpan = 5;
          var Div = document.createElement('div');
          Div.classList.add ("FCHBorderRow")
          Div.appendChild(document.createTextNode(""));
          cell.appendChild(Div);
          row.appendChild(cell);
          tbody.appendChild(row);
      table.appendChild(tbody);
  //Div.appendChild(tbody);
  document.body.appendChild(table);
  return Div
  }


  createAbbreviationTableForPrint(POri, TFHtClass) {
    // this is for printing Abbreviation Table
      // repeative header only fir
  let tC = 3;
  var table = document.createElement('table');
  table.classList.add(POri, "forExcelTable", "tFAbb")
 
      //creating thead for Header      - refer to Excel print file
      var thead = document.createElement('thead');
      //creaating Empty Row for Alignment - as 1st colums are merged we can not set width needed
      var row = document.createElement('tr');
      var i = 0;
      for (i = 1; i < tC; i++) {
          var cell = document.createElement('th');
          cell.appendChild(document.createTextNode(""));
          row.appendChild(cell);
        };
  thead.appendChild(row);

      var row = document.createElement('tr');
      var cell = document.createElement('th');
      cell.colSpan = tC;
        var Div = document.createElement('div');
        Div.classList.add ("HeadLogo");
        Div.appendChild(document.createTextNode(this.claimantName));
        cell.appendChild(Div);

        var Div = document.createElement('div');+
        Div.classList.add ("HeadTextRight1");
        Div.appendChild(document.createTextNode(this.defendantAs + ': ' + this.defendentName));
        cell.appendChild(Div);

        var Div = document.createElement('div');
        Div.classList.add ("HeadTextRight2");
        Div.appendChild(document.createTextNode(this.projectName));
        cell.appendChild(Div);
        row.appendChild(cell);
  thead.appendChild(row);

      var row = document.createElement('tr');
      var cell = document.createElement('th');
      cell.colSpan = tC;
      var Div = document.createElement('div');
      Div.classList.add ("HeadTextLeft");
      Div.appendChild(document.createTextNode("COST EVALUATION (ANNEXURE B)"));
      cell.appendChild(Div);

      var Div = document.createElement('div');
      Div.classList.add ("HeadTextRight3");
      Div.appendChild(document.createTextNode("Rev.0 - " +  this.formatDate(new Date())));
      cell.appendChild(Div);
      row.appendChild(cell);
  thead.appendChild(row);

      var row = document.createElement('tr');
      var cell = document.createElement('th');
      cell.colSpan = tC;
      cell.appendChild(document.createTextNode('Event: ' + this.currentEventType + ' due to ' + this.currentEventDes + ' Occurred ' + this.eventPeriodDes));
      row.appendChild(cell);
      thead.appendChild(row);

      var row = document.createElement('tr');
      var cell = document.createElement('th');
      cell.colSpan = tC;
      cell.appendChild(document.createTextNode("ABBREVIATION"));
      row.appendChild(cell);
  thead.appendChild(row);

      var row = document.createElement('tr');
      var cell = document.createElement('th');
      cell.colSpan = tC;
      var Div = document.createElement('div');
      Div.classList.add ("AbbText");
      Div.appendChild(document.createTextNode("The following abbreviation are used in the tables' headings."));
      cell.appendChild(Div);
      row.appendChild(cell);
  thead.appendChild(row);


    //creaating Table Data Header
  var row = document.createElement('tr'); 
        var cell = document.createElement('th');
        cell.appendChild(document.createTextNode("S.No."));
        row.appendChild(cell);
        var cell = document.createElement('th');
        cell.appendChild(document.createTextNode("Abbreviation"));
        row.appendChild(cell);
        var cell = document.createElement('th');
        cell.appendChild(document.createTextNode("Details"));
        row.appendChild(cell);
 
  thead.appendChild(row);
  table.appendChild(thead);
  document.body.appendChild(table);        

  //creaating complete Table Data
  var tbody = document.createElement('tbody');
  var row = document.createElement('tr'); 
    var cell = document.createElement('td');
    cell.appendChild(document.createTextNode("1"));
    row.appendChild(cell);
    var cell = document.createElement('td');
    cell.appendChild(document.createTextNode("[RQT"));
    row.appendChild(cell);
    var cell = document.createElement('td');
    cell.appendChild(document.createTextNode("Refer Quantum Table"));
    row.appendChild(cell);
  tbody.appendChild(row); 

  var row = document.createElement('tr'); 
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("2"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("AM Quantity"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("Average Monthly Quantity"));
        row.appendChild(cell);
  tbody.appendChild(row); 
  var row = document.createElement('tr'); 
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("3"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("Avg. Pro"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("Average Productivity"));
        row.appendChild(cell);
  tbody.appendChild(row); 
  var row = document.createElement('tr'); 
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("4"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("DeMob"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("Demobilisation"));
  row.appendChild(cell);
  tbody.appendChild(row); 
  var row = document.createElement('tr'); 
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("5"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("DWHrs"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("Daily Working Hours as per " + this.contractAs));
  row.appendChild(cell);
  tbody.appendChild(row); 
  var row = document.createElement('tr'); 
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("6"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("EOT"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("Extension of Time"));
  row.appendChild(cell);
  tbody.appendChild(row); 
  var row = document.createElement('tr'); 
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("7"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("FOI"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("Factor of Impact"));
  row.appendChild(cell);
  tbody.appendChild(row); 
  var row = document.createElement('tr'); 
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("8"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("FOI-D"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("Factor of Impact of Days = Delay Days / Impacted Days"));
  row.appendChild(cell);
  tbody.appendChild(row); 
  var row = document.createElement('tr'); 
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("9"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("FOI-M"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("Factor of Impact of Month = Delay Days / 30"));
        row.appendChild(cell);
  tbody.appendChild(row); 
  var row = document.createElement('tr'); 
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("10"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("LOP"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("Loss Of Productivity"));
        row.appendChild(cell);
  tbody.appendChild(row); 
  var row = document.createElement('tr'); 
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("11"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("LOPF"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("Loss of Productivity Factor"));
        row.appendChild(cell);
  tbody.appendChild(row); 
  var row = document.createElement('tr'); 
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("12"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("Max. Prod."));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("Maximum Productivity"));
        row.appendChild(cell);
  tbody.appendChild(row); 
  var row = document.createElement('tr'); 
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("13"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("MP"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("Manpower"));
        row.appendChild(cell);
  tbody.appendChild(row); 
  var row = document.createElement('tr'); 
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("14"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("PA Date"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("Productivity Achieved Date"));
        row.appendChild(cell);
  tbody.appendChild(row); 
  var row = document.createElement('tr'); 
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("15"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("ReMob"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("Remobilisation"));
        row.appendChild(cell);
  tbody.appendChild(row); 
  var row = document.createElement('tr'); 
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("16"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("TI Quantity"));
        row.appendChild(cell);
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode("Total Impacted Quantity"));
        row.appendChild(cell);
  tbody.appendChild(row); 

  table.appendChild(tbody);
  document.body.appendChild(table);

  //footer data
  var tfoot = document.createElement('tfoot');
      //empty footer row
  var row = document.createElement('tr');
  var cell = document.createElement('td');
  cell.colSpan = tC;
  cell.appendChild(document.createTextNode(""));
  row.appendChild(cell);
  tfoot.appendChild(row);
      //footer data row
  var row = document.createElement('tr');
  var cell = document.createElement('td');
  cell.colSpan = tC;
  var Div = document.createElement('div');
  Div.classList.add ( TFHtClass, "FootTextLeft");
  Div.appendChild(document.createTextNode("Prepared Using ClaimDD By"));
  cell.appendChild(Div);
 
  var Div = document.createElement('div');
  Div.classList.add ("FooterHtPor", "FootTextRight");
  Div.appendChild(document.createTextNode("Commented By"));
  cell.appendChild(Div);
  row.appendChild(cell);
  tfoot.appendChild(row);

  table.appendChild(tfoot);
  document.body.appendChild(table);
  return table
}


createTableForPrintPor(tableData, POri, TFHtClass, TCAlignClass, AppName, TotalRow: boolean) {
    // this is for printing portrait table based on orientation and data, orientation and css
  let tC = tableData[0].length;
  let tR = tableData.length;
  var table = document.createElement('table');
  table.classList.add(POri, "forExcelTable", TCAlignClass)
  if (TotalRow) {table.classList.add("forTotalRow")}
  if (this.notationRow) {table.classList.add("forNotationRow")}
 
      //creating thead for Header      - refer to Excel print file
  var thead = document.createElement('thead');
          //creaating Empty Row for Alignment - as 1st colums are merged we can not set width needed
    var row = document.createElement('tr');
    var i = 0;
    for (i = 1; i < tC; i++) {
        var cell = document.createElement('th');
        cell.appendChild(document.createTextNode(""));
        row.appendChild(cell);
      };
  thead.appendChild(row);
    
  var row = document.createElement('tr');
  var cell = document.createElement('th');
  cell.colSpan = tC;
  var Div = document.createElement('div');
  Div.classList.add ("HeadLogo");
  Div.appendChild(document.createTextNode(this.claimantName));
  cell.appendChild(Div);

  var Div = document.createElement('div');
  Div.classList.add ("HeadTextRight1");
  Div.appendChild(document.createTextNode(this.defendantAs + ': ' + this.defendentName));
  cell.appendChild(Div);

  var Div = document.createElement('div');
  Div.classList.add ("HeadTextRight2");
  Div.appendChild(document.createTextNode(this.projectName));
  cell.appendChild(Div);
  row.appendChild(cell);
thead.appendChild(row);

  var row = document.createElement('tr');
  var cell = document.createElement('th');
  cell.colSpan = tC;
  var Div = document.createElement('div');
  Div.classList.add ("HeadTextLeft");
  Div.appendChild(document.createTextNode("COST EVALUATION (ANNEXURE B)"));
  cell.appendChild(Div);

  var Div = document.createElement('div');
  Div.classList.add ("HeadTextRight3");
  Div.appendChild(document.createTextNode("Rev.0 - " +  this.formatDate(new Date())));
  cell.appendChild(Div);
  row.appendChild(cell);
thead.appendChild(row);

    var row = document.createElement('tr');
    var cell = document.createElement('th');
    cell.colSpan = tC;
    cell.appendChild(document.createTextNode('Event: ' + this.currentEventType + ' due to ' + this.currentEventDes + ' Occurred ' + this.eventPeriodDes));
    row.appendChild(cell);
  thead.appendChild(row);

    var row = document.createElement('tr');
    var cell = document.createElement('th');
    cell.colSpan = tC;
    cell.appendChild(document.createTextNode(AppName));
    row.appendChild(cell);
  thead.appendChild(row);

  var row = document.createElement('tr');
  var cell = document.createElement('th');
  cell.colSpan = tC;
  var Div = document.createElement('div');
  Div.classList.add ("Currency");
  Div.appendChild(document.createTextNode("Currency: " + this.originalContractPriceType ));
  cell.appendChild(Div);
  row.appendChild(cell);
thead.appendChild(row);

    //creaating Table Data Header
  var row = document.createElement('tr');
      tableData[0].forEach(function(cellData) {
        var cell = document.createElement('th');
        cell.appendChild(document.createTextNode(cellData));
        row.appendChild(cell);
      });

  thead.appendChild(row);
  table.appendChild(thead);
  document.body.appendChild(table);        

  //creaating complete Table Data
  var tbody = document.createElement('tbody');
  //tbody.classList.add ("forTData", TCAlignClass)
  
            //cuuentAppendixData.slice(1)
    var i = 0;
    for (i = 1; i < tR; i++) {
      var row = document.createElement('tr');
      tableData[i].forEach(function(cellData) {
            //apply sub heading formatting for cost summary table before adding celldata
          if (AppName === "Cost Summary") {
            if (tableData[i].slice(-1) ==="" || tableData[i].slice(-1) === null){
              row.classList.add("forSHRow")
            }
          }
              //adding cell data
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode(cellData));
        row.appendChild(cell);
      });
      tbody.appendChild(row);
    };
 
  table.appendChild(tbody);
  document.body.appendChild(table);

  //footer data
  var tfoot = document.createElement('tfoot');
      //empty footer row
  var row = document.createElement('tr');
  var cell = document.createElement('td');
  cell.colSpan = tC;
  cell.appendChild(document.createTextNode(""));
  row.appendChild(cell);
  tfoot.appendChild(row);
      //footer data row
  var row = document.createElement('tr');
  var cell = document.createElement('td');
  cell.colSpan = tC;
  var Div = document.createElement('div');
  Div.classList.add (TFHtClass, "FootTextLeft");
  Div.appendChild(document.createTextNode("Prepared Using ClaimDD By"));
  cell.appendChild(Div);
 
  var Div = document.createElement('div');
  Div.classList.add (TFHtClass, "FootTextRight");
  Div.appendChild(document.createTextNode("Commented By"));
  cell.appendChild(Div);
  row.appendChild(cell);
  tfoot.appendChild(row);

  table.appendChild(tfoot);
  document.body.appendChild(table);
  return table
}

createTableForPrintLS(tableData, POri, TFHtClass, TCAlignClass, AppName, TotalRow: boolean) {
  // this is for printing Landscape (LS) table based on orientation and data, orientation and css
  // in landscape the table is broken into several table based on available ttable body height adn total data row

let tC = tableData[0].length;
let tR = tableData.length;
var allowedTBodyHt = 330;


var r = 0;
for (r = 1; r< tR; r++) {         // this is for repeat after breaking the table
var tBodyHt = 0                 //setting table body startting ht
      var table = document.createElement('table');
      table.classList.add(POri, "forExcelTable", TCAlignClass)
      if (TotalRow) {table.classList.add("forTotalRow")}                    
      if (this.notationRow && r===1) {table.classList.add("forNotationRow")}            // add only first table of continous if break

      //creating thead for Header      - refer to Excel print file
      var thead = document.createElement('thead');
      //creaating Empty Row for Alignment - as 1st colums are merged we can not set width needed
      var row = document.createElement('tr');
      var i = 0;
      for (i = 1; i < tC+1; i++) {
          var cell = document.createElement('th');
          cell.appendChild(document.createTextNode(""));
          row.appendChild(cell);
        };
  thead.appendChild(row);

      var row = document.createElement('tr');
      var cell = document.createElement('th');
      cell.colSpan = tC;
      var Div = document.createElement('div');
      Div.classList.add ("HeadLogo");
      Div.appendChild(document.createTextNode(this.claimantName));
      cell.appendChild(Div);

      var Div = document.createElement('div');
      Div.classList.add ("HeadTextRight1");
      Div.appendChild(document.createTextNode(this.defendantAs + ': ' + this.defendentName));
      cell.appendChild(Div);

      var Div = document.createElement('div');
      Div.classList.add ("HeadTextRight2");
      Div.appendChild(document.createTextNode(this.projectName));
      cell.appendChild(Div);
      row.appendChild(cell);
  thead.appendChild(row);

      var row = document.createElement('tr');
      var cell = document.createElement('th');
      cell.colSpan = tC;
      var Div = document.createElement('div');
      Div.classList.add ("HeadTextLeft");
      Div.appendChild(document.createTextNode("COST EVALUATION (ANNEXURE B)"));
      cell.appendChild(Div);

      var Div = document.createElement('div');
      Div.classList.add ("HeadTextRight3");
      Div.appendChild(document.createTextNode("Rev.0 - " +  this.formatDate(new Date())));
      cell.appendChild(Div);
      row.appendChild(cell);
  thead.appendChild(row);

      var row = document.createElement('tr');
      var cell = document.createElement('th');
      cell.colSpan = tC;
      cell.appendChild(document.createTextNode('Event: ' + this.currentEventType + ' due to ' + this.currentEventDes + ' Occurred ' + this.eventPeriodDes));
      row.appendChild(cell);
      thead.appendChild(row);

      var row = document.createElement('tr');
      var cell = document.createElement('th');
      cell.colSpan = tC;
      cell.appendChild(document.createTextNode(AppName));
      row.appendChild(cell);
  thead.appendChild(row);

      var row = document.createElement('tr');
      var cell = document.createElement('th');
      cell.colSpan = tC;
      var Div = document.createElement('div');
      Div.classList.add ("Currency");
      Div.appendChild(document.createTextNode("Currency: " + this.originalContractPriceType ));
      cell.appendChild(Div);
      row.appendChild(cell);
  thead.appendChild(row);

        //creaating Table Data Header
        let j1 = 0
        let k1 = 1
      var row = document.createElement('tr');
          for (j1 = 0; j1 < tC; j1++){
          //tableData[0].forEach(function(cellData) {
            var cell = document.createElement('th');
              // cell.appendChild(document.createTextNode(cellData));
              let k1 = tableData[0][j1]
              //var cell = document.createElement('td');
              cell.appendChild(document.createTextNode(k1));
              row.appendChild(cell);
                    //this for calculating column ht to control allowable body hht to priting table ht
                    let tCellHt = 0           // initiating column ht
                    let tPCellHt = 0           
                    tPCellHt = tCellHt
                    console.log(k1, TCAlignClass, j1+1)
                      tCellHt = this.getCellHeight(k1, TCAlignClass, j1+1);
                      if (tPCellHt > tCellHt){tCellHt = tPCellHt};
                      if ((tCellHt/20*15) > 106) {allowedTBodyHt = 300 - tCellHt/20*15 + 106};
                      console.log(tCellHt, allowedTBodyHt) 
          };
  thead.appendChild(row);
  table.appendChild(thead);
  document.body.appendChild(table);        

      //creaating complete Table Data
      var tbody = document.createElement('tbody');
                //cuuentAppendixData.slice(1)
        var i = r;
        for (i = r; i < tR; i++) {
          let tCellHt = 0           // initiating column ht
          let tPCellHt = 0 
          let j = 0                 // initiating col number
          var row = document.createElement('tr');
            for (j = 0; j < tC; j++) {
            let k = tableData[i][j]
            var cell = document.createElement('td');
            cell.appendChild(document.createTextNode(k));
            row.appendChild(cell);
                //this for calculating column ht to control priting table ht
              tPCellHt = tCellHt
              console.log(k, TCAlignClass, j+1)
                tCellHt = this.getCellHeight(k, TCAlignClass, j+1);
                if (tPCellHt > tCellHt){tCellHt = tPCellHt};
                console.log(tCellHt)         
            };

            //cehcking total table height currently to cut (break the loop) the table if need then resume as a separate table
          //tBodyHt = tBodyHt + this.getRowHeight(tableData[i].slice(1,2));             //finding row ht based on description column 2
          tBodyHt = tBodyHt + tCellHt
          console.log(tBodyHt, r)
          if (tBodyHt > allowedTBodyHt) { 
            r= i-1;
            if (TotalRow) {table.classList.remove("forTotalRow")};          // this partial table so total does not come in this table
            break;}                     
          else{
            tbody.appendChild(row);
            r = tR                                  // it will ensure that table not repeating after final row has reached.
          }
        };

  table.appendChild(tbody);
  document.body.appendChild(table);

      //footer data
      var tfoot = document.createElement('tfoot');
          //empty footer row
      var row = document.createElement('tr');
      var cell = document.createElement('td');
      cell.colSpan = tC;
      cell.appendChild(document.createTextNode(""));
      row.appendChild(cell);
      tfoot.appendChild(row);
          //footer data row
      var row = document.createElement('tr');
      var cell = document.createElement('td');
      cell.colSpan = tC;
      var Div = document.createElement('div');
      Div.classList.add (TFHtClass, "FootTextLeft");
      Div.appendChild(document.createTextNode("Prepared Using ClaimDD By"));
      cell.appendChild(Div);

      var Div = document.createElement('div');
      Div.classList.add (TFHtClass, "FootTextRight");
      Div.appendChild(document.createTextNode("Commented By"));
      cell.appendChild(Div);
      row.appendChild(cell);
      tfoot.appendChild(row);

  table.appendChild(tfoot);
  document.body.appendChild(table);
  }                                   // end of main loop -next page table
return table
}



getRowHeight(text) {
  // this get row height based on content text size
  var rHt =0
  const font = "normal 14pt Calibri"
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;
  const {width} = context.measureText(text);
  
  if (width === 0) {          // empty cell
  rHt = 20
  }
  else {  
  rHt = Math.ceil(width / 200) * 20
  }

  return rHt
}

getCellHeight(text, TableID, CIndex) {
  // this get row height based on content text size

  var rHt = 0
  const font = "normal 12pt Calibri"
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;
  const {width} = context.measureText(text)
  
 console.log(text, CIndex, width)
  if (width === 0) {          // empty cell
  rHt = 20
  }
  else {  
      if (CIndex === 1){                      //1st col sno
      rHt = 20
      }
      else{
          if (TableID === "tF0"){
            if (CIndex === 2){                      //desc & 2 col
              rHt = Math.ceil(width / 555) * 20
            }
            else {
              rHt = Math.ceil((width) / 207 ) * 20
            }
          }
          else if (TableID === "tF1"){
            if (CIndex === 2){                      //desc & 2 col
              rHt = Math.ceil(width / 363) * 20
            }
            else if (CIndex === 4){                      //desc & 2 col
              rHt = Math.ceil(width / 106) * 20
            }
            else if (CIndex === 6){                      //desc & 2 col
              rHt = Math.ceil(width / 218) * 20
            }
            else {
              rHt = Math.ceil((width) / 135 ) * 20
            }
          }

          else if (TableID === "tF2A"){
            if (CIndex === 2){                      //desc & 2 col
              rHt = Math.ceil(width / 330) * 20
            }
            else if (CIndex === 4){                      //desc & 2 col
              rHt = Math.ceil(width / 95) * 20
            }
            else if (CIndex === 5){                      //desc & 2 col
              rHt = Math.ceil(width / 95) * 20
            }
            else if (CIndex === 7){                      //desc & 2 col
              rHt = Math.ceil(width / 218) * 20
            }
            else {
              rHt = Math.ceil((width) / 106 ) * 20
            }
          }

          else if (TableID === "tF2B1"){
              if (CIndex === 2){                      //desc & 2 col
                rHt = Math.ceil(width / 194) * 20
              }
              else if (CIndex === (this.EDuration + 3*1)) {         //last col
                rHt = Math.ceil(width / 60) * 20
              }
              else {
                let cal = Math.ceil(((700/this.EDuration)-6) / 9.32) - 1              // it is calcuate possible integers in a column width
                if (cal === 0) { cal = 1}
                rHt = Math.ceil(width / (cal * 9.4) ) * 20

              }
             }
             else if (TableID === "tF4B1"){
              if (CIndex === 2){                      //desc & 2 col
                rHt = Math.ceil(width / 386) * 20
              }
              else if (CIndex === 3){                      //desc & 2 col
                rHt = Math.ceil(width / 106) * 20
              }
              else {
                rHt = Math.ceil((width) / 155 ) * 20
              }
            }
  
            else if (TableID === "tF7"){
              if (CIndex === 2){                      //desc & 2 col
                rHt = Math.ceil(width / 117) * 20
              }
              else if (CIndex === 3){                      //desc & 2 col
                rHt = Math.ceil(width / 184) * 20
              }
              else if (CIndex === 5){                      //desc & 2 col
                rHt = Math.ceil(width / 72) * 20
              }
              else if (CIndex === 9){                      //desc & 2 col
                rHt = Math.ceil(width / 128) * 20
              }
              else {
                rHt = Math.ceil((width) / 114 ) * 20
              }
           }
           else if (TableID === "tF8A"){
            if (CIndex === 2){                      //desc & 2 col
              rHt = Math.ceil(width / 184) * 20
            }
            else if (CIndex === 3){                      //desc & 2 col
              rHt = Math.ceil(width / 150) * 20
            }
            else if (CIndex === 5){                      //desc & 2 col
              rHt = Math.ceil(width / 72) * 20
            }
            else if (CIndex === 9){                      //desc & 2 col
              rHt = Math.ceil(width / 128) * 20
            }
            else {
              rHt = Math.ceil((width) / 100 ) * 20
            }
          }
          else if (TableID === "tF8B2"){
            if (CIndex === 2){                      //desc & 2 col
              rHt = Math.ceil(width / 140) * 20
            }
            else if (CIndex === 3){                      //desc & 2 col
              rHt = Math.ceil(width / 100) * 20
            }
            else if (CIndex === (this.EDuration + 4*1)) {         //last col
              rHt = Math.ceil(width / 87) * 20
            }
            else {
              let cal = Math.ceil(((620/this.EDuration)-6) / 9.32) - 1              // it is calcuate possible integers in a column width
              if (cal === 0) { cal = 1}
              rHt = Math.ceil(width / (cal * 9.4) ) * 20
            }
          }
          else if (TableID === "tF9A"){
            if (CIndex === 2){                      //desc & 2 col
              rHt = Math.ceil(width / 106) * 20
            }
            else if (CIndex === 3){                      //desc & 2 col
              rHt = Math.ceil(width / 106) * 20
            }
            else if (CIndex === 4){                      //desc & 2 col
              rHt = Math.ceil(width / 60) * 20
            }
            else if (CIndex === 12){                      //desc & 2 col
              rHt = Math.ceil(width / 94) * 20
            }
            else {
              rHt = Math.ceil((width) / 78 ) * 20
            }
          }
          else if (TableID === "tF9B"){
            if (CIndex === 2){                      //desc & 2 col
              rHt = Math.ceil(width / 127) * 20
            }
            else if (CIndex === 3){                      //desc & 2 col
              rHt = Math.ceil(width / 100) * 20
            }
            else if (CIndex === 4){                      //desc & 2 col
              rHt = Math.ceil(width / 60) * 20
            }
            else if (CIndex === (this.EDuration + 5*1)) {         //last col
              rHt = Math.ceil(width / 87) * 20
            }
            else {
              let cal = Math.ceil(((570/this.EDuration)-6) / 9.32) - 1              // it is calcuate possible integers in a column width
              if (cal === 0) { cal = 1}
              rHt = Math.ceil(width / (cal * 9.4) ) * 20
            }
          }
          else if (TableID === "tF9C"){
            if (CIndex === 2){                      //desc & 2 col
              rHt = Math.ceil(width / 330) * 20
            }
            else if (CIndex === 3){                      //desc & 2 col
              rHt = Math.ceil(width / 218) * 20
            }
            else if (CIndex === 4){                      //desc & 2 col
              rHt = Math.ceil(width / 106) * 20
            }
            else {
              rHt = Math.ceil((width) / 150 ) * 20
            }
          }
          else if (TableID === "tF10"){
            if (CIndex === 2){                      //desc & 2 col
              rHt = Math.ceil(width / 240) * 20
            }
            else if (CIndex === 3){                      //desc & 2 col
              rHt = Math.ceil(width / 162) * 20
            }
            else if (CIndex === 5){                      //desc & 2 col
              rHt = Math.ceil(width / 106) * 20
            }
            else if (CIndex === 7){                      //desc & 2 col
              rHt = Math.ceil(width / 173) * 20
            }
            else {
              rHt = Math.ceil((width) / 134 ) * 20
            }
          }
          else if (TableID === "tF12"){
            if (CIndex === 2){                      //desc & 2 col
              rHt = Math.ceil(width / 835) * 20
            }
            else {
              rHt = Math.ceil((width) / 135 ) * 20
            }
          }
          else if (TableID === "tF14"){
            if (CIndex === 2){                      //desc & 2 col
              rHt = Math.ceil(width / 555) * 20
            }
            else {
              rHt = Math.ceil((width) / 207 ) * 20
            }
          }
          else if (TableID === "tF16"){
            if (CIndex ===3){                      //desc & 2 col
              rHt = Math.ceil(width / 555) * 20
            }
            else {
              rHt = Math.ceil((width) / 207 ) * 20
            }
          }

          else if (TableID === "tF18"){
            if (CIndex === 2){                      //desc & 2 col
              rHt = Math.ceil(width / 194) * 20
            }
  
            else if (CIndex === 4){                      //desc & 2 col
              rHt = Math.ceil(width / 114) * 20
            }
            else if (CIndex === 5){                      //desc & 2 col
              rHt = Math.ceil(width / 114) * 20
            }
            else if (CIndex === 6){                      //desc & 2 col
              rHt = Math.ceil(width / 74) * 20
            }
 
            else if (CIndex === 8){                      //desc & 2 col
              rHt = Math.ceil(width / 114) * 20
            }
            else {                                      //c3
              rHt = Math.ceil((width) / 165 ) * 20
            }
         }
      }
  }

  return rHt
}



 
pageBreakDiv(pageOriCl) {
  var AppHDiv = document.createElement("div");
  AppHDiv.setAttribute("class", pageOriCl);
  document.body.appendChild(AppHDiv);
  return AppHDiv
}

onPrintWordReport() {
  //this is for printing Word Report

  if (this.reportView === false){
    Swal.fire({
      title: "Report is not yet generated.",
      text: "Please generate the report before printing.",
      icon: "warning",
    })
  }
  else {
      this.generateReportVariable()
      this.reportView = true;

      var PrintTOC = document.getElementById("All");     // getting data from the html report Div
      document.body.innerHTML = "";  
      this.createFrontCoverPTable ("PPorF", "forFCPTable", "Cost Claim Report");
      this.createReportTable ("forReportTable", PrintTOC);
      window.print();
      location.reload();         // it will reload the original page
  }
}

createReportTable(ReportTClass:string, PrintContent) {       
    // this is subfunction of Printing Word Report
  var table = document.createElement('table');
      //creaating thead for Header
  table.classList.add ("PPor", ReportTClass);
  var thead = document.createElement('thead');
  var row = document.createElement('tr');
  var cell = document.createElement('th');
  cell.colSpan = 1;
  cell.rowSpan = 1;
  cell.appendChild(document.createTextNode("Cost Claim Report"));
  row.appendChild(cell);

  var cell = document.createElement('th');
  cell.colSpan = 1;
  cell.appendChild(document.createTextNode(this.claimantName));
  row.appendChild(cell);
  thead.appendChild(row);

  var row = document.createElement('tr');
  var cell = document.createElement('th');
  cell.colSpan = 1;
  cell.rowSpan = 1;
  cell.appendChild(document.createTextNode(this.currentEventType + " due to " + this.currentEventDes));
  row.appendChild(cell);

  var cell = document.createElement('th');
  cell.colSpan = 1;
  cell.appendChild(document.createTextNode(this.projectName));
  row.appendChild(cell);
  thead.appendChild(row);
  table.appendChild(thead);
  document.body.appendChild(table);

      //creating content
  var tbody = document.createElement('tbody');
  var row = document.createElement('tr');
  var cell = document.createElement('td');
  cell.colSpan = 2;
  var Div = document.createElement("div");
  Div.classList.add ("leftContent");
  Div.insertAdjacentElement ("afterbegin", PrintContent)     
  //Div.insertAdjacentHTML ("afterbegin", PrintContent)     
  cell.appendChild(Div);
  row.appendChild(cell);
  tbody.appendChild(row);
  table.appendChild(tbody);
  document.body.appendChild(table);
      
    //footer
  var tfoot = document.createElement('tfoot');
  //tfoot.setAttribute ("class", TFClass);
  var row = document.createElement('tr');
  var cell = document.createElement('td');
  cell.colSpan = 1;
  cell.appendChild(document.createTextNode("ClaimDD: " + this.currentEventId));
  row.appendChild(cell);

  var cell = document.createElement('td');
  cell.colSpan = 1;
  cell.appendChild(document.createTextNode("Rev. 0 - " + this.formatDate(new Date())));
  row.appendChild(cell);

  tfoot.appendChild(row);
  table.appendChild(tfoot);      

  document.body.appendChild(table);
  return table
}

  saveDocumentToFile(doc, fileName) {
    // Create a mime type that will associate the new file with Microsoft Word
    const mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    // Create a Blob object from Packer containing the Document instance and the mimeType
    Packer.toBlob(doc).then((blob) => {
      const docblob = blob.slice(0, blob.size, mimeType)
    saveAs(docblob, fileName) 
    })
  }

  generateReportVariable() {
    //alert (this.regionFormat)
    console.log(this.regionFormat,  this.yearFormat , this.monthFormat, this.dayFormat);

    this.projectName = JSON.parse(localStorage.getItem("SelectedProjectName"));
    let selectedClaimant = JSON.parse(localStorage.getItem("selectedClaimant"));
    
    this.claimantService.getCliamantById(selectedClaimant).subscribe((res) => {
      this.claimantName = res['name']
    })

    let currentEvent = JSON.parse(localStorage.getItem("selectedEvent"))
    if(currentEvent) {
      this.currentEventType =  currentEvent['type']
      this.currentEventDes =  currentEvent['description']
      this.EstartDate =  currentEvent['startDate']
      this.EendDate = currentEvent['endDate']
      this.daysOnCompletion = currentEvent['daysOnCompletion']
      this.delayDuration = currentEvent['daysOnCompletion']
    
    }
    this.costSummary()
    this.selectedOptions = JSON.parse(localStorage.getItem("selectedOptions")); 

    this.selectedFormula = JSON.parse(localStorage.getItem("selectedFormula"));

    this.claimantAss = this.claimantAs + "'s"
   
    if(this.interestType == "simple") {
      this.StmtFreqCompoundInterest = ""
    }
    else {
      this.StmtFreqCompoundInterest = "and the frequency of the compound interest is " + this.compoundingPeriod 
    }

 
    var PStartDate = moment(this.commencementDate);
    let OriginalContractCompletionDate = moment(PStartDate).add(this.originalContractDurationvalue - 1, 'days');
    //this.OCD = this.convertDateType(moment(OriginalContractCompletionDate).format('YYYY-MM-DD'))
    this.OCD = this.formatDate(OriginalContractCompletionDate)
    if (this.reviesdContractDuration === null ||this.reviesdContractDuration === "" || this.reviesdContractDuration === 0) {
      this.contractUpdate = 'There is no amendment made to the ' + this.contractAs + '.'
      this.StatusContract = 'original'
      this.StatusPlan = 'planned'
      this.StatusContractSecurities = "."
      //this.forcastedCompletionDate = this.OCD
    }
    else {
      let revisd_Contract_Compeltion_Date = moment(PStartDate).add(this.reviesdContractDuration - 1, 'days');
      this.rccd = this.convertDateType(moment(revisd_Contract_Compeltion_Date).format('YYYY-MM-DD'))
      this.contractUpdate = 'Pursuant to the latest ' + this.contractAs + ' amendment, the revised ' + this.contractAs + ' completion date is ' + this.rccd + ' and revised ' + this.contractAs + ' Price is ' +  this.originalContractPriceType + ' ' + this.reviesdContractPriceValue
      this.StatusContract = 'revised'
      this.StatusPlan = 're-planned'
      this.StatusContractSecurities = ' and amended the ' + this.contractAs + ' Securities for the revised ' + this.contractAs + ' Duration.'
    }

     if (moment(this.EstartDate) == moment(this.EendDate)){
      this.eventPeriodDes = 'on ' + this.formatDate(this.EstartDate)
      let iP1 = moment(PStartDate).add(this.originalContractDurationvalue + this.extendedContractDuaration - 1, 'days');
      this.impactedPeriodDes = 'on ' + this.formatDate(iP1)
     }
     else {
      this.eventPeriodDes = 'from ' + this.formatDate(this.EstartDate) + ' to ' + this.formatDate(this.EendDate)
      let iP1 = moment(PStartDate).add(this.originalContractDurationvalue + this.extendedContractDuaration - 1, 'days');
      let iP2 = moment(PStartDate).add(this.originalContractDurationvalue + this.extendedContractDuaration + this.daysOnCompletion - 1, 'days');
      this.impactedPeriodDes = 'from ' + this.formatDate(this.formatDate(iP1)) + ' to ' + this.formatDate(this.formatDate(iP2))
    }

    // descripting the event
    let repEvent = 'The ' + this.claimantAs +  ' had asserted and claimed in its Extension of Time (EOT) submission that the ' + this.currentEventDes + ' (Event), which occurred ' + this.eventPeriodDes +  ', (Event) has impacted the Project plan that consequently shall delay (or delays) the ' + this.StatusContract  + ' ' + this.contractAs + ' completion date by ' + this.daysOnCompletion + ' days (Asserted Extension of Time or Asserted EOT).'
    let repEventDis= 'The Project has encountered severe disruption during ' + this.formatDate (this.EstartDate) + ' to ' + this.formatDate (this.EendDate) + '  due to  ' + this.currentEventDes +  ' (Event).'
    let repEventDem= 'The ' + this.claimantAs +  ' has demobilised the staff, labour, and equipment due to the ' + this.currentEventDes + ' ' + this.eventPeriodDes +  ', (Event).'
    let repEventRem= 'The ' + this.claimantAs +  ' has remobilised the staff, labour, and equipment due to the ' + this.currentEventDes + ' ' + this.eventPeriodDes +  ', (Event).'

    let repEventFC = 'The ' + this.defendantAs +  ' has unpaid hereinafter listed payments by the due date (Event) to the ' + this.claimantAs + '.'
    
    let repClaimJustDelay = 'The ' + this.claimantAs +   ' incurs (or shall incur) additional expenses, costs, and damages (Cost) due to the Event. Thus, the ' + this.claimantAs +  ' has asserted and Claims such Cost in this submission (Cost Claim).'
    let repClaimJustDis = 'Irrespective of whether the Event delays the project completion or not, it has impacted the ' + this.claimantAss +   ' plan and labour and material productivity. Consequently, the ' + this.claimantAs +   ' incurs (or shall incur) additional expenses, costs and damages (Cost) due to the Event. Thus, the ' + this.claimantAs +  ' has asserted and claims such Cost in this submission (Cost Claim).'
    let repClaimJustDem = 'The ' + this.claimantAs +   ' incurs (or shall incur) additional expenses, costs, and damages (Cost) due to the Event. Thus, the ' + this.claimantAs +  ' has asserted and claims such Cost in this submission (Cost Claim).'
    let repClaimJustRem = 'The ' + this.claimantAs +   ' incurs (or shall incur) additional expenses, costs, and damages (Cost) due to the Event. Thus, the ' + this.claimantAs +  ' has asserted and claims such Cost in this submission (Cost Claim).'

    let repClaimJustEsc = 'As a result of such delay Event, the ' + this.claimantAs +   ' has executed the Works behind the original ' + this.contractAs + ' Completion Date of ' + this.OCD +   ' , which is ' + this.impactedPeriodDes + '. During this period, the cost of the materials and labour are escalated over the estimated rates considered in the ' + this.contractAs +  '. This incurs additional expenses and costs on the ' + this.claimantAs +   '. Thus, the ' + this.claimantAs +  ' has asserted and claims such Cost in this submission (Cost Claim)'
    let repClaimJustHOOH = 'The ' + this.claimantAss +   ' head office incurs (or shall incur) additional expenses (Overhead) for supporting the Project due to the Event. Thus, the ' + this.claimantAs +  ' has asserted and claims such Head Office Overhead in this submission (Cost Claim).'
    let repClaimJustLOP = 'The ' + this.claimantAss +   ' business lost the profit that could have been earned from the other project, which has not been secured due to delay in this Project as resources are tied up in this Project. Thus, the ' + this.claimantAs +  ' has asserted and claims such Loss of Profit in this submission (Cost Claim).'
    let repClaimJustHOOHLOP  = 'The ' + this.claimantAss +   ' head office incurs (or shall incur) additional expenses (Overhead) for supporting the Project due to the Event, and loss the profit that could have been earned from the other project which has not been secured due to delay in this Project as resources are tied up in this Project. Thus, the ' + this.claimantAs +  ' has asserted and claims such Head Office Overhead and Loss of Profit in this submission (Cost Claim).'
    let repClaimJustSC  = 'The ' + this.claimantAss +   ' subcontractor incurs (or shall incur) additional expenses, cost and damages (Cost) due to the Event that consequently impacted the '  + this.claimantAs +  '. Thus, the ' + this.claimantAs +  ' has asserted and claims such Cost in this submission (Cost Claim).'
    let repClaimJustDamages  = 'The ' + this.claimantAss +   ' business incurs (or shall incur) damages (Cost) due to the Event. Thus, the ' + this.claimantAs +  ' has asserted and claims such Cost in this submission (Cost Claim).'
    let repClaimJustFC  = 'The ' + this.claimantAss +   ' business incurs (or shall incur) financial charges (Cost) due to the Event. Thus, the ' + this.claimantAs +  ' has asserted and claims such Cost in this submission (Cost Claim).'
    let repClaimJustFCDP1  = 'The delay in the completion of the Works shall impact the ' + this.claimantAs +  '  earning value at the time of delay. Thus, it shall impact our profit earning at the time of delay.'
    let repClaimJustFCDP2  = 'The ' + this.claimantAs +  ' shall earn such profit one day. However, such delayed earning shall result (i) loss of earnings (at least interest) from such profit and/or (ii) delay in settling our debut with the borrower that shall result us to paying the financial charges (interest) to them. Thus, the ' + this.claimantAs +  ' claims such loss and/or expenses as a Financial Charges on Delayed Profit in this submission (Cost Claim).'
    
    if (this.currentEventType === 'Delay' || this.currentEventType === 'Delay and Disruption') {
      this.EventDeclaration  = repEvent
      this.claimJustification = repClaimJustDelay      

    }
    else if (this.currentEventType === 'Disruption') {
      this.EventDeclaration  = repEventDis
      this.claimJustification = repClaimJustDis
    }
    else if  (this.currentEventType === 'Demobilisation') {
      this.EventDeclaration  = repEventDem
      this.claimJustification = repClaimJustDem
    }
    else if  (this.currentEventType === 'Remobilisation') {
      this.EventDeclaration  = repEventRem
      this.claimJustification = repClaimJustRem
    }
    else if  (this.currentEventType === 'Escalation') {
      this.EventDeclaration  = repEvent
      this.claimJustification = repClaimJustEsc
    }
    else if (this.currentEventType === 'Head Office Overhead') {
      this.EventDeclaration  = repEvent
      this.claimJustification = repClaimJustHOOH
    }
    else if (this.currentEventType === 'Loss of Profit') {
      this.EventDeclaration  = repEvent
      this.claimJustification = repClaimJustLOP
    }

    else if (this.currentEventType === 'HOOH & Loss of Profit') {
      this.EventDeclaration  = repEvent
      this.claimJustification = repClaimJustHOOHLOP
    }

    else if (this.currentEventType === 'Subcontractor Claims') {
      this.EventDeclaration  = repEvent
      this.claimJustification = repClaimJustSC
    }
    else if (this.currentEventType === 'Other Damages') {
      this.EventDeclaration  = repEvent
      this.claimJustification = repClaimJustDamages
    }
    else if (this.currentEventType === 'Financial Charge') {
      this.EventDeclaration  = repEventFC
      this.claimJustification = repClaimJustFC
    }
    else if (this.currentEventType === 'Financial Charge on Delayed Profit') {
      this.EventDeclaration  = repEvent
      this.claimJustification = repClaimJustFCDP1
      this.claimJustification = repClaimJustFCDP2
    }

    var diff = Math.abs(new Date(this.EendDate).getTime() - new Date(this.EstartDate).getTime());
    this.EDuration = Math.ceil(diff / (1000 * 3600 * 24)) + 1; 
    console.log(this.EDuration)
}



  generateWordDoc(event: any) {

    if (this.reportView === false){
      Swal.fire({
        title: "Report is not yet generated.",
        text: "Please generate the report before exporting.",
        icon: "warning",
      })
    }
    else {

        this.msgReportExporting()
        this.generateReportVariable()
        this.reportView = true;

        let EventImpact: any
        event.preventDefault()
      
          //Title page as a table
            let tGap = 0
            const titlepageTable = new Table({
              rows: [
                new TableRow({
                    children: [
                      new TableCell({
                        width: { size: 1200, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "365F91", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 1,
                        rowSpan:51
                      }),
                      new TableCell({
                        width: { size: 1200, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "365F91", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 1,
                        rowSpan:3
                      }),

                      new TableCell({
                        width: { size: 4305, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "365F91", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 1,
                        rowSpan:3
                      }),
                      
                      new TableCell({
                        width: { size: 4305, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "365F91", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 1,
                        rowSpan:3
                      }),
                      new TableCell({
                        width: { size: 4305, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "365F91", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 1,
                        rowSpan:3
                      }),
                      new TableCell({
                        width: { size: 1200, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "365F91", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 1,
                        rowSpan:3
                      }),
                      new TableCell({
                          width: { size: 1200, type:WidthType.DXA},  
                          children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                          shading: {fill: "ffc000", type: ShadingType.CLEAR, color: "auto"},
                          rowSpan:51
                      }),
                    ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
              new TableRow({
                children: [
                    new TableCell({
                      //width: { size: 1505, type:WidthType.DXA},  
                      children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                      shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                      columnSpan: 1,
                    }),
                    new TableCell({
                      //width: { size: 1505, type:WidthType.DXA},  
                      children: [new Paragraph({text:this.claimantName, style: "ClaimDD_THB"})],
                      shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                      columnSpan: 4,
                    }),
                ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 1,
                      }),
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"("+ this.claimantAs +")", style: "ClaimDD_THNW"})],
                        shading: {fill: "ffc000", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 4,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 1,
                      }),
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"presents", style: "ClaimDD_TCC"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 4,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 1,
                      }),
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"Cost Claim Report", style: "ClaimDD_THB"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 4,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 1,
                      }),
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"(Annexure A)", style: "ClaimDD_TSTA"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 4,
                      }),
                  ],
                }),

                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 1,
                      }),
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"for", style: "ClaimDD_TCC"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 4,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 1,
                      }),
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        //children: [new Paragraph({ text: selectedEvent['type'] + ' due to ' + selectedEvent['description'] + ' - ' + selectedEvent['eventID'], style: "ClaimDD_TC" })],

                        children: [new Paragraph({text: this.currentEventType + ' due to ' + this.currentEventDes, 
                        style: "ClaimDD_TCE" })],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 4,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 1,
                      }),
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        //children: [new Paragraph({ text: selectedEvent['type'] + ' due to ' + selectedEvent['description'] + ' - ' + selectedEvent['eventID'], style: "ClaimDD_TC" })],

                        children: [new Paragraph({ text: 'Occurred ' + this.eventPeriodDes,style: "ClaimDD_TCED" })],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 4,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 1,
                      }),
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"on", style: "ClaimDD_TCC"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 4,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 1,
                      }),
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({ text: this.projectName, style: "ClaimDD_TC" })],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 4,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 1,
                      }),
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"of", style: "ClaimDD_TCC"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 4,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 1,
                      }),
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:this.nameOfDefendant, style: "ClaimDD_THB"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 4,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      //width: { size: 1505, type:WidthType.DXA},  
                      children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                      shading: {fill: "365F91", type: ShadingType.CLEAR, color: "auto"},
                      columnSpan: 1,
                    }),
                    new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"("+ this.defendantAs +")", style: "ClaimDD_THNW"})],
                        shading: {fill: "365F91", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 3,
                      }),
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 1,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),

                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                      }),
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"ClaimDD-" + this.currentEventId, style: "ClaimDD_TR", alignment: AlignmentType.LEFT,})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 1,
                      }),
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"Rev. 0", style: "ClaimDD_TR", alignment: AlignmentType.CENTER,})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 1,
                      }),
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({
                          children: [
                            new TextRun("Date: " + this.formatDate(new Date())),
                            //new SimpleField('DATE  \\@ "d MMMM yyyy"'),
                          ],
                          style: "ClaimDD_TR", alignment: AlignmentType.RIGHT,})],
                          shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                      }),
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TCC"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 1,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TP"})],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 1,
                      }),
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({ text: "Source: Prepared Using Good Faith's ClaimDD Web App", style: "ClaimDD_TP" }),],
                        shading: {fill: "FFFFFF", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 4,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "ffc000", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "ffc000", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),
                new TableRow({
                  children: [
                      new TableCell({
                        //width: { size: 1505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"", style: "ClaimDD_TH1"})],
                        shading: {fill: "ffc000", type: ShadingType.CLEAR, color: "auto"},
                        columnSpan: 5,
                      }),
                  ],
                }),

              ],
              //columnWidths: [850, 850, 4505,4505, 4505, 850,850],
              float: {
                horizontalAnchor: TableAnchorType.PAGE,
                verticalAnchor:TableAnchorType.PAGE,
                //relativeVerticalPosition: RelativeVerticalPosition.BOTTOM,
                overlap:OverlapType.OVERLAP,
              },
              width: {size:132, type:WidthType.PERCENTAGE},
              //width: {size:100, type:WidthType.AUTO},
              margins: {top: convertInchesToTwip(tGap), bottom: convertInchesToTwip(tGap), left: convertInchesToTwip(tGap), right: convertInchesToTwip(tGap),} ,
              //indent: {size:-400, type:WidthType.DXA},          
              alignment: AlignmentType.LEFT,
              borders:TableBorders.NONE,
            })

        
        // Header Table
        const HeaderTable = new Table({
        
          columnWidths: [5505, 4505,],
            rows: [
              new TableRow({
                  children: [
                      new TableCell({
                        width: { size: 5505, type:WidthType.DXA},  
                        children: [new Paragraph({text:"Cost Claim Report", style: "ClaimDD_HOB", alignment: AlignmentType.LEFT,})],
                      }),
                        new TableCell({
                        width: { size: 4505, type:WidthType.DXA},  
                        children: [new Paragraph({text:this.claimantName, style: "ClaimDD_HBB", alignment: AlignmentType.RIGHT,})],

                      }),
                  ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 5505, type:WidthType.DXA},  
                    children: [new Paragraph({text: this.currentEventType + " due to " + this.currentEventDes, style: "ClaimDD_HBB", alignment: AlignmentType.LEFT,})],
                  }),
                    new TableCell({
                    width: { size: 4505, type:WidthType.DXA},  
                    children: [new Paragraph({text:this.projectName, style: "ClaimDD_HOB", alignment: AlignmentType.RIGHT,})],

                  }),
                ],
              }),
    
            ],
            width: {size:101, type:WidthType.PERCENTAGE},
            borders:{top:{style: BorderStyle.NONE},bottom:{style: BorderStyle.SINGLE, size: 35, color: "0F243E",},left:{style: BorderStyle.NONE},right:{style: BorderStyle.NONE},insideHorizontal:{style: BorderStyle.NONE},insideVertical:{style: BorderStyle.NONE}}, 
            alignment: AlignmentType.CENTER,
            
          })

              // Footer Table
        const FooterTable = new Table({
        
          columnWidths: [5505, 4505,],
            rows: [
              new TableRow({
                  children: [
                      new TableCell({
                        width: { size: 4005, type:WidthType.DXA},  
                        
                        children: [new Paragraph({
                          children: [
                            new TextRun("ClaimDD: "),
                            new TextRun(this.currentEventId),
                          ],
                          style: "ClaimDD_HOB", alignment: AlignmentType.LEFT,})],
                      }),
                      new TableCell({
                        width: { size: 3005, type:WidthType.DXA},  
                        
                        children: [new Paragraph({
                          children: [
                            new TextRun("Rev. 0 - "),
                            new TextRun(this.formatDate(new Date())),
                            //new SimpleField('DATE  \\@ "d MMMM yyyy"'),
                          ],
                          style: "ClaimDD_HOB", alignment: AlignmentType.CENTER,})],
                      }),

                      new TableCell({
                        width: { size: 4005, type:WidthType.DXA},  
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            style: "ClaimDD_HBB",
                            children: [
                                new TextRun({
                                children: ["Page: ", PageNumber.CURRENT],
                                }),
                                new TextRun({
                                children: [" of ", PageNumber.TOTAL_PAGES],
                                }),
                            ],
                          }),
                        ],
                      }),
                  ],
              }),
            ],      
            width: {size:101, type:WidthType.PERCENTAGE},
            alignment: AlignmentType.CENTER,
            borders:{top:{style: BorderStyle.THICK, size: 35, color:"0F243E",},bottom:{style: BorderStyle.NONE},left:{style: BorderStyle.NONE},right:{style: BorderStyle.NONE},insideHorizontal:{style: BorderStyle.NONE},insideVertical:{style: BorderStyle.NONE}}, 
          })


        // anexure table
        let mGap = 0.02
        const annexuresTable = new Table({
        
        columnWidths: [3505, 4505, 3505,],
          rows: [
            new TableRow({
                children: [
                    new TableCell({
                      width: { size: 3505, type:WidthType.DXA},  
                      children: [new Paragraph({text:"ANNEXURE", style: "ClaimDD_TH1"})],
                      shading: {fill: "365F91", type: ShadingType.CLEAR, color: "auto"},
                    }),
                    new TableCell({
                      width: { size: 3505, type:WidthType.DXA},  
                      children: [new Paragraph({text:"DESCRIPTION", style: "ClaimDD_TH1"})],
                      shading: {fill: "365F91", type: ShadingType.CLEAR, color: "auto"},
                    }),
                      new TableCell({
                      width: { size: 3505, type:WidthType.DXA},  
                      children: [new Paragraph({text:"REMARKS", style: "ClaimDD_TH1"})],
                      shading: {fill: "365F91", type: ShadingType.CLEAR, color: "auto"},
                    }),
                ],
            }),
            new TableRow({
              children: [
                  new TableCell({
                    children: [new Paragraph({text:"Annexure B", style: "ClaimDD_TP1"})],
                  }),
                  new TableCell({
                    children: [new Paragraph({text:"Cost Evaluation", style: "ClaimDD_TP1"})],
                  }),
                  new TableCell({
                    children: [],
                  }),
              ],
          }),
          new TableRow({
            children: [
                new TableCell({
                  children: [new Paragraph({text:"Annexure C", style: "ClaimDD_TP1"})],
                }),
                new TableCell({
                  children: [new Paragraph({text:"Contemporary Records", style: "ClaimDD_TP1"})],
                }),
                new TableCell({
                  children: [],
                }),
            ],
          }),
          ],
          width: {size:95, type:WidthType.PERCENTAGE},
          margins: {top: convertInchesToTwip(mGap), bottom: convertInchesToTwip(mGap), left: convertInchesToTwip(mGap), right: convertInchesToTwip(mGap),} ,
          alignment: AlignmentType.LEFT,
        })


      // creating site preliminary table with separate section of table - Header, Content & Footer Rows

        // let's create first site prelimenaries Header Row table then appendwith childs (content and Footer)
        const sitePrelimsTable = new Table({
          rows: [
            new TableRow({
              children: [
                  new TableCell({
                    width: { size: 1005, type:WidthType.DXA},  
                    children: [new Paragraph({text:"S.No.", style: "ClaimDD_TH1"})],
                    shading: {fill: "365F91", type: ShadingType.CLEAR, color: "auto"},
                    }),
                  new TableCell({
                    width: { size: 7005, type:WidthType.DXA},  
                    children: [new Paragraph({text:"Description", style: "ClaimDD_TH1"})],
                    shading: {fill: "365F91", type: ShadingType.CLEAR, color: "auto"},
                  }),
                  new TableCell({
                    width: { size: 2005, type:WidthType.DXA},  
                    children: [new Paragraph({text:"Amount", style: "ClaimDD_TH1", alignment: AlignmentType.RIGHT})],
                    shading: {fill: "365F91", type: ShadingType.CLEAR, color: "auto"},
                }),
                new TableCell({
                  width: { size: 2005, type:WidthType.DXA},  
                  children: [new Paragraph({text:"Reference", style: "ClaimDD_TH1"})],
                  shading: {fill: "365F91", type: ShadingType.CLEAR, color: "auto"},
              }),
              ],
            }),
          ],
          width: {size:95, type:WidthType.PERCENTAGE},
          margins: {top: convertInchesToTwip(mGap), bottom: convertInchesToTwip(mGap), left: convertInchesToTwip(mGap), right: convertInchesToTwip(mGap),} ,
          alignment: AlignmentType.RIGHT,

        });


      // site prelimenaries content table
        const sitePrelims_ContentTable = new Table({
          rows: [
            new TableRow({
                children: [
                    new TableCell({
                      children: [new Paragraph({text:"A", style: "ClaimDD_TPB"})],
                      }),
                    new TableCell({
                      children: [new Paragraph({text:"Project/Site Overheads", style: "ClaimDD_TPB"})],
                    }),
                    new TableCell({
                      children: [],
                  }),
                  new TableCell({
                      children: [],
                  }),
                ],
            }),
            new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({text:"1", style: "ClaimDD_TP1"})],
                  }),
                new TableCell({
                  children: [new Paragraph({text:"Contractual Securities - Bonds and Insurances", style: "ClaimDD_TP1"})],
                }),
                new TableCell({
                  children: [new Paragraph({text: ""+this.formatNumber(this.sumA[1]), style: "ClaimDD_TP1", alignment: AlignmentType.RIGHT})],
                }),
                new TableCell({
                children: [new Paragraph({text:"Appendix 1", style: "ClaimDD_TP1"})],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({text:"2", style: "ClaimDD_TP1"})],
                }),
              new TableCell({
                children: [new Paragraph({text:"Resources - Manpower (Staff)", style: "ClaimDD_TP1"})],
              }),
              new TableCell({
                children: [new Paragraph({text:""+this.formatNumber(this.sumA[2]), style: "ClaimDD_TP1", alignment: AlignmentType.RIGHT})],
              }),
              new TableCell({
              children: [new Paragraph({text:"Appendix 2", style: "ClaimDD_TP1"})],
              }),
            ],
            }),
            new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({text:"3", style: "ClaimDD_TP1"})],
              }),
            new TableCell({
              children: [new Paragraph({text:"Resources - Equipment", style: "ClaimDD_TP1"})],
            }),
            new TableCell({
              children: [new Paragraph({text:""+this.formatNumber(this.sumA[3]), style: "ClaimDD_TP1", alignment: AlignmentType.RIGHT})],
            }),
            new TableCell({
            children: [new Paragraph({text:"Appendix 3", style: "ClaimDD_TP1"})],
            }),
            ],
            }),
            new TableRow({
            children: [
            new TableCell({
              children: [new Paragraph({text:"4", style: "ClaimDD_TP1"})],
            }),
            new TableCell({
            children: [new Paragraph({text:"Facility - Utilities", style: "ClaimDD_TP1"})],
            }),
            new TableCell({
            children: [new Paragraph({text:""+this.formatNumber(this.sumA[4]), style: "ClaimDD_TP1", alignment: AlignmentType.RIGHT})],
            }),
            new TableCell({
            children: [new Paragraph({text:"Appendix 4", style: "ClaimDD_TP1"})],
            }),
          ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({text:"5", style: "ClaimDD_TP1"})],
              }),
            new TableCell({
              children: [new Paragraph({text:"Facility - Site Administration", style: "ClaimDD_TP1"})],
            }),
            new TableCell({
              children: [new Paragraph({text:""+this.formatNumber(this.sumA[5]), style: "ClaimDD_TP1", alignment: AlignmentType.RIGHT})],
            }),
            new TableCell({
            children: [new Paragraph({text:"Appendix 5", style: "ClaimDD_TP1"})],
            }),
          ],
          }),
          new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({text:"6", style: "ClaimDD_TP1"})],
                }),
              new TableCell({
                children: [new Paragraph({text:"Facility - Transportation", style: "ClaimDD_TP1"})],
              }),
              new TableCell({
                children: [new Paragraph({text:""+this.formatNumber(this.sumA[6]), style: "ClaimDD_TP1", alignment: AlignmentType.RIGHT})],
              }),
              new TableCell({
              children: [new Paragraph({text:"Appendix 6", style: "ClaimDD_TP1"})],
              }),
            ],
          }),
        ],
        width: {size:95, type:WidthType.PERCENTAGE},
        margins: {top: convertInchesToTwip(mGap), bottom: convertInchesToTwip(mGap), left: convertInchesToTwip(mGap), right: convertInchesToTwip(mGap),} ,
        alignment: AlignmentType.RIGHT,
        });

      // site prelimenaries Footer table
      const sitePrelims_FooterTable = new Table({
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [],
                shading: {fill: "365F91", type: ShadingType.CLEAR, color: "auto"},
                }),
              new TableCell({
                children: [new Paragraph({text:"Total", style: "ClaimDD_TH1"})],
                shading: {fill: "365F91", type: ShadingType.CLEAR, color: "auto"},
              }),
              new TableCell({
                children: [new Paragraph({text:""+this.formatNumber(this.sumA[0]), style: "ClaimDD_TH1", alignment: AlignmentType.RIGHT})],
                shading: {fill: "365F91", type: ShadingType.CLEAR, color: "auto"},
              }),
              new TableCell({
                children: [],
                shading: {fill: "365F91", type: ShadingType.CLEAR, color: "auto"},
              }),
            ],
          }),
        ],
        width: {size:95, type:WidthType.PERCENTAGE},
        margins: {top: convertInchesToTwip(mGap), bottom: convertInchesToTwip(mGap), left: convertInchesToTwip(mGap), right: convertInchesToTwip(mGap),} ,
        alignment: AlignmentType.RIGHT,
        });

        // appending Site Prelims Table and Footer with Header
        sitePrelimsTable.addChildElement(sitePrelims_ContentTable);
        sitePrelimsTable.addChildElement(sitePrelims_FooterTable);

        // Summary Table - empty (space) row- used in Summary Table
          const summaryTable_emptyRow = new Table({
            rows: [
              new TableRow({
              children: [
              new TableCell({
                children: [],
              }),
              new TableCell({
                children: [new Paragraph({text:"", style: "ClaimDD_TPB"})],
              }),
              new TableCell({
                children: [new Paragraph({text:"", style: "ClaimDD_TPB", alignment: AlignmentType.RIGHT})],
              }),
              new TableCell({
                children: [],
              }),
            ],
            }),
          ],
          width: {size:95, type:WidthType.PERCENTAGE},
          margins: {top: convertInchesToTwip(mGap), bottom: convertInchesToTwip(mGap), left: convertInchesToTwip(mGap), right: convertInchesToTwip(mGap),} ,
          alignment: AlignmentType.RIGHT,
          });
          
        // site prelimenaries Subtotal - used in Summary Table
        const sitePrelims_Subtotal = new Table({
          rows: [
            new TableRow({
          children: [
            new TableCell({
              children: [],
            }),
            new TableCell({
              children: [new Paragraph({text:"Subtotal", style: "ClaimDD_TPB"})],
            }),
            new TableCell({
              children: [new Paragraph({text:""+this.formatNumber(this.sumA[0]), style: "ClaimDD_TPB", alignment: AlignmentType.RIGHT})],
            }),
            new TableCell({
              children: [],
            }),
          ],
          }),
        ],
        width: {size:95, type:WidthType.PERCENTAGE},
        margins: {top: convertInchesToTwip(mGap), bottom: convertInchesToTwip(mGap), left: convertInchesToTwip(mGap), right: convertInchesToTwip(mGap),} ,
        alignment: AlignmentType.RIGHT,
        });

      //creatimng summary table header and then appendd necessary rows
        const summaryTable = new Table({
          rows: [
            new TableRow({
              children: [
                  new TableCell({
                    width: { size: 1005, type:WidthType.DXA},  
                    children: [new Paragraph({text:"S.No.", style: "ClaimDD_TH1"})],
                    shading: {fill: "365F91", type: ShadingType.CLEAR, color: "auto"},
                }),
                  new TableCell({
                    width: { size: 7005, type:WidthType.DXA},  
                    children: [new Paragraph({text:"Description", style: "ClaimDD_TH1"})],
                    shading: {fill: "365F91", type: ShadingType.CLEAR, color: "auto"},
                }),
                  new TableCell({
                    width: { size: 2005, type:WidthType.DXA},  
                    children: [new Paragraph({text:"Amount in " + this.originalContractPriceType, style: "ClaimDD_TH1", alignment: AlignmentType.RIGHT})],
                    shading: {fill: "365F91", type: ShadingType.CLEAR, color: "auto"},
              }),
                new TableCell({
                  width: { size: 2005, type:WidthType.DXA},  
                  children: [new Paragraph({text:"Remarks", style: "ClaimDD_TH1"})],
                  shading: {fill: "365F91", type: ShadingType.CLEAR, color: "auto"},
              }),
              ],
            }),
          ],
          width: {size:95, type:WidthType.PERCENTAGE},
          margins: {top: convertInchesToTwip(mGap), bottom: convertInchesToTwip(mGap), left: convertInchesToTwip(mGap), right: convertInchesToTwip(mGap),} ,
          alignment: AlignmentType.RIGHT,
        });
      
        //creating each row for the summary table
        //Elements Heading
        let summaryTableRow_EleH = new Table({
          rows: [
            new TableRow({
            children: [
            new TableCell({
              children: [new Paragraph({text:SM[2], style: "ClaimDD_TPB"})],
            }),
            new TableCell({
              children: [new Paragraph({text:"Escalation", style: "ClaimDD_TPB"})],
            }),
            new TableCell({
            children: [],
            }),
            new TableCell({
              children: [],
            }),
          ],
          }),
        ],
        width: {size:95, type:WidthType.PERCENTAGE},
        margins: {top: convertInchesToTwip(mGap), bottom: convertInchesToTwip(mGap), left: convertInchesToTwip(mGap), right: convertInchesToTwip(mGap),} ,
        alignment: AlignmentType.RIGHT,
        });

        //Elements Material
        let summaryTableRow_EleMat = new Table({
          rows: [
            new TableRow({
            children: [
            new TableCell({
              children: [new Paragraph({text:"", style: "ClaimDD_TP1", numbering:{ reference: "L_N", level:0,instance:10}})],
            }),
            new TableCell({
              children: [new Paragraph({text:"Impact due to change in Material cost", style: "ClaimDD_TP1"})],
            }),
            new TableCell({
              children: [new Paragraph({text:""+this.formatNumber(this.sumA[7]), style: "ClaimDD_TP1", alignment: AlignmentType.RIGHT})],
            }),
            new TableCell({
              children: [new Paragraph({text:"Appendix "+this.AN[7], style: "ClaimDD_TP1"})],
            }),
          ],
          }),
        ],
        width: {size:95, type:WidthType.PERCENTAGE},
        margins: {top: convertInchesToTwip(mGap), bottom: convertInchesToTwip(mGap), left: convertInchesToTwip(mGap), right: convertInchesToTwip(mGap),} ,
        alignment: AlignmentType.RIGHT,
        });

        //Elements Labor
        let summaryTableRow_EleLab = new Table({
          rows: [
            new TableRow({
            children: [
            new TableCell({
              children: [new Paragraph({text:"", style: "ClaimDD_TP1", numbering:{ reference: "L_N", level:0,instance:10}})],
            }),
            new TableCell({
              children: [new Paragraph({text:"Impact due to change in Labour cost", style: "ClaimDD_TP1"})],
            }),
            new TableCell({
              children: [new Paragraph({text:""+this.formatNumber(this.sumA[8]), style: "ClaimDD_TP1", alignment: AlignmentType.RIGHT})],
            }),
            new TableCell({
              children: [new Paragraph({text:"Appendix "+this.AN[8], style: "ClaimDD_TP1"})],
            }),
          ],
          }),  
        ],
        width: {size:95, type:WidthType.PERCENTAGE},
        margins: {top: convertInchesToTwip(mGap), bottom: convertInchesToTwip(mGap), left: convertInchesToTwip(mGap), right: convertInchesToTwip(mGap),} ,
        alignment: AlignmentType.RIGHT,
        });

        //Elements Loss of Productivity
        let summaryTableRow_LOP = new Table({
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({text:SM[3], style: "ClaimDD_TPB"})],
                }),
                new TableCell({
                  children: [new Paragraph({text:"Loss of Productivity", style: "ClaimDD_TPB"})],
                }),
                new TableCell({
                children: [],
                }),
                new TableCell({
                children: [],
                }),
                ],
              }),
                
            new TableRow({
                children: [
                new TableCell({
                  children: [new Paragraph({text:"1", style: "ClaimDD_TP1"})],
                }),
                new TableCell({
                  children: [new Paragraph({text:"Loss of Productivity incurred due to Disruption", style: "ClaimDD_TP1"})],
                }),
                new TableCell({
                  children: [new Paragraph({text:""+this.formatNumber(this.sumA[9]), style: "ClaimDD_TP1", alignment: AlignmentType.RIGHT})],
                }),
                new TableCell({
                  children: [new Paragraph({text:"Appendix "+this.AN[9], style: "ClaimDD_TP1"})],
                }),
                ],
              }),
            ],
            width: {size:95, type:WidthType.PERCENTAGE},
            margins: {top: convertInchesToTwip(mGap), bottom: convertInchesToTwip(mGap), left: convertInchesToTwip(mGap), right: convertInchesToTwip(mGap),} ,
            alignment: AlignmentType.RIGHT,
          });
        
        //Mobbilisation Heading
        let summaryTableRow_MobH = new Table({
          rows: [
            new TableRow({
            children: [
            new TableCell({
              children: [new Paragraph({text:SM[4], style: "ClaimDD_TPB"})],
            }),
            new TableCell({
              children: [new Paragraph({text:"Mobilisation", style: "ClaimDD_TPB"})],
            }),
            new TableCell({
            children: [],
            }),
            new TableCell({
            children: [],
            }),
          ],
          }), 
          ],
        width: {size:95, type:WidthType.PERCENTAGE},
        margins: {top: convertInchesToTwip(mGap), bottom: convertInchesToTwip(mGap), left: convertInchesToTwip(mGap), right: convertInchesToTwip(mGap),} ,
        alignment: AlignmentType.RIGHT,
        });

        //Demobilisation Summary Table Row
        let summaryTableRow_DeMob = new Table({
          rows: [
            new TableRow({
            children: [
            new TableCell({
              children: [new Paragraph({text:"", style: "ClaimDD_TP1", numbering:{ reference: "L_N", level:0,instance:11}})],
            }),
            new TableCell({
              children: [new Paragraph({text:"Demobilisation cost", style: "ClaimDD_TP1"})],
            }),
            new TableCell({
              children: [new Paragraph({text:""+this.formatNumber(this.sumA[10]), style: "ClaimDD_TP1", alignment: AlignmentType.RIGHT})],
            }),
            new TableCell({
              children: [new Paragraph({text:"Appendix "+this.AN[10], style: "ClaimDD_TP1"})],
            }),
          ],
          }),  
        ],
        width: {size:95, type:WidthType.PERCENTAGE},
        margins: {top: convertInchesToTwip(mGap), bottom: convertInchesToTwip(mGap), left: convertInchesToTwip(mGap), right: convertInchesToTwip(mGap),} ,
        alignment: AlignmentType.RIGHT,
        });

        //Remobilisation  Summary Table Row
        let summaryTableRow_ReMob = new Table({
          rows: [
            new TableRow({
            children: [
            new TableCell({
              children: [new Paragraph({text:"", style: "ClaimDD_TP1", numbering:{ reference: "L_N", level:0,instance:11}})],
            }),
            new TableCell({
              children: [new Paragraph({text:"Remobilisation cost", style: "ClaimDD_TP1"})],
            }),
            new TableCell({
              children: [new Paragraph({text:""+this.formatNumber(this.sumA[11]), style: "ClaimDD_TP1", alignment: AlignmentType.RIGHT})],
            }),
            new TableCell({
              children: [new Paragraph({text:"Appendix "+this.AN[11], style: "ClaimDD_TP1"})],
            }),
          ],
          }),  
        ],
        width: {size:95, type:WidthType.PERCENTAGE},
        margins: {top: convertInchesToTwip(mGap), bottom: convertInchesToTwip(mGap), left: convertInchesToTwip(mGap), right: convertInchesToTwip(mGap),} ,
        alignment: AlignmentType.RIGHT,
        });

        //Head Office Overheads Summary Table Row
        let summaryTableRow_HOOH = new Table({
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({text:SM[5], style: "ClaimDD_TPB"})],
                }),
                new TableCell({
                  children: [new Paragraph({text:"Head Office Overhead", style: "ClaimDD_TPB"})],
                }),
                new TableCell({
                children: [],
                }),
                new TableCell({
                children: [],
                }),
                ],
              }),
                
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({text:"1", style: "ClaimDD_TP1"})],
                }),
                new TableCell({
                  children: [new Paragraph({text:"Head Office Overhead for the delayed period", style: "ClaimDD_TP1"})],        }),
                new TableCell({
                  children: [new Paragraph({text:""+this.formatNumber(this.sumA[12]), style: "ClaimDD_TP1", alignment: AlignmentType.RIGHT})],
                }),
                new TableCell({
                  children: [new Paragraph({text:"Appendix "+this.AN[12], style: "ClaimDD_TP1"})],
                }),
              ],
            }),
          ],
          width: {size:95, type:WidthType.PERCENTAGE},
          margins: {top: convertInchesToTwip(mGap), bottom: convertInchesToTwip(mGap), left: convertInchesToTwip(mGap), right: convertInchesToTwip(mGap),} ,
          alignment: AlignmentType.RIGHT,
        });
      
        //Subcontractor's Claims Summary Table Row
        let summaryTableRow_SC = new Table({
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({text:SM[6], style: "ClaimDD_TPB"})],
                }),
                new TableCell({
                  children: [new Paragraph({text:"Subcontractor's Claims", style: "ClaimDD_TPB"})],
                }),
                new TableCell({
                children: [],
                }),
                new TableCell({
                children: [],
                }),
                ],
              }),
                
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({text:"1", style: "ClaimDD_TP1"})],
                }),
                new TableCell({
                  children: [new Paragraph({text:"Claim made by the Subcontractors", style: "ClaimDD_TP1"})],        }),
                new TableCell({
                  children: [new Paragraph({text:""+this.formatNumber(this.sumA[13]), style: "ClaimDD_TP1", alignment: AlignmentType.RIGHT})],
                }),
                new TableCell({
                  children: [new Paragraph({text:"Appendix "+this.AN[13], style: "ClaimDD_TP1"})],
                }),
              ],
            }),
          ],
          width: {size:95, type:WidthType.PERCENTAGE},
          margins: {top: convertInchesToTwip(mGap), bottom: convertInchesToTwip(mGap), left: convertInchesToTwip(mGap), right: convertInchesToTwip(mGap),} ,
          alignment: AlignmentType.RIGHT,
        });
      
            //Profit Heading
        let summaryTableRow_ProfitH = new Table({
          rows: [
            new TableRow({
            children: [
            new TableCell({
              children: [new Paragraph({text:SM[7], style: "ClaimDD_TPB"})],
            }),
            new TableCell({
              children: [new Paragraph({text:"Profit", style: "ClaimDD_TPB"})],
            }),
            new TableCell({
            children: [],
            }),
            new TableCell({
            children: [],
            }),
          ],
          }),
        ],
        width: {size:95, type:WidthType.PERCENTAGE},
        margins: {top: convertInchesToTwip(mGap), bottom: convertInchesToTwip(mGap), left: convertInchesToTwip(mGap), right: convertInchesToTwip(mGap),} ,
        alignment: AlignmentType.RIGHT,
        });

        //Profit on Claim Summary Table Row
        let summaryTableRow_ProOnClaim = new Table({
          rows: [
            new TableRow({
            children: [
            new TableCell({
              children: [new Paragraph({text:"", style: "ClaimDD_TP1", numbering:{ reference: "L_N", level:0,instance:12}})],
            }),
            new TableCell({
              children: [new Paragraph({text:"Profit on the cost claim", style: "ClaimDD_TP1"})],
            }),
            new TableCell({
              children: [new Paragraph({text:""+this.formatNumber(this.sumA[14]), style: "ClaimDD_TP1", alignment: AlignmentType.RIGHT})],
            }),
            new TableCell({
              children: [new Paragraph({text:"Appendix "+this.AN[14], style: "ClaimDD_TP1"})],
            }),
            ],
            }),  
          ],
          width: {size:95, type:WidthType.PERCENTAGE},
          margins: {top: convertInchesToTwip(mGap), bottom: convertInchesToTwip(mGap), left: convertInchesToTwip(mGap), right: convertInchesToTwip(mGap),} ,
          alignment: AlignmentType.RIGHT,
          });

        //Loss of Profit  Summary Table Row
        let summaryTableRow_LOPro = new Table({
          rows: [
            new TableRow({
            children: [
            new TableCell({
              children: [new Paragraph({text:"", style: "ClaimDD_TP1", numbering:{ reference: "L_N", level:0,instance:12}})],
            }),
            new TableCell({
              children: [new Paragraph({text:"Loss of Profit due to delay in the works", style: "ClaimDD_TP1"})],
            }),
            new TableCell({
              children: [new Paragraph({text:""+this.formatNumber(this.sumA[15]), style: "ClaimDD_TP1", alignment: AlignmentType.RIGHT})],
            }),
            new TableCell({
              children: [new Paragraph({text:"Appendix "+this.AN[15], style: "ClaimDD_TP1"})],
            }),
            ],
          }),  
        ],
        width: {size:95, type:WidthType.PERCENTAGE},
        margins: {top: convertInchesToTwip(mGap), bottom: convertInchesToTwip(mGap), left: convertInchesToTwip(mGap), right: convertInchesToTwip(mGap),} ,
        alignment: AlignmentType.RIGHT,
        });

            //Damages Summary Table Row
        let summaryTableRow_Damages = new Table({
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({text:SM[8], style: "ClaimDD_TPB"})],
                }),
                new TableCell({
                  children: [new Paragraph({text:"Other Damages", style: "ClaimDD_TPB"})],
                }),
                new TableCell({
                children: [],
                }),
                new TableCell({
                children: [],
                }),
                ],
              }),
                
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({text:"1", style: "ClaimDD_TP1"})],
                }),
                new TableCell({
                  children: [new Paragraph({text:"Other Damages incurred in the business", style: "ClaimDD_TP1"})],
                }),
                new TableCell({
                  children: [new Paragraph({text:""+this.formatNumber(this.sumA[16]), style: "ClaimDD_TP1", alignment: AlignmentType.RIGHT})],
                }),
                new TableCell({
                  children: [new Paragraph({text:"Appendix "+this.AN[16], style: "ClaimDD_TP1"})],
                }),
                ],
              }),
            ],
            width: {size:95, type:WidthType.PERCENTAGE},
            margins: {top: convertInchesToTwip(mGap), bottom: convertInchesToTwip(mGap), left: convertInchesToTwip(mGap), right: convertInchesToTwip(mGap),} ,
            alignment: AlignmentType.RIGHT,
          });
        
          //Financial Charge Heading
        let summaryTableRow_FCH = new Table({
        rows: [
          new TableRow({
            children: [
            new TableCell({
              children: [new Paragraph({text:SM[9], style: "ClaimDD_TPB"})],
            }),
            new TableCell({
              children: [new Paragraph({text:"Financial Charges", style: "ClaimDD_TPB"})],
            }),
            new TableCell({
            children: [],
            }),
            new TableCell({
            children: [],
            }),
          ],
          }),  
        ],
        width: {size:95, type:WidthType.PERCENTAGE},
        margins: {top: convertInchesToTwip(mGap), bottom: convertInchesToTwip(mGap), left: convertInchesToTwip(mGap), right: convertInchesToTwip(mGap),} ,
        alignment: AlignmentType.RIGHT,
        });

          //FC on Delayed Profit Summary Table Row
        let summaryTableRow_FCProfit = new Table({
          rows: [
            new TableRow({
            children: [
            new TableCell({
              children: [new Paragraph({text:"", style: "ClaimDD_TP1", numbering:{ reference: "L_N", level:0,instance:13}})],
            }),
            new TableCell({
              children: [new Paragraph({text:"Financial Charge on Delayed Profit", style: "ClaimDD_TP1"})],
            }),
            new TableCell({
              children: [new Paragraph({text:""+this.formatNumber(this.sumA[17]), style: "ClaimDD_TP1", alignment: AlignmentType.RIGHT})],
            }),
            new TableCell({
              children: [new Paragraph({text:"Appendix "+this.AN[17], style: "ClaimDD_TP1"})],
            }),
            ],
          }),  
        ],
        width: {size:95, type:WidthType.PERCENTAGE},
        margins: {top: convertInchesToTwip(mGap), bottom: convertInchesToTwip(mGap), left: convertInchesToTwip(mGap), right: convertInchesToTwip(mGap),} ,
        alignment: AlignmentType.RIGHT,
        });

        //FC on delay/unpaid payment Summary Table Row
        let summaryTableRow_FCUnPay = new Table({
          rows: [
            new TableRow({
            children: [
            new TableCell({
              children: [new Paragraph({text:"", style: "ClaimDD_TP1", numbering:{ reference: "L_N", level:0,instance:12}})],
            }),
            new TableCell({
              children: [new Paragraph({text:"Financial Charge on Delayed or Unpaid Payment", style: "ClaimDD_TP1"})],
            }),
            new TableCell({
              children: [new Paragraph({text:""+this.formatNumber(this.sumA[18]), style: "ClaimDD_TP1", alignment: AlignmentType.RIGHT})],
            }),
            new TableCell({
              children: [new Paragraph({text:"Appendix "+this.AN[18], style: "ClaimDD_TP1"})],
            }),
            ],
          }),  
        ],
        width: {size:95, type:WidthType.PERCENTAGE},
        margins: {top: convertInchesToTwip(mGap), bottom: convertInchesToTwip(mGap), left: convertInchesToTwip(mGap), right: convertInchesToTwip(mGap),} ,
        alignment: AlignmentType.RIGHT,
        });

        //Footer  Summary Table Row
        const summaryTable_FooterTable = new Table({
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [],
              }),
              new TableCell({
                children: [],
              }),
              new TableCell({
                children: [],
              }),
              new TableCell({
                children: [],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [],
                shading: {fill: "365F91", type: ShadingType.CLEAR, color: "auto"},
                }),
              new TableCell({
                children: [new Paragraph({text:"Total", style: "ClaimDD_TH1"})],
                shading: {fill: "365F91", type: ShadingType.CLEAR, color: "auto"},
              }),
              new TableCell({
                children: [new Paragraph({text:""+this.formatNumber(this.sumA[19]), style: "ClaimDD_TH1", alignment: AlignmentType.RIGHT})],
                shading: {fill: "365F91", type: ShadingType.CLEAR, color: "auto"},
              }),
              new TableCell({
                children: [],
                shading: {fill: "365F91", type: ShadingType.CLEAR, color: "auto"},
              }),
            ],
          }),
        ],
        width: {size:95, type:WidthType.PERCENTAGE},
        margins: {top: convertInchesToTwip(mGap), bottom: convertInchesToTwip(mGap), left: convertInchesToTwip(mGap), right: convertInchesToTwip(mGap),} ,
        alignment: AlignmentType.RIGHT,
        });


        // Appending all applicable Summary Table Rows with Summary Table Heading      (Heading Row will be called in main document creation)

        this.selectedOptions.includes('Site Preliminaries') && summaryTable.addChildElement(sitePrelims_ContentTable);
        this.selectedOptions.includes('Site Preliminaries') && summaryTable.addChildElement(sitePrelims_Subtotal);
        (this.selectedOptions.includes('Escalation - Material') || this.selectedOptions.includes('Escalation - Labour')) && summaryTable.addChildElement(summaryTableRow_EleH);
        this.selectedOptions.includes('Escalation - Material') && summaryTable.addChildElement(summaryTableRow_EleMat);
        this.selectedOptions.includes('Escalation - Labour') && summaryTable.addChildElement(summaryTableRow_EleLab);
        this.selectedOptions.includes('Loss of Productivity') && summaryTable.addChildElement(summaryTableRow_LOP);
        (this.selectedOptions.includes('De-moblisation') || this.selectedOptions.includes('Re-moblisation')) && summaryTable.addChildElement(summaryTableRow_MobH);
        this.selectedOptions.includes('De-moblisation') && summaryTable.addChildElement(summaryTableRow_DeMob);
        this.selectedOptions.includes('Re-moblisation') && summaryTable.addChildElement(summaryTableRow_ReMob);
        this.selectedOptions.includes('Head Office Overheads') && summaryTable.addChildElement(summaryTableRow_HOOH);
        this.selectedOptions.includes("Subcontractor's Claims") && summaryTable.addChildElement(summaryTableRow_SC);
        (this.selectedOptions.includes('Profit on Claim') || this.selectedOptions.includes('Loss of Profit')) && summaryTable.addChildElement(summaryTableRow_ProfitH);
        this.selectedOptions.includes('Profit on Claim') && summaryTable.addChildElement(summaryTableRow_ProOnClaim);
        this.selectedOptions.includes('Loss of Profit') && summaryTable.addChildElement(summaryTableRow_LOPro);
        this.selectedOptions.includes('Damages') && summaryTable.addChildElement(summaryTableRow_Damages);
        (this.selectedOptions.includes('Financiaal Charge on Delayed Profit') || this.selectedOptions.includes('Financiaal Charge (Interest) on Unsettled Payment')) && summaryTable.addChildElement(summaryTableRow_FCH);
        this.selectedOptions.includes('Financiaal Charge on Delayed Profit') && summaryTable.addChildElement(summaryTableRow_FCProfit);
        this.selectedOptions.includes('Financiaal Charge (Interest) on Unsettled Payment') && summaryTable.addChildElement(summaryTableRow_FCUnPay);
        summaryTable.addChildElement(summaryTable_FooterTable);
      


        let doc = new Document({

        //creating list - dynamic         
        numbering: {
          config: [
            {
                reference: "GF_List",
                levels: [
                  {
                    level: 0,
                    //format: LevelFormat.DECIMAL_ENCLOSED_FULLSTOP,
                    text: "%1",
                    alignment: AlignmentType.LEFT,

                  },
                  {
                    level: 1,
                    //format: LevelFormat.DECIMAL_ENCLOSED_FULLSTOP,
                    text: "%1.%2",
                    alignment: AlignmentType.LEFT,

                  },
                  {
                    level: 2,
                    //format: LevelFormat.DECIMAL_ENCLOSED_FULLSTOP,
                    text: "%1.%2.%3",
                    alignment: AlignmentType.LEFT,

                  },
                ],
            },
            {
              reference: "4L2",
              levels: [
                {
                  level: 0,
                  //format: LevelFormat.DECIMAL_ENCLOSED_FULLSTOP,
                  text: "4.%1.",
                  alignment: AlignmentType.LEFT,

                },

              ],
            },
            {
              reference: "L_A",
              levels: [
                {
                  level: 0,
                  format: LevelFormat.UPPER_LETTER,
                  text: "%1.",
                  alignment: AlignmentType.LEFT,
                },

              ],
            },
            {
              reference: "L_N",
              levels: [
                {
                  level: 0,
                  //format: LevelFormat.UPPER_LETTER,
                  text: "%1.",
                  alignment: AlignmentType.LEFT,
                },

              ],
            },         
            {
              reference: "L_a",
              levels: [
                {
                  level: 0,
                  format: LevelFormat.LOWER_LETTER,
                  text: "%1.",
                  alignment: AlignmentType.LEFT,
                },

              ],
            },                 
          ],
        },
        
      //creating styles used in document
        styles: {
          paragraphStyles: [
            {
              id: "ClaimDD_THB",
              name: "ClaimDD Title Head Bold",
              basedOn: "Normal",
              run: {
                font: "Calibri",
                size: 48,
                bold: true,
                color: "0F243E",
              },
              paragraph: {
                indent: {hanging:0, left: 100},
                spacing: {after: 100},
              },
            },
            {
              id: "ClaimDD_THN",
              name: "ClaimDD Title Head Normal",
              basedOn: "Normal",
              run: {
                font: "Calibri",
                size: 48,
                color: "FFC000",
              },
              paragraph: {
                indent: {hanging:0, left: 100},
                //spacing: {after: 250},
              },
            },
            {
              id: "ClaimDD_THNW",
              name: "ClaimDD Title Head Normal White",
              basedOn: "Normal",
              run: {
                font: "Calibri",
                size: 48,
                color: "FFFFFF",
              },
              paragraph: {
                indent: {hanging:0, left: 100},
                //spacing: {after: 250},
              },
            },
            {
              id: "ClaimDD_TC",
              name: "ClaimDD Title Content",
              basedOn: "Normal",
              run: {
                font: "Calibri",
                size: 36,
                color: "0F243E",
              },
              paragraph: {
                indent: {hanging:0, left: 100},
                //spacing: {after: 250},
              },
            },
            {
              id: "ClaimDD_TSTA",
              name: "ClaimDD Title STitle Anex",
              basedOn: "Normal",
              run: {
                font: "Calibri",
                size: 24,
                color: "FFC000",
              },
              paragraph: {
                indent: {hanging:0, left: 100},
                //spacing: {after: 250},
              },
            },

            {
              id: "ClaimDD_TCE",
              name: "ClaimDD Title Content Event",
              basedOn: "Normal",
              run: {
                font: "Calibri",
                size: 36,
                bold: true,
                color: "FFC000",
              },
              paragraph: {
                indent: {hanging:0, left: 100},
                //spacing: {after: 250},
              },
            },
            {
              id: "ClaimDD_TCED",
              name: "ClaimDD Title Content Event Date",
              basedOn: "Normal",
              run: {
                font: "Calibri",
                size: 28,
                color: "0F243E",
              },
              paragraph: {
                indent: {hanging:0, left: 100},
                //spacing: {after: 250},
              },
            },

            {
              id: "ClaimDD_TCC",
              name: "ClaimDD Title Connection Content",
              basedOn: "Normal",
              run: {
                font: "Calibri",
                size: 18,
                color: "FFC000",
              },
              paragraph: {
                indent: {hanging:0, left: 100},
                //spacing: {after: 250},
              },
            },
            {
              id: "ClaimDD_TR",
              name: "ClaimDD Title Refe",
              basedOn: "Normal",
              run: {
                font: "Calibri",
                size: 20,
                color: "0F243E",
              },
              paragraph: {
                indent: {hanging:0, left: 100},
                spacing: {after: 180},
              },
            },
            {
              id: "ClaimDD_TP",
              name: "ClaimDD Title Prepared",
              basedOn: "Normal",
              run: {
                font: "Calibri",
                size: 20,
                color: "FFC000",
              },
              paragraph: {
                indent: {hanging:0, left: 100},
                spacing: {after: 250},
              },
            },

            {
              id: "ClaimDD_CH",
              name: "ClaimDD Contents Heading",
              basedOn: "Normal",
              run: {
                font: "Calibri",
                size: 24,
                bold: true,
                color: "0F243E",
                underline:{
                  type: UnderlineType.SINGLE,
                  color:"0F243E",
                }
              },
              paragraph: {
                indent: {hanging:0, left: 0},
                spacing: {after: 150},
              },
            },

            {
              id: "ClaimDD_H1",
              name: "ClaimDD Heading1",
              basedOn: "Heading2",
              run: {
                font: "Calibri",
                size: 24,
                bold: true,
                color: "0F243E",
                underline:{
                  type: UnderlineType.SINGLE,
                  color:"0F243E",
                }
              },
              paragraph: {
                indent: {hanging:0, left: 0},
                spacing: {after: 150},
              },
            },
            {
              id: "ClaimDD_H2",
              name: "ClaimDD Heading2",
              basedOn: "Heading2",
              run: {
                font: "Calibri",
                size: 24,
                color: "0F243E",
                bold: true,
              
              },
              paragraph: {
                indent: { hanging: 0, left: 0}
              },
            },
            {
              id: "ClaimDD_Para",
              name: "ClaimDD Para",
              basedOn: "Normal",
              run: {
                font: "Calibri",
                size: 24,
                color: "0F243E",
              },
              paragraph: {
                spacing: { line:240*1.5, before:150, after: 240},
                alignment: AlignmentType.JUSTIFIED,
                indent: { hanging: 0, left: 0}
              },
            },
            {
              id: "ClaimDD_ParaWoL",
              name: "ClaimDD Para with Indent",
              basedOn: "Normal",
              run: {
                font: "Calibri",
                size: 24,
                color: "0F243E",
                italics: true,
              },
              paragraph: {
                spacing: { line:240*1.5, before:150, after: 240},
                alignment: AlignmentType.JUSTIFIED,
                indent: {left: 800}
              },
            },
            {
              id: "ClaimDD_SH1",
              name: "ClaimDD Subheading1",
              basedOn: "Normal",
              run: {
                font: "Calibri",
                size: 24,
                bold: true,
                color: "0F243E",
              },
              paragraph: {
                //indent: {hanging: 400, left: 400}
              },
            },
            {
              id: "ClaimDD_ML",
              name: "ClaimDD Main List",
              basedOn: "Normal",
              run: {
                font: "Calibri",
                size: 24,
                bold: true,
                color: "0F243E",
              },
              paragraph: {
                indent: {left: 700}
              },
            },
            {
              id: "ClaimDD_SL",
              name: "ClaimDD Sub List",
              basedOn: "Normal",
              run: {
                font: "Calibri",
                size: 24,
                color: "0F243E",
              },
              paragraph: {
                indent: {left: 700}
              },
            },
            {
              id: "ClaimDD_TH1",
              name: "ClaimDD Table Heading1",
              basedOn: "Normal",
              run: {
                font: "Calibri",
                size: 24,
                color: "FFFFFF",
                bold: true,
              },
            },
            {
              id: "ClaimDD_TP1",
              name: "ClaimDD Table Para1",
              basedOn: "Normal",
              run: {
                font: "Calibri",
                size: 24,
                color: "0F243E",
              },
            },
            {
              id: "ClaimDD_TPB",
              name: "ClaimDD Table Para Bold",
              basedOn: "Normal",
              run: {
                font: "Calibri",
                size: 24,
                color: "0F243E",
                bold: true,
              },
            },
            {
              id: "ClaimDD_HBB",
              name: "ClaimDD Header Blue Bold",
              basedOn: "Normal",
              run: {
                font: "Calibri",
                size: 20,
                color: "0F243E",
                bold: true,
              },
            },
            {
                id: "ClaimDD_HOB",
                name: "ClaimDD Header Orange Bold",
                basedOn: "Normal",
                run: {
                  font: "Calibri",
                  size: 20,
                  color: "FFC000",
                  bold: true,
                },
              
            },
            {
              id: "ClaimDD_HB",
              name: "ClaimDD Header Blue",
              basedOn: "Normal",
              run: {
                font: "Calibri",
                size: 24,
                color: "0F243E",
              },
            },
            {
                id: "ClaimDD_HO",
                name: "ClaimDD Header Orange",
                basedOn: "Normal",
                run: {
                  font: "Calibri",
                  size: 24,
                  color: "FFC000",
                },
              
            }, 
          ],
          },
        
        //for table of contents
        features: {updateFields: true,},

        //creatig content of word documents
        sections: [
            {
              properties: {titlePage: true,
                page: {
                  margin: {top:0, bottom:0},
                }
              },
              headers: {
                default: new Header({
                    children: [HeaderTable, new Paragraph({})],
                }),
              },
              footers: {
                default: new Footer({
                    children: [FooterTable],
                }),
              },
              children: [
                titlepageTable,
                  /*new Paragraph({
                  children: [
                      new ImageRun({
                          data: fs.readFileSync("../../../assests/images/home-img-3.jpg"),
                          transformation: {
                              width: 200,
                              height: 200,
                          },
                          floating: {
                              horizontalPosition: {
                                  relative: HorizontalPositionRelativeFrom.PAGE,
                                  align: HorizontalPositionAlign.RIGHT,
                              },
                              verticalPosition: {
                                  relative: VerticalPositionRelativeFrom.PAGE,
                                  align: VerticalPositionAlign.BOTTOM,
                              },
                              wrap: {
                                type: TextWrappingType.TOP_AND_BOTTOM
                              
                              }
                          },
                      }),
                  ],
                }),*/

              ],
            },
              //Table of Content
            { 
            children: [
              new Paragraph({ text: 'CONTENTS', style: "ClaimDD_CH"}),

              new TableOfContents ('TABLE OF CONTENTS',{
                  hyperlink: true,
                  headingStyleRange: "1-2",
                  stylesWithLevels: [new StyleLevel ("ClaimDD_CH", 1)],

                  }),
              ],
            },
            // Content pages
            
            {
              children: [
                new Paragraph({ text: 'INTRODUCTION AND BACKGROUND', style: "ClaimDD_H1", numbering:{ reference: "GF_List", level:0}}),
                
                new Paragraph({children: [new TextRun ({text: 'RELEVANT '+ this.contractAs, allCaps: true}),], style: "ClaimDD_H2", numbering:{ reference: "GF_List", level: 1} }),
                
                new Paragraph({ text: 'A ' + this.contractAs + ' was entered into between M/s. ' + this.claimantName + ' (hereinafter referred to as “' + this.claimantAs + '”) and M/s. ' + this.nameOfDefendant + ' (hereinafter referred to as “' + this.defendantAs + '”) for the ' + this.projectName +' (the “Project”).', 
                              style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2} }),
                
                new Paragraph({ text: 'Pursuant to the ' + this.contractAs + ', the original ' + this.contractAs + ' Price is ' + this.originalContractPriceType + ' ' + this.formatNumber(this.originalContractPrice) + ', and the original ' + this.contractAs + ' Duration is ' + this.originalContractDurationvalue + ' ' + this.originalContractDurationSelect + '.', 
                style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}  }),
                
                new Paragraph({ text: 'The Project commencement date is ' + this.commencementDate + ', and the original ' + this.contractAs + ' Completion date is ' + this.OCD + '.', 
                              style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}  }),
                new Paragraph({}),
                new Paragraph({ children: [new TextRun ({text: this.contractAs + ' REVISION', allCaps: true}),], style: "ClaimDD_H2", numbering:{ reference: "GF_List", level: 1} }),
                
                new Paragraph({ text: ''+ this.contractUpdate, style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2 }}),
                new Paragraph({}),
                new Paragraph({ text: 'EVENT', style: "ClaimDD_H2", numbering:{ reference: "GF_List", level: 1} }),
                
                /* doubts */ new Paragraph({ text: this.EventDeclaration, style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2 }}),
                new Paragraph({}),
                new Paragraph({ text: 'COST CLAIM', style: "ClaimDD_H2", numbering:{ reference: "GF_List", level: 1} }),
                
                /* doubts */ new Paragraph({ text: this.claimJustification, style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2 }}),
                new Paragraph({}),
                new Paragraph({ text: 'PURPOSE OF THIS DOCUMENT', style: "ClaimDD_H2", numbering:{ reference: "GF_List", level: 1} }),
                
                new Paragraph({ text: 'This report is generated from ClaimDD to justify the Cost Claim (which the ' + this.claimantAs + ' incurred and/or shall incur in addition to the ' + this.StatusContract +   ' ' + this.contractAs + ' Price due to the Event) evaluated via ClaimDD.', style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2 }}),

                new Paragraph({children: [new TextRun ({text: 'RELEVANT '+ this.contractAs + ' PARTICULARS', allCaps: true}),], style: "ClaimDD_H1", numbering:{ reference: "GF_List", level:0}, pageBreakBefore: true }),
              
              new Paragraph({ text: 'GENERALLY', style: "ClaimDD_H2", numbering:{ reference: "GF_List", level: 1} }),
              
              new Paragraph({ text: 'This Section identifies the ' + this.contractAs + ' provisions that are deemed relevant/pertinent to or are referred to in this document. The provisions, conditions, documents, and particulars set out hereunder are included in this Section for information and ease of reference only.', style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
              new Paragraph({}),
              new Paragraph({ children: [new TextRun ({text: this.contractAs + ' PROVISIONS', allCaps: true}),], style: "ClaimDD_H2", numbering:{ reference: "GF_List", level: 1} }),
              
              new Paragraph({ text: 'The ' + this.claimantAss + ' entitlement to claim an additional payment is stated in the ' + this.contractAs + '. The Conditions of the ' + this.contractAs + ' state:', style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
              
              new Paragraph({ text: '"' + this.clauses + '"', style: "ClaimDD_ParaWoL" }),

              new Paragraph({ text: 'FINANCIAL IMPACT', style: "ClaimDD_H1", numbering:{ reference: "GF_List", level:0}, pageBreakBefore: true}),
            
            new Paragraph({ text: 'INTRODUCTION', style: "ClaimDD_H2", numbering:{ reference: "GF_List", level: 1}}),
            
            new Paragraph({ text: 'This Section details the various expenditure, costs, losses, and financial burdens incurred and/or shall be incurred by the ' + this.claimantAs + ' due to the Event and justifies the additional payment (“Cost Claim”) that is entitled to receive from the ' + this.defendantAs + '.', style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2} }),

            new Paragraph({ text: 'COST HEADINGS', style: "ClaimDD_H2", numbering:{ reference: "GF_List", level: 1} , pageBreakBefore: true}),
          
          new Paragraph({ text: 'Pursuant to the ' + this.contractAs + ', the Cost Claim is claimed under the following headings and subheadings:', style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2} }),
          
          new Paragraph({}),
          //new Paragraph({text: this.selectedOptions.includes('Site Preliminaries') ? 'Project/Site Overheads (Running Site Preliminary Cost)' , style: "ClaimDD_ML", numbering:{ reference: "L_A", level:0}}),
          
          this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Project/Site Overheads (Running Site Preliminary Cost)', style: "ClaimDD_ML", numbering:{ reference: "L_A", level:0}}),
          
          
          //this.selectedOptions.includes('Site Preliminaries') ? new Paragraph({text: 'Contractual Securities such as bonds and insurances' , style: "ClaimDD_SL", numbering:{ reference: "L_N", level:0}}): null,
          this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Contractual Securities such as bonds and insurances' , style: "ClaimDD_SL", numbering:{ reference: "L_N", level:0}}),
          this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Resources – Manpower (Staff)' , style: "ClaimDD_SL", numbering:{ reference: "L_N", level:0}}),
          
          this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Resources – Equipment' , style: "ClaimDD_SL", numbering:{ reference: "L_N", level:0}}),
          
          this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Facility - Utilities' , style: "ClaimDD_SL", numbering:{ reference: "L_N", level:0}}),
          
          this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Facility – Site Administration' , style: "ClaimDD_SL", numbering:{ reference: "L_N", level:0}}),
          
          this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Facility – Transportation' , style: "ClaimDD_SL", numbering:{ reference: "L_N", level:0}}),
          new Paragraph({}),
          
          (this.selectedOptions.includes('Escalation - Material') || this.selectedOptions.includes('Escalation - Labour')) && new Paragraph({text: 'ESCALATION' , style: "ClaimDD_ML", numbering:{ reference: "L_A", level:0}}),
          new Paragraph({}),
          this.selectedOptions.includes('Escalation - Labour') && new Paragraph({text: 'Impact due to change in Labour cost' , style: "ClaimDD_SL", numbering:{ reference: "L_N", level:0,instance:2}}),
          new Paragraph({}),
          this.selectedOptions.includes('Escalation - Material') && new Paragraph({text: 'Impact due to change in Material cost' , style: "ClaimDD_SL", numbering:{ reference: "L_N", level:0,instance:2}}),
          new Paragraph({}),

          this.selectedOptions.includes('Loss of Productivity') && new Paragraph({text: 'Productivity' , style: "ClaimDD_ML", numbering:{ reference: "L_A", level:0}}),
        
        this.selectedOptions.includes('Loss of Productivity') && new Paragraph({text: 'Loss of productivity incurred due to disruption' , style: "ClaimDD_SL", numbering:{ reference: "L_N", level:0, instance:3}}),
        new Paragraph({}),
        //this.selectedOptions.includes('De-moblisation') ? new Paragraph({text:  'Mobilisation' , style: "ClaimDD_ML", numbering:{ reference: "L_A", level:0}}): this.selectedOptions.includes('Re-moblisation') && new Paragraph({text:  'Mobilisation' , style: "ClaimDD_ML", numbering:{ reference: "L_A", level:0}}),
      
        (this.selectedOptions.includes('De-moblisation') || this.selectedOptions.includes('Re-moblisation')) && new Paragraph({text: 'Mobilisation' , style: "ClaimDD_ML", numbering:{ reference: "L_A", level:0}}),
        new Paragraph({}),
        this.selectedOptions.includes('De-moblisation') && new Paragraph({text: 'Demobilisation' , style: "ClaimDD_SL", numbering:{ reference: "L_N", level:0,instance:4}}),
        new Paragraph({}),
        this.selectedOptions.includes('Re-moblisation') && new Paragraph({text: 'Remobilisation' , style: "ClaimDD_SL", numbering:{ reference: "L_N", level:0, instance:4}}),
        new Paragraph({}),
        this.selectedOptions.includes('Head Office Overheads') && new Paragraph({text: 'Head Office Overheads' , style: "ClaimDD_ML", numbering:{ reference: "L_A", level:0}}),
        
        this.selectedOptions.includes('Head Office Overheads') && new Paragraph({text: 'Head Office Overhead for the delay duration' , style: "ClaimDD_SL", numbering:{ reference: "L_N", level:0, instance:5}}),
        new Paragraph({}),
        this.selectedOptions.includes("Subcontractor's Claims") && new Paragraph({text: "Subcontractor’s Claims" , style: "ClaimDD_ML", numbering:{ reference: "L_A", level:0}}),
        
        this.selectedOptions.includes("Subcontractor's Claims") && new Paragraph({text: 'Claim made by the Subcontractor' , style: "ClaimDD_SL", numbering:{ reference: "L_N", level:0, instance:6}}),
        new Paragraph({}),
        (this.selectedOptions.includes("Loss of Profit") || this.selectedOptions.includes("Profit on Claim")) && new Paragraph({text: 'Profit' , style: "ClaimDD_ML", numbering:{ reference: "L_A", level:0}}),
        new Paragraph({}),
        this.selectedOptions.includes("Profit on Claim") && new Paragraph({text: 'Profit on the cost' , style: "ClaimDD_SL", numbering:{ reference: "L_N", level:0, instance:7}}),
        new Paragraph({}),
        this.selectedOptions.includes("Loss of Profit") && new Paragraph({text: 'Loss of Profit or Loss of opportunity to earn profit' , style: "ClaimDD_SL", numbering:{ reference: "L_N", level:0,instance:7}}),
        new Paragraph({}),
        this.selectedOptions.includes("Damages") && new Paragraph({text: ' Damages' , style: "ClaimDD_ML", numbering:{ reference: "L_A", level:0}}),
        new Paragraph({}),
        this.selectedOptions.includes("Damages") && new Paragraph({text: 'Damages incurred in the business' , style: "ClaimDD_SL", numbering:{ reference: "L_N", level:0, instance:8}}),
        new Paragraph({}),
        (this.selectedOptions.includes('Financiaal Charge on Delayed Profit') || this.selectedOptions.includes('Financiaal Charge (Interest) on Unsettled Payment')) && new Paragraph({text: 'Financial Charges' , style: "ClaimDD_ML", numbering:{ reference: "L_A", level:0}}),
        new Paragraph({}),
        this.selectedOptions.includes('Financiaal Charge on Delayed Profit') && new Paragraph({text: 'Financial Charge on Delayed Profit' , style: "ClaimDD_SL", numbering:{ reference: "L_N", level:0, instance:9}}),
        new Paragraph({}),
        this.selectedOptions.includes('Financiaal Charge (Interest) on Unsettled Payment') && new Paragraph({text: 'Financial Charge on Delayed or Unpaid Payment' , style: "ClaimDD_SL", numbering:{ reference: "L_N", level:0,instance:9}}),
        new Paragraph({}),
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'PROJECT/SITE OVERHEADS (RUNNING PRELIMINARY COST)' , style: "ClaimDD_H2", numbering:{ reference: "GF_List", level: 1}, pageBreakBefore: true}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'The “Site Overheads” cost is the cost incurred by the ' + this.claimantAs + ' on the Site. It is also referred to as Running Preliminary Costs, Site Organisation Costs, Site Running Costs, or Site Preliminary Costs.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'The Event shall lead the ' + this.claimantAs + ' to retain its key staff and resources on the Project for the Asserted EOT of ' + this.daysOnCompletion + ' days, which is longer than the ' + this.StatusPlan + ' duration.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'The ' + this.claimantAss + ' Site Overheads costs shall increase considerably due to such extended presence on the site. The Site Overheads costs include, but are not necessarily limited to, the following categories:' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Contractual Securities such as bonds and insurances;' , style: "ClaimDD_SL", numbering:{ reference: "L_a", level:0}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Resources – Manpower (Staff)' , style: "ClaimDD_SL", numbering:{ reference: "L_a", level:0}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Resources - Equipment,' , style: "ClaimDD_SL", numbering:{ reference: "L_a", level:0}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Facility - Utilities' , style: "ClaimDD_SL", numbering:{ reference: "L_a", level:0}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Facility – Site Administration,' , style: "ClaimDD_SL", numbering:{ reference: "L_a", level:0}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Facility – Site Transport' , style: "ClaimDD_SL", numbering:{ reference: "L_a", level:0}}),
        new Paragraph({}),
        new Paragraph({}),
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Contractual Securities' , style: "ClaimDD_SH1"}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Pursuant to the ' + this.contractAs + ', the ' + this.claimantAs + ' has procured and submitted the bonds and insurances (“Contractual Securities”) for the original ' + this.contractAs + ' Duration' + this.StatusContractSecurities , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Moreover, the ' + this.claimantAs + ' has to maintain the validity of the Contractual Securities.  Thus, the ' + this.claimantAs + ' shall incur (incurred) additional cost for maintaining (extending) the validity of Contractual Securities for the Asserted EOT due to the Event. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        //this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Accordingly, pursuant to the daily cost required for maintaining the Contractual Securities, it is evaluated that the ' + this.claimantAs + ' incurs and/or shall incur the cost of ' + this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[1]) + ' for maintaining the Contractual Securities for the Asserted EOT of ' + this.daysOnCompletion + ' days.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({children: [new TextRun ({text: 'Accordingly, pursuant to the daily cost required for maintaining the Contractual Securities, it is evaluated that the ' + this.claimantAs + ' incurs and/or shall incur the cost of '}),  new TextRun ({text: this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[1]), bold:true}), new TextRun ({text:' for maintaining the Contractual Securities for the Asserted EOT of ' + this.daysOnCompletion + ' days.'}),], style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'The principle adopted in calculating such cost is the daily rate for maintaining the Contractual Securities multiplied by the Asserted EOT. The cost evaluation details are in Appendix 1 of Annexure B (Evaluation of Cost Claim).' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Resources – Manpower (Staff)' , style: "ClaimDD_SH1", pageBreakBefore: true}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Pursuant to the ' + this.contractAs + ', the ' + this.claimantAs + ' provides the Manpower (Staff) staff whom the ' + this.claimantAs + ' utilises on-site, who may include the staff and employees of each Subcontractor ("Resources – Manpower (Staff)") that are necessary to execute and complete the Works. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'The ' + this.claimantAs + ' has considered the Resources - Administrator cost required for the original ' + this.contractAs + ' Duration in the original ' + this.contractAs + ' Price. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'The Event shall lead the ' + this.claimantAs + ' to extend Resources – Manpower (Staff) for the Asserted EOT of ' + this.daysOnCompletion + ' days, which is longer than the ' + this.StatusPlan + ' duration. These extended Resources - Administrators shall incur additional costs to the ' + this.claimantAs + '.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Though the ' + this.claimantAs + ' shall extend the Resources - Administrator for ' + this.daysOnCompletion + ' days from the ' + this.StatusContract + ' ' + this.contractAs + ' Duration, the Event impacted the Resources – Manpower (Staff) engaged during the Event Period ' + this.formatDate(this.EstartDate) + ' to ' + this.formatDate(this.EendDate) + '. Thus, the quantum of Resources - Administrator engaged during the Event Period is considered when evaluating such additional cost.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        //this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Accordingly, pursuant to the daily rate of Resources - Administrator, it is evaluated that the ' + this.claimantAs + ' incurs and/or shall incur the cost of ' + this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[2]) + ' for extending the Resources - Administrator for the Asserted EOT of ' + this.daysOnCompletion + ' days.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),

        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({children: [new TextRun ({text: 'Accordingly, pursuant to the daily rate of Resources - Administrator, it is evaluated that the ' + this.claimantAs + ' incurs and/or shall incur the cost of '}),  new TextRun ({text: this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[2]), bold:true}), new TextRun ({text:' for extending the Resources - Administrator for the Asserted EOT of ' + this.daysOnCompletion + ' days.'}),], style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),

        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'The principle adopted in calculating such cost is a daily rate of Resources - Administrator multiplied by total Resources - Administrator engaged during the Event Period and factor of impact (which is computed by Asserted EOT divided by Event Duration). ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'The cost evaluation details are in Appendix 2 of Annexure B (Evaluation of Cost Claim).' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Resources – Equipment' , style: "ClaimDD_SH1", pageBreakBefore: true}),
        new Paragraph({}),
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Pursuant to the ' + this.contractAs + ', the ' + this.claimantAs + ' provides equipment such as apparatus, machinery, vehicles, and other things (“Resources – Equipment”) that are required to execute and complete the Works.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'The ' + this.claimantAs + ' has considered the Resources - Equipment cost required for the original ' + this.contractAs + ' Duration in the original ' + this.contractAs + ' Price. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'The Event shall lead the ' + this.claimantAs + ' to extend Resources – Equipment for the Asserted EOT of ' + this.daysOnCompletion + ' days, which is longer than the ' + this.StatusPlan + ' duration. This extended Resources - Equipment shall incur additional cost to the ' + this.claimantAs + '.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Though the ' + this.claimantAs + ' shall extend the Resources - Equipment for ' + this.daysOnCompletion + ' days from the ' + this.StatusContract + ' ' + this.contractAs + ' Duration, the Event impacted the Resources – Equipment engaged during the Event Period ' + this.formatDate(this.EstartDate) + ' to ' + this.formatDate(this.EendDate) + '. Thus, the quantum of Resources – Equipment engaged during the Event Period is considered when evaluating such additional cost. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        //this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Accordingly, pursuant to the daily rate of Resources - Equipment, it is evaluated that the ' + this.claimantAs + ' incurs and/or shall incur the cost of ' +  this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[3]) + ' for extending the Resources – Equipment for the Asserted EOT of ' + this.daysOnCompletion + ' days.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({children: [new TextRun ({text: 'Accordingly, pursuant to the daily rate of Resources - Equipment, it is evaluated that the ' + this.claimantAs + ' incurs and/or shall incur the cost of '}),  new TextRun ({text: this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[3]), bold:true}), new TextRun ({text:' for extending the Resources – Equipment for the Asserted EOT of ' + this.daysOnCompletion + ' days.'}),], style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'The principle adopted in calculating such cost is the daily rate of Resources – Equipment multiplied by total Resources - Equipment engaged during the Event Period and factor of impact (which is computed by Asserted EOT divided by Event Duration). ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'The cost evaluation details are in Appendix 3 of Annexure B (Evaluation of Cost Claim).' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        new Paragraph({}),
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Facility – Utilities' , style: "ClaimDD_SH1", pageBreakBefore: true}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Pursuant to the ' + this.contractAs + ', the ' + this.claimantAs + ' provides the facilities such as water, electricity, and gas (“Utility Facilities") that are necessary to execute and complete the Works. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'The ' + this.claimantAs + ' has considered the Utility Facilities for the original ' + this.contractAs + ' Duration in the original ' + this.contractAs + ' Price.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'The Event shall lead the ' + this.claimantAs + ' to provide the Utility Facilities for the Asserted EOT of ' + this.daysOnCompletion + ' days, which is longer than the ' + this.StatusPlan + ' duration. These extended Utility Facilities shall incur additional costs to the ' + this.claimantAs + '.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Though the ' + this.claimantAs + ' shall extend the Utility Facilities for ' + this.daysOnCompletion + ' days from the ' + this.StatusContract + ' ' + this.contractAs + ' Duration, the Event impacted the Utility Facilities provided during the Event Period ' + this.formatDate(this.EstartDate) + ' to ' + this.formatDate(this.EendDate) + '. Thus, the quantum of Utility Facilities provided during the Event Period is considered when evaluating such additional cost. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        //this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Accordingly, pursuant to the daily cost required for providing the Utility Facilities, it is evaluated that the ' + this.claimantAs + ' incurs and/or shall incur the cost of ' + this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[4]) + ' for providing the Utility Facilities for the Asserted EOT of ' + this.daysOnCompletion + ' days. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({children: [new TextRun ({text: 'Accordingly, pursuant to the daily cost required for providing the Utility Facilities, it is evaluated that the ' + this.claimantAs + ' incurs and/or shall incur the cost of '}),  new TextRun ({text: this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[4]), bold:true}), new TextRun ({text:' for providing the Utility Facilities for the Asserted EOT of ' + this.daysOnCompletion + ' days.'}),], style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'The principle adopted in calculating such cost is the unit rate of Utility Facilities multiplied by the average monthly quantity during the Event Period and factor of impact (which is computed by Asserted EOT divided by 30, which is an average number of days in a month). ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'The cost evaluation details are in Appendix 4 of Annexure B (Evaluation of Cost Claim).' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        new Paragraph({}),

        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Facility – Site Administration' , style: "ClaimDD_SH1", pageBreakBefore: true}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Pursuant to the ' + this.contractAs + ', the ' + this.claimantAs + ' provides the facilities such as offices, office boy, securities, printing, and stationaries ("Site Facilities") that are necessary to execute and complete the Works.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'The ' + this.claimantAs + ' has considered the Site Facilities that are required for the original ' + this.contractAs + ' Duration in the original ' + this.contractAs + ' Price. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'The Event shall lead the ' + this.claimantAs + ' to provide the Site Facilities on the Project for the Asserted EOT of ' + this.daysOnCompletion + ' days, which is longer than the ' + this.StatusPlan + ' duration. These extended Utility Facilities shall incur additional costs to the ' + this.claimantAs + '.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        //this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Accordingly, pursuant to the daily cost required for providing the Site Facilities, it is evaluated that the ' + this.claimantAs + ' incurs and/or shall incur the cost of ' + this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[5]) + ' for providing the Site Facilities for the Asserted EOT of ' + this.daysOnCompletion + ' days.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({children: [new TextRun ({text: 'Accordingly, pursuant to the daily cost required for providing the Site Facilities, it is evaluated that the ' + this.claimantAs + ' incurs and/or shall incur the cost of '}),  new TextRun ({text: this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[5]), bold:true}), new TextRun ({text:' for providing the Site Facilities for the Asserted EOT of ' + this.daysOnCompletion + ' days.'}),], style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),

        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'The principle adopted in calculating such cost is the daily rate for providing the Site Facilities multiplied by the Asserted EOT. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'The cost evaluation details are in Appendix 5 of Annexure B (Evaluation of Cost Claim).' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        new Paragraph({}),
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Facility – Transport' , style: "ClaimDD_SH1", pageBreakBefore: true}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Pursuant to the ' + this.contractAs + ', the ' + this.claimantAs + ' provides transport facilities such as bus, minibus, and car (Transport Facilities) that are required to execute and complete the Works.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'The ' + this.claimantAs + ' has considered the Transport Facilities cost required for the original ' + this.contractAs + ' Duration only in the original ' + this.contractAs + ' Price. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'The Event shall lead the ' + this.claimantAs + ' to extend Transport Facilities on the Project for the Asserted EOT of ' + this.daysOnCompletion + ' days, which is longer than the ' + this.StatusPlan + ' duration. This extended Transport Facility shall incur additional cost to the ' + this.claimantAs + '.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Though the ' + this.claimantAs + ' extended the Transport Facilities for ' + this.daysOnCompletion + ' days from the ' + this.StatusContract + ' ' + this.contractAs + ' Duration, the Event impacted the Transport Facilities engaged during the Event Period ' + this.formatDate(this.EstartDate) + ' to ' + this.formatDate(this.EendDate) + '. Thus, the quantum of Transport Facilities engaged during the Event period is considered when evaluating such additional cost. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        //this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Accordingly, pursuant to the daily rate of Transport Facilities, it is evaluated that the ' + this.claimantAs + ' incurs and/or shall incur the cost of ' + this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[6]) + ' for providing the Transport Facilities for the Asserted EOT of ' + this.daysOnCompletion + ' days.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({children: [new TextRun ({text: 'Accordingly, pursuant to the daily rate of Transport Facilities, it is evaluated that the ' + this.claimantAs + ' incurs and/or shall incur the cost of '}),  new TextRun ({text: this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[6]), bold:true}), new TextRun ({text:' for providing the Transport Facilities for the Asserted EOT of ' + this.daysOnCompletion + ' days.'}),], style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),

        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'The principle adopted in calculating such cost is the daily rate of Transport Facilities multiplied by total Transport Facilities engaged during the Event Period and the factor of impact (which is computed by Asserted EOT divided by Event Duration).' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'The cost evaluation details are in Appendix 6 of Annexure B (Evaluation of Cost Claim).' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        new Paragraph({}),
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Total – Site Overheads' , style: "ClaimDD_SH1", pageBreakBefore: true}),
        
        //this.selectedOptions.includes('Site Preliminaries') && new Paragraph({text: 'Accordingly, it is evaluated that the ' + this.claimantAs + ' incurs and/or shall incur the cost of ' + this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[0]) + ' due to prolonged Site Overheads. The cost summary is tabulated below:' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        this.selectedOptions.includes('Site Preliminaries') && new Paragraph({children: [new TextRun ({text: 'Accordingly, it is evaluated that the ' + this.claimantAs + ' incurs and/or shall incur the cost of '}),  new TextRun ({text: this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[0]), bold:true}), new TextRun ({text:' due to prolonged Site Overheads. The cost summary is tabulated below:'}),], style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        this.selectedOptions.includes('Site Preliminaries') && sitePrelimsTable,
        new Paragraph({}),
        new Paragraph({}),
        (this.selectedOptions.includes('Escalation - Material') || this.selectedOptions.includes('Escalation - Labour')) && new Paragraph({text: 'ESCALATION' , style: "ClaimDD_H2", numbering:{ reference: "GF_List", level: 1}, pageBreakBefore: true}),
        
        (this.selectedOptions.includes('Escalation - Material') || this.selectedOptions.includes('Escalation - Labour')) && new Paragraph({text: 'Pursuant to the ' + this.contractAs + ', irrespective of whether the ' + this.claimantAs + ' has the right to claim the cost of escalation of material and labour, the ' + this.claimantAs + ' claims such cost escalation condition is applicable until the original ' + this.contractAs + ' Completion date of ' + this.OCD +'.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        new Paragraph({}),
        this.selectedOptions.includes('Escalation - Material') && new Paragraph({text: 'Escalation - Materials' , style: "ClaimDD_SH1"}),
        
        this.selectedOptions.includes('Escalation - Material') && new Paragraph({text: 'The Event has led the ' + this.claimantAs + ' to execute and complete the Works beyond the original ' + this.contractAs + ' Completion date. During such period, the Material costs are increased from the rate that the ' + this.claimantAs + ' considered in the tender (“Tender Rate”). This incurs additional cost to the ' + this.claimantAs + '.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        //this.selectedOptions.includes('Escalation - Material') && new Paragraph({text: 'Accordingly, pursuant to the Tender Rates and actual rates of material, it is evaluated that the ' + this.claimantAs + ' incurred the cost of ' + this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[7]) + ' due to escalation of the material cost during the extended/prolonged ' + this.contractAs + ' period. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        this.selectedOptions.includes('Escalation - Material') && new Paragraph({children: [new TextRun ({text: 'Accordingly, pursuant to the Tender Rates and actual rates of materials, it is evaluated that the ' + this.claimantAs + ' incurred the cost of '}),  new TextRun ({text: this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[7]), bold:true}), new TextRun ({text:' due to escalation of the material cost during the extended/prolonged ' + this.contractAs + ' period.'}),], style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),

        this.selectedOptions.includes('Escalation - Material') && new Paragraph({text: 'The principle adopted in calculating such cost is the difference in the rate of materials multiplied by the quantum of materials procured during the extended ' + this.contractAs + ' period. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Escalation - Material') && new Paragraph({text: 'The cost evaluation details are in Appendix ' +  this.AN[7] +  ' of Annexure B (Evaluation of Cost Claim).' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        //new Paragraph({}),
        this.selectedOptions.includes('Escalation - Labour') && new Paragraph({text: 'Escalation - Labour' , style: "ClaimDD_SH1"}),
        
        this.selectedOptions.includes('Escalation - Labour') && new Paragraph({text: 'The Event has led the ' + this.claimantAs + ' to execute and complete the Works beyond the original ' + this.contractAs + ' Completion date. During such period, the labour costs are increased from the rate the ' + this.claimantAs + ' considered in the tender (“Tender Rate”). This incurs additional cost to the ' + this.claimantAs + '.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        //this.selectedOptions.includes('Escalation - Labour') && new Paragraph({text: 'Accordingly, pursuant to the Tender Rates and actual rates of labourers, it is evaluated that the ' + this.claimantAs + ' incurred the additional cost of ' + this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[8]) + ' due to escalation of labour cost during the extended/prolonged ' + this.contractAs + ' period. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        this.selectedOptions.includes('Escalation - Labour') && new Paragraph({children: [new TextRun ({text: 'Accordingly, pursuant to the Tender Rates and actual rates of labourers, it is evaluated that the ' + this.claimantAs + ' incurred the additional cost of '}),  new TextRun ({text: this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[8]), bold:true}), new TextRun ({text:' due to escalation of labour cost during the extended/prolonged ' + this.contractAs + ' period.'}),], style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),

        this.selectedOptions.includes('Escalation - Labour') && new Paragraph({text: 'The principle adopted in calculating such cost is the difference in the rate of labour multiplied by the quantum of labour engaged during the extended period. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Escalation - Labour') && new Paragraph({text: 'The cost evaluation details are in Appendix ' +  this.AN[8] +  ' of Annexure B (Evaluation of Cost Claim).' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        //new Paragraph({}),
        this.selectedOptions.includes('Loss of Productivity') && new Paragraph({text: 'LOSS OF PRODUCTIVITY' , style: "ClaimDD_H2", numbering:{ reference: "GF_List", level: 1}, pageBreakBefore: true}),
        
        this.selectedOptions.includes('Loss of Productivity') && new Paragraph({text: 'Pursuant to the ' + this.contractAs + ' and planned resources, the ' + this.claimantAs + ' deploys the labour and equipment required to execute and complete within the original ' + this.contractAs + ' Duration.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Loss of Productivity') && new Paragraph({text: 'The Event has impacted the productivity of the labour and equipment.  Irrespective of whether the Event shall delay the completion of the Project, such loss of productivity needs to be overcome by deploying more labour and equipment and/or deploying labour and equipment for the extended duration to complete the activities. This incurs additional cost to the ' + this.claimantAs + '.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Loss of Productivity') && new Paragraph({text: 'The ' + this.claimantAs + ' evidences such loss of productivity by measured mile method (which is comparing productivity during undisturbed duration with disturbed duration) that is an internationally accepted method to prove the loss of productivity.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        //this.selectedOptions.includes('Loss of Productivity') && new Paragraph({text: 'Accordingly, pursuant to the tender rate of labourers, it is evaluated that the ' + this.claimantAs + ' shall incur the additional cost of ' + this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[9]) + ' due to loss of productivity during the Event Period. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        this.selectedOptions.includes('Loss of Productivity') && new Paragraph({children: [new TextRun ({text: 'Accordingly, pursuant to the tender rate of labourers, it is evaluated that the ' + this.claimantAs + ' shall incur the additional cost of '}),  new TextRun ({text: this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[9]), bold:true}), new TextRun ({text:' due to loss of productivity during the Event Period.'}),], style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),

        this.selectedOptions.includes('Loss of Productivity') && new Paragraph({text: 'The principle adopted in calculating such cost is the rate of labour multiplied by the loss of productivity during the Event Period, which is the difference in productivity during the Event Period and productivity during the undisturbed period. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Loss of Productivity') && new Paragraph({text: 'The cost evaluation details are in Appendix ' +  this.AN[9] +  ' of Annexure B (Evaluation of Cost Claim).' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        new Paragraph({}),
        (this.selectedOptions.includes('De-moblisation') || this.selectedOptions.includes('Re-moblisation')) && new Paragraph({text: 'MOBILISATION' , style: "ClaimDD_H2", numbering:{ reference: "GF_List", level: 1}, pageBreakBefore: true}),
        
        (this.selectedOptions.includes('De-moblisation') || this.selectedOptions.includes('Re-moblisation')) && new Paragraph({text: 'Pursuant to the ' + this.contractAs + ' and planned resources, the ' + this.claimantAs + ' mobilises and demobilises the labour required to execute and complete the Works.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        new Paragraph({}),
        this.selectedOptions.includes('De-moblisation') && new Paragraph({text: 'Demobilisation' , style: "ClaimDD_SH1"}),
        
        this.selectedOptions.includes('De-moblisation') && new Paragraph({text: 'The Event has led the ' + this.claimantAs + ' to demobilise the labour at an unplanned stage. This incurs additional cost to the ' + this.claimantAs + '.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        //this.selectedOptions.includes('De-moblisation') && new Paragraph({text: 'Pursuant to the labour engaged at the time of the Event and the cost of demobilisation, it is evaluated that the ' + this.claimantAs + ' incurred the cost of ' + this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[10]) + ' for demobilising the labour due to the Event. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        this.selectedOptions.includes('De-moblisation') && new Paragraph({children: [new TextRun ({text: 'Pursuant to the labour engaged at the time of the Event and the cost of demobilisation, it is evaluated that the ' + this.claimantAs + ' incurred the cost of '}),  new TextRun ({text: this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[10]), bold:true}), new TextRun ({text:' for demobilising the labour due to the Event.'}),], style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('De-moblisation') && new Paragraph({text: 'The principle adopted in calculating such cost is the number of demobilised labour multiplied by the cost of demobilisation.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('De-moblisation') && new Paragraph({text: 'The cost evaluation details are in Appendix ' +  this.AN[10] +  ' of Annexure B (Evaluation of Cost Claim).' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        new Paragraph({}),
        this.selectedOptions.includes('Re-moblisation') && new Paragraph({text: 'Remobilisation' , style: "ClaimDD_SH1"}),
        
        this.selectedOptions.includes('Re-moblisation') && new Paragraph({text: 'The Event has led the ' + this.claimantAs + ' to remobilise the labour at an unplanned stage. This incurs additional cost to the ' + this.claimantAs + '.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        //this.selectedOptions.includes('Re-moblisation') && new Paragraph({text: 'Pursuant to the labour deployed after the Event and cost of remobilisation, it is evaluated that the ' + this.claimantAs + ' incurs and/or shall incur the cost of ' + this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[11]) + ' for remobilising the labour due to the Event. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        this.selectedOptions.includes('Re-moblisation') && new Paragraph({children: [new TextRun ({text: 'Pursuant to the labour deployed after the Event and cost of remobilisation, it is evaluated that the ' + this.claimantAs + ' incurs and/or shall incur the cost of '}),  new TextRun ({text: this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[11]), bold:true}), new TextRun ({text:' for remobilising the labour due to the Event.'}),], style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),

        this.selectedOptions.includes('Re-moblisation') && new Paragraph({text: 'The principle adopted in calculating such cost is a number of remobilised labour multiplied by the cost of remobilisation. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Re-moblisation') && new Paragraph({text: 'The cost evaluation details are in Appendix ' +  this.AN[11] +  ' of Annexure B (Evaluation of Cost Claim).' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        new Paragraph({}),
        this.selectedOptions.includes('Head Office Overheads') && new Paragraph({text: 'HEAD OFFICE OVERHEADS (OFF-SITE OVERHEADS)' , style: "ClaimDD_H2", numbering:{ reference: "GF_List", level: 1}, pageBreakBefore: true}),
        
        this.selectedOptions.includes('Head Office Overheads') && new Paragraph({text: 'Pursuant to the business principle, the ' + this.claimantAss + ' head office department, such as management, accounts, tender, procurement, and HR (“Head Office Support"), works to get the Project and supports the Project team to execute and complete the Works. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Head Office Overheads') && new Paragraph({text: 'Pursuant to the ' + this.contractAs + ', the ' + this.claimantAs + ' has considered a portion of the cost/expenses of the Head Office Support in the original ' + this.contractAs + ' Price as a Head Office Overhead. Further, such Head Office Overhead cost is considered based on the original ' + this.contractAs + ' Duration. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Head Office Overheads') && new Paragraph({text: 'The Event shall lead the ' + this.claimantAs + ' to extend the Head Office Support to the Project for the Asserted EOT of ' + this.daysOnCompletion + ' days, which is longer than the ' + this.StatusPlan + ' duration. This extended Head Office support shall incur additional costs to the ' + this.claimantAs + '.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Head Office Overheads') && new Paragraph({text: 'The Head Office Overhead cost is evaluated for the Asserted EOT of ' + this.daysOnCompletion + ' days.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Head Office Overheads') && new Paragraph({text: 'There are three internationally accepted formulas for calculating the additional/reimbursable Head Office Overhead costs. The formulas are:' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Head Office Overheads') && new Paragraph({text: 'Hudson' , style: "ClaimDD_SL", numbering:{ reference: "L_a", level:0, instance:2}}),
        
        this.selectedOptions.includes('Head Office Overheads') && new Paragraph({text: 'Emden' , style: "ClaimDD_SL", numbering:{ reference: "L_a", level:0}}),
        
        this.selectedOptions.includes('Head Office Overheads') && new Paragraph({text: 'Eichleay' , style: "ClaimDD_SL", numbering:{ reference: "L_a", level:0}}),
        
        this.selectedOptions.includes('Head Office Overheads') && new Paragraph({text: 'Moreover, as the ' + this.contractAs + ' Price used in Hudson Formula includes Head Office Overheads and Profit, SCL corrected such formula by excluding Head office Overhead and Profit amounts from the ' + this.contractAs + ' Price. However, Good Faith has found an accounting error in such corrected SCL formula. Thus, Good Faith has corrected such errors and introduced new formulas from the Hudson formula ("Good Faith Hudson") and Emden Formula (“Good Faith Emden”).' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes('Head Office Overheads') && new Paragraph({text: 'The ' + this.claimantAs + ' finds that the ' + this.selectedFormula + ' formula is the most suitable formula at this stage. Thus, the ' + this.claimantAs + ' has considered such formula to calculate Head Office Overhead cost resulting from the Event.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        new Paragraph({}), // OH Formula is value replace kro
        this.selectedOptions.includes('Head Office Overheads') && new Paragraph({text: 'Accordingly, it is evaluated that the ' + this.claimantAs + ' incurs and/or shall incur the cost of ' + this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[12]) + ' for providing the Head Office Support due to the Event. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}, pageBreakBefore: true}),
        this.selectedOptions.includes('Head Office Overheads') && new Paragraph({children: [new TextRun ({text: 'Accordingly, it is evaluated that the ' + this.claimantAs + ' incurs and/or shall incur the cost of '}),  new TextRun ({text: this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[12]), bold:true}), new TextRun ({text:' for providing the Head Office Support due to the Event.'}),], style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),

        this.selectedOptions.includes('Head Office Overheads') && new Paragraph({text: 'The formula adopted in calculating such cost is detailed in the cost evaluation, which is found under Appendix ' +  this.AN[12] +  ' of Annexure B (Evaluation of Cost Claim).' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        new Paragraph({}),
        this.selectedOptions.includes("Subcontractor's Claims") && new Paragraph({text: 'SUBCONTRACTOR’S CLAIMS' , style: "ClaimDD_H2", numbering:{ reference: "GF_List", level: 1}, pageBreakBefore: true}),
        
        this.selectedOptions.includes("Subcontractor's Claims") && new Paragraph({text: 'Pursuant to the ' + this.contractAs + ', the ' + this.claimantAs + ' has employed the subcontractors for various trade works that are necessary to execute and complete the Works.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes("Subcontractor's Claims") && new Paragraph({text: 'The Event has impacted the Subcontractors as like the impact faced by the ' + this.claimantAs + '. Thus, the ' + this.claimantAss + ' Subcontractors incurred additional costs for which the ' + this.claimantAs + ' is liable. As this is the consequence of the Event, the ' + this.claimantAs + ' seeks reimbursement of such damages from the ' + this.defendantAs + '.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        //this.selectedOptions.includes("Subcontractor's Claims") && new Paragraph({text: 'Accordingly, and pursuant to the various subcontractors’ claims received by the ' + this.claimantAs + ', it is evaluated that the ' + this.claimantAss + ' reimbursable cost is ' + this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[13]) + ' due to the Event. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        this.selectedOptions.includes("Subcontractor's Claims") && new Paragraph({children: [new TextRun ({text: 'Accordingly, and pursuant to the various subcontractors’ claims received by the ' + this.claimantAs + ', it is evaluated that the ' + this.claimantAss + ' reimbursable cost is '}),  new TextRun ({text: this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[13]), bold:true}), new TextRun ({text:' due to the Event.'}),], style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes("Subcontractor's Claims") && new Paragraph({text: 'The cost evaluation details are in Appendix ' +  this.AN[13] +  ' of Annexure B (Evaluation of Cost Claim).' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        new Paragraph({}),
        (this.selectedOptions.includes("Loss of Profit") || this.selectedOptions.includes("Profit on Claim")) && new Paragraph({text: 'PROFIT' , style: "ClaimDD_H2", numbering:{ reference: "GF_List", level: 1}, pageBreakBefore: true}),
        
        (this.selectedOptions.includes("Loss of Profit") || this.selectedOptions.includes("Profit on Claim")) && new Paragraph({text: 'Pursuant to the business principle, the ' + this.claimantAs + ' spends the money to earn the profit. Moreover, the profit depends on the cost and the duration it would take to generate the revenue. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        (this.selectedOptions.includes("Loss of Profit") || this.selectedOptions.includes("Profit on Claim")) && new Paragraph({text: 'There are three internationally accepted formulas for calculating the additional/reimbursable Head Office Overhead costs. The formulas are:' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        (this.selectedOptions.includes("Loss of Profit") || this.selectedOptions.includes("Profit on Claim")) && new Paragraph({text: 'Hudson' , style: "ClaimDD_SL", numbering:{ reference: "L_a", level:0, instance:2}}),
        
        (this.selectedOptions.includes("Loss of Profit") || this.selectedOptions.includes("Profit on Claim")) && new Paragraph({text: 'Emden' , style: "ClaimDD_SL", numbering:{ reference: "L_a", level:0}}),
        
        (this.selectedOptions.includes("Loss of Profit") || this.selectedOptions.includes("Profit on Claim")) && new Paragraph({text: 'Eichleay' , style: "ClaimDD_SL", numbering:{ reference: "L_a", level:0}}),
        
        (this.selectedOptions.includes("Loss of Profit") || this.selectedOptions.includes("Profit on Claim")) && new Paragraph({text: 'Moreover, as the ' + this.contractAs + ' Price used in Hudson Formula includes Head Office Overheads and Profit, SCL corrected the Hudson formula by excluding Head office Overhead and Profit amounts from the ' + this.contractAs + ' Price. However, Good Faith has found an accounting error in such corrected SCL formula. Thus, Good Faith has corrected such errors and introduced new formulas from the Hudson formula ("Good Faith Hudson") and Emden Formula (“Good Faith Emden”).' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),

        new Paragraph({}),
        this.selectedOptions.includes("Profit on Claim") && new Paragraph({text: 'Profit on Cost' , style: "ClaimDD_SH1"}),
        
        this.selectedOptions.includes("Profit on Claim") && new Paragraph({text: 'Thus, the ' + this.claimantAs + ' claims profit on the cost established hereinbefore due to the Event.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes("Profit on Claim") && new Paragraph({text: 'The ' + this.claimantAs + ' finds that the ' + this.selectedFormula + ' formula is the most suitable formula at this stage. Thus, the Profit Percentage is computed/considered fundamental used in such formula. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        //this.selectedOptions.includes("Profit on Claim") && new Paragraph({text: 'Accordingly, it is evaluated that the ' + this.claimantAs + ' is entitled ' + this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[14]) + ' as a profit on the costs evaluated due to the Event. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        this.selectedOptions.includes("Profit on Claim") && new Paragraph({children: [new TextRun ({text: 'Accordingly, it is evaluated that the ' + this.claimantAs + ' is entitled '}),  new TextRun ({text: this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[14]), bold:true}), new TextRun ({text:' as a profit on the costs evaluated due to the Event. '}),], style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),

        this.selectedOptions.includes("Profit on Claim") && new Paragraph({text: 'The formula adopted in calculating such cost is the total cost/expenditure established hereinbefore due to the Event multiplied by Profit Percentage. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes("Profit on Claim") && new Paragraph({text: 'The cost evaluation details are in Appendix ' +  this.AN[14] +  ' of Annexure B (Evaluation of Cost Claim).' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        new Paragraph({}),
        new Paragraph({}),
        this.selectedOptions.includes("Loss of Profit") && new Paragraph({text: 'Loss of Profit or Loss of Opportunity to Earn Profit' , style: "ClaimDD_SH1"}),

        this.selectedOptions.includes("Loss of Profit") && new Paragraph({text: 'The "Loss of Profit" or loss of opportunity to earn profit claim is the profit that would have been earned if the resources are utilised in similar projects that were prevented as the ' + this.claimantAs + ' was kept on the Project longer than the planned time due to the Event.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes("Loss of Profit") && new Paragraph({text: 'The Loss of Profit is evaluated for the Asserted EOT of ' + this.daysOnCompletion + 'days.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes("Loss of Profit") && new Paragraph({text: 'The ' + this.claimantAs + ' finds that ' + this.selectedFormula + ' formula is the most suitable formula to evaluate the loss of profit. Thus, the ' + this.claimantAs + ' has considered such formula to calculate the loss of profit resulting from the Event.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        //this.selectedOptions.includes("Loss of Profit") && new Paragraph({text: 'Accordingly, it is evaluated that the ' + this.claimantAs + ' shall have earned the profit of ' + this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[15]) + ' if the Event did not occur. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        this.selectedOptions.includes("Loss of Profit") && new Paragraph({children: [new TextRun ({text: 'Accordingly, it is evaluated that the ' + this.claimantAs + ' shall have earned the profit of '}),  new TextRun ({text: this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[15]), bold:true}), new TextRun ({text:' if the Event did not occur. '}),], style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes("Loss of Profit") && new Paragraph({text: 'The formula adopted in calculating such cost is detailed in the cost evaluation, found under Appendix ' +  this.AN[15] +  ' of Annexure B (Evaluation of Cost Claim).' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        new Paragraph({}),
        this.selectedOptions.includes("Damages") && new Paragraph({text: 'DAMAGES' , style: "ClaimDD_H2", numbering:{ reference: "GF_List", level: 1}, pageBreakBefore: true}),
        
        this.selectedOptions.includes("Damages") && new Paragraph({text: 'The damage claim is the damage  for which the cost and/or expenses is not claimed or considered or coverd in other cost heading but incurred by the ' + this.claimantAs + ' due to consequences of the Event.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes("Damages") && new Paragraph({text: 'The Event has led the ' + this.claimantAs + ' to face various damages during the extended ' + this.contractAs + ' period. Thus, the ' + this.claimantAs + ' seeks reimbursement of such damages.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        //this.selectedOptions.includes("Damages") && new Paragraph({text: 'Accordingly, and pursuant to the various damages shall incur (or incurred) by the ' + this.claimantAs + ', it is evaluated that the ' + this.claimantAss + ' reimbursable cost is ' + this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[16]) + ' due to the Event. ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        this.selectedOptions.includes("Damages") && new Paragraph({children: [new TextRun ({text: 'Accordingly, and pursuant to the various damages incurred by the ' + this.claimantAs + ', it is evaluated that the ' + this.claimantAss + ' reimbursable cost is '}),  new TextRun ({text: this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[16]), bold:true}), new TextRun ({text:' due to the Event.'}),], style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes("Damages") && new Paragraph({text: 'The cost evaluation details are in Appendix ' +  this.AN[16] +  ' of Annexure B (Evaluation of Cost Claim).' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        new Paragraph({}),
        (this.selectedOptions.includes("Financiaal Charge on Delayed Profit") || this.selectedOptions.includes("Financiaal Charge (Interest) on Unsettled Payment")) && new Paragraph({text: 'FINANCE CHARGE' , style: "ClaimDD_H2", numbering:{ reference: "GF_List", level: 1}, pageBreakBefore: true}),
        
        (this.selectedOptions.includes("Financiaal Charge on Delayed Profit") || this.selectedOptions.includes("Financiaal Charge (Interest) on Unsettled Payment")) && new Paragraph({text: 'Pursuant to the business principle, the ' + this.claimantAs + ' shall incur a financial loss if the revenue is not earned and/or payment is not realised as planned.' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        (this.selectedOptions.includes("Financiaal Charge on Delayed Profit") || this.selectedOptions.includes("Financiaal Charge (Interest) on Unsettled Payment")) && new Paragraph({text: 'There are three internationally accepted formulas for calculating the additional/reimbursable Head Office Overhead costs. The formulas are:' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        (this.selectedOptions.includes("Financiaal Charge on Delayed Profit") || this.selectedOptions.includes("Financiaal Charge (Interest) on Unsettled Payment")) && new Paragraph({text: 'Hudson' , style: "ClaimDD_SL", numbering:{ reference: "L_a", level:0, instance:2}}),
        
        (this.selectedOptions.includes("Financiaal Charge on Delayed Profit") || this.selectedOptions.includes("Financiaal Charge (Interest) on Unsettled Payment")) && new Paragraph({text: 'Emden' , style: "ClaimDD_SL", numbering:{ reference: "L_a", level:0}}),
        
        (this.selectedOptions.includes("Financiaal Charge on Delayed Profit") || this.selectedOptions.includes("Financiaal Charge (Interest) on Unsettled Payment")) && new Paragraph({text: 'Eichleay' , style: "ClaimDD_SL", numbering:{ reference: "L_a", level:0}}),
        
        (this.selectedOptions.includes("Financiaal Charge on Delayed Profit") || this.selectedOptions.includes("Financiaal Charge (Interest) on Unsettled Payment")) && new Paragraph({text: 'Moreover, as the ' + this.contractAs + ' Price used in Hudson Formula includes Head Office Overheads and Profit, SCL corrected the Hudson formula by excluding Head office Overhead and Profit amounts from the ' + this.contractAs + ' Price. However, Good Faith has found an accounting error in such corrected SCL formula. Thus, Good Faith has corrected such errors and introduced new formulas from the Hudson formula ("Good Faith Hudson") and Emden Formula (“Good Faith Emden”).' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),

        new Paragraph({}),
        this.selectedOptions.includes("Financiaal Charge on Delayed Profit") && new Paragraph({text: 'Financial Charge on Delayed Profit' , style: "ClaimDD_SH1"}),
        
        this.selectedOptions.includes("Financiaal Charge on Delayed Profit") && new Paragraph({text: "The Event impacted the " + this.claimantAss + ' earning value during the Event Period. Thus, it impacted the ' + this.claimantAss + ' profit earning during the Event Period. The ' + this.claimantAs + ' shall earn such profit one day. However, such delayed earnings shall result in a loss of earnings (at least interest) from such profit. Thus, the ' + this.claimantAs + ' claims such loss of earnings (interest on delayed profit). ' , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes("Financiaal Charge on Delayed Profit") && new Paragraph({text: "The " + this.claimantAs + " has considered " + this.interestType + " Interest from the end date of the Event, " + this.StmtFreqCompoundInterest + "." , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes("Financiaal Charge on Delayed Profit") && new Paragraph({text: "The " + this.claimantAs + " finds that the " + this.selectedFormula + " formula is the most suitable formula at this stage. Thus, Profit Percentage is computed/considered fundamental used in such formula." , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        //this.selectedOptions.includes("Financiaal Charge on Delayed Profit") && new Paragraph({text: "Accordingly, and pursuant to the planned and actual earned values at the start and end of the Event, it is evaluated that the " + this.claimantAss + " loss of earning is " + this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[17]) + " due to the Event. " , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        this.selectedOptions.includes("Financiaal Charge on Delayed Profit") && new Paragraph({children: [new TextRun ({text: "Accordingly, and pursuant to the planned and actual earned values at the start and end of the Event, it is evaluated that the " + this.claimantAss + " loss of earning is "}),  new TextRun ({text: this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[17]), bold:true}), new TextRun ({text:" due to the Event."}),], style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes("Financiaal Charge on Delayed Profit") && new Paragraph({text: "The formula adopted in calculating such cost is detailed in the cost evaluation, found in Appendix " +  this.AN[17] +  " of Annexure B (Evaluation of Cost Claim)." , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        new Paragraph({}),
        this.selectedOptions.includes("Financiaal Charge (Interest) on Unsettled Payment") && new Paragraph({text: "Financial Charge on Delayed or Unpaid Payment" , style: "ClaimDD_SH1"}),
        
        this.selectedOptions.includes("Financiaal Charge (Interest) on Unsettled Payment") && new Paragraph({text: "The " + this.claimantAs + " is yet to receive various due payments from the " + this.defendantAs + ". Despite the " + this.claimantAss + " request to release such due payments, no financial relief in respect of such due payments was received from the " + this.defendantAs + "." , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes("Financiaal Charge (Interest) on Unsettled Payment") && new Paragraph({text: "The lack of financial relief resulted in the " + this.claimantAs + " being further burdened with additional financial charges. Thus, the " + this.claimantAs + " claims interest on delayed payment. " , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes("Financiaal Charge (Interest) on Unsettled Payment") && new Paragraph({text: "The " + this.claimantAs + " has considered " + this.interestType + " Interest from the expiry of the due date of the payment to the date of this report, " + this.StmtFreqCompoundInterest + "." , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes("Financiaal Charge (Interest) on Unsettled Payment") && new Paragraph({text: "Further, the " + this.claimantAs + " finds that the " + this.selectedFormula + " formula is the most suitable formula at this stage. Thus, Profit Percentage is computed/considered fundamental used in such formula." , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        //this.selectedOptions.includes("Financiaal Charge (Interest) on Unsettled Payment") && new Paragraph({text: "Accordingly, and pursuant to the various due payments, it is evaluated that the " + this.claimantAss + " incur a financial charge of " + this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[18]) + " due to delay in the payment. " , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        this.selectedOptions.includes("Financiaal Charge (Interest) on Unsettled Payment") && new Paragraph({children: [new TextRun ({text: "Accordingly, and pursuant to the various due payments, it is evaluated that the " + this.claimantAss + " incur a financial charge of "}),  new TextRun ({text: this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[18]), bold:true}), new TextRun ({text:" due to delay in the payment."}),], style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        
        this.selectedOptions.includes("Financiaal Charge (Interest) on Unsettled Payment") && new Paragraph({text: "The formula adopted in calculating such cost is detailed in the cost evaluation, found in Appendix " +  this.AN[18] +  " of Annexure B (Evaluation of Cost Claim)." , style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        new Paragraph({}), // page 25 tak done 
        //this.annualProfit ? new Paragraph({}) : this.clauses // aise kr skte hai na
        new Paragraph({text: "SUMMARY OF FINANCIAL IMPACT", style: "ClaimDD_H2", numbering:{ reference: "GF_List", level: 1}, pageBreakBefore: true}),
        
        //new Paragraph({text: "As explained in above Clauses of this submission, the " + this.claimantAss + " cost claim due to the Event amount to " + this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[19]) + " that summarised in the table below:", style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),
        new Paragraph({children: [new TextRun ({text: "As explained in the above Clauses of this submission, the " + this.claimantAss + " cost claim due to the Event amount to "}),  new TextRun ({text: this.originalContractPriceType + ' ' + this.formatNumber(this.sumA[19]), bold:true}), new TextRun ({text:" that summarised in the table below:"}),], style: "ClaimDD_Para", numbering:{ reference: "GF_List", level: 2}}),

        
        summaryTable,
        
        new Paragraph({text: "CONCLUSION", style: "ClaimDD_H1", numbering:{ reference: "GF_List", level:0}, pageBreakBefore: true}),
        
        new Paragraph({text: "The " + this.claimantAs + " shall incur (or incurred) cost due to the Event for which neither " + this.claimantAs + " nor " + this.claimantAss + " Subcontractor is responsible. ", style: "ClaimDD_Para", numbering:{ reference: "4L2", level:0}}),
        
        //new Paragraph({text: "Pursuant to the " + this.contractAs + ", the " + this.claimantAs + " has evaluated the cost using ClaimDD due to the impact of the Event and claims the cost amount to " + this.originalContractPriceType + " " + this.formatNumber(this.sumA[1]) + " .", style: "ClaimDD_Para", numbering:{ reference: "4L2", level:0}}),
        
        new Paragraph({children: [new TextRun ({text: "Pursuant to the " + this.contractAs + ", the " + this.claimantAs + " has evaluated the cost using ClaimDD due to the Event's impact and claims the cost amount to "}),  new TextRun ({text: this.originalContractPriceType + " " + this.formatNumber(this.sumA[19]) + ".", bold:true}),], style: "ClaimDD_Para", numbering:{ reference: "4L2", level:0}}),
        
        new Paragraph({text: "The detailed evaluation is attached in Annexure B. Further, the " + this.claimantAs + " can provide an access to the " + this.defendantAs + "’s representative to review the submission in ClaimDD.", style: "ClaimDD_Para", numbering:{ reference: "4L2", level:0}}),
        
        new Paragraph({text: "As the evaluation is based on the report date, the " + this.claimantAs + " reserves its right to amend the evaluation if it incurs more cost and/or finds errors in the submissions. ", style: "ClaimDD_Para", numbering:{ reference: "4L2", level:0}}),
        
        new Paragraph({text: "Moreover, the " + this.claimantAs + " shall raise the payment application (invoice) based on this Cost Claim unless amended or agreed otherwise. ", style: "ClaimDD_Para", numbering:{ reference: "4L2", level:0}}),
        new Paragraph({}),
        new Paragraph({text: "ANNEXURES", style: "ClaimDD_H1", pageBreakBefore: true}),
        new Paragraph({}),
        annexuresTable,
        new Paragraph({}),
        new Paragraph({text: "Note: Annexure A is this Cost Claim Report.", style: "ClaimDD_TSTA"}),
    
        // last page is remaining
        // index is remaining
        // adding images
        // some formating
      ],
      },
      // page ends here
        ]
        })
        this.saveDocumentToFile(doc, 'ClaimDD-Cost Report.docx')
      this.msgExportSucessfullReport()
      }
    }

  // reviewer
   generateDataForReviewer(projectId: string) {
    let A1 = 0
    let B1 = 0
    this.sumA = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    this.AN = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    this.Evaluation = true
    let appendixData: any = []
    let options : any = []
    this.selectedOptions = []
    const currentClaim = JSON.parse(localStorage.getItem("currentClaim"));
    this.claimName = currentClaim
    this.savedClaims.forEach((data) => {
      if (data['claimName'] == currentClaim) {
        this.currentEventId = data['eventId']
        appendixData = data['data']
        options = data['options']
        this.selectedOptions =  data['options']
        localStorage.setItem("selectedOptions",JSON.stringify(this.selectedOptions));
        this.selectedFormula =  data['formula']
        localStorage.setItem("selectedFormula",JSON.stringify(this.selectedFormula));

      }
    })
          this.projectService
            .getEvents(projectId)
            .subscribe((res) => {
              this.eventList = res['data'];
              this.eventList.forEach(event => {
                if(event['eventID'] === this.currentEventId) {
                  console.log("///////////////////", event)
                  localStorage.setItem(
                    "selectedEvent",
                    JSON.stringify(event)
                  );
                }
              })
            })
          this.generateAppendixAndMainHeadingsNotations()
          this.listOfAppendixToBeDisplayed = []
          // preparing appendix to be displayed
          if(options.includes('Site Preliminaries')) {
            this.listOfAppendixToBeDisplayed.push("Cost - Contractual Requirements") //Appendix 1
            this.listOfAppendixToBeDisplayed.push("Cost - Resources, Manpower (Staff)") //Appendix 2A
            this.listOfAppendixToBeDisplayed.push("Quantum - Resources, Manpower (Staff)") //Appendix 2B
            this.listOfAppendixToBeDisplayed.push("Cost - Resources, Equipment") //Appendix 3a
            this.listOfAppendixToBeDisplayed.push("Quantum - Resources, Equipment") //Appendix 3b
            this.listOfAppendixToBeDisplayed.push("Cost - Resources, Utility") //Appendix 4a
            this.listOfAppendixToBeDisplayed.push("Quantum - Resources, Utility") //Appendix 4b
            this.listOfAppendixToBeDisplayed.push("Cost - Facility, Site Administration")  //Appendix 5
            this.listOfAppendixToBeDisplayed.push("Cost - Facility, Transportation") //Appendix 6A
            this.listOfAppendixToBeDisplayed.push("Quantum - Facility, Transporation") //Appendix 6B
            A1 = A1 + 1
            B1 = 5
            console.log(options, this.selectedOptions)
          }
          if(options.includes('Escalation - Material')) {
            this.listOfAppendixToBeDisplayed.push("Cost - Escalation, Material")  //Appendix 7
            
          }
          if(options.includes('Escalation - Labour')) {
            this.listOfAppendixToBeDisplayed.push("Cost - Escalation, Labour") //Appendix 8A
            this.listOfAppendixToBeDisplayed.push("Quantum - Escalation, Labour")  //Appendix 8B
            this.listOfAppendixToBeDisplayed.push("Rate - Escalation, Labour")  //Appendix 8C
            
          }
          if(options.includes('Loss of Productivity')) {
            this.listOfAppendixToBeDisplayed.push("Cost - Loss of Productivity")  //Appendix 9A
            this.listOfAppendixToBeDisplayed.push("Quantum (Impact) - Loss of Productivity")  //Appendix 9B
            this.listOfAppendixToBeDisplayed.push("Quantum (Max) - Loss of Productivity")  //Appendix 9
            
          }
          if(options.includes('De-moblisation')){
         
            this.listOfAppendixToBeDisplayed.push("Cost - Demobilisation")  //Appendix 10
            
          }
          if(options.includes('Re-moblisation')){
            this.listOfAppendixToBeDisplayed.push("Cost - Remobilisation")  //Appendix 11
          }
          if(options.includes('Head Office Overheads')){
            this.listOfAppendixToBeDisplayed.push("Head Office Overheads") //Appendix 12
          }
          if(options.includes("Subcontractor's Claims")){
            this.listOfAppendixToBeDisplayed.push("Subcontractor's Claims")  //Appendix 13
            this.selectedOptionSC = true
          }
          if(options.includes('Profit on Claim')){
            this.listOfAppendixToBeDisplayed.push("Profit on the Cost")  //Appendix 14
          }
          if(options.includes('Loss of Profit')){
            this.listOfAppendixToBeDisplayed.push("Loss of Profit")  //Appendix 15
          }
          if(options.includes('Damages')){
            this.listOfAppendixToBeDisplayed.push("Other Damages")  //Appendix 16
          }
          if(options.includes('Financiaal Charge on Delayed Profit')){
            this.listOfAppendixToBeDisplayed.push("Financial Charge on Delayed Profit")  //Appendix 17
          }
          if(options.includes('Financiaal Charge (Interest) on Unsettled Payment')){
            this.listOfAppendixToBeDisplayed.push("Financial Charge on Delayed/Unsettled Payment")  //Appendix 18
          }
 
          for(var j = 0; j< appendixData.length; j++) {
              //if(appendixData[j]['appendixName'] != "Cost Summary" )
                //this.listOfAppendixToBeDisplayed.push(appendixData[j]['appendixName'])
              if(appendixData[j]['appendixName'] === "Cost Summary" ) {
                this.summaryTable = appendixData[j]['actualData']
                this.cuurentAppendixData = this.summaryTable
                let index = appendixData[j]['actualData'].length
                this.sumA[19] = appendixData[j]['actualData'][index - 1][2]

              }
              if(appendixData[j]['appendixName'] === "Appendix 1" ) {
                this.appendix_1_Data = appendixData[j]['actualData']
                let index = appendixData[j]['actualData'].length
                this.sumA[1] = appendixData[j]['actualData'][index - 1][5]
  
              }
              if(appendixData[j]['appendixName'] === "Appendix 2B" ) {
                this.appendix_2B_Data =  appendixData[j]['actualData']
              }
              if(appendixData[j]['appendixName'] === "Appendix 2A" ) {
                this.appendix_2A_Data = appendixData[j]['actualData']
                let index = appendixData[j]['actualData'].length
                this.sumA[2] = appendixData[j]['actualData'][index - 1][6]
              }
              if(appendixData[j]['appendixName'] === "Appendix 3B" ) {
                this.appendix_3B_Data = appendixData[j]['actualData']
              }
              if(appendixData[j]['appendixName'] === "Appendix 3A" ) {
                this.appendix_3A_Data = appendixData[j]['actualData']
                let index = appendixData[j]['actualData'].length
                this.sumA[3] = appendixData[j]['actualData'][index - 1][6]
              }
              if(appendixData[j]['appendixName'] === "Appendix 4B" ) {
                this.appendix_4B_Data = appendixData[j]['actualData']
              }
              if(appendixData[j]['appendixName'] === "Appendix 4A" ) {
                this.appendix_4A_Data = appendixData[j]['actualData']
                let index = appendixData[j]['actualData'].length
                this.sumA[4] = appendixData[j]['actualData'][index - 1][6]
              }
              if(appendixData[j]['appendixName'] === "Appendix 5" ) {
                this.appendix_5_Data = appendixData[j]['actualData']
                let index = appendixData[j]['actualData'].length
                this.sumA[5] = appendixData[j]['actualData'][index - 1][5]
              }
              if(appendixData[j]['appendixName'] === "Appendix 6B" ) {
                this.appendix_6B_Data = appendixData[j]['actualData']
              }
              if(appendixData[j]['appendixName'] === "Appendix 6A" ) {
                this.appendix_6A_Data = appendixData[j]['actualData']
                let index = appendixData[j]['actualData'].length
                this.sumA[6] = appendixData[j]['actualData'][index - 1][6]
              }
              if(appendixData[j]['appendixName'] === "Appendix 7" ) {
                this.appendix_7_Data = appendixData[j]['actualData']
                let index = appendixData[j]['actualData'].length
               this.sumA[7] = appendixData[j]['actualData'][index - 1][8]
              }
              if(appendixData[j]['appendixName'] === "Appendix 8C" ) {
                this.appendix_8C_Data = appendixData[j]['actualData']
              }
              if(appendixData[j]['appendixName'] === "Appendix 8B" ) {
                this.appendix_8B_Data = appendixData[j]['actualData']
              }
              if(appendixData[j]['appendixName'] === "Appendix 8A" ) {
                this.appendix_8A_Data = appendixData[j]['actualData']
                let index = appendixData[j]['actualData'].length
                this.sumA[8] = appendixData[j]['actualData'][index - 1][8]
              }
              if(appendixData[j]['appendixName'] === "Appendix 9C" ) {
                this.appendix_9C_Data = appendixData[j]['actualData']
              }
              if(appendixData[j]['appendixName'] === "Appendix 9B" ) {
                this.appendix_9B_Data = appendixData[j]['actualData']
              }
              if(appendixData[j]['appendixName'] === "Appendix 9A" ) {
                this.appendix_9A_Data = appendixData[j]['actualData']
                let index = appendixData[j]['actualData'].length
                this.sumA[9] = appendixData[j]['actualData'][index - 1][11]
              }
              if(appendixData[j]['appendixName'] === "Appendix 10" ) {
                this.appendix_10_Data = appendixData[j]['actualData']
                let index = appendixData[j]['actualData'].length
                this.sumA[10] = appendixData[j]['actualData'][index - 1][6]
              }
              if(appendixData[j]['appendixName'] === "Appendix 11" ) {
                this.appendix_11_Data = appendixData[j]['actualData']
                let index = appendixData[j]['actualData'].length
                this.sumA[11] = appendixData[j]['actualData'][index - 1][6]
              }
              if(appendixData[j]['appendixName'] === "Appendix 12" ) {
                this.appendix_12_Data = appendixData[j]['actualData']
                let index = appendixData[j]['actualData'].length
                this.sumA[12] = appendixData[j]['actualData'][index - 1][2]
              }
              if(appendixData[j]['appendixName'] === "Appendix 13" ) {
                this.appendix_13_Data = appendixData[j]['actualData']
                let index = appendixData[j]['actualData'].length
                this.sumA[13] = appendixData[j]['actualData'][index - 1][2]
              }
              if(appendixData[j]['appendixName'] === "Appendix 14" ) {
                this.appendix_14_Data = appendixData[j]['actualData']
                let index = appendixData[j]['actualData'].length
                this.sumA[14] = appendixData[j]['actualData'][index - 1][2]
              }
              if(appendixData[j]['appendixName'] === "Appendix 15" ) {
                this.appendix_15_Data = appendixData[j]['actualData']
                let index = appendixData[j]['actualData'].length
                this.sumA[15] = appendixData[j]['actualData'][index - 1][2]
              }
              if(appendixData[j]['appendixName'] === "Appendix 16" ) {
                this.appendix_16_Data = appendixData[j]['actualData']
                let index = appendixData[j]['actualData'].length
                this.sumA[16] = appendixData[j]['actualData'][index - 1][3]
              }
              if(appendixData[j]['appendixName'] === "Appendix 17" ) {
                this.appendix_17_Data = appendixData[j]['actualData']
                let index = appendixData[j]['actualData'].length
                this.sumA[17] = appendixData[j]['actualData'][index - 1][2]
              }
              if(appendixData[j]['appendixName'] === "Appendix 18" ) {
                this.appendix_18_Data = appendixData[j]['actualData']
                let index = appendixData[j]['actualData'].length
                this.sumA[18] = appendixData[j]['actualData'][index - 1][7]
              }
          }
          //this.AppN = "tF0"
          //this.setDates()
          //this.setDatesFromCommencementDate()
          this.getProjectData(projectId)
          this.getBasicProjectDataForReviewer()
          localStorage.setItem(
            "initAppendixData",
            JSON.stringify("false")
          );
          //this.openClaimSelectionRef.close();
  }

  word() {
    console.log("Word clicked")
  }



viewReport(event: any) {
  this.reportLoading()
  this.SH = "No"

  this.generateReportVariable()
  this.currentAppendixHeader = "Cost Claim Report"
  //console.log(this.regionFormat, this.monthFormat,  this.dayFormat,  this.yearFormat)
  //alert (this.contractAs - this.regionFormat)
  setTimeout(() => {
  this.reportView = true
   }, 1000);
}

public navigateToSection(section: string) {
  console.log(this.reportView)
  window.location.hash = '';
  window.location.hash = section;
  console.log(this.reportView)
  this.reportView = true
}



formatDate(value) {

    if (value) { 
      let projectData = JSON.parse(localStorage.getItem("projectData"));
      this.regionFormat = projectData.regionFormat
      this.yearFormat = projectData.yearFormat
      this.monthFormat = projectData.monthFormat
      this.dayFormat = projectData.dayFormat
      let date = new Date(value);
      var formattedDate = new Intl.DateTimeFormat(this.regionFormat, {year: this.yearFormat, month: this.monthFormat, day: this.dayFormat}).format(date);
      return formattedDate
    }
    else {
      return ""
    }
  
  }

formatNumber(value: number) {
  // this is for formatting single value/number
 /*let projectData = JSON.parse(localStorage.getItem("projectData"));

  const formatSetting =  new Intl.NumberFormat(projectData.regionFormat, {minimumFractionDigits: projectData.decimalPlaces, maximumFractionDigits: projectData.decimalPlaces});
  */
  const formatSetting =  new Intl.NumberFormat(this.regionFormat, {minimumFractionDigits: this.decimalPlaces, maximumFractionDigits: this.decimalPlaces});
 
  var formattedNumber = formatSetting.format(value)

  return formattedNumber
}

formatNumberInPercent(value: number) {
  // this is for formatting single value/number
  let projectData = JSON.parse(localStorage.getItem("projectData"));
  const formatPercentSetting =  new Intl.NumberFormat(projectData.regionFormat, {style: 'percent', minimumFractionDigits: projectData.decimalPlaces, maximumFractionDigits: projectData.decimalPlaces});
  var formattedPercent = formatPercentSetting.format(value/100)

  return formattedPercent
}

formatCurrentAppendixNumberColOld(TableID:string) {
    //this is for formatting the CurrentAppendix and this will run after formation of CurrentAppendix
    // this is the best place it will help even user changed the format settings. so diaplay based on the format.
    //TableID is identify the Appendix to format (Refer Excel Output file)

    console.log("Number Format")
    /*let actualProjectData: any;
    const projectId = JSON.parse(localStorage.getItem("selectedProject"));
    
    this.projectService.getProjectDataById(projectId).subscribe((res) => {
      actualProjectData = res;
      console.log(res)
    })*/
    let projectData = JSON.parse(localStorage.getItem("projectData"));

    const formatSetting =  new Intl.NumberFormat(projectData.regionFormat, {minimumFractionDigits: projectData.decimalPlaces, maximumFractionDigits: projectData.decimalPlaces});
    const formatPercentSetting =  new Intl.NumberFormat(projectData.regionFormat, {style: 'percent', minimumFractionDigits: projectData.decimalPlaces, maximumFractionDigits: projectData.decimalPlaces});
  
  setTimeout(() => {
      if(TableID ==="tF0") {
          let nRow = this.summaryTable.length
          for (let i = 1; i < nRow; i++) {            // i start after heading row that may be 1 or 2   
            if (this.summaryTable[i][2] === "" || this.summaryTable[i][2] === null) {}          // otherwise will display formated zero
            else {this.summaryTable[i][2] = formatSetting.format(this.summaryTable[i][2])} 
          }
      }
      else if(TableID ==="tF1") {
        let nRow = this.appendix_1_Data.length
        for (let i = 2; i < nRow; i++) {        
          if (this.appendix_1_Data[i][2] === "" || this.appendix_1_Data[i][2] === null) {}          // otherwise will display formated zero
          else {this.appendix_1_Data[i][2] = formatSetting.format(this.appendix_1_Data[i][2])} 
          if (this.appendix_1_Data[i][4] === "" || this.appendix_1_Data[i][4] === null) {}          // otherwise will display formated zero
          else {this.appendix_1_Data[i][4] = formatSetting.format(this.appendix_1_Data[i][4])} 
          if (this.appendix_1_Data[i][5] === "" || this.appendix_1_Data[i][5] === null) {}          // otherwise will display formated zero
          else {this.appendix_1_Data[i][5] = formatSetting.format(this.appendix_1_Data[i][5])} 
        }
      }
      else if(TableID ==="tF2A") {
        let nRow = this.appendix_2A_Data.length
        for (let i = 2; i < nRow; i++) {        
          if (this.appendix_2A_Data[i][2] === "" || this.appendix_2A_Data[i][2] === null) {}          // otherwise will display formated zero
          else {this.appendix_2A_Data[i][2] = formatSetting.format(this.appendix_2A_Data[i][2])} 
          if (this.appendix_2A_Data[i][4] === "" || this.appendix_2A_Data[i][4] === null) {}          // otherwise will display formated zero
          else {this.appendix_2A_Data[i][4] = formatSetting.format(this.appendix_2A_Data[i][4])} 
          if (this.appendix_2A_Data[i][5] === "" || this.appendix_2A_Data[i][5] === null) {}          // otherwise will display formated zero
          else {this.appendix_2A_Data[i][5] = formatSetting.format(this.appendix_2A_Data[i][5])} 
          if (this.appendix_2A_Data[i][6] === "" || this.appendix_2A_Data[i][6] === null) {}          // otherwise will display formated zero
          else {this.appendix_2A_Data[i][6] = formatSetting.format(this.appendix_2A_Data[i][6])} 
        }
      }
      else if(TableID ==="tF2B") {
        let nRow = this.appendix_2B_Data.length
        let nCol = this.appendix_2B_Data[0].length
        for (let i = 1; i < nRow; i++) {        
          for (let j = 2; j < nCol; j++){
          if (this.appendix_2B_Data[i][j] === "" || this.appendix_2B_Data[i][j] === null) {}          // otherwise will display formated zero
          else {this.appendix_2B_Data[i][j] = formatSetting.format(this.appendix_2B_Data[i][j])} 
          }
        }
      }
      else if(TableID ==="tF3A") {
        let nRow = this.appendix_3A_Data.length
        for (let i = 2; i < nRow; i++) {        
          if (this.appendix_3A_Data[i][2] === "" || this.appendix_3A_Data[i][2] === null) {}          // otherwise will display formated zero
          else {this.appendix_3A_Data[i][2] = formatSetting.format(this.appendix_3A_Data[i][2])} 
          if (this.appendix_3A_Data[i][4] === "" || this.appendix_3A_Data[i][4] === null) {}          // otherwise will display formated zero
          else {this.appendix_3A_Data[i][4] = formatSetting.format(this.appendix_3A_Data[i][4])} 
          if (this.appendix_3A_Data[i][5] === "" || this.appendix_3A_Data[i][5] === null) {}          // otherwise will display formated zero
          else {this.appendix_3A_Data[i][5] = formatSetting.format(this.appendix_3A_Data[i][5])} 
          if (this.appendix_3A_Data[i][6] === "" || this.appendix_3A_Data[i][6] === null) {}          // otherwise will display formated zero
          else {this.appendix_3A_Data[i][6] = formatSetting.format(this.appendix_3A_Data[i][6])} 
        }
      }
      else if(TableID ==="tF3B") {
        let nRow = this.appendix_3B_Data.length
        let nCol = this.appendix_3B_Data[0].length
        for (let i = 1; i < nRow; i++) {        
          for (let j = 2; j < nCol; j++){
          if (this.appendix_3B_Data[i][j] === "" || this.appendix_3B_Data[i][j] === null) {}          // otherwise will display formated zero
          else {this.appendix_3B_Data[i][j] = formatSetting.format(this.appendix_3B_Data[i][j])} 
          }
        }
      }
      else if(TableID ==="tF4A") {
        let nRow = this.appendix_4A_Data.length
        for (let i = 2; i < nRow; i++) {        
          if (this.appendix_4A_Data[i][2] === "" || this.appendix_4A_Data[i][2] === null) {}          // otherwise will display formated zero
          else {this.appendix_4A_Data[i][2] = formatSetting.format(this.appendix_4A_Data[i][2])} 
          if (this.appendix_4A_Data[i][4] === "" || this.appendix_4A_Data[i][4] === null) {}          // otherwise will display formated zero
          else {this.appendix_4A_Data[i][4] = formatSetting.format(this.appendix_4A_Data[i][4])} 
          if (this.appendix_4A_Data[i][5] === "" || this.appendix_4A_Data[i][5] === null) {}          // otherwise will display formated zero
          else {this.appendix_4A_Data[i][5] = formatSetting.format(this.appendix_4A_Data[i][5])} 
          if (this.appendix_4A_Data[i][6] === "" || this.appendix_4A_Data[i][6] === null) {}          // otherwise will display formated zero
          else {this.appendix_4A_Data[i][6] = formatSetting.format(this.appendix_4A_Data[i][6])} 
        }
      }
      else if(TableID ==="tF4B") {
        let nRow = this.appendix_4B_Data.length
        let nCol = this.appendix_4B_Data[0].length
        for (let i = 1; i < nRow; i++) {        
          for (let j = 3; j < nCol; j++){
          if (this.appendix_4B_Data[i][j] === "" || this.appendix_4B_Data[i][j] === null) {}          // otherwise will display formated zero
          else {this.appendix_4B_Data[i][j] = formatSetting.format(this.appendix_4B_Data[i][j])} 
          }
        }
      }
      else if(TableID ==="tF5") {
        let nRow = this.appendix_5_Data.length
        for (let i = 2; i < nRow; i++) {        
          if (this.appendix_5_Data[i][2] === "" || this.appendix_5_Data[i][2] === null) {}          // otherwise will display formated zero
          else {this.appendix_5_Data[i][2] = formatSetting.format(this.appendix_5_Data[i][2])} 
          if (this.appendix_5_Data[i][4] === "" || this.appendix_5_Data[i][4] === null) {}          // otherwise will display formated zero
          else {this.appendix_5_Data[i][4] = formatSetting.format(this.appendix_5_Data[i][4])} 
          if (this.appendix_5_Data[i][5] === "" || this.appendix_5_Data[i][5] === null) {}          // otherwise will display formated zero
          else {this.appendix_5_Data[i][5] = formatSetting.format(this.appendix_5_Data[i][5])} 
        }
      }
      else if(TableID ==="tF6A") {
        let nRow = this.appendix_6A_Data.length
        for (let i = 2; i < nRow; i++) {        
          if (this.appendix_6A_Data[i][2] === "" || this.appendix_6A_Data[i][2] === null) {}          // otherwise will display formated zero
          else {this.appendix_6A_Data[i][2] = formatSetting.format(this.appendix_6A_Data[i][2])} 
          if (this.appendix_6A_Data[i][4] === "" || this.appendix_6A_Data[i][4] === null) {}          // otherwise will display formated zero
          else {this.appendix_6A_Data[i][4] = formatSetting.format(this.appendix_6A_Data[i][4])} 
          if (this.appendix_6A_Data[i][5] === "" || this.appendix_6A_Data[i][5] === null) {}          // otherwise will display formated zero
          else {this.appendix_6A_Data[i][5] = formatSetting.format(this.appendix_6A_Data[i][5])} 
          if (this.appendix_6A_Data[i][6] === "" || this.appendix_6A_Data[i][6] === null) {}          // otherwise will display formated zero
          else {this.appendix_6A_Data[i][6] = formatSetting.format(this.appendix_6A_Data[i][6])} 
        }
      }
      else if(TableID ==="tF6B") {
        let nRow = this.appendix_6B_Data.length
        let nCol = this.appendix_6B_Data[0].length
        for (let i = 1; i < nRow; i++) {        
          for (let j = 2; j < nCol; j++){
          if (this.appendix_6B_Data[i][j] === "" || this.appendix_6B_Data[i][j] === null) {}          // otherwise will display formated zero
          else {this.appendix_6B_Data[i][j] = formatSetting.format(this.appendix_6B_Data[i][j])} 
          }
        }
      }
      else if(TableID ==="tF7") {
        let nRow = this.appendix_7_Data.length
        for (let i = 2; i < nRow; i++) {        
          if (this.appendix_7_Data[i][3] === "" || this.appendix_7_Data[i][3] === null) {}          // otherwise will display formated zero
          else {this.appendix_7_Data[i][3] = formatSetting.format(this.appendix_7_Data[i][3])} 
          if (this.appendix_7_Data[i][5] === "" || this.appendix_7_Data[i][5] === null) {}          // otherwise will display formated zero
          else {this.appendix_7_Data[i][5] = formatSetting.format(this.appendix_7_Data[i][5])} 
          if (this.appendix_7_Data[i][6] === "" || this.appendix_7_Data[i][6] === null) {}          // otherwise will display formated zero
          else {this.appendix_7_Data[i][6] = formatSetting.format(this.appendix_7_Data[i][6])} 
          if (this.appendix_7_Data[i][7] === "" || this.appendix_7_Data[i][7] === null) {}          // otherwise will display formated zero
          else {this.appendix_7_Data[i][7] = formatSetting.format(this.appendix_7_Data[i][7])} 
          if (this.appendix_7_Data[i][8] === "" || this.appendix_7_Data[i][8] === null) {}          // otherwise will display formated zero
          else {this.appendix_7_Data[i][8] = formatSetting.format(this.appendix_7_Data[i][8])} 
        }
      }
      else if(TableID ==="tF8A") {
        let nRow = this.appendix_8A_Data.length
        for (let i = 2; i < nRow; i++) {        
            if (this.appendix_8A_Data[i][3] === "" || this.appendix_8A_Data[i][3] === null) {}          // otherwise will display formated zero
            else {this.appendix_8A_Data[i][3] = formatSetting.format(this.appendix_8A_Data[i][3])} 
            if (this.appendix_8A_Data[i][5] === "" || this.appendix_8A_Data[i][5] === null) {}          // otherwise will display formated zero
            else {this.appendix_8A_Data[i][5] = formatSetting.format(this.appendix_8A_Data[i][5])} 
            if (this.appendix_8A_Data[i][6] === "" || this.appendix_8A_Data[i][6] === null) {}          // otherwise will display formated zero
            else {this.appendix_8A_Data[i][6] = formatSetting.format(this.appendix_8A_Data[i][6])} 
            if (this.appendix_8A_Data[i][7] === "" || this.appendix_8A_Data[i][7] === null) {}          // otherwise will display formated zero
            else {this.appendix_8A_Data[i][7] = formatSetting.format(this.appendix_8A_Data[i][7])} 
            if (this.appendix_8A_Data[i][8] === "" || this.appendix_8A_Data[i][8] === null) {}          // otherwise will display formated zero
            else {this.appendix_8A_Data[i][8] = formatSetting.format(this.appendix_8A_Data[i][8])} 
        }
      }
      else if(TableID ==="tF8B") {
        let nRow = this.appendix_8B_Data.length
        let nCol = this.appendix_8B_Data[0].length
        for (let i = 1; i < nRow; i++) {        
          for (let j = 3; j < nCol; j++){
          if (this.appendix_8B_Data[i][j] === "" || this.appendix_8B_Data[i][j] === null) {}          // otherwise will display formated zero
          else {this.appendix_8B_Data[i][j] = formatSetting.format(this.appendix_8B_Data[i][j])} 
          }
        }
      }
      else if(TableID ==="tF8C") {
        let nRow = this.appendix_8C_Data.length
        let nCol = this.appendix_8C_Data[0].length
        for (let i = 1; i < nRow; i++) {        
          for (let j = 3; j < nCol; j++){
          if (this.appendix_8C_Data[i][j] === "" || this.appendix_8C_Data[i][j] === null) {}          // otherwise will display formated zero
          else {this.appendix_8C_Data[i][j] = formatSetting.format(this.appendix_8C_Data[i][j])} 
          }
        }
      }
      else if(TableID ==="tF9A") {
        let nRow = this.appendix_9A_Data.length
        let nCol = this.appendix_9A_Data[0].length
        for (let i = 2; i < nRow; i++) {
            if (this.appendix_9A_Data[i][4] === "" || this.appendix_9A_Data[i][4] === null) {}          // otherwise will display formated zero
            else {this.appendix_9A_Data[i][4] = formatSetting.format(this.appendix_9A_Data[i][4])} 
            
            for (let j = 6; j < nCol; j++){
            if (this.appendix_9A_Data[i][j] === "" || this.appendix_9A_Data[i][j] === null) {}          // otherwise will display formated zero
            else {this.appendix_9A_Data[i][j] = formatSetting.format(this.appendix_9A_Data[i][j])} 
          }
        }
      }
      else if(TableID ==="tF9B") {
        let nRow = this.appendix_9B_Data.length
        let nCol = this.appendix_9B_Data[0].length
        for (let i = 1; i < nRow; i++) {        
          for (let j = 4; j < nCol; j++){
          if (this.appendix_9B_Data[i][j] === "" || this.appendix_9B_Data[i][j] === null) {}          // otherwise will display formated zero
          else {this.appendix_9B_Data[i][j] = formatSetting.format(this.appendix_9B_Data[i][j])} 
          }
        }
      }
      else if(TableID ==="tF9C") {
        let nRow = this.appendix_9C_Data.length
        for (let i = 1; i < nRow; i++) {        
          if (this.appendix_9C_Data[i][4] === "" || this.appendix_9C_Data[i][4] === null) {}          // otherwise will display formated zero
          else {this.appendix_9C_Data[i][4] = formatSetting.format(this.appendix_9C_Data[i][4])} 
        }
      }
      else if(TableID ==="tF10") {
        let nRow = this.appendix_10_Data.length
        for (let i = 2; i < nRow; i++) {  
            if (this.appendix_10_Data[i][3] === "" || this.appendix_10_Data[i][3] === null) {}          // otherwise will display formated zero
            else {this.appendix_10_Data[i][3] = formatSetting.format(this.appendix_10_Data[i][3])} 
            if (this.appendix_10_Data[i][5] === "" || this.appendix_10_Data[i][5] === null) {}          // otherwise will display formated zero
            else {this.appendix_10_Data[i][5] = formatSetting.format(this.appendix_10_Data[i][5])} 
            if (this.appendix_10_Data[i][6] === "" || this.appendix_10_Data[i][6] === null) {}          // otherwise will display formated zero
            else {this.appendix_10_Data[i][6] = formatSetting.format(this.appendix_10_Data[i][6])} 
        }
      }
      else if(TableID ==="tF11") {
        let nRow = this.appendix_11_Data.length
        for (let i = 2; i < nRow; i++) {        
          if (this.appendix_11_Data[i][3] === "" || this.appendix_11_Data[i][3] === null) {}          // otherwise will display formated zero
          else {this.appendix_11_Data[i][3] = formatSetting.format(this.appendix_11_Data[i][3])} 
          if (this.appendix_11_Data[i][5] === "" || this.appendix_11_Data[i][5] === null) {}          // otherwise will display formated zero
          else {this.appendix_11_Data[i][5] = formatSetting.format(this.appendix_11_Data[i][5])} 
          if (this.appendix_11_Data[i][6] === "" || this.appendix_11_Data[i][6] === null) {}          // otherwise will display formated zero
          else {this.appendix_11_Data[i][6] = formatSetting.format(this.appendix_11_Data[i][6])} 
        }
      }
      else if(TableID ==="tF12") {
            //differnet strategy needs to be applied
        let nRow = this.appendix_12_Data.length
          if (this.appendix_12_Data[nRow-2][2] === "" || this.appendix_12_Data[nRow-2][2] === null) {}          // otherwise will display formated zero
          else {this.appendix_12_Data[nRow-2][2] = formatSetting.format(this.appendix_12_Data[nRow-2][2])} 
          if (this.appendix_12_Data[nRow-1][2] === "" || this.appendix_12_Data[nRow-1][2] === null) {}          // otherwise will display formated zero
          else {this.appendix_12_Data[nRow-1][2] = formatSetting.format(this.appendix_12_Data[nRow-1][2])} 

        }
      else if(TableID ==="tF13") {
        let nRow = this.appendix_13_Data.length
        for (let i = 1; i < nRow; i++) {        
          if (this.appendix_13_Data[i][2] === "" || this.appendix_13_Data[i][2] === null) {}          // otherwise will display formated zero
          else {this.appendix_13_Data[i][2] = formatSetting.format(this.appendix_13_Data[i][2])} 
 
        }
      }
      else if(TableID ==="tF14") {
        let nRow = this.appendix_14_Data.length
        for (let i = 1; i < nRow; i++) {        
          
          if (this.appendix_14_Data[i][2] === "" || this.appendix_14_Data[i][2] === null || this.appendix_14_Data[i][2] === undefined) {}          // no action - will display zero
          else if (i === nRow-4) {this.appendix_14_Data[i][2] = formatPercentSetting.format((this.appendix_14_Data[i][2])/100)}     // format for Percent
          else {this.appendix_14_Data[i][2] = formatSetting.format(this.appendix_14_Data[i][2])} 
 
        }
      }
      else if(TableID ==="tF15") {
        let nRow = this.appendix_15_Data.length
          if (this.appendix_15_Data[nRow-2][2] === "" || this.appendix_15_Data[nRow-2][2] === null) {}          // otherwise will display formated zero
          else {this.appendix_15_Data[nRow-2][2] = formatSetting.format(this.appendix_15_Data[nRow-2][2])} 
          if (this.appendix_15_Data[nRow-1][2] === "" || this.appendix_15_Data[nRow-1][2] === null) {}          // otherwise will display formated zero
          else {this.appendix_15_Data[nRow-1][2] = formatSetting.format(this.appendix_15_Data[nRow-1][2])} 

      }
      else if(TableID ==="tF16") {
        let nRow = this.appendix_16_Data.length
        for (let i = 1; i < nRow; i++) {        
          if (this.appendix_16_Data[i][3] === "" || this.appendix_16_Data[i][3] === null) {}          // otherwise will display formated zero
          else {this.appendix_16_Data[i][3] = formatSetting.format(this.appendix_16_Data[i][3])} 
 
        }
      }
      else if(TableID ==="tF17") {
        let nRow = this.appendix_17_Data.length
          if (this.appendix_17_Data[nRow-2][2] === "" || this.appendix_17_Data[nRow-2][2] === null) {}          // otherwise will display formated zero
          else {this.appendix_17_Data[nRow-2][2] = formatSetting.format(this.appendix_17_Data[nRow-2][2])} 
          if (this.appendix_17_Data[nRow-1][2] === "" || this.appendix_17_Data[nRow-1][2] === null) {}          // otherwise will display formated zero
          else {this.appendix_17_Data[nRow-1][2] = formatSetting.format(this.appendix_17_Data[nRow-1][2])} 
      }
      else if(TableID ==="tF18") {
        let nRow = this.appendix_18_Data.length
        for (let i = 2; i < nRow; i++) {        
          if (this.appendix_18_Data[i][2] === "" || this.appendix_18_Data[i][2] === null) {}          // otherwise will display formated zero
          else {this.appendix_18_Data[i][2] = formatSetting.format(this.appendix_18_Data[i][2])} 
          if (this.appendix_18_Data[i][5] === "" || this.appendix_18_Data[i][5] === null) {}          // otherwise will display formated zero
          else {this.appendix_18_Data[i][5] = formatPercentSetting.format((this.appendix_18_Data[i][5])/100)} 
          if (this.appendix_18_Data[i][7] === "" || this.appendix_18_Data[i][7] === null) {}          // otherwise will display formated zero
          else {this.appendix_18_Data[i][7] = formatSetting.format(this.appendix_18_Data[i][7])} 
        }
      }

  }, 1000);
}


formatCurrentAppendixNumberCol(TableID:string) {
  //this is for formatting the CurrentAppendix and this will run after formation of CurrentAppendix
  // this is the best place it will help even user changed the format settings. so diaplay based on the format.
  //TableID is identify the Appendix to format (Refer Excel Output file)
  // it will create new array data

  console.log("Number Format")
  /*let actualProjectData: any;
  const projectId = JSON.parse(localStorage.getItem("selectedProject"));
  
  this.projectService.getProjectDataById(projectId).subscribe((res) => {
    actualProjectData = res;
    console.log(res)
  })*/
  let projectData = JSON.parse(localStorage.getItem("projectData"));

  const formatSetting =  new Intl.NumberFormat(projectData.regionFormat, {minimumFractionDigits: projectData.decimalPlaces, maximumFractionDigits: projectData.decimalPlaces});
  const formatPercentSetting =  new Intl.NumberFormat(projectData.regionFormat, {style: 'percent', minimumFractionDigits: projectData.decimalPlaces, maximumFractionDigits: projectData.decimalPlaces});

setTimeout(() => {
    if(TableID ==="tF0") {
        let nRow = this.summaryTable.length
        for (let i = 1; i < nRow; i++) {            // i start after heading row that may be 1 or 2   
          if (this.summaryTable[i][2] === "" || this.summaryTable[i][2] === null) {}          // otherwise will display formated zero
          else {this.summaryTable[i][2] = formatSetting.format(this.summaryTable[i][2])} 
        }
    }
    else if(TableID ==="tF1") {
      let nRow = this.appendix_1_Data.length
      for (let i = 2; i < nRow; i++) {        
        if (this.appendix_1_Data[i][2] === "" || this.appendix_1_Data[i][2] === null) {}          // otherwise will display formated zero
        else {this.appendix_1_Data[i][2] = formatSetting.format(this.appendix_1_Data[i][2])} 
        if (this.appendix_1_Data[i][4] === "" || this.appendix_1_Data[i][4] === null) {}          // otherwise will display formated zero
        else {this.appendix_1_Data[i][4] = formatSetting.format(this.appendix_1_Data[i][4])} 
        if (this.appendix_1_Data[i][5] === "" || this.appendix_1_Data[i][5] === null) {}          // otherwise will display formated zero
        else {this.appendix_1_Data[i][5] = formatSetting.format(this.appendix_1_Data[i][5])} 
      }
    }
    else if(TableID ==="tF2A") {
      let nRow = this.appendix_2A_Data.length
      for (let i = 2; i < nRow; i++) {        
        if (this.appendix_2A_Data[i][2] === "" || this.appendix_2A_Data[i][2] === null) {}          // otherwise will display formated zero
        else {this.appendix_2A_Data[i][2] = formatSetting.format(this.appendix_2A_Data[i][2])} 
        if (this.appendix_2A_Data[i][4] === "" || this.appendix_2A_Data[i][4] === null) {}          // otherwise will display formated zero
        else {this.appendix_2A_Data[i][4] = formatSetting.format(this.appendix_2A_Data[i][4])} 
        if (this.appendix_2A_Data[i][5] === "" || this.appendix_2A_Data[i][5] === null) {}          // otherwise will display formated zero
        else {this.appendix_2A_Data[i][5] = formatSetting.format(this.appendix_2A_Data[i][5])} 
        if (this.appendix_2A_Data[i][6] === "" || this.appendix_2A_Data[i][6] === null) {}          // otherwise will display formated zero
        else {this.appendix_2A_Data[i][6] = formatSetting.format(this.appendix_2A_Data[i][6])} 
      }
    }
    else if(TableID ==="tF2B") {
      let nRow = this.appendix_2B_Data.length
      let nCol = this.appendix_2B_Data[0].length
      for (let i = 1; i < nRow; i++) {        
        for (let j = 2; j < nCol; j++){
        if (this.appendix_2B_Data[i][j] === "" || this.appendix_2B_Data[i][j] === null) {}          // otherwise will display formated zero
        else {this.appendix_2B_Data[i][j] = formatSetting.format(this.appendix_2B_Data[i][j])} 
        }
      }
    }
    else if(TableID ==="tF3A") {
      let nRow = this.appendix_3A_Data.length
      for (let i = 2; i < nRow; i++) {        
        if (this.appendix_3A_Data[i][2] === "" || this.appendix_3A_Data[i][2] === null) {}          // otherwise will display formated zero
        else {this.appendix_3A_Data[i][2] = formatSetting.format(this.appendix_3A_Data[i][2])} 
        if (this.appendix_3A_Data[i][4] === "" || this.appendix_3A_Data[i][4] === null) {}          // otherwise will display formated zero
        else {this.appendix_3A_Data[i][4] = formatSetting.format(this.appendix_3A_Data[i][4])} 
        if (this.appendix_3A_Data[i][5] === "" || this.appendix_3A_Data[i][5] === null) {}          // otherwise will display formated zero
        else {this.appendix_3A_Data[i][5] = formatSetting.format(this.appendix_3A_Data[i][5])} 
        if (this.appendix_3A_Data[i][6] === "" || this.appendix_3A_Data[i][6] === null) {}          // otherwise will display formated zero
        else {this.appendix_3A_Data[i][6] = formatSetting.format(this.appendix_3A_Data[i][6])} 
      }
    }
    else if(TableID ==="tF3B") {
      let nRow = this.appendix_3B_Data.length
      let nCol = this.appendix_3B_Data[0].length
      for (let i = 1; i < nRow; i++) {        
        for (let j = 2; j < nCol; j++){
        if (this.appendix_3B_Data[i][j] === "" || this.appendix_3B_Data[i][j] === null) {}          // otherwise will display formated zero
        else {this.appendix_3B_Data[i][j] = formatSetting.format(this.appendix_3B_Data[i][j])} 
        }
      }
    }
    else if(TableID ==="tF4A") {
      let nRow = this.appendix_4A_Data.length
      for (let i = 2; i < nRow; i++) {        
        if (this.appendix_4A_Data[i][2] === "" || this.appendix_4A_Data[i][2] === null) {}          // otherwise will display formated zero
        else {this.appendix_4A_Data[i][2] = formatSetting.format(this.appendix_4A_Data[i][2])} 
        if (this.appendix_4A_Data[i][4] === "" || this.appendix_4A_Data[i][4] === null) {}          // otherwise will display formated zero
        else {this.appendix_4A_Data[i][4] = formatSetting.format(this.appendix_4A_Data[i][4])} 
        if (this.appendix_4A_Data[i][5] === "" || this.appendix_4A_Data[i][5] === null) {}          // otherwise will display formated zero
        else {this.appendix_4A_Data[i][5] = formatSetting.format(this.appendix_4A_Data[i][5])} 
        if (this.appendix_4A_Data[i][6] === "" || this.appendix_4A_Data[i][6] === null) {}          // otherwise will display formated zero
        else {this.appendix_4A_Data[i][6] = formatSetting.format(this.appendix_4A_Data[i][6])} 
      }
    }
    else if(TableID ==="tF4B") {
      let nRow = this.appendix_4B_Data.length
      let nCol = this.appendix_4B_Data[0].length
      for (let i = 1; i < nRow; i++) {        
        for (let j = 3; j < nCol; j++){
        if (this.appendix_4B_Data[i][j] === "" || this.appendix_4B_Data[i][j] === null) {}          // otherwise will display formated zero
        else {this.appendix_4B_Data[i][j] = formatSetting.format(this.appendix_4B_Data[i][j])} 
        }
      }
    }
    else if(TableID ==="tF5") {
      let nRow = this.appendix_5_Data.length
      for (let i = 2; i < nRow; i++) {        
        if (this.appendix_5_Data[i][2] === "" || this.appendix_5_Data[i][2] === null) {}          // otherwise will display formated zero
        else {this.appendix_5_Data[i][2] = formatSetting.format(this.appendix_5_Data[i][2])} 
        if (this.appendix_5_Data[i][4] === "" || this.appendix_5_Data[i][4] === null) {}          // otherwise will display formated zero
        else {this.appendix_5_Data[i][4] = formatSetting.format(this.appendix_5_Data[i][4])} 
        if (this.appendix_5_Data[i][5] === "" || this.appendix_5_Data[i][5] === null) {}          // otherwise will display formated zero
        else {this.appendix_5_Data[i][5] = formatSetting.format(this.appendix_5_Data[i][5])} 
      }
    }
    else if(TableID ==="tF6A") {
      let nRow = this.appendix_6A_Data.length
      for (let i = 2; i < nRow; i++) {        
        if (this.appendix_6A_Data[i][2] === "" || this.appendix_6A_Data[i][2] === null) {}          // otherwise will display formated zero
        else {this.appendix_6A_Data[i][2] = formatSetting.format(this.appendix_6A_Data[i][2])} 
        if (this.appendix_6A_Data[i][4] === "" || this.appendix_6A_Data[i][4] === null) {}          // otherwise will display formated zero
        else {this.appendix_6A_Data[i][4] = formatSetting.format(this.appendix_6A_Data[i][4])} 
        if (this.appendix_6A_Data[i][5] === "" || this.appendix_6A_Data[i][5] === null) {}          // otherwise will display formated zero
        else {this.appendix_6A_Data[i][5] = formatSetting.format(this.appendix_6A_Data[i][5])} 
        if (this.appendix_6A_Data[i][6] === "" || this.appendix_6A_Data[i][6] === null) {}          // otherwise will display formated zero
        else {this.appendix_6A_Data[i][6] = formatSetting.format(this.appendix_6A_Data[i][6])} 
      }
    }
    else if(TableID ==="tF6B") {
      let nRow = this.appendix_6B_Data.length
      let nCol = this.appendix_6B_Data[0].length
      for (let i = 1; i < nRow; i++) {        
        for (let j = 2; j < nCol; j++){
        if (this.appendix_6B_Data[i][j] === "" || this.appendix_6B_Data[i][j] === null) {}          // otherwise will display formated zero
        else {this.appendix_6B_Data[i][j] = formatSetting.format(this.appendix_6B_Data[i][j])} 
        }
      }
    }
    else if(TableID ==="tF7") {
      let nRow = this.appendix_7_Data.length
      for (let i = 2; i < nRow; i++) {        
        if (this.appendix_7_Data[i][3] === "" || this.appendix_7_Data[i][3] === null) {}          // otherwise will display formated zero
        else {this.appendix_7_Data[i][3] = formatSetting.format(this.appendix_7_Data[i][3])} 
        if (this.appendix_7_Data[i][5] === "" || this.appendix_7_Data[i][5] === null) {}          // otherwise will display formated zero
        else {this.appendix_7_Data[i][5] = formatSetting.format(this.appendix_7_Data[i][5])} 
        if (this.appendix_7_Data[i][6] === "" || this.appendix_7_Data[i][6] === null) {}          // otherwise will display formated zero
        else {this.appendix_7_Data[i][6] = formatSetting.format(this.appendix_7_Data[i][6])} 
        if (this.appendix_7_Data[i][7] === "" || this.appendix_7_Data[i][7] === null) {}          // otherwise will display formated zero
        else {this.appendix_7_Data[i][7] = formatSetting.format(this.appendix_7_Data[i][7])} 
        if (this.appendix_7_Data[i][8] === "" || this.appendix_7_Data[i][8] === null) {}          // otherwise will display formated zero
        else {this.appendix_7_Data[i][8] = formatSetting.format(this.appendix_7_Data[i][8])} 
      }
    }
    else if(TableID ==="tF8A") {
      let nRow = this.appendix_8A_Data.length
      for (let i = 2; i < nRow; i++) {        
          if (this.appendix_8A_Data[i][3] === "" || this.appendix_8A_Data[i][3] === null) {}          // otherwise will display formated zero
          else {this.appendix_8A_Data[i][3] = formatSetting.format(this.appendix_8A_Data[i][3])} 
          if (this.appendix_8A_Data[i][5] === "" || this.appendix_8A_Data[i][5] === null) {}          // otherwise will display formated zero
          else {this.appendix_8A_Data[i][5] = formatSetting.format(this.appendix_8A_Data[i][5])} 
          if (this.appendix_8A_Data[i][6] === "" || this.appendix_8A_Data[i][6] === null) {}          // otherwise will display formated zero
          else {this.appendix_8A_Data[i][6] = formatSetting.format(this.appendix_8A_Data[i][6])} 
          if (this.appendix_8A_Data[i][7] === "" || this.appendix_8A_Data[i][7] === null) {}          // otherwise will display formated zero
          else {this.appendix_8A_Data[i][7] = formatSetting.format(this.appendix_8A_Data[i][7])} 
          if (this.appendix_8A_Data[i][8] === "" || this.appendix_8A_Data[i][8] === null) {}          // otherwise will display formated zero
          else {this.appendix_8A_Data[i][8] = formatSetting.format(this.appendix_8A_Data[i][8])} 
      }
    }
    else if(TableID ==="tF8B") {
      let nRow = this.appendix_8B_Data.length
      let nCol = this.appendix_8B_Data[0].length
      for (let i = 1; i < nRow; i++) {        
        for (let j = 3; j < nCol; j++){
        if (this.appendix_8B_Data[i][j] === "" || this.appendix_8B_Data[i][j] === null) {}          // otherwise will display formated zero
        else {this.appendix_8B_Data[i][j] = formatSetting.format(this.appendix_8B_Data[i][j])} 
        }
      }
    }
    else if(TableID ==="tF8C") {
      let nRow = this.appendix_8C_Data.length
      let nCol = this.appendix_8C_Data[0].length
      for (let i = 1; i < nRow; i++) {        
        for (let j = 3; j < nCol; j++){
        if (this.appendix_8C_Data[i][j] === "" || this.appendix_8C_Data[i][j] === null) {}          // otherwise will display formated zero
        else {this.appendix_8C_Data[i][j] = formatSetting.format(this.appendix_8C_Data[i][j])} 
        }
      }
    }
    else if(TableID ==="tF9A") {
      let nRow = this.appendix_9A_Data.length
      let nCol = this.appendix_9A_Data[0].length
      for (let i = 2; i < nRow; i++) {
          if (this.appendix_9A_Data[i][4] === "" || this.appendix_9A_Data[i][4] === null) {}          // otherwise will display formated zero
          else {this.appendix_9A_Data[i][4] = formatSetting.format(this.appendix_9A_Data[i][4])} 
          
          for (let j = 6; j < nCol; j++){
          if (this.appendix_9A_Data[i][j] === "" || this.appendix_9A_Data[i][j] === null) {}          // otherwise will display formated zero
          else {this.appendix_9A_Data[i][j] = formatSetting.format(this.appendix_9A_Data[i][j])} 
        }
      }
    }
    else if(TableID ==="tF9B") {
      let nRow = this.appendix_9B_Data.length
      let nCol = this.appendix_9B_Data[0].length
      for (let i = 1; i < nRow; i++) {        
        for (let j = 4; j < nCol; j++){
        if (this.appendix_9B_Data[i][j] === "" || this.appendix_9B_Data[i][j] === null) {}          // otherwise will display formated zero
        else {this.appendix_9B_Data[i][j] = formatSetting.format(this.appendix_9B_Data[i][j])} 
        }
      }
    }
    else if(TableID ==="tF9C") {
      let nRow = this.appendix_9C_Data.length
      for (let i = 1; i < nRow; i++) {        
        if (this.appendix_9C_Data[i][4] === "" || this.appendix_9C_Data[i][4] === null) {}          // otherwise will display formated zero
        else {this.appendix_9C_Data[i][4] = formatSetting.format(this.appendix_9C_Data[i][4])} 
      }
    }
    else if(TableID ==="tF10") {
      let nRow = this.appendix_10_Data.length
      for (let i = 2; i < nRow; i++) {  
          if (this.appendix_10_Data[i][3] === "" || this.appendix_10_Data[i][3] === null) {}          // otherwise will display formated zero
          else {this.appendix_10_Data[i][3] = formatSetting.format(this.appendix_10_Data[i][3])} 
          if (this.appendix_10_Data[i][5] === "" || this.appendix_10_Data[i][5] === null) {}          // otherwise will display formated zero
          else {this.appendix_10_Data[i][5] = formatSetting.format(this.appendix_10_Data[i][5])} 
          if (this.appendix_10_Data[i][6] === "" || this.appendix_10_Data[i][6] === null) {}          // otherwise will display formated zero
          else {this.appendix_10_Data[i][6] = formatSetting.format(this.appendix_10_Data[i][6])} 
      }
    }
    else if(TableID ==="tF11") {
      let nRow = this.appendix_11_Data.length
      for (let i = 2; i < nRow; i++) {        
        if (this.appendix_11_Data[i][3] === "" || this.appendix_11_Data[i][3] === null) {}          // otherwise will display formated zero
        else {this.appendix_11_Data[i][3] = formatSetting.format(this.appendix_11_Data[i][3])} 
        if (this.appendix_11_Data[i][5] === "" || this.appendix_11_Data[i][5] === null) {}          // otherwise will display formated zero
        else {this.appendix_11_Data[i][5] = formatSetting.format(this.appendix_11_Data[i][5])} 
        if (this.appendix_11_Data[i][6] === "" || this.appendix_11_Data[i][6] === null) {}          // otherwise will display formated zero
        else {this.appendix_11_Data[i][6] = formatSetting.format(this.appendix_11_Data[i][6])} 
      }
    }
    else if(TableID ==="tF12") {
          //differnet strategy needs to be applied
      let nRow = this.appendix_12_Data.length
        if (this.appendix_12_Data[nRow-2][2] === "" || this.appendix_12_Data[nRow-2][2] === null) {}          // otherwise will display formated zero
        else {this.appendix_12_Data[nRow-2][2] = formatSetting.format(this.appendix_12_Data[nRow-2][2])} 
        if (this.appendix_12_Data[nRow-1][2] === "" || this.appendix_12_Data[nRow-1][2] === null) {}          // otherwise will display formated zero
        else {this.appendix_12_Data[nRow-1][2] = formatSetting.format(this.appendix_12_Data[nRow-1][2])} 

      }
    else if(TableID ==="tF13") {
      let nRow = this.appendix_13_Data.length
      for (let i = 1; i < nRow; i++) {        
        if (this.appendix_13_Data[i][2] === "" || this.appendix_13_Data[i][2] === null) {}          // otherwise will display formated zero
        else {this.appendix_13_Data[i][2] = formatSetting.format(this.appendix_13_Data[i][2])} 

      }
    }
    else if(TableID ==="tF14") {
      let nRow = this.appendix_14_Data.length
      for (let i = 1; i < nRow; i++) {        
        
        if (this.appendix_14_Data[i][2] === "" || this.appendix_14_Data[i][2] === null || this.appendix_14_Data[i][2] === undefined) {}          // no action - will display zero
        else if (i === nRow-4) {this.appendix_14_Data[i][2] = formatPercentSetting.format((this.appendix_14_Data[i][2])/100)}     // format for Percent
        else {this.appendix_14_Data[i][2] = formatSetting.format(this.appendix_14_Data[i][2])} 

      }
    }
    else if(TableID ==="tF15") {
      let nRow = this.appendix_15_Data.length
        if (this.appendix_15_Data[nRow-2][2] === "" || this.appendix_15_Data[nRow-2][2] === null) {}          // otherwise will display formated zero
        else {this.appendix_15_Data[nRow-2][2] = formatSetting.format(this.appendix_15_Data[nRow-2][2])} 
        if (this.appendix_15_Data[nRow-1][2] === "" || this.appendix_15_Data[nRow-1][2] === null) {}          // otherwise will display formated zero
        else {this.appendix_15_Data[nRow-1][2] = formatSetting.format(this.appendix_15_Data[nRow-1][2])} 

    }
    else if(TableID ==="tF16") {
      let nRow = this.appendix_16_Data.length
      for (let i = 1; i < nRow; i++) {        
        if (this.appendix_16_Data[i][3] === "" || this.appendix_16_Data[i][3] === null) {}          // otherwise will display formated zero
        else {this.appendix_16_Data[i][3] = formatSetting.format(this.appendix_16_Data[i][3])} 

      }
    }
    else if(TableID ==="tF17") {
      let nRow = this.appendix_17_Data.length
        if (this.appendix_17_Data[nRow-2][2] === "" || this.appendix_17_Data[nRow-2][2] === null) {}          // otherwise will display formated zero
        else {this.appendix_17_Data[nRow-2][2] = formatSetting.format(this.appendix_17_Data[nRow-2][2])} 
        if (this.appendix_17_Data[nRow-1][2] === "" || this.appendix_17_Data[nRow-1][2] === null) {}          // otherwise will display formated zero
        else {this.appendix_17_Data[nRow-1][2] = formatSetting.format(this.appendix_17_Data[nRow-1][2])} 
    }
    else if(TableID ==="tF18") {
      let nRow = this.appendix_18_Data.length
      for (let i = 2; i < nRow; i++) {        
        if (this.appendix_18_Data[i][2] === "" || this.appendix_18_Data[i][2] === null) {}          // otherwise will display formated zero
        else {this.appendix_18_Data[i][2] = formatSetting.format(this.appendix_18_Data[i][2])} 
        if (this.appendix_18_Data[i][5] === "" || this.appendix_18_Data[i][5] === null) {}          // otherwise will display formated zero
        else {this.appendix_18_Data[i][5] = formatPercentSetting.format((this.appendix_18_Data[i][5])/100)} 
        if (this.appendix_18_Data[i][7] === "" || this.appendix_18_Data[i][7] === null) {}          // otherwise will display formated zero
        else {this.appendix_18_Data[i][7] = formatSetting.format(this.appendix_18_Data[i][7])} 
      }
    }

}, 1000);
}


reportLoading() {
  Swal.fire({
    title: "Generating...",
    allowEscapeKey: false,
    allowOutsideClick: false,
    background: '#fbb335',
 
    showConfirmButton:false,
    timer: 2500,
    timerProgressBar: true,
  })
}

msgReportExporting() {
  Swal.fire({
    title: "Exporting Report...",
    allowEscapeKey: false,
    allowOutsideClick: false,
    background: '#fbb335',
    showConfirmButton:false,
    timer: 2500,
    timerProgressBar: true,
  })
}

msgEvaluationExporting() {
  Swal.fire({
    title: "Exporting Evaluation...",
    allowEscapeKey: false,
    allowOutsideClick: false,
    background: '#fbb335',
    showConfirmButton:false,
    timer: 2500,
    timerProgressBar: true,
  })
}

msgExportSucessfullEvaluation() {
  Swal.fire({
    title: "Exported",
    text: "Evaluation is successfully exported.",
    icon: "success",
    showConfirmButton:true,
  })
}

msgExportSucessfullReport() {
  Swal.fire({
    title: "Exported",
    text: "Report is successfully exported.",
    icon: "success",
    showConfirmButton:true,
  })
}


openingtheClaim() {
  Swal.fire({
    title: "Opening..",
    allowEscapeKey: false,
    allowOutsideClick: false,
    background: '#fbb335',
 
    showConfirmButton:false,
    timer: 3000,
    timerProgressBar: true,
  })
}


generateSumA (){
  //this is to find the sumA variables from the saved Claim and remove comma

this.sumA[1] = Number(this.removeComma(this.sumA[1]))
this.sumA[2] = Number(this.removeComma(this.sumA[2]))
this.sumA[3] = Number(this.removeComma(this.sumA[3]))
this.sumA[4] = Number(this.removeComma(this.sumA[4]))
this.sumA[5] = Number(this.removeComma(this.sumA[5]))
this.sumA[6] = Number(this.removeComma(this.sumA[6]))
this.sumA[7] = Number(this.removeComma(this.sumA[7]))
this.sumA[8] = Number(this.removeComma(this.sumA[8]))
this.sumA[9] = Number(this.removeComma(this.sumA[9]))
this.sumA[10] = Number(this.removeComma(this.sumA[10]))
this.sumA[11] = Number(this.removeComma(this.sumA[11]))
this.sumA[12] = Number(this.removeComma(this.sumA[12]))
this.sumA[13] = Number(this.removeComma(this.sumA[13]))
this.sumA[14] = Number(this.removeComma(this.sumA[14]))
this.sumA[15] = Number(this.removeComma(this.sumA[15]))
this.sumA[16] = Number(this.removeComma(this.sumA[16]))
this.sumA[17] = Number(this.removeComma(this.sumA[17]))
this.sumA[18] = Number(this.removeComma(this.sumA[18]))
this.sumA[19] = Number(this.removeComma(this.sumA[19]))
this.sumA[0] = Number((this.sumA[1])) + Number((this.sumA[2])) +Number((this.sumA[3])) + Number((this.sumA[4])) + Number((this.sumA[5])) + Number((this.sumA[6]))
/*this.sumA[19] = Number((this.sumA[1])) + Number((this.sumA[2])) +Number((this.sumA[3])) + Number((this.sumA[4])) + Number((this.sumA[5])) + Number((this.sumA[6]))
  let i = 0
  this.sumA[19] = 0
  for (i = 1; i<19; i++) {
    this.sumA[19] = this.sumA[19] + this.sumA[i]
  }
  */
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

getProjectData(projectId: string) {
  //this is to get basic Project data for reviwer/ executer based on Project ID
  //console.log(this.regionFormat,  this.yearFormat , this.monthFormat, this.dayFormat);

  this.projectService.getProjectDataById(projectId).subscribe((res)=> {
    this.decimalPlaces = res['decimalPlaces']
    this.regionFormat = res['regionFormat']
    this.dayFormat = res['dayFormat']
    this.monthFormat = res['monthFormat']
    this.yearFormat = res['yearFormat']

    localStorage.setItem("projectData", JSON.stringify(res));
  })
}


getBasicProjectDataForReviewer() {
  //this is to get basic general variables reviwer / executer
  //console.log(this.regionFormat,  this.yearFormat , this.monthFormat, this.dayFormat);

  setTimeout(() => {
    this.generateSumA()
    this.generateReportVariable()
    this.generateAbbreviation()
    this.AppN = "tF0"

  }, 1500)
}

costSummary(){
    // this ti control the undefined value error
  if (this.sumA[19]){
    return this.costSum = this.formatNumber (this.sumA[19])
  } 
  else { return this.costSum = 0}
}

// Custom ngOnit operations
customNgOnint() {
  this.Evaluation = false;
  this.reportView = false
    this.selectedOptionSC = false             //initiate with false
    //this.Evaluation = JSON.parse(localStorage.getItem("Evaluation"))

    this.claimName = JSON.parse(localStorage.getItem("claimName"));
    const projectId = JSON.parse(localStorage.getItem("selectedProject"));
    this.projectService
            .getProjectDataById(projectId)
            .subscribe((res) => {
              console.log(res, res['contractAs']['selected'])
              this.setDaysOnCompletion(res['events'])
              this.setCurrentEventId()
              this.setExtendedContractDuaration()
              this.defendentName = res['nameOfDefendant']
              this.commencementDate = res['commencementDate']
              this.nameOfDefendant = res['nameOfDefendant']
              this.contractWorking = res['contractWorking']
              this.originalContractDurationSelect = res['originalContractDurationSelect']
              this.originalContractDurationvalue = res['originalContractDurationvalue']
              this.originalContractPrice = res['originalContractPrice']
              this.headOfficeOverheadPercentage = res['headOfficeOverheadPercentage']
              this.originalContractPriceType = res['originalContractPriceType']
              this.actualTurnoverOfCompany = res['actualTurnoverOfCompany']
              this.actualHOOverheadCost = res['actualHOOverheadCost']
              this.actualProfit = res['actualProfit']
              this.reviesdContractDuration = res['reviesdContractDuration']
              this.reviesdContractPriceValue = res['reviesdContractPriceValue']
              this.profitPercentage= res['profitPercentage']
              this.annualTurnoverOfCompany = res['annualTurnoverOfCompany']
              this.annualHOOverheadCost = res['annualHOOverheadCost']
              this.annualProfit = res['annualProfit']
              this.yearlyInterest = res['yearlyInterest']
              this.interestType = res['interestType']
              this.compoundingPeriod = res['compoundingPeriod']
              this.clauses = res['clauses']
              console.log("Bye1")
              this.savedClaims = res['claims']
              console.log(this.savedClaims)
              //this.setDatesFromCommencementDate()
             this.contractAs = res['contractAs']['selected']
             this.claimantAs = res['claimantAs']['selected']
             this.defendantAs = res['defendentAs']['selected']
             this.regionFormat = res['regionFormat']
             this.dayFormat = res['dayFormat']
             this.monthFormat = res['monthFormat']
             this.yearFormat = res['yearFormat']
             this.decimalPlaces = res['decimalPlaces']
             this.contractReference = res['contractReference']
             this.status = res['status']            // project status
            this.source = "data"
              console.log("Bye2")
            });
            /* checking for reveiwer User */
    this.userData = JSON.parse(localStorage.getItem("userData"));
    if (this.userData.isReviewer) {
      this.openingtheClaim()
      this.isReviewer = true;
      setTimeout(() => {
        let selectedReveiwerData = JSON.parse(localStorage.getItem("selectedReviewerData"));
        let obj: any = {}
        obj.selectedProject = selectedReveiwerData.projectId
        obj.defendantName = this.defendentName
        obj.claimaintList = []
        obj.selectedClaimant = selectedReveiwerData.claimantId
        this.projectService.sendSelectedProjectData(obj);
        this.currentAppendixHeader = "Cost Summary";
        console.log("Reviewer Bhai")
        console.log(this.savedClaims)
        this.generateDataForReviewer(projectId)
            // set project Name - added by Sagaya
        this.projectName = JSON.parse(localStorage.getItem("SelectedProjectName"));

      }, 2100);
    }
    else {
      this.isReviewer = false;
      this.setDates()
      this.setDatesFromCommencementDate()
      console.log(this.listOfAppendixToBeDisplayed)
      console.log(this.appendix_1_Data)
      let initAppendixData = JSON.parse(localStorage.getItem("initAppendixData"))
      this.currentAppendixHeader = "Cost Summary";
 
      this.selectedOptions = JSON.parse(localStorage.getItem("selectedOptions"));
      console.log(this.selectedOptions)
      console.log("Hello")
      this.generateAppendixAndMainHeadingsNotations()
      this.generateReportVariable()
      this.generateAbbreviation()

    this.projectService
            .getRatesById(projectId)
            .subscribe((res) => {
              console.log(res)
              this.setProjectRatesContractCommitments(res['projectRatesContractCommitments'])
              this.setProjectRatesSiteFacilities(res['projectRatesSiteFacilities'])
              this.setProjectRatesSiteAdministrationStaff(res['projectRatesSiteAdministrationStaff'])
              this.setProjectRatesEquipmentTransport(res['projectRatesEquipmentTransport'])
              this.setTenderRatesLabour(res['tenderRatesLabour'])
              this.setTenderRatesMaterial(res['tenderRatesMaterial'])
              this.setProjectRatesUtilities(res['projectRatesUtilities'])
              this.setActualRatesLabour(res['actualRatesLabour'])
            });
    this.projectService
            .getQuantumById(projectId)
            .subscribe((res) => {
              this.setLabourDemobilisation(res['labourDemobilisation'])
              this.setLabourRemobilisation(res['labourRemobilisation'])
              this.setOtherSubcontractorClaims(res['otherSubcontractorClaims'])
              this.setOtherUnpaidClaim(res['otherUnpaidClaim'])
              this.setSiteResourcesManpowerAdmin(res['siteResourcesManpowerAdmin'])
              this.setSiteResourcesEquipment(res['siteResourcesEquipment'])
              this.setSiteResourcesTransport(res['siteResourcesTransport'])
              this.setWorkResourcesManpowerWork(res['workResourcesManpowerWork'])
              this.setLabourProductivity(res['labourProductivity'])
              this.setOtherDamages(res['otherDamages'])
              this.setWorkResourcesMaterial(res['workResourcesMaterial'])
              this.setWorkResourcesUtilities(res['workResourcesUtilities'])
            });
    setTimeout(() => {
      
      if(this.selectedOptions.includes('Site Preliminaries') && initAppendixData != "false"){
        console.log("INIT")
        this.listOfAppendixToBeDisplayed.push("Cost - Contractual Requirements") //Appendix 1
        this.listOfAppendixToBeDisplayed.push("Cost - Resources, Manpower (Staff)") //Appendix 2A
        this.listOfAppendixToBeDisplayed.push("Quantum - Resources, Manpower (Staff)") //Appendix 2B
        this.listOfAppendixToBeDisplayed.push("Cost - Resources, Equipment") //Appendix 3a
        this.listOfAppendixToBeDisplayed.push("Quantum - Resources, Equipment") //Appendix 3b
        this.listOfAppendixToBeDisplayed.push("Cost - Resources, Utility") //Appendix 4a
        this.listOfAppendixToBeDisplayed.push("Quantum - Resources, Utility") //Appendix 4b
        this.listOfAppendixToBeDisplayed.push("Cost - Facility, Site Administration")  //Appendix 5
        this.listOfAppendixToBeDisplayed.push("Cost - Facility, Transportation") //Appendix 6A
        this.listOfAppendixToBeDisplayed.push("Quantum - Facility, Transporation") //Appendix 6B
        this.generateAppendix1()
        this.generateAppendix2B()
        this.generateAppendix2A()
        this.generateAppendix3B()
        this.generateAppendix3A()
        this.generateAppendix4B()
        this.generateAppendix4A()
        this.generateAppendix5()
        this.generateAppendix6B()
        this.generateAppendix6A()
        this.allClaimData.push({'appendixName': 'Appendix 1', 'actualData': this.appendix_1_Data})
        this.allClaimData.push({'appendixName': 'Appendix 2A', 'actualData': this.appendix_2A_Data})
        this.allClaimData.push({'appendixName': 'Appendix 2B', 'actualData': this.appendix_2B_Data})
        this.allClaimData.push({'appendixName': 'Appendix 3A', 'actualData': this.appendix_3A_Data})
        this.allClaimData.push({'appendixName': 'Appendix 3B', 'actualData': this.appendix_3B_Data})
        this.allClaimData.push({'appendixName': 'Appendix 4A', 'actualData': this.appendix_4A_Data})
        this.allClaimData.push({'appendixName': 'Appendix 4B', 'actualData': this.appendix_4B_Data})
        this.allClaimData.push({'appendixName': 'Appendix 5', 'actualData': this.appendix_5_Data})
        this.allClaimData.push({'appendixName': 'Appendix 6A', 'actualData': this.appendix_6A_Data})
        this.allClaimData.push({'appendixName': 'Appendix 6B', 'actualData': this.appendix_6B_Data})
          //number formatting the calculated Appendix data
        this.formatCurrentAppendixNumberCol("tF1")
        this.formatCurrentAppendixNumberCol("tF2A")
        this.formatCurrentAppendixNumberCol("tF2B")
        this.formatCurrentAppendixNumberCol("tF3A")
        this.formatCurrentAppendixNumberCol("tF3B")
        this.formatCurrentAppendixNumberCol("tF4A")
        this.formatCurrentAppendixNumberCol("tF4B")
        this.formatCurrentAppendixNumberCol("tF5")
        this.formatCurrentAppendixNumberCol("tF6A")
        this.formatCurrentAppendixNumberCol("tF6B")
   
      }
      if(this.selectedOptions.includes('Escalation - Material') && initAppendixData != "false"){
        this.listOfAppendixToBeDisplayed.push("Cost - Escalation, Material")  //Appendix 7
        this.generateAppendix7()
        this.allClaimData.push({'appendixName': 'Appendix 7', 'actualData': this.appendix_7_Data})
        this.formatCurrentAppendixNumberCol("tF7")
        
      }
      if(this.selectedOptions.includes('Escalation - Labour') && initAppendixData != "false"){
        this.listOfAppendixToBeDisplayed.push("Cost - Escalation, Labour") //Appendix 8A
        this.listOfAppendixToBeDisplayed.push("Quantum - Escalation, Labour")  //Appendix 8B
        this.listOfAppendixToBeDisplayed.push("Rate - Escalation, Labour")  //Appendix 8C
        this.generateAppendix8B()
        this.generateAppendix8C()
        this.generateAppendix8A()
        this.allClaimData.push({'appendixName': 'Appendix 8A', 'actualData': this.appendix_8A_Data})
        this.allClaimData.push({'appendixName': 'Appendix 8B', 'actualData': this.appendix_8B_Data})
        this.allClaimData.push({'appendixName': 'Appendix 8C', 'actualData': this.appendix_8C_Data})
        this.formatCurrentAppendixNumberCol("tF8A")
        this.formatCurrentAppendixNumberCol("tF8B")
        this.formatCurrentAppendixNumberCol("tF8C")
      }
      if(this.selectedOptions.includes('Loss of Productivity') && initAppendixData != "false"){
        this.listOfAppendixToBeDisplayed.push("Cost - Loss of Productivity")  //Appendix 9A
        this.listOfAppendixToBeDisplayed.push("Quantum (Impact) - Loss of Productivity")  //Appendix 9B
        this.listOfAppendixToBeDisplayed.push("Quantum (Max) - Loss of Productivity")  //Appendix 9C
        this.generateAppendix9B()
        this.generateAppendix9C()
        this.generateAppendix9A()
        this.allClaimData.push({'appendixName': 'Appendix 9A', 'actualData': this.appendix_9A_Data})
        this.allClaimData.push({'appendixName': 'Appendix 9B', 'actualData': this.appendix_9B_Data})
        this.allClaimData.push({'appendixName': 'Appendix 9C', 'actualData': this.appendix_9C_Data})
        this.formatCurrentAppendixNumberCol("tF9A")
        this.formatCurrentAppendixNumberCol("tF9B")
        this.formatCurrentAppendixNumberCol("tF9C")
      }
      if(this.selectedOptions.includes('De-moblisation') && initAppendixData != "false"){
         
        this.listOfAppendixToBeDisplayed.push("Cost - Demobilisation")  //Appendix 10
        this.generateAppendix10()
        this.allClaimData.push({'appendixName': 'Appendix 10', 'actualData': this.appendix_10_Data})
        this.formatCurrentAppendixNumberCol("tF10")
      }
      if(this.selectedOptions.includes('Re-moblisation') && initAppendixData != "false"){
        this.listOfAppendixToBeDisplayed.push("Cost - Remobilisation")  //Appendix 11
        this.generateAppendix11()
        this.allClaimData.push({'appendixName': 'Appendix 11', 'actualData': this.appendix_11_Data})
        this.formatCurrentAppendixNumberCol("tF11")
      }
      if(this.selectedOptions.includes('Head Office Overheads') && initAppendixData != "false"){
        this.listOfAppendixToBeDisplayed.push("Head Office Overheads") //Appendix 12
        this.generateAppendix12()
        this.allClaimData.push({'appendixName': 'Appendix 12', 'actualData': this.appendix_12_Data})
        this.formatCurrentAppendixNumberCol("tF12")
      }
      if(this.selectedOptions.includes("Subcontractor's Claims") && initAppendixData != "false"){
        this.listOfAppendixToBeDisplayed.push("Subcontractor's Claims")  //Appendix 13
        this.generateAppendix13()
        this.allClaimData.push({'appendixName': 'Appendix 13', 'actualData': this.appendix_13_Data})
        this.formatCurrentAppendixNumberCol("tF13")
      }
      if(this.selectedOptions.includes('Profit on Claim') && initAppendixData != "false"){
        this.listOfAppendixToBeDisplayed.push("Profit on the Cost")  //Appendix 14
        this.generateAppendix14()
        this.allClaimData.push({'appendixName': 'Appendix 14', 'actualData': this.appendix_14_Data})
        this.formatCurrentAppendixNumberCol("tF14")
      }
      if(this.selectedOptions.includes('Loss of Profit') && initAppendixData != "false"){
        this.listOfAppendixToBeDisplayed.push("Loss of Profit")  //Appendix 15
        this.generateAppendix15()
        this.allClaimData.push({'appendixName': 'Appendix 15', 'actualData': this.appendix_15_Data})
        this.formatCurrentAppendixNumberCol("tF15")
      }
      if(this.selectedOptions.includes('Damages') && initAppendixData != "false"){
        this.listOfAppendixToBeDisplayed.push("Other Damages")  //Appendix 16
        this.generateAppendix16()
        this.allClaimData.push({'appendixName': 'Appendix 16', 'actualData': this.appendix_16_Data})
        this.formatCurrentAppendixNumberCol("tF16")
      }
      if(this.selectedOptions.includes('Financiaal Charge on Delayed Profit') && initAppendixData != "false"){
        this.listOfAppendixToBeDisplayed.push("Financial Charge on Delayed Profit")  //Appendix 17
        this.generateAppendix17()
        this.allClaimData.push({'appendixName': 'Appendix 17', 'actualData': this.appendix_17_Data})
        this.formatCurrentAppendixNumberCol("tF17")
      }
      if(this.selectedOptions.includes('Financiaal Charge (Interest) on Unsettled Payment') && initAppendixData != "false"){
        this.listOfAppendixToBeDisplayed.push("Financial Charge on Delayed/Unsettled Payment")  //Appendix 18
        console.log(this.listOfAppendixToBeDisplayed)
        this.generateAppendix18()
        this.allClaimData.push({'appendixName': 'Appendix 18', 'actualData': this.appendix_18_Data})
        this.formatCurrentAppendixNumberCol("tF18")
      }
      if(this.currentEventId  && initAppendixData != "false") {
        this.generateSummaryTable()
        // this.allClaimData.push({'appendixName': 'Cost Summary', 'actualData': this.summaryTable})
        this.allClaimData.splice(0,0,{'appendixName': 'Cost Summary', 'actualData': this.summaryTable})
        this.formatCurrentAppendixNumberCol("tF0")
      }
      this.cuurentAppendixData = this.summaryTable
      this.openClaimSelectionRef.close();
      this.Evaluation = true;
      
    }, 2000);
    if(initAppendixData === "false") {
      localStorage.setItem(
        "initAppendixData",
        JSON.stringify("true")
      );
    }
    // set project Name
    let selectedClaimant = JSON.parse(localStorage.getItem("selectedClaimant"))
    this.projectService.getExecuterProject(selectedClaimant).subscribe(
      (res) => {
        for(let i = 0;i < res.length; i++) {
          if(res[i]['_id'] == JSON.parse(localStorage.getItem("selectedProject"))) {
            this.projectName = res[i]['name']
          }
        }
      },
      (err) => {})
    }
    let obj: any = {};
    obj.projectId = projectId
    this.projectService.checkTrailProject(obj).subscribe((res) => {
      console.log(res)
      if (res['data'] == false) // paid 
      this.showExportLinks = true
    } , (err) => {
    })
}

}
