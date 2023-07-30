import { Component } from "@angular/core";
import * as chartData from "../../../shared/data/dashboard/default";

export interface Balance {
  icon: string;
  title: string;
  price: string;
  growth: string;
  colorClass: string;
  show?: boolean;
}
@Component({
  selector: "app-inflation-tracker",
  templateUrl: "./inflation-tracker.component.html",
  styleUrls: ["./inflation-tracker.component.scss"],
})
export class InflationTrackerComponent {
  // public overallBalance = chartData.overallBalance;
  public splineArea1 = chartData.splineArea1;

  constructor() {}

  ngOnInit(): void {}

  toggle(item: Balance) {
    item.show = !item.show;
  }

  public balance: Balance[] = [
    {
      icon: "income",
      title: "Income",
      price: "$22,678",
      growth: "+$456",
      colorClass: "success",
    },
    {
      icon: "expense",
      title: "Expense",
      price: "$12,057",
      growth: "+$256",
      colorClass: "danger",
    },
    {
      icon: "doller-return",
      title: "Cashback",
      price: "8,475",
      growth: "",
      colorClass: "success",
    },
  ];
}
