import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ClaimComponent } from "./claim/claim.component";
import { ContemporaryRecordsComponent } from "./contemporary-records/contemporary-records.component";
import { ContractParticularsComponent } from "./contract-particulars/contract-particulars.component";
import { DataImportComponent } from "./data-import/data-import.component";
import { EvaluationComponent } from "./evaluation/evaluation.component";
import { EventsComponent } from "./events/events.component";
import { FinancialParticularsComponent } from "./financial-particulars/financial-particulars.component";
import { QuantumComponent } from "./quantum/quantum.component";
import { RatePreviewComponent } from "./rates/rate-preview/rate-preview.component";
import { RatesComponent } from "./rates/rates.component";
import { ReportComponent } from "./report/report.component";
import { CreateManagerComponent } from "./create-manager/create-manager.component";
import { CreateExecuterComponent } from "./create-executer/create-executer.component";
import { PreviewComponent } from "./preview/preview.component";
import { LicenseUpgradeComponent } from "./license-upgrade/license-upgrade.component";
import {ReviewerDashboardComponent} from "./reviewer-dashboard/reviewer-dashboard.component";
import {ActualDbComponent} from "./actual-db/actual-db.component";
const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "create-manager",
        component: CreateManagerComponent,
        pathMatch: "full",
      },
      {
        path: "create-executer",
        component: CreateExecuterComponent,
        pathMatch: "full",
      },
      {
        path: "",
        component: DashboardComponent,
        pathMatch: "full",
      },
      {
        path: "reviewerDashboard",
        component: ReviewerDashboardComponent,
        pathMatch: "full",
      },
      {
        path: "contract-particulars",
        component: ContractParticularsComponent,
        pathMatch: "full",
      },
      {
        path: "financial-particulars",
        component: FinancialParticularsComponent,
        pathMatch: "full",
      },
      {
        path: "events",
        component: EventsComponent,
        pathMatch: "full",
      },
      {
        path: "rates",
        component: RatesComponent,
        pathMatch: "full",
      },
      {
        path: "quantum",
        component: QuantumComponent,
        pathMatch: "full",
      },
      {
        path: "evaluation",
        component: EvaluationComponent,
        pathMatch: "full",
      },
      {
        path: "claim",
        component: ClaimComponent,
        pathMatch: "full",
      },
      {
        path: "report",
        component: ReportComponent,
        pathMatch: "full",
      },
      {
        path: "contemporary-records",
        component: ContemporaryRecordsComponent,
        pathMatch: "full",
      },
      {
        path: "rate-preview",
        component: RatePreviewComponent,
        pathMatch: "full",
      },
      {
        path: "data-import",
        component: DataImportComponent,
        pathMatch: "full",
      },
      {
        path: "preview",
        component: PreviewComponent,
        pathMatch: "full",
      },
      {
        path: "licenseUpgrade",
        component: LicenseUpgradeComponent,
        pathMatch: "full",
      },
      {
        path: "actual-db",
        component: ActualDbComponent,
        pathMatch: "full"
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
