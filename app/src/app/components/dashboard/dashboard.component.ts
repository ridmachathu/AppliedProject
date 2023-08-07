import { Component } from '@angular/core';
import { DashboardService } from 'src/app/shared/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  public purchase = {
    icon: "cart",
    counter: "Loading...",
    name: "Products to compare with",
    font: "secondary",
    pr: "-20",
  };

  public sales = {
    icon: "tag",
    counter: "Loading...",
    name: "Current Deals",
    font: "primary",
    pr: "+70",
  };

  constructor(
    private dashboardService: DashboardService,
  ) { }

  ngOnInit() {

  }

  ngAfterContentInit() {
    this.dashboardService.GetDashboardStats().subscribe(res => {
      const data = res['data'];
      this.purchase.counter = data.total_number_of_products.toLocaleString("en-US");
      this.sales.counter = data.total_number_of_products_with_deals.toLocaleString("en-US");
    })
  }

}
