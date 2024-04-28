import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";

import { SystemManagementComponent } from "../../pages/system-management/system-management.component";

import { KosuFormComponent } from "../../pages/kosu-form/kosu-form.component";

import { ProjectViewComponent } from "../../pages/project-view/project-view.component";
import { SearchPageComponent } from "../../pages/search-page/search-page.component";
import { UserManagementComponent } from "../../pages/user-management/user-management.component";
import { AuthGuard } from "../../_auth/auth.guard";
export const AdminLayoutRoutes: Routes = [

  { path: "dashboard", component: DashboardComponent,
  canActivate: [AuthGuard], // Apply the AuthGuard here
  data: { roles: ['AdminUser', 'NormalUser','KosuUser'] } 
   },

  { path: "systemmanagement", component: SystemManagementComponent,
  canActivate: [AuthGuard], // Apply the AuthGuard here
  data: { roles: ['AdminUser'] } 
   },

  { path: "kosuform", component: KosuFormComponent,
  canActivate: [AuthGuard], // Apply the AuthGuard here
  data: { roles: ['AdminUser','KosuUser'] } 
   },
  { path: "projectview", component: ProjectViewComponent, canActivate: [AuthGuard], // Apply the AuthGuard here
  data: { roles: ['AdminUser', 'NormalUser','KosuUser'] }  },
  {path:"searchpage",component:SearchPageComponent, canActivate: [AuthGuard], // Apply the AuthGuard here
  data: { roles: ['AdminUser', 'NormalUser','KosuUser'] } },
  {path:"usermanagement",component:UserManagementComponent,
  canActivate: [AuthGuard], // Apply the AuthGuard here
  data: { roles: ['AdminUser'] } 
  }
];
