import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";

import { ForbiddenComponent } from "./pages/forbidden/forbidden.component";
import { LoginComponent } from "./pages/login/login.component";
import { AuthGuard } from "./_auth/auth.guard";

export const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "",
    redirectTo: "login", // Redirect to login page by default
    pathMatch: "full"
  },
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () => import("./layouts/admin-layout/admin-layout.module").then(m => m.AdminLayoutModule)
      }
    ],
    canActivate: [AuthGuard], 
    data: { roles: ['AdminUser', 'NormalUser','KosuUser'] }
  }, 
  {
    path: "**",
    redirectTo: "login" // Redirect to login page for unknown routes
  },
  {
    path: "forbidden",
    component: ForbiddenComponent
  },
  
];


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
