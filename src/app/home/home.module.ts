import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HomeRoutingModule } from "./home-routing.module";
import { AppComponent } from "../app.component";
import { AboutComponent } from "./about/about.component";
import { HomeComponent } from "./home/home.component";
import { OverviewComponent } from "./overview/overview.component";
import { SignupComponent } from "./signup/signup.component";
import { LoginComponent } from "./login/login.component";
import { PricingComponent } from "./pricing/pricing.component";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";
import { NavbarComponent } from "./navbar/navbar/navbar.component";
import { FooterComponent } from "./footer/footer/footer.component";
import { TermsOfUseComponent } from "./terms-of-use/terms-of-use.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { DemoComponent } from "./demo/demo.component";
import { FaqComponent } from "./faq/faq.component";
import { NewComponent } from "./new/new.component";
import { SnapshotInterfaceComponent } from "./snapshot-interface/snapshot-interface.component";
import { SnapshotTechnicalComponent } from "./snapshot-technical/snapshot-technical.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PaymentComponent } from './payment/payment.component';

@NgModule({
  declarations: [
    AboutComponent,
    HomeComponent,
    OverviewComponent,
    SignupComponent,
    LoginComponent,
    PricingComponent,
    PrivacyPolicyComponent,
    FooterComponent,
    TermsOfUseComponent,
    NavbarComponent,
    ContactUsComponent,
    DemoComponent,
    FaqComponent,
    NewComponent,
    SnapshotInterfaceComponent,
    SnapshotTechnicalComponent,
    PaymentComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class HomeModule {}
