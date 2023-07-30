import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from "ng-apexcharts";

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { ProfileComponent } from './profile/profile.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ProductStatusChartBoxComponent } from './product-status-chart-box/product-status-chart-box.component';
import { MySavingsComponent } from './my-savings/my-savings.component';
import { OverallBalanceComponent } from './overall-balance/overall-balance.component';
import { PriceHistoryComponent } from './price-history/price-history.component';
import { InflationTrackerComponent } from './inflation-tracker/inflation-tracker.component'

@NgModule({
  declarations: [
    DashboardComponent,
    ProfileComponent,
    WelcomeComponent,
    ProductStatusChartBoxComponent,
    MySavingsComponent,
    OverallBalanceComponent,
    PriceHistoryComponent,
    InflationTrackerComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    NgApexchartsModule
  ]
})
export class DashboardModule { }
