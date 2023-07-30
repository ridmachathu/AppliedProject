import { Component } from "@angular/core";
import * as chartData from "../../../shared/data/dashboard/default";
import { DashboardService } from "src/app/shared/services/dashboard.service";

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
  // public overallBalance = chartData.overallBalance;
  public splineArea2 = chartData.splineArea2;

  constructor(
    private dashboardService: DashboardService,
  ) {}

  ngOnInit(): void {
    this.dashboardService.GetProductPriceHistoryForId("20070132001_EA").subscribe(res => {
      const data = res['data'];
      this.splineArea2.labels = data.labels;
      this.splineArea2.series = data.series;
    })
  }

  toggle(item: Balance) {
    item.show = !item.show;
  }
}
