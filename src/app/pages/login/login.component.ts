import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../../_services/user.service';
import { UserAuthService } from '../../_services/user-auth.service';
import { Router } from '@angular/router';


@Component({
  selector: "app-login",
  templateUrl: "login.component.html"
})
export class LoginComponent {
  wrongCredentials = false; // Flag to indicate wrong credentials

  constructor(private userService: UserService, private userAuthService: UserAuthService, private router: Router) {}

  login(loginForm: NgForm) {
    this.userService.login(loginForm.value).subscribe((response: any) => {
      this.userAuthService.setRoles(response.user.role)
      this.userAuthService.setToken(response.jwtToken)
      this.userAuthService.setFirstName(response.user.name)
      this.userAuthService.setLastName(response.user.lastname)
    
  

      if (this.userAuthService.isLoggedIn()) {
        this.router.navigate(['/dashboard']);
      }
    }, (error) => {
      console.log(error);
      this.wrongCredentials = true; // Set flag to true for wrong credentials
    });
  }
}
