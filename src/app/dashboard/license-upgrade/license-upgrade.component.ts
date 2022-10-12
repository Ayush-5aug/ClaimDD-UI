import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project/project.service';
import { User } from "src/app/types/User";
import { AuthService } from "../../services/auth/auth.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-license-upgrade',
  templateUrl: './license-upgrade.component.html',
  styleUrls: ['./license-upgrade.component.css']
})
export class LicenseUpgradeComponent implements OnInit {

  toBeValid: Date;
  licenseData: any;
  trailLicenseData: any;

  isMonthly: Boolean;
  duration: number;
  newPrice: number;
  FinalPriceMonth: number;
  FinalPriceQtr: number;
  FinalPricehalfYearly: number;
  FinalPriceAnnually: number;
  exPrice: number;
  newPlanProjectNumber: number;
  newPlanProjectLimit: number;
  newFinalPriceMonth: number;
  newFinalPriceQtr: number;
  newFinalPricehalfYearly: number;
  newFinalPriceAnnually: number;
  newPlanstartDate: Date;
  newPlanValidity: Date;
  disabledUpgradeButton: Boolean;
  errorMsg: string;
  newPlanNewPrice: number;
  userData: User;

  paymentHandler: any = null;
  success: boolean = false
  failure:boolean = false
  error: boolean = false
  showSpinner: boolean = false

  constructor(private projectService: ProjectService,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.invokeStripe();
    this.userData = JSON.parse(localStorage.getItem("userData"));
    let obj3: any = {}
    obj3.email = this.userData.email
    this.authService
              .getTrailLicense(obj3)
              .subscribe((res) => {
                this.trailLicenseData = res['user']
                console.log(this.trailLicenseData)
    })
    setTimeout(() => {
    this.errorMsg = "";
    this.disabledUpgradeButton = false 
    this.licenseData = JSON.parse(localStorage.getItem("licenseData"));
    this.isMonthly = true;
    this.duration = 1;
    let d  = new Date(this.licenseData['validity'])
    //console.log(this.trailLicenseData['local'])
    d.setMonth(d.getMonth() + this.duration)
    //d = new Date(new Intl.DateTimeFormat(this.trailLicenseData['local']).format(d))
    //d = new Intl.DateTimeFormat(this.trailLicenseData['local']).format(d)
    this.toBeValid = d
    //console.log(d)
    //this.formatDates()
    // calculating prices for current plan
    let CurFac, RegFac;
    let BasePrice = 50 / 3.65
    let NoPFac = Number(this.licenseData['totalProjects']) / Math.pow(Number(this.licenseData['totalProjects']), Math.pow(0.5, 2.75))
    if (this.licenseData['currency'] == "AED")
        CurFac = 3.65
    else if (this.licenseData['currency'] == "IND")
        CurFac = 75
    else if (this.licenseData['currency'] == "GBP")
        CurFac = 0.89
    else if (this.licenseData['currency'] == "EUR")
        CurFac = 1.01
    else if (this.licenseData['currency'] == "USD")
      CurFac = 1
    
    if (this.licenseData['region'] == "Middle East" || this.licenseData['region'] == "Central Africa" || this.licenseData['region'] == "East Africa" || this.licenseData['region'] == "South Africa" || this.licenseData['region'] == "Singapore")
      RegFac = 1
    else if (this.licenseData['region'] == "Australia" || this.licenseData['region'] == "Hong Kong")
      RegFac = 1.5
    else if (this.licenseData['region'] == "America (USA)" || this.licenseData['region'] == "Europe" || this.licenseData['region'] == "Western Africa")
      RegFac = 2
    else if (this.licenseData['region'] == "Asia (excluding Singapore & Hong Kong)")
      RegFac = 0.75
    else if (this.licenseData['region'] == "North Africa")
      RegFac = 0.5
    
    let GFPV = Number(this.licenseData['projectValueLimit']) / Number(CurFac)
    let PVI;
    if (GFPV <= 1500000)
    PVI = 5                       //minimum is 5 times the base price
    else if (GFPV <= 2000000)
    PVI = 5 + Math.ceil((GFPV - 1500000)/250000)
    else if (GFPV <= 3000000)
    PVI = 7 + Math.ceil((GFPV - 2000000)/500000)
    else if (GFPV <= 10000000)
    PVI = 9 + Math.ceil((GFPV - 3000000)/1000000)
    else if(GFPV <= 20000000)
    PVI = 16 + Math.ceil((GFPV - 10000000)/2000000)
    else if( GFPV <= 50000000)
    PVI = 21 + Math.ceil((GFPV - 20000000)/2500000)
    else if( GFPV <= 100000000)
    PVI = 33 + Math.ceil((GFPV - 50000000)/5000000)
    else if( GFPV <= 250000000)
    PVI = 43 + Math.ceil((GFPV - 100000000)/10000000)
    else if( GFPV <= 950000000)
    PVI = 58 + Math.ceil((GFPV - 250000000)/25000000)
    else if( GFPV > 950000000)
    PVI = 84 + Math.ceil((GFPV - 950000000)/50000000)

    
    this.FinalPriceMonth = Math.round(BasePrice * RegFac * PVI * CurFac * NoPFac)
    this.FinalPriceQtr = Math.round(this.FinalPriceMonth * 97 / 100)
    this.FinalPricehalfYearly = Math.round(this.FinalPriceMonth * 92 / 100)
    this.FinalPriceAnnually = Math.round(this.FinalPriceMonth * 80 / 100)
    
    let price;
    if (this.duration == 1)
      price = this.FinalPriceMonth
    else if (this.duration == 3)
      price = this.FinalPriceQtr
    else if (this.duration = 6)
      price = this.FinalPricehalfYearly
    else
      price = this.FinalPriceAnnually

    let discount = 0 // later get it from DB
    this.newPrice = price * this.duration * (1 - discount / 100)
    this.newPrice = Math.round(this.newPrice)
    }, 1000);
  }

