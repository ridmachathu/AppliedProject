import { Component } from "@angular/core";
import * as chartData from "../../../shared/data/dashboard/default";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";

export interface Balance {
  icon: string;
  title: string;
  price: string;
  //growth: string;
  colorClass: string;
  show?: boolean;
}
@Component({
  selector: "app-overall-balance",
  templateUrl: "./overall-balance.component.html",
  styleUrls: ["./overall-balance.component.scss"],
})
export class OverallBalanceComponent {
   public shoppingListData = [];
   public listname : string;
   public listtype : string;
   public errorMessage = "";
   public successMessage = "";
   public closeResult = '';
   public uId;
   public overallBalance = chartData.overallBalance;
   public total = 0;
   public savings = 0;
   public icon1: "income";
   public icon2: "expense"

  constructor(private http: HttpClient,private route: ActivatedRoute) {
    
  }

  ngOnInit(): void {
    this.displayAllShoppingListNames();
  }

  toggle(item: Balance) {
    item.show = !item.show;
  }

  displayAllShoppingListNames(){
    this.GetAllShoppingLists().subscribe(res => {
       this.uId = localStorage.getItem('userId');
       for (let i = 0; i < res['data'].length; i++) {
         if((res['data'][i]['userId'] == this.uId)) {
           this.shoppingListData.push(res['data'][i]);
           this.total = this.total + res['data'][i]['totalPrice'];
           this.savings = this.savings + res['data'][i]['totalSaving'];
         }
       }
       console.log(this.total);
       console.log(this.savings);
    })
    
  }

  public GetAllShoppingLists() {
    return this.http.get("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/shoppinglists");
  }

  public balance: Balance[] = [
    {
      icon: "income",
      title: "Total Savings",
      price: this.savings.toString(),
      //growth: "+$456",
      colorClass: "success",
    },
    {
      icon: "expense",
      title: "Total Expenses",
      price: this.total.toString(),
      //growth: "+$256",
      colorClass: "danger",
    },
  ];
}


