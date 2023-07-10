import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
  constructor(public router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // Guard for user is login or not
    let user = JSON.parse(localStorage.getItem("authUser"));
    if (!user || user === null) {
      this.router.navigate(["/auth/login"]);
      return true;
    } else if (user) {
      if (!Object.keys(user).length) {
        this.router.navigate(["/auth/login"]);
        return true;
      }
    }
    return true;
  }
}