  formatDates() {
      //not used 
  this.toBeValid = new Date(new Intl.DateTimeFormat(this.trailLicenseData['local']).format(this.toBeValid))
    if (this.newPlanValidity) {
      console.log(this.newPlanValidity)
      this.newPlanValidity = new Date(new Intl.DateTimeFormat(this.trailLicenseData['local']).format(new Date(this.newPlanValidity)))
    }
    this.licenseData['licenseStartDate'] = new Intl.DateTimeFormat(this.trailLicenseData['local']).format(new Date(this.licenseData['licenseStartDate']))
    this.licenseData['validity'] = new Intl.DateTimeFormat(this.trailLicenseData['local']).format(new Date(this.licenseData['validity']))
    console.log(this.licenseData['licenseStartDate'])
    
  }

  getPricesForNewPlan() {
    let CurFac, RegFac;
    let BasePrice = 50 / 3.65
    let NoPFac = Number(this.newPlanProjectNumber) / Math.pow(Number(this.newPlanProjectNumber), Math.pow(0.5, 2.75))
    if (this.licenseData['currency'] == "AED")
        CurFac = 3.65
    else if (this.licenseData['currency'] == "IND")
        CurFac = 75
    else if (this.licenseData['currency'] == "GBP")
        CurFac = 0.89
    else if (this.licenseData['currency'] == "EUR")
        CurFac = 1.01
    else if (this.licenseData['currency'] == "USD")
      CurFac = 1
    
    if (this.licenseData['region'] == "Middle East" || this.licenseData['region'] == "Central Africa" || this.licenseData['region'] == "East Africa" || this.licenseData['region'] == "South Africa" || this.licenseData['region'] == "Singapore")
      RegFac = 1
    else if (this.licenseData['region'] == "Australia" || this.licenseData['region'] == "Hong Kong")
      RegFac = 1.5
    else if (this.licenseData['region'] == "America (USA)" || this.licenseData['region'] == "Europe" || this.licenseData['region'] == "Western Africa")
      RegFac = 2
    else if (this.licenseData['region'] == "Asia (excluding Singapore & Hong Kong)")
      RegFac = 0.75
    else if (this.licenseData['region'] == "North Africa")
      RegFac = 0.5
    
    let GFPV = Number(this.newPlanProjectLimit) / Number(CurFac)
    let PVI;
    if (GFPV <= 1500000)
    PVI = 5                       //minimum is 5 times the base price
    else if (GFPV <= 2000000)
    PVI = 5 + Math.ceil((GFPV - 1500000)/250000)
    else if (GFPV <= 3000000)
    PVI = 7 + Math.ceil((GFPV - 2000000)/500000)
    else if (GFPV <= 10000000)
    PVI = 9 + Math.ceil((GFPV - 3000000)/1000000)
    else if(GFPV <= 20000000)
    PVI = 16 + Math.ceil((GFPV - 10000000)/2000000)
    else if( GFPV <= 50000000)
    PVI = 21 + Math.ceil((GFPV - 20000000)/2500000)
    else if( GFPV <= 100000000)
    PVI = 33 + Math.ceil((GFPV - 50000000)/5000000)
    else if( GFPV <= 250000000)
    PVI = 43 + Math.ceil((GFPV - 100000000)/10000000)
    else if( GFPV <= 950000000)
    PVI = 58 + Math.ceil((GFPV - 250000000)/25000000)
    else if( GFPV > 950000000)
    PVI = 84 + Math.ceil((GFPV - 950000000)/50000000)

    
    this.newFinalPriceMonth = Math.round(BasePrice * RegFac * PVI * CurFac * NoPFac)
    this.newFinalPriceQtr = Math.round(this.newFinalPriceMonth * 97 / 100)
    this.newFinalPricehalfYearly = Math.round(this.newFinalPriceMonth * 92 / 100)
    this.newFinalPriceAnnually = Math.round(this.newFinalPriceMonth * 80 / 100)
    //this.setNewPlanValidtiy()
  }

