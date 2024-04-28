import { Component, OnInit } from "@angular/core";
import { UserAuthService } from "../../_services/user-auth.service";

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  roles?: string[]; // Added roles property
}
export const ROUTES: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "Dashboard",
    icon: "icon-chart-pie-36",
    class: "",
    roles: ["AdminUser","NormalUser","KosuUser"]
  },
  {
    path: "/projectview",
    title: "Détail Projet",
    icon: "icon-notes",
    class: "",
    roles: ["AdminUser","NormalUser","KosuUser"]
  },
  {
    path: "/kosuform",
    title: "Kosu",
    icon: "icon-bullet-list-67",
    class: "",
    roles: ["AdminUser","KosuUser"]
  },
  {
    path: "/searchpage",
    title: "Recherche",
    icon: "icon-zoom-split",
    class: "",
    roles: ["AdminUser","NormalUser","KosuUser"]
  },
  {
    path: "/usermanagement",
    title: "Gestion des Comptes",
    icon: "icon-single-02",
    class: "",
    roles: ["AdminUser"]
  },
  {
    path: "/systemmanagement",
    title: "Gestion Systeme",
    icon: "icon-settings",
    class: "",
    roles: ["AdminUser"]
  },
  

];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  menuItems: any[] = [];

  constructor(private userAuthService: UserAuthService) {}

  ngOnInit() {
    // Get user roles
    const roles = this.userAuthService.getRoles();

    // Filter menu items based on user's roles
    this.menuItems = roles
      ? ROUTES.filter(menuItem => !menuItem.roles || menuItem.roles.some(role => roles.includes(role)))
      : [];
  }

  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }
}
