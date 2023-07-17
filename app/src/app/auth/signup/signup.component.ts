import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {FormGroup,FormBuilder, Validators} from '@angular/forms'
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit{

  public signupForm : FormGroup;
  public errorMessage = "";
  public successMessage = "";
  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {

  }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      firstname:['', Validators.required],
      lastname:['', Validators.required],
      email:['', Validators.required],
      mobile:['', Validators.required],
      password:['', Validators.required],
    })
  }

  signUp(){
    if (this.signupForm.invalid) {
      // alert("Some fields are missing");
      this.errorMessage = "Some fields are missing"
      return;
    }
    this.http.post<any>("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/users/",this.signupForm.value)
    .subscribe(res=>{
      // alert("SignUp Successfully");
      this.successMessage = "User registration is successful!"
      this.signupForm.reset();
      this.router.navigate(['auth/login']);
    },err=>{
      this.errorMessage = err.error.message
      console.log(err);
    }
    )
  }
}

