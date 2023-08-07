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
  selector: "app-inflation-tracker",
  templateUrl: "./inflation-tracker.component.html",
  styleUrls: ["./inflation-tracker.component.scss"],
})
export class InflationTrackerComponent {
  // public overallBalance = chartData.overallBalance;
  public splineArea1 = chartData.inflationTracker;

  constructor(
    private dashboardService: DashboardService,
  ) {}

  ngOnInit(): void {
    
  }

  ngAfterContentInit() {
    this.getInflationTrackerChart();
  }

  getInflationTrackerChart(){
    this.dashboardService.GetInflationTrackerChart().subscribe(res => {
      const data = res['data'];
      this.splineArea1.labels = data.labels;
      this.splineArea1.series = data.series;
    })
  }

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
