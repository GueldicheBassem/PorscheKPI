import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';


import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";

import { SystemManagementComponent } from "../../pages/system-management/system-management.component";

import { KosuFormComponent } from "../../pages/kosu-form/kosu-form.component";


import { ProjectViewComponent } from "../../pages/project-view/project-view.component";
import { SearchPageComponent } from "../../pages/search-page/search-page.component";
import { UserManagementComponent } from "../../pages/user-management/user-management.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    MatDatepickerModule,
    MatInputModule,
    
   
  ],
  
  declarations: [
    DashboardComponent,
    KosuFormComponent,


    SystemManagementComponent,
    ProjectViewComponent,
    SearchPageComponent,
    UserManagementComponent
    
  
  ]
})
export class AdminLayoutModule {}
