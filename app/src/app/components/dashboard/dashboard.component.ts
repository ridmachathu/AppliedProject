import { Component } from '@angular/core';
import * as data from "../../shared/data/dashboard/default";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  public purchase = {
    icon: "cart",
    counter: "2,524",
    name: "Products to compare with",
    font: "secondary",
    pr: "-20",
  };

  public sales = {
    icon: "tag",
    counter: "52",
    name: "Current Deals",
    font: "primary",
    pr: "+70",
  };

}
