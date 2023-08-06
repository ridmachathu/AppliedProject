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
  public errorMessage = "";
  latitude: number;
  longitude: number;

  constructor(private formBuilder: FormBuilder, public router: Router, private http: HttpClient) {
    this.getLocation();
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
      //console.log(res);
      const resCode = res.statusCode;
      if(resCode == 200){
        localStorage.clear();
        // console.log(localStorage);
        localStorage.setItem('userName', res.data.user.firstname);
        localStorage.setItem('role', res.data.user.role);
        localStorage.setItem('userId', res.data.user.id);
        localStorage.setItem('authUser', JSON.stringify(res.data.user));
        const obj = 
        {
          id:res.data.user.id,
          firstname: res.data.user.firstname,
          lastname : res.data.user.lastname,
          mobile: res.data.user.mobile,
          latitude: this.latitude,
          longitude: this.longitude
        };
        this.http.post<any>("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/users/update/", obj)
        .subscribe(res => {
          console.log(res);
        }
        )
      this.loginForm.reset();
      this.router.navigate([''])
      }
      else{
        this.errorMessage = "Invalid email or password"
      }
    },err=>{
      this.errorMessage = err.error.message
    }
    )
  }

  showPassword(){
    this.show = !this.show
  }

  getLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          localStorage.setItem('Latitude', this.latitude.toString());
          localStorage.setItem('Longitude', this.latitude.toString());
          console.log('Latitude:', this.latitude);
          console.log('Longitude:', this.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not available.');
    }
  }
}





