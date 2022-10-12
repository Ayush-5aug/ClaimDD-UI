import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project/project.service';
import { AuthService } from "src/app/services/auth/auth.service";
import { ToastrService } from "ngx-toastr";
import { INFERRED_TYPE } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit {

  currency : string;
  projectLocation : string;
  FinalPriceMonth: number;
  FinalPriceQtr: number;
  FinalPricehalfYearly: number;
  FinalPriceAnnually: number;
  isMonthly: Boolean;
  duration: number;
  newPrice: number;
  startDate: Date;
  validity: Date;
  email: string;
  numberOfProjects: number;
  projectValue: number;
  ValidityText: string;

  paymentHandler: any = null;
  success: boolean = false
  failure:boolean = false
  error: boolean = false
  showSpinner: boolean = false
  FormatedPV:any;

  constructor(private projectService: ProjectService,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.invokeStripe();
    this.currency = "AED";
    this.projectLocation = "Middle East";
    this.projectValue = 0;
    this.numberOfProjects = 0;
    this.FinalPriceMonth = 0
    this.isMonthly = true;
    this.duration = 1;
    this.newPrice = 0;
    this.success = false;
    this.DisplayValidity();
    this.calculateBill();
  }

  currencyChange() {
    this.currency = (<HTMLInputElement>document.getElementById("curr")).value
    this.calculateBill()
  }

  setQuaterly() {
    this.duration = 3
    this.DisplayValidity() 
    this.calculateBill()
  }

  setIsMonthly() {
    this.duration = 1
    this.DisplayValidity() 
    this.calculateBill()
  }

  setHalfYearly() {
    this.duration = 6
    this.DisplayValidity() 
    this.calculateBill()
  }

  setAnnually() {
    this.duration = 12
    this.DisplayValidity() 
    this.calculateBill()
  }

  onRegionChange() {
    this.projectLocation = (<HTMLInputElement>document.getElementById("region")).value
    this.calculateBill()
  }

  
  DisplayValidity() {
    this.ValidityText =  "The Plan is valid for " + this.duration +  " months starting from:";
  }

  calculateBill() {
    let numberOfProject = (<HTMLInputElement>document.getElementById("numberOfProject")).value
    let projectValue = (<HTMLInputElement>document.getElementById("PV")).value
    const formatSetting =  new Intl.NumberFormat(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    this.FormatedPV = formatSetting.format(Number(projectValue));
    let CurFac, RegFac;
    let BasePrice = 50 / 3.65
    let NoPFac = Number(numberOfProject) / Math.pow(Number(numberOfProject), Math.pow(0.5, 2.75))
    if (this.currency == "AED")
        CurFac = 3.65
    else if (this.currency == "IND")
        CurFac = 75
    else if (this.currency == "GBP")
        CurFac = 0.89
    else if (this.currency == "EUR")
        CurFac = 1.01
    else if (this.currency == "USD")
      CurFac = 1
    
    if (this.projectLocation == "Middle East" || this.projectLocation == "Central Africa" || this.projectLocation == "East Africa" || this.projectLocation == "South Africa" || this.projectLocation == "Singapore")
      RegFac = 1
    else if (this.projectLocation == "Australia" || this.projectLocation == "Hong Kong")
      RegFac = 1.5
    else if (this.projectLocation == "America (USA)" || this.projectLocation == "Europe" || this.projectLocation == "Western Africa")
      RegFac = 2
    else if (this.projectLocation == "Asia (excluding Singapore & Hong Kong)")
      RegFac = 0.75
    else if (this.projectLocation == "North Africa")
      RegFac = 0.5
    
    let GFPV = Number(projectValue) / Number(CurFac)
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
      price = this.FinalPriceMonth * 97 / 100
    else if (this.duration == 6)
      price = this.FinalPriceMonth * 92 / 100
    else
      price = this.FinalPriceMonth * 80 / 100

    let discount = 0                        // later get it from DB
    this.newPrice = price * this.duration * (1 - discount / 100)
    this.newPrice = Math.round(this.newPrice)
  }

  saveLicenseInfo() {
    // validity find kro
    var d = new Date(this.startDate);
    d.setMonth(d.getMonth() + this.duration);
    this.validity = d; // validity set ho gyi
    let obj: any = {};
    let keys: any = []
    obj.email = this.email
    obj.licenseType = "Paid"
    obj.licenseStartDate = this.startDate
    obj.validity = this.validity
    obj.totalProjects = this.numberOfProjects
    for ( let i = 1; i <= this.numberOfProjects; i++ ) {
      //Can change 7 to 2 for longer results.
      let r = (Math.random() + 1).toString(36).substring(7);
      keys.push(r)
    }
      obj.licenseKeys = keys
      obj.activeProjects = this.numberOfProjects
      obj.region = this.projectLocation
      obj.currency = this.currency
      obj.projectValueLimit = this.projectValue
      obj.credit = 0
      obj.creditCurrency = this.currency
      obj.transactionID = null

      this.projectService
          .saveLicenseData(obj)
          .subscribe((res) => {
            console.log(res)
            this.toastr.success("Payment is successful and your ClaimDD plan is activated.")
            this.showSpinner = false
            this.router.navigate(["home/login"]);
        }, (err) => {
          this.toastr.error(err.error.err)
      });
  }

  buyNow() {
    let obj2: any = {}
    obj2.email = this.email;
    if (this.email == undefined || this.startDate == undefined || this.numberOfProjects == undefined || this.projectValue == undefined) {
      console.log(this.email, this.startDate, this.numberOfProjects, this.projectValue)
      this.toastr.error("Please enter values in all the feilds")
      return;
    }
    this.projectService.validateLicenseEmail(obj2).subscribe((res) => {
      console.log(res)
    }, (err) => {
      this.error = true
      this.toastr.error(err.error.err)
    })

    setTimeout(() => {
      if (!this.error) {
        let data: any = {}
        data.amount = this.newPrice
        data.name = this.email
        data.currency = this.currency
        this.makePayment(data); // TRYING PAYMENT
      }
    }, 600);
  }

  formatDate(value) {
    // this is for formatting single value/number
    if (value) {
      const formatSetting =  new Intl.DateTimeFormat(undefined,{ year: 'numeric', month: 'long'});
      var formattedDate = formatSetting.format(value);
      return formattedDate
      } else
      {
        return ""
      }

  }

  formatNumber(value: number) {
    // this is for formatting single value/number
    if (value) {
    const formatSetting =  new Intl.NumberFormat(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    var formattedNumber = formatSetting.format(value) 
    return formattedNumber
    } else
    {
      return ""
    }
}

// below is stripe code
makePayment(data: any) {
  if (data.currency == "AED") {
    data.currency = "AED"
  }
  const paymentHandler = (<any>window).StripeCheckout.configure({
    //key: 'pk_test_51IOpD1JtvdEe9F7zkklsrrA6tDfHxewK3PLr3WTx2Ih49WLONS8HL339f0ux42ubDvRcdkGaWlOeMBAz3GQqtNm800oTaa2HWQ',
    key: 'pk_live_51It7VIAF4xOFjGu6ubTOXGJopXzyYQ2GvIg0a7ylocXirpzKGnN6yz9tIA7mPxu9Uzs3LrWjHjrQ7X3GlTG7OKCs00eNl9tOSE',
        locale: 'auto',
        image:  "https://claimdd-wa.herokuapp.com/assets/images/ClaimDD.svg",
    token: function (stripeToken: any) {
      console.log(stripeToken);
      paymentstripe(stripeToken, data);
    },
  });

  const paymentstripe = (stripeToken: any, data: any) => {
    this.showSpinner = true
    this.projectService.makePayment(stripeToken, data).subscribe((data: any) => {
      console.log(data);
      if (data.data === "success") {
        this.success = true
        this.toastr.success("Payment Success");
        this.saveLicenseInfo();
      }
      else {
        this.toastr.error("Some Payment Error");
        this.showSpinner = false
        this.router.navigate(["home/login"]);
      }
    });
  };

  paymentHandler.open({
    name: 'Claim DD',
    description: 'Purchase License',
    email: data.name,
    currency: data.currency,
    amount: this.newPrice * 100,
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
