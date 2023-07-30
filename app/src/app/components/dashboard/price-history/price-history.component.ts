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
  selector: "app-price-history",
  templateUrl: "./price-history.component.html",
  styleUrls: ["./price-history.component.scss"],
})
export class PriceHistoryComponent {
  public overallBalance = chartData.overallBalance;
  public splineArea2 = chartData.splineArea2;

  constructor() {}

  ngOnInit(): void {}

  toggle(item: Balance) {
    item.show = !item.show;
  }
}
