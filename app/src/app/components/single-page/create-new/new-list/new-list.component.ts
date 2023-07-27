import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss']
})
export class NewListComponent implements OnInit{

  files: File[] = [];
	startingDate: NgbDateStruct;
	endingDate: NgbDateStruct;
  public newListForm : FormGroup;
  public errorMessage = "";
  public successMessage = "";

  onSelect(event) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit() : void {
    this.newListForm = this.formBuilder.group({
      listtype:['', Validators.required],
      listname:['', Validators.required]
    })
  }

  createList(){
    if (this.newListForm.invalid) {
      // alert("Some fields are missing");
      this.errorMessage = "Some fields are missing"
      return;
    }
    this.http.post<any>("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/shoppinglists/",this.newListForm.value)
    .subscribe(res=>{
      // alert("SignUp Successfully");
      this.successMessage = "Shopping list creation is successful!"
      this.newListForm.reset();
      //this.router.navigate(['single-page']);
    },err=>{
      this.errorMessage = err.error.message
      console.log(err);
    }
    )
  }

}
