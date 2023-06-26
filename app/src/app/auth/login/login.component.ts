import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  public newUser = false;
  // public user: firebase.User;
  public loginForm: FormGroup;
  public show: boolean = false
  public errorMessage: any;

  constructor(private formBuilder: FormBuilder, public router: Router, private http: HttpClient) {
    
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [''],
      password: ['']
    })
  }

  login() {
    this.http.post<any>("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/users/login",this.loginForm.value)
    .subscribe(res=>{
      console.log(res);
      const resCode = res.statusCode;
      if(resCode == 200){
        alert("Log in Success");
        localStorage.clear();
        // console.log(localStorage);
        localStorage.setItem('nickname', res.data.nickname);
        localStorage.setItem('role', res.data.role);
        this.loginForm.reset();
        this.router.navigate([''])
      }
      else{
        alert("User not found");
      }
    },err=>{
      alert("Something went wrong!")
    }
    )
  }

  showPassword(){
    this.show = !this.show
  }
}