  setNewPlanValidtiy() {
    if (Number(this.licenseData['projectValueLimit']) > Number(this.newPlanProjectLimit)) {
      this.toastr.error("New Plan Project Value should be equal or greater than Existing Plan Maximum Project Value.");
      this.newPlanstartDate = null;
      return;
    }
    if (Number(this.licenseData['totalProjects']) >= Number(this.newPlanProjectNumber)) {
      this.toastr.error("New Plan Number of Projects should be greater then Existing Plan Number of Projects.");
      this.newPlanstartDate = null;
      return;
    }
    let price;
    if (this.duration == 1) {
      price = Math.round(this.newFinalPriceMonth)
      this.exPrice = this.FinalPriceMonth
    }
    else if (this.duration == 3) {
      price = Math.round(this.newFinalPriceMonth * 97 / 100)
      this.exPrice = this.FinalPriceQtr
    }
    else if (this.duration == 6) {
      price = Math.round(this.newFinalPriceMonth * 92 / 100)
      this.exPrice = this.FinalPricehalfYearly
    }
    else {
      price = Math.round(this.newFinalPriceMonth * 80 / 100)
      this.exPrice = this.FinalPriceAnnually
    }
    if (this.newPlanstartDate) {
      var d = new Date(this.newPlanstartDate)
    d.setMonth(d.getMonth() + this.duration)
    this.newPlanValidity = d
    }
    //this.formatDates()

    //Calculating Adj Factor as per existing plan and payment
    if (this.newPlanstartDate) {
    let SD = new Date(this.newPlanstartDate) // new starting month
    let EED = new Date(this.licenseData['validity']) // existing validity date (old plan)
    let NED = this.newPlanValidity // to be valid new plan
        
    let D1 = Math.round(Math.abs(new Date(NED).getTime() - SD.getTime()) / (2e3 * 3600 * 365.25));
    let D2 = Math.round(Math.abs(EED.getTime() - SD.getTime()) / (2e3 * 3600 * 365.25));
    console.log(D1, D2, this.disabledUpgradeButton)
    let ADJ: any;
    if (D2 < D1) {
      this.disabledUpgradeButton = false;
      this.errorMsg = ""
      ADJ = this.duration - (D1 - D2)
    }
    else if(D2 == D1) {
      this.errorMsg = ""
      this.disabledUpgradeButton = false;
      ADJ = this.duration
    }
    else { // D1> D2
      this.disabledUpgradeButton = true;
      this.errorMsg = "New plan should be valid untill or behind current plan. Please select higher payment period."
    }
    let Credit = this.licenseData['credit']
    let discount = 0 // later get it from DB
    this.newPlanNewPrice = Math.round((price * this.duration - ADJ * this.exPrice) * (1 - discount / 100) - Credit)
    console.log(this.newPlanNewPrice)
    }
  }

