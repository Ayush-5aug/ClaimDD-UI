import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { ProjectService } from "../../services/project/project.service";
import { DatePipe } from '@angular/common'
import * as moment from 'moment';
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
//Chart.register(LineController, LineElement, PointElement, LinearScale, Title);

@Component({
  selector: 'app-actual-db',
  templateUrl: './actual-db.component.html',
  styleUrls: ['./actual-db.component.css']
})
export class ActualDbComponent implements OnInit {

  data1 : any = [];
  startDate : Date;
  endDate : Date;
  projectId: any;
  projectData: any;
  originalCompletionDate: any;
  revisedCOmpletionDate: any;
  commencementDate: any;
  licenseValidity: any;
  maxDataDuration: any;
  calculatedRevisedContractPrice: any;
  calculatedRevisedContractDuration: any;

  constructor(
    private projectService: ProjectService,
    public datepipe: DatePipe,
    private toastr : ToastrService
  ) { }

  ngOnInit(): void {
    this.openingDB();
    const userData = JSON.parse(localStorage.getItem("userData"));
    console.log(userData)
    this.projectId = JSON.parse(localStorage.getItem("selectedProject"));
    this.projectData = JSON.parse(localStorage.getItem("projectData"));
    console.log(this.projectData)
    let obj: any = {}
    obj.projectId = this.projectId
    this.projectService.getLicenseDataFromProjectId(obj).subscribe((res) => {
      this.licenseValidity = res['data']['validity']
    }, (err) => {
      this.toastr.error(err.error.err);
    });
    if (this.projectData['commencementDate']) {
      this.commencementDate = this.projectData['commencementDate']
      var x = moment(this.projectData['commencementDate']);
      this.originalCompletionDate = moment(x).add(Number(this.projectData['originalContractDurationvalue']), 'days');
      if (this.projectData['reviesdContractDuration']){
      this.revisedCOmpletionDate = moment(x).add(Number(this.projectData['reviesdContractDuration']), 'days');
      }
      else{
        this.revisedCOmpletionDate = this.originalCompletionDate
      }
    }
    if (this.projectData['reviesdContractPriceValue']) {
    this.calculatedRevisedContractPrice = this.projectData['reviesdContractPriceValue']
    }
    else {this.calculatedRevisedContractPrice =this.projectData['originalContractPrice']}

    if (this.projectData['reviesdContractDuration']) {
      this.calculatedRevisedContractDuration = this.projectData['reviesdContractDuration']
      }
      else {this.calculatedRevisedContractDuration =this.projectData['originalContractDurationvalue']}


    this.prepareData();
    this.prepareDateRow();
    setTimeout(() => {
      const myChart = new Chart("myChart", {
        type: 'bar',
        //backgroundColor: Utils.CHART_COLORS.blue,
        //borderColor: 'rgba(255, 99, 132)',
        data: {
            //labels: ['Project Rate Contract Commitements', 'Site Facilities', 'Site Addministartio Staff'],
            labels: ['Project Rates - Contract Commitments',
            'Project Rates - Site Facility',
            'Project Rates - Site Administration staff',
            'Project Rates - Equipment & Transport',
            'Project Rates - Utilities',
            'Tender Rates - Material',
            'Tender Rates - Labour',
            'Quantum- Resources - Material',
            'Quantum- Demobilisation',
            'Quantum- Remobilisation',
            'Quantum- Subcontractors Claims',
            'Quantum- Other Damages',
            'Quantum- Delayed/Unpaid Claims'],
            

            datasets: [{
                label: 'Number of Saved Items',
                data: this.data1,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 205, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)',
                  'rgb(201, 203, 207)'
                ],
                borderWidth: 1
            }]
        },
        options: {
          indexAxis: 'y',
            scales: {
                x: {
                  grid: {display: false},
                  title: {
                    color: 'rgb(251,179,53)',         //Orange
                    display: true,
                    text: 'Number of Data',
                    font: {
                      family: 'Comic Sans MS',
                      size: 20,
                      weight: 'bold',
                      lineHeight: 1.2,
                    },
                    //padding: {top: 20, left: 0, right: 0, bottom: 0}
                    padding: 20
                  },
                  ticks: {            //for axis texts
                    font: {
                      size: 14, weight: 'bold'
                    },
                    color: 'rgb(48,84,150)',             //Blue
                  }
              },
              y: {
                    beginAtZero: true,
                    grid: {display: false},
                    title: {
                      color: 'rgb(251,179,53)',
                      display: true,
                      text: 'Rates and Quantum Headings',
                      font: {
                        family: 'Comic Sans MS',
                        size: 20,
                        weight: 'bold',
                        lineHeight: 1.2,
                      },
                      padding: 20
                    },
                    ticks: {
                      font: {
                        size: 14, weight: 'bold'
                      },
                      color: 'rgb(48,84,150)',
                    }
  
                }
            }
        }
        });
    }, 2000);
    console.log(this.data1)
  }

  prepareData() {
    const projectId = JSON.parse(localStorage.getItem("selectedProject"));
    this.projectService
            .getRatesById(projectId)
            .subscribe((res) => {
              this.data1.push(Number(res['projectRatesContractCommitments'].length) > 0 ? Number(res['projectRatesContractCommitments'].length) - 1 : 0)
              this.data1.push(Number(res['projectRatesSiteFacilities'].length) - 1 > 0 ? Number(res['projectRatesSiteFacilities'].length) - 1 : 0)
              this.data1.push(Number(res['projectRatesSiteAdministrationStaff'].length) - 1 > 0 ? Number(res['projectRatesSiteAdministrationStaff'].length) - 1 : 0)
              this.data1.push(Number(res['projectRatesEquipmentTransport'].length) - 1 > 0 ? Number(res['projectRatesEquipmentTransport'].length) - 1 : 0)
              this.data1.push(Number(res['projectRatesUtilities'].length) - 1 > 0 ? Number(res['projectRatesUtilities'].length) - 1 : 0)
              this.data1.push(Number(res['tenderRatesMaterial'].length) - 1 > 0 ? Number(res['tenderRatesMaterial'].length) - 1 : 0)
              this.data1.push(Number(res['tenderRatesLabour'].length) - 1 > 0 ? Number(res['tenderRatesLabour'].length) - 1 : 0)
            });
    setTimeout(() => {
      this.projectService.getQuantumById(projectId).subscribe((res) => {
        this.data1.push(Number(res['workResourcesMaterial'].length) > 0 ? Number(res['workResourcesMaterial'].length) - 1 : 0)
       

        this.data1.push(Number(res['labourDemobilisation'].length) > 0 ? Number(res['labourDemobilisation'].length) - 1 : 0)
     

        this.data1.push(Number(res['labourRemobilisation'].length) > 0 ? Number(res['labourRemobilisation'].length) - 1 : 0)
 

        this.data1.push(Number(res['otherSubcontractorClaims'].length) > 0 ? Number(res['otherSubcontractorClaims'].length) - 1 : 0)
  

        this.data1.push(Number(res['otherDamages'].length) > 0 ? Number(res['otherDamages'].length) - 1 : 0)
     

        this.data1.push(Number(res['otherUnpaidClaim'].length) > 0 ? Number(res['otherUnpaidClaim'].length) - 1 : 0)
      

        console.log(this.data1)
      })
    }, 200)
  }

  prepareDateRow() {
    let startDate : Date;
    let endDate : Date;
    let tempDate : Date;
    const projectId = JSON.parse(localStorage.getItem("selectedProject"));
    this.projectService
            .getProjectDataById(projectId)
            .subscribe((res) => {
              console.log(res['commencementDate'])
              console.log(res['originalContractDurationSelect'])
              console.log(res['originalContractDurationvalue'])
              startDate = new Date(res['commencementDate'])
              tempDate = new Date(startDate) 
              tempDate.setDate(startDate.getDate() + Number(res['originalContractDurationvalue']))
              endDate = new Date(tempDate)
              console.log(this.datepipe.transform(startDate, 'dd-MM-yyyy'), this.datepipe.transform(endDate, 'yyyy-MM-dd'))
              console.log((2500).toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
              }))
              this.startDate = new Date(startDate) 
              //this.endDate = new Date(endDate) 
              this.endDate = new Date(this.licenseValidity)
              this.prepareDataForSecondGraph();
            });
  }
  
  prepareDataForSecondGraph() {
    let data2: number [] = []
    let apiResponse : any = {}
    let count : number = 0
    const projectId = JSON.parse(localStorage.getItem("selectedProject"));
    this.projectService.getRatesById(projectId).subscribe((res) => {
      res['actualRatesLabour'].forEach((row) => {
        if (this.datepipe.transform(this.startDate, 'yyyy-MM-dd') <= this.datepipe.transform(new Date(row[0][2]), 'yyyy-MM-dd') && this.datepipe.transform(this.endDate, 'yyyy-MM-dd') >= this.datepipe.transform(new Date(row[0][2]), 'yyyy-MM-dd')) {
          count = count + 1
        }
      })
  
      data2.push(count)
      this.maxDataDuration = count
      console.log(this.maxDataDuration, count)
    })
    
    this.projectService.getQuantumById(projectId).subscribe((res) => {
      apiResponse = res
      console.log(apiResponse)
    })
    setTimeout(() => {
      count = 0
      apiResponse['siteResourcesManpowerAdmin'].forEach((row) => {
        if (this.datepipe.transform(this.startDate, 'yyyy-MM-dd') <= this.datepipe.transform(new Date(row[0][2]), 'yyyy-MM-dd') && this.datepipe.transform(this.endDate, 'yyyy-MM-dd') >= this.datepipe.transform(new Date(row[0][2]), 'yyyy-MM-dd')) {
          count = count + 1
        }
      })
      data2.push(count)
      if (count > this.maxDataDuration){this.maxDataDuration = count}
      console.log(this.maxDataDuration, count)

      count = 0
      apiResponse['siteResourcesEquipment'].forEach((row) => {
        if (this.datepipe.transform(this.startDate, 'yyyy-MM-dd') <= this.datepipe.transform(new Date(row[0][2]), 'yyyy-MM-dd') && this.datepipe.transform(this.endDate, 'yyyy-MM-dd') >= this.datepipe.transform(new Date(row[0][2]), 'yyyy-MM-dd')) {
          count = count + 1
        }
      })
      data2.push(count)
      if (count > this.maxDataDuration){this.maxDataDuration = count}
      console.log(this.maxDataDuration, count)

      count = 0
      apiResponse['siteResourcesTransport'].forEach((row) => {
        if (this.datepipe.transform(this.startDate, 'yyyy-MM-dd') <= this.datepipe.transform(new Date(row[0][2]), 'yyyy-MM-dd') && this.datepipe.transform(this.endDate, 'yyyy-MM-dd') >= this.datepipe.transform(new Date(row[0][2]), 'yyyy-MM-dd')) {
          count = count + 1
        }
      })
      data2.push(count)
      if (count > this.maxDataDuration){this.maxDataDuration = count}
      console.log(this.maxDataDuration, count)

      count = 0
      apiResponse['workResourcesManpowerWork'].forEach((row) => {
        if (this.datepipe.transform(this.startDate, 'yyyy-MM-dd') <= this.datepipe.transform(new Date(row[0][2]), 'yyyy-MM-dd') && this.datepipe.transform(this.endDate, 'yyyy-MM-dd') >= this.datepipe.transform(new Date(row[0][2]), 'yyyy-MM-dd')) {
          count = count + 1
        }
      })
      data2.push(count)
      if (count > this.maxDataDuration){this.maxDataDuration = count}
      console.log(this.maxDataDuration, count)

      count = 0
      if (apiResponse['workResourcesUtilities'].length != 0) {
      apiResponse['workResourcesUtilities'][0].slice(2).forEach((col) => {
       // col = "1-" + col
        console.log(this.datepipe.transform(new Date(col), 'yyyy-MM-dd'))
        if (this.datepipe.transform(this.startDate, 'yyyy-MM-dd') <= this.datepipe.transform(new Date(col), 'yyyy-MM-dd') && this.datepipe.transform(this.endDate, 'yyyy-MM-dd') >= this.datepipe.transform(new Date(col), 'yyyy-MM-dd')) {
          count = count + 1
        }
      })
      }
      data2.push(count) 
      if (count > this.maxDataDuration){this.maxDataDuration = count}
      console.log(this.maxDataDuration, count)

     count = 0
      apiResponse['labourProductivity'].forEach((row) => {
        if (this.datepipe.transform(this.startDate, 'yyyy-MM-dd') <= this.datepipe.transform(new Date(row[0][2]), 'yyyy-MM-dd') && this.datepipe.transform(this.endDate, 'yyyy-MM-dd') >= this.datepipe.transform(new Date(row[0][2]), 'yyyy-MM-dd')) {
          count = count + 1
        }
      })
      data2.push(count)
      if (count > this.maxDataDuration){this.maxDataDuration = count}
      console.log(this.maxDataDuration, count)

      console.log(data2)
      this.displayChart2(data2)
    }, 2000)
  }

  displayChart2(data2) {
    data2.push(0)
    let startMonth = new Date(this.commencementDate).getMonth()   //this will help to control the startig month
    let DSDate = this.commencementDate            // this will help to control the starting year
    let maxTicks = this.maxDataDuration           // this is to control the x-value range (based on maximum data entered)
    const myChart2 = new Chart("myChart2", {
      type: 'bar',
      //backgroundColor: 'rgb(255, 99, 132)',
      //borderColor: 'rgb(255, 99, 132)',
      data: {
          labels: ['Actual Rates - Labour',
          'Quantum: Resources - Manpower (Staff)',
          'Quantum: Resources - Equipment',
          'Quantum: Resources - Transport',
          'Quantum: Resources - Manpower (Labour)',
          'Quantum: Resources - Utilities',
          'Quantum: Productivity'],
  
          datasets: [{
              label: 'Avaialble Data in Month',
              data: data2,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
              ],
              borderWidth: 1
          }]
      },
      options: {
        indexAxis: 'y',
          scales: {
              x: {
            
                grid: {display: false},
                //type: 'time',
                //time: {unit: 'month'},

                title: {
                  color: 'rgb(251,179,53)',         //Orange
                  display: true,
                  text: 'Months',
                  font: {
                    family: 'Comic Sans MS',
                    size: 20,
                    weight: 'bold',
                    lineHeight: 1.2,
                  },
                  //padding: {top: 20, left: 0, right: 0, bottom: 0}
                  padding: 20
                },
                ticks: {            //for axis texts
                  
                  callback: function (val, index) {
                    const date = new Date(DSDate);
                    date.setMonth(index + startMonth);
                    return val = date.toLocaleString("en-US", {month: 'short', year: '2-digit'});
                    //return index % 2 === 0 ? this.getLabelForValue(index) : '';

                  },
            
                  font: {
                    size: 14, weight: 'bold'
                  },
                  maxTicksLimit: maxTicks + 1,
              
                  color: 'rgb(48,84,150)',             //Blue
                }
            },
            y: {
                  beginAtZero: true,
                  grid: {display: false},
                  title: {
                    color: 'rgb(251,179,53)',
                    display: true,
                    text: 'Rates and Quantum Headings',
                    font: {
                      family: 'Comic Sans MS',
                      size: 20,
                      weight: 'bold',
                      lineHeight: 1.2,
                    },
                    padding: 20
                  },
                  ticks: {
                    font: {
                      size: 14, weight: 'bold'
                    },
                    color: 'rgb(48,84,150)',
                  }

              }
          }
      }
      });
  
  }

  
  formatDate(value) {
    if (!value) {
      return 
    }
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
      return value
    }
  }
  
  formatNumber(value: number) {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    if (projectData) {
    const formatSetting =  new Intl.NumberFormat(projectData.regionFormat, {minimumFractionDigits: projectData.decimalPlaces, maximumFractionDigits: projectData.decimalPlaces});
    var formattedNumber = formatSetting.format(value) 
    return formattedNumber
    }
    else {
      const formatSetting =  new Intl.NumberFormat(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
      var formattedNumber = formatSetting.format(value) 
      return formattedNumber
  
    }
  }

  
openingDB() {
  Swal.fire({
    title: "Graphing...",
    allowEscapeKey: false,
    allowOutsideClick: false,
    background: '#fbb335',
    showConfirmButton:false,
    timer: 2000,
    timerProgressBar: true,
  })
}

NumbertoMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
  
    return date.toLocaleString('en-US', {month: 'short',});
  }

  getStartMonthNumber(){

   // return this.startMonth = new Date(this.commencementDate).getMonth()

  }

  findRevisedContractData(){


  }


}
