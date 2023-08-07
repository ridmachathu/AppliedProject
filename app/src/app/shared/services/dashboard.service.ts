import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    // Angular Modules 
    private http: HttpClient
  ) { }


  public GetDashboardStats() {
    return this.http.get("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/dashboard/stats");
  }

  public GetProductPriceHistoryForId(productId) {
    return this.http.get("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/dashboard/price-history/"+productId);
  }

  public GetInflationTrackerChart() {
    return this.http.get("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/dashboard/inflation-tracker-chart");
  }

  // public post(url: string, data: any, options?: any) {
  //   return this.http.post(url, data, options);
  // }
  // public put(url: string, data: any, options?: any) {
  //   return this.http.put(url, data, options);
  // }
  // public delete(url: string, options?: any) {
  //   return this.http.delete(url, options);
  // }
}