  setQuaterly() {
    let price;
    this.duration = 3
    var d = new Date(this.licenseData['validity'])
    console.log(d)
    d.setMonth(d.getMonth() + this.duration)
    this.toBeValid = d
    price = Math.round(this.FinalPriceMonth * 97 / 100)
    let discount = 0 // later get it from DB
    this.newPrice = price * this.duration * (1 - discount / 100)
    this.newPrice = Math.round(this.newPrice)
    if (this.newPlanstartDate) {
      var d1 = new Date(this.newPlanstartDate)
      d1.setMonth(d1.getMonth() + this.duration)
      this.newPlanValidity = d1
    }
    //this.formatDates()
    this.setNewPlanValidtiy()
  }

  setIsMonthly() {
    let price;
    this.duration = 1
    var d = new Date(this.licenseData['validity'])
    d.setMonth(d.getMonth() + this.duration)
    this.toBeValid = d
    price = Math.round(this.FinalPriceMonth)
    let discount = 0 // later get it from DB
    this.newPrice = price * this.duration * (1 - discount / 100)
    this.newPrice = Math.round(this.newPrice)
    if (this.newPlanstartDate) {
      var d1 = new Date(this.newPlanstartDate)
      d1.setMonth(d1.getMonth() + this.duration)
      this.newPlanValidity = d1
    }
    //this.formatDates()
    this.setNewPlanValidtiy()
  }

  setHalfYearly() {
    let price;
    this.duration = 6
    var d = new Date(this.licenseData['validity'])
    d.setMonth(d.getMonth() + this.duration)
    this.toBeValid = d
    price = Math.round(this.FinalPriceMonth * 92 / 100)
    let discount = 0 // later get it from DB
    this.newPrice = price * this.duration * (1 - discount / 100)
    this.newPrice = Math.round(this.newPrice)
    if (this.newPlanstartDate) {
      var d1 = new Date(this.newPlanstartDate)
      d1.setMonth(d1.getMonth() + this.duration)
      this.newPlanValidity = d1
    }
    //this.formatDates()
    this.setNewPlanValidtiy()
  }

  setAnnually() {
    let price;
    this.duration = 12
    var d = new Date(this.licenseData['validity'])
    d.setMonth(d.getMonth() + this.duration)
    this.toBeValid = d
    price = Math.round(this.FinalPriceMonth * 80 / 100)
    let discount = 0 // later get it from DB
    this.newPrice = price * this.duration * (1 - discount / 100)
    this.newPrice = Math.round(this.newPrice)
    if (this.newPlanstartDate) {
      var d1 = new Date(this.newPlanstartDate)
      d1.setMonth(d1.getMonth() + this.duration)
      this.newPlanValidity = d1
    }
    //this.formatDates()
    this.setNewPlanValidtiy()
  }

  updatevalidity() {
    let obj: any = {}
    obj.updatedValidity = this.toBeValid
    obj.email = this.licenseData['email']
    
    let data: any = {}
    data.amount = this.newPrice
    data.name = obj.email
    data.currency = this.licenseData['currency']
    this.makePayment(data, obj, true);
  }

  upgradePlan() {
    let obj: any = {}
    obj.newPlanProjectNumber = this.newPlanProjectNumber
    obj.newPlanProjectLimit = this.newPlanProjectLimit
    obj.newPlanValidity = this.newPlanValidity
    obj.newPlanstartDate = this.newPlanstartDate
    obj.email = this.licenseData['email']
    
    let data: any = {}
    data.amount = this.newPlanNewPrice
    data.name = obj.email
    data.currency = this.licenseData['currency']
    this.makePayment(data, obj, false);
  }

  callUpdateAPI(obj: any) {
    this.projectService
            .updateLicenseValidity(obj)
            .subscribe((res) => {
              console.log(res)
              this.toastr.success("License Updated successfully")
              this.showSpinner = false
              this.router.navigate(["User/create-manager"]);
      });
  }

