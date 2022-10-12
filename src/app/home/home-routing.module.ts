import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AboutComponent } from "./about/about.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { DemoComponent } from "./demo/demo.component";
import { FaqComponent } from "./faq/faq.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { OverviewComponent } from "./overview/overview.component";
import { PricingComponent } from "./pricing/pricing.component";
import { PaymentComponent } from "./payment/payment.component";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";
import { SignupComponent } from "./signup/signup.component";
import { SnapshotInterfaceComponent } from "./snapshot-interface/snapshot-interface.component";
import { SnapshotTechnicalComponent } from "./snapshot-technical/snapshot-technical.component";
import { TermsOfUseComponent } from "./terms-of-use/terms-of-use.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: HomeComponent,
        pathMatch: "full",
      },
      {
        path: "about",
        component: AboutComponent,
        pathMatch: "full",
      },
      {
        path: "overview",
        component: OverviewComponent,
        pathMatch: "full",
      },
      {
        path: "signup",
        component: SignupComponent,
        pathMatch: "full",
      },
      {
        path: "login",
        component: LoginComponent,
        pathMatch: "full",
      },
      {
        path: "pricing",
        component: PricingComponent,
        pathMatch: "full",
      },
      {
        path: "payment",
        component: PaymentComponent,
        pathMatch: "full",
      },
      {
        path: "privacy",
        component: PrivacyPolicyComponent,
        pathMatch: "full",
      },
      {
        path: "terms-of-use",
        component: TermsOfUseComponent,
        pathMatch: "full",
      },
      {
        path: "contact",
        component: ContactUsComponent,
        pathMatch: "full",
      },
      {
        path: "demo",
        component: DemoComponent,
        pathMatch: "full",
      },
      {
        path: "faq",
        component: FaqComponent,
        pathMatch: "full",
      },
      {
        path: "snapshot-interface",
        component: SnapshotInterfaceComponent,
        pathMatch: "full",
      },
      {
        path: "snapshot-technical",
        component: SnapshotTechnicalComponent,
        pathMatch: "full",
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
