import { HomeModule } from "./home/home.module";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { WAheaderComponent } from "./dashboard/waheader/waheader.component";
import { NavbarComponent } from "./home/navbar/navbar/navbar.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "home",
    component: NavbarComponent,
    loadChildren: () =>
      import("src/app/home/home.module").then((m) => m.HomeModule),
  },
  {
    path: "User",
    component: WAheaderComponent,
    loadChildren: () =>
      import("src/app/dashboard/dashboard.module").then(
        (m) => m.DashboardModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
