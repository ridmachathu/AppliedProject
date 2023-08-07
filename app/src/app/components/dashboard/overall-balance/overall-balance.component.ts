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
   public shoppingListNames = [];
   public shoppingListExpenses = [];
   public shoppingListSavings = [];
   public listname : string;
   public uId;
   public overallBalance = chartData.overallBalance;
   public total = 0;
   public savings = 0;
   public splineArea1 = chartData.overallBalance;

  constructor(private http: HttpClient,private route: ActivatedRoute) {
    
  }

  ngOnInit(): void {
    
  }

  ngAfterContentInit() {
    this.getoverallBalanceChart();
  }

  getoverallBalanceChart(){
    this.displayAllShoppingListNames();
    console.log(this.shoppingListNames);
    let series = [
      {
        name: "Expenses",
        data: this.shoppingListExpenses,
      },
      {
        name: "Savings from deals",
        data: this.shoppingListSavings,
      },
    ];
  let xaxis = {
      categories: this.shoppingListNames,
      labels: {
        style: {
          fontFamily: "Rubik, sans-serif",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    };
      
    this.splineArea1.xaxis = xaxis;
    this.splineArea1.series = series;
  }

  toggle(item: Balance) {
    item.show = !item.show;
  }

  displayAllShoppingListNames(){
    this.GetAllShoppingLists().subscribe(res => {
       this.uId = localStorage.getItem('userId');
       for (let i = 0; i < res['data'].length; i++) {
         if((res['data'][i]['userId'] == this.uId)) {
           this.shoppingListNames.push(res['data'][i]['listname']);
           this.shoppingListExpenses.push(parseFloat(res['data'][i]['totalPrice']).toFixed(2));
           this.shoppingListSavings.push(parseFloat(res['data'][i]['totalSaving']).toFixed(2));
           this.total = this.total + res['data'][i]['totalPrice'];
           this.savings = this.savings + res['data'][i]['totalSaving'];
         }
       }
       console.log(this.shoppingListExpenses);
       console.log(this.shoppingListSavings);
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


