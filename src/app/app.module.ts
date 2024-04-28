import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { ToastrModule } from 'ngx-toastr';
import { NgbCarouselModule } from "@ng-bootstrap/ng-bootstrap";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { LoginComponent } from "./pages/login/login.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ForbiddenComponent } from "./pages/forbidden/forbidden.component";
import { CarouselModule } from 'ngx-owl-carousel-o';

import { AppRoutingModule } from "./app-routing.module";
import { ComponentsModule } from "./components/components.module";
import { AuthInterceptor } from "./_auth/auth.interceptor";
import { UserService } from "./_services/user.service";
import { AuthGuard } from "./_auth/auth.guard";


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      enableHtml: true,
      closeButton: true,
      timeOut: 3000, // Optional: Set notification timeout
      progressBar: true, // Optional: Display a progress bar
      positionClass: 'toast-top-center'

    })
    
  ],
  declarations: [AppComponent, AdminLayoutComponent, LoginComponent,ForbiddenComponent],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass:AuthInterceptor,
      multi:true
    },
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
