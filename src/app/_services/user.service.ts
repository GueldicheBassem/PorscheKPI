import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAuthService } from './user-auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
PATH_OF_API="http://localhost:9090";
requestHeader = new HttpHeaders(
  {
    "No-Auth":"True"
  }
)

  constructor(private httpclient: HttpClient,private userAuthService:UserAuthService) { }


  public login(loginData: any){
    return this.httpclient.post(this.PATH_OF_API + "/authenticate",loginData,{headers: this.requestHeader}) ;
  }

  public roleMatch(allowedRoles: string[]): boolean {
    const userRoles: string[] | null = this.userAuthService.getRoles();
  
    if (userRoles !== null) {
      for (let i = 0; i < userRoles.length; i++) {
        if (allowedRoles.includes(userRoles[i])) {
          return true; // User has a role that matches one of the allowed roles
        }
      }
    }
    return false; // User doesn't have any matching roles
  }
}
