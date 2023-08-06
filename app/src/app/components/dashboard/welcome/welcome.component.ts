import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit  {

  public userName: string;

  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser(){
    this.userName = localStorage.getItem("userName");
  }
  
}
