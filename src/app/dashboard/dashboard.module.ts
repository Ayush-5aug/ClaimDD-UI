import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WAheaderComponent } from "./waheader/waheader.component";
import { WAfooterComponent } from "./wafooter/wafooter.component";
import { WASidenavComponent } from "./wasidenav/wasidenav.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ContractParticularsComponent } from "./contract-particulars/contract-particulars.component";
import { FinancialParticularsComponent } from "./financial-particulars/financial-particulars.component";
import { EventsComponent } from "./events/events.component";
import { RatesComponent } from "./rates/rates.component";
import { QuantumComponent } from "./quantum/quantum.component";
import { EvaluationComponent } from "./evaluation/evaluation.component";
import { ClaimComponent } from "./claim/claim.component";
import { ReportComponent } from "./report/report.component";
import { ContemporaryRecordsComponent } from "./contemporary-records/contemporary-records.component";
import { RatePreviewComponent } from "./rates/rate-preview/rate-preview.component";
import { DataImportComponent } from "./data-import/data-import.component";
import { HttpClientModule } from "@angular/common/http";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CreateManagerComponent } from "./create-manager/create-manager.component";
import { CreateExecuterComponent } from "./create-executer/create-executer.component";
import { PreviewComponent } from "./preview/preview.component";
import { LicenseUpgradeComponent } from './license-upgrade/license-upgrade.component';
import { ReviewerDashboardComponent } from './reviewer-dashboard/reviewer-dashboard.component';
import { ActualDbComponent } from './actual-db/actual-db.component';

@NgModule({
  declarations: [
    WAheaderComponent,
    WAfooterComponent,
    WASidenavComponent,
    DashboardComponent,
    ContractParticularsComponent,
    FinancialParticularsComponent,
    EventsComponent,
    RatesComponent,
    QuantumComponent,
    EvaluationComponent,
    ClaimComponent,
    ReportComponent,
    ContemporaryRecordsComponent,
    RatePreviewComponent,
    DataImportComponent,
    CreateManagerComponent,
    CreateExecuterComponent,
    CreateExecuterComponent,
    PreviewComponent,
    LicenseUpgradeComponent,
    ReviewerDashboardComponent,
    ActualDbComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
  ],
})
export class DashboardModule {}
