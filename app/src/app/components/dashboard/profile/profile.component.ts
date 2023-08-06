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

  constructor(private formBuilder: FormBuilder, private http: HttpClient, public router: Router) {
    this.userInfo = localStorage.getItem("authUser");
    this.userRole = localStorage.getItem("role");
    this.obj = JSON.parse(this.userInfo);
    console.log(this.obj);
  }

  ngOnInit(): void {
    this.profileUpdateForm = this.formBuilder.group({
      firstname:[this.obj.firstname, Validators.required],
      lastname:[this.obj.lastname, Validators.required],
      email:[this.obj.email, Validators.required],
      mobile:[this.obj.mobile, Validators.required],
      id:[this.obj.id],
      latitude:[this.obj.latitude],
      longitude:[this.obj.longitude] 
    })
  }

  updateUser(){
    if (this.profileUpdateForm.invalid) {
      // alert("Some fields are missing");
      this.errorMessage = "Some fields are missing"
      return;
    }
    this.http.post<any>("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/users/update",this.profileUpdateForm.value)
    .subscribe(res=>{
      //console.log(res['data']['firstname']);
      localStorage.setItem('userName', res['data']['firstname']);
      localStorage.setItem('role', res['data']['role']);
      localStorage.setItem('authUser', JSON.stringify(res['data']));
      //console.log(localStorage.getItem("authUser"));
      this.successMessage = "Profile update successful!"
      //this.profileUpdateForm.reset();
      this.router.navigate(['/dashboard/profile']);
    },err=>{
      this.errorMessage = err.error.message
      console.log(err);
    }
    )
  }
}

