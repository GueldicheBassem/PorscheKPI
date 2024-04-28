import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor() { }
  private firstName: string | null = null;
  private lastName: string | null = null;

  public setRoles(roles:[]){
    localStorage.setItem("roles",JSON.stringify(roles));
  }

  public getRoles(): string[] | null {
    const rolesString = localStorage.getItem('roles');
    if (rolesString) {
      const rolesArray = JSON.parse(rolesString) as { roleName: string, roleDescription: string }[];
      const roleNames = rolesArray.map(role => role.roleName);
      return roleNames.length > 1 ? roleNames : [roleNames[0]];
    }
    return null;
  }

  public setToken(jwtToken:string){
    localStorage.setItem("jwtToken",jwtToken)
  }

  public getToken():string | null{
    return localStorage.getItem("jwtToken");
  }

  public clear(){
    localStorage.clear()
  }

  public isLoggedIn(): boolean {
    const roles = this.getRoles();
    const token = this.getToken(); // No change needed here
    return roles !== null && token !== null; // Check for both roles and token
  }

  public isAdmin(): boolean {
    const roles = this.getRoles();
    return roles !== null && roles.includes('AdminUser');
  }

  public setFirstName(name: string): void {
    localStorage.setItem("FirstName",name)
  }

  public getFirstName(): string | null {
    return localStorage.getItem("FirstName");
  }

  public setLastName(name: string): void {
    localStorage.setItem("LastName",name)
  }
  

  public getLastName(): string | null {
    return localStorage.getItem("LastName");
  }





  public getIconForRole(): string {
    const roles = this.getRoles();
    if (roles) {
      if (roles.includes('AdminUser')) {
        return 'adminlogo';
      } else if (roles.includes('NormalUser')) {
        return 'userlogo';
      } else if (roles.includes('KosuUser')) {
        return 'kosulogo';
      }
    }
    return 'userlogo';
  }

  
}
