import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserAuthService } from '../_services/user-auth.service';
import { UserService } from '../_services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private userAuthService: UserAuthService,
    private router: Router,
    private userService: UserService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.userAuthService.getToken() !== null) {
      const roles = route.data['roles'] as Array<string>;

      if (roles) {
        const match = this.userService.roleMatch(roles);

        if (match) {
          return true;
        } else {
          // Redirect to forbidden page
          this.router.navigate(['/forbidden'], { queryParams: { returnUrl: state.url } });
          return false;
        }
      }
    }

    // Redirect to login page if user is not authenticated
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
