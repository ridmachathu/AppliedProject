import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-my-account",
  templateUrl: "./my-account.component.html",
  styleUrls: ["./my-account.component.scss"],
})
export class MyAccountComponent implements OnInit {
  public userName: string;
  public userRole: string;
  public profileImg: "assets/images/dashboard/profile.jpg";

  constructor(public router: Router) {
    // if (JSON.parse(localStorage.getItem("user"))) {
    //   console.log("true");
    // } else {
    //   console.log("NO ");
    // }
    this.setCurrentUser();
  }

  ngOnInit() {}

  logoutFunc() {
    this.router.navigateByUrl('auth/login');
  }

  setCurrentUser(){
    this.userName = localStorage.getItem("firstname");
    this.userRole = localStorage.getItem("role");
  }
}