  callUpgradeAPI(obj: any) {
    this.projectService
            .upgradeLicense(obj)
            .subscribe((res) => {
              console.log(res)
              this.toastr.success("License Upgraded successfully")
              this.showSpinner = false
              this.router.navigate(["User/create-manager"]);
    });
  }

   
  formatNumber(value: number) {
    // this is for formatting single value/number
  let TregionFormat = this.trailLicenseData['local'];
  const formatSetting =  new Intl.NumberFormat(TregionFormat, {minimumFractionDigits: 2, maximumFractionDigits: 2});
  var formattedNumber = formatSetting.format(value) 
  return formattedNumber
  }

  formatNumberNoDecimal(value: number) {
    // this is for formatting single value/number
  let TregionFormat = this.trailLicenseData['local'];
  const formatSetting =  new Intl.NumberFormat(TregionFormat, {minimumFractionDigits: 0, maximumFractionDigits: 0});
  var formattedNumber = formatSetting.format(value) 
  return formattedNumber
  }

  
  formatDate(value: Date) {
    if (value) {
    // this is for formatting single value/date
    let TregionFormat = this.trailLicenseData['local'];
    //console.log(TregionFormat)
    const formatSetting =  new Intl.DateTimeFormat(TregionFormat, {year: "numeric", month: "long", day: "numeric"});
    var formattedDate = formatSetting.format(new Date(value));
    return formattedDate
    }
    return ""
}

// below is stripe code
makePayment(data: any, obj: any, isUpdate: boolean) {
  const paymentHandler = (<any>window).StripeCheckout.configure({
    //key: 'pk_test_51IOpD1JtvdEe9F7zkklsrrA6tDfHxewK3PLr3WTx2Ih49WLONS8HL339f0ux42ubDvRcdkGaWlOeMBAz3GQqtNm800oTaa2HWQ',
    key: 'pk_live_51It7VIAF4xOFjGu6ubTOXGJopXzyYQ2GvIg0a7ylocXirpzKGnN6yz9tIA7mPxu9Uzs3LrWjHjrQ7X3GlTG7OKCs00eNl9tOSE',
    locale: 'auto',
        image:  "https://claimdd-wa.herokuapp.com/assets/images/ClaimDD.svg",
    token: function (stripeToken: any) {
      console.log(stripeToken);
      paymentstripe(stripeToken, data, obj, isUpdate);
    },
  });

  const paymentstripe = (stripeToken: any, data: any, obj: any, isUpdate: boolean) => {
    this.showSpinner = true
    this.projectService.makePayment(stripeToken, data).subscribe((data: any) => {
      console.log(data);
      if (data.data === "success") {
        this.success = true
        this.toastr.success("Payment Success");
        // call API to update
        if (isUpdate) {
          this.callUpdateAPI(obj);
        }
        else {
          this.callUpgradeAPI(obj);
        }
      }
      else {
        this.toastr.error("Some Payment Error");
        this.showSpinner = false
        //this.router.navigate(["home/login"]);
      }
    });
  };

  paymentHandler.open({
    name: 'Claim DD',
    description: 'Purchase License',
    email: data.name,
    currency: data.currency,
    amount: data.amount * 100,
  });
}

invokeStripe() {
  if (!window.document.getElementById('stripe-script')) {
    const script = window.document.createElement('script');
    script.id = 'stripe-script';
    script.type = 'text/javascript';
    script.src = 'https://checkout.stripe.com/checkout.js';
    script.onload = () => {
      this.paymentHandler = (<any>window).StripeCheckout.configure({
        //key: 'pk_test_51IOpD1JtvdEe9F7zkklsrrA6tDfHxewK3PLr3WTx2Ih49WLONS8HL339f0ux42ubDvRcdkGaWlOeMBAz3GQqtNm800oTaa2HWQ',
        key: 'pk_live_51It7VIAF4xOFjGu6ubTOXGJopXzyYQ2GvIg0a7ylocXirpzKGnN6yz9tIA7mPxu9Uzs3LrWjHjrQ7X3GlTG7OKCs00eNl9tOSE',
            locale: 'auto',
            image:  "https://claimdd-wa.herokuapp.com/assets/images/ClaimDD.svg",
            token: function (stripeToken: any) {
          console.log(stripeToken);
        },
      });
    };
    window.document.body.appendChild(script);
    }
  }
}
