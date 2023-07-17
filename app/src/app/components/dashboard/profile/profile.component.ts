import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public userInfo: string;
  public obj: any;
  public userRole: string;
  public profileUpdateForm : FormGroup;
  public errorMessage = "";
  public successMessage = "";
  public fname: string;
  public lname: string;
  public useremail: string;
  public phone: string;

  // public url: any;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, public router: Router) {
    this.setCurrentUser()
  }

  ngOnInit(): void {
    this.profileUpdateForm = this.formBuilder.group({
      // firstname:['', Validators.required],
      // lastname:['', Validators.required],
      // email:['', Validators.required],
      // mobile:['', Validators.required]
    })
  }

  setCurrentUser(){
    this.userInfo = localStorage.getItem("authUser");
    this.userRole = localStorage.getItem("role");
    this.obj = JSON.parse(this.userInfo);
    this.fname = this.obj.firstname;
    this.lname = this.obj.lastname;
    this.useremail = this.obj.email;
    this.phone = this.obj.mobile;
  }

  updateUser(){
    if (this.profileUpdateForm.invalid) {
      // alert("Some fields are missing");
      this.errorMessage = "Some fields are missing"
      return;
    }
    this.http.post<any>("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/users/",this.profileUpdateForm.value)
    .subscribe(res=>{
      // alert("SignUp Successfully");
      console.log(res);
      this.successMessage = "Successful!"
      this.profileUpdateForm.reset();
      this.router.navigate(['']);
    },err=>{
      this.errorMessage = err.error.message
      console.log(err);
    }
    )
  }
}

