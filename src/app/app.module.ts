import { NO_ERRORS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxBootstrapIconsModule, allIcons } from "ngx-bootstrap-icons";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "./services/auth/auth.service";
import { JwtInterceptor } from "./services/interceptor/jwt-interceptor.service";
import { ToastrModule } from "ngx-toastr";
import { ClaimantService } from "./services/claimant/claimant.service";
import { ProjectService } from "./services/project/project.service";
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgDisableLinkModule } from 'ng-disable-link';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxBootstrapIconsModule.pick(allIcons),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgbModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    NgDisableLinkModule,
  ],
  exports: [
            NgxSpinnerModule,
  ],
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    DatePipe,
    AuthService,
    ClaimantService,
    ProjectService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
