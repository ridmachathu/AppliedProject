import { Component } from "@angular/core";
import * as chartData from "../../../shared/data/dashboard/default";
import { DashboardService } from "src/app/shared/services/dashboard.service";
import { Observable, of } from "rxjs";

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
  public splineArea2 = chartData.splineArea2;
  options = [
    { label : "Whole White Mushrooms", value : "20738571_EA"},
    { label : "Original Half Ham", value : "21094878_EA"},
    { label : "Microfiltered 2% Milk, 1.89 Litre", value : "productCard_title__00068700108907"},
    { label : "Bagel Cinnamon Raisin 6 Pack", value: "21217965_EA"},
    { label : "Yellow Potatoes", value: "20106716001_KG"}
  ];
  selectedProduct = null;

  constructor(
    private dashboardService: DashboardService,
  ) {
    this.selectedProduct = this.options[0];
  }

  ngOnInit(): void {
    this.getProductChart(this.selectedProduct.value);
  }

  getProductChart(value){
    this.dashboardService.GetProductPriceHistoryForId(value).subscribe(res => {
      const data = res['data'];
      this.splineArea2.labels = data.labels;
      this.splineArea2.series = data.series;
    })
  }

  toggle(item: Balance) {
    item.show = !item.show;
  }

  changeProduct(event){
    this.getProductChart(event.value);
  }
}
