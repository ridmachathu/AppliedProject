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
   public plist = [];
   public errorMessage = "";
   public successMessage = "";
   public closeResult = '';
   public totPriceList = [];
   public totSavingsList = [];
   public uId;
   public overallBalance = chartData.overallBalance;
   public total = 0;
   public savings = 0;

  constructor(private http: HttpClient,private route: ActivatedRoute) {
    
  }

  ngOnInit(): void {
    //this.displayAllShoppingListNames();
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
         }
       }
       //console.log(this.shoppingListData[0]['items']);
       for (let j = 0; j < this.shoppingListData.length; j++) {
        //console.log(this.shoppingListData[j]['items'])
        this.calTotalandSaving(this.shoppingListData[j]['items']);
       }
       console.log(this.totPriceList);
       console.log(this.totSavingsList);
    })
    
  }

  calTotalandSaving(plistIdString){
    //console.log(plistIdString);
    let plistId = plistIdString.split(",");
    this.GetAllProducts().subscribe(res => {
      //this.listData = res['data'];
      //console.log(this.listData);
      let totPrice = 0;
      let totPriceSaving = 0;
      for (let i = 0; i < res['data'].length; i++) {
         for(let j = 0; j < plistId.length; j++){
            if (res['data'][i]['id'] == plistId[j]) {
               totPrice = totPrice + parseFloat(res['data'][i]['price'].toFixed(2));
               if(res['data'][i]['priceBefore'] != 0){
                  let deal = parseFloat(res['data'][i]['priceBefore'].toFixed(2)) - parseFloat(res['data'][i]['price'].toFixed(2));
                  totPriceSaving = totPriceSaving + deal;
               }
            }
         }
      }
      //this.total = this.total + totPrice;
      this.totPriceList.push(totPrice);
      //his.savings = this.total + totPriceSaving;
      this.totSavingsList.push(totPriceSaving);
      //console.log(this.totPriceList);
   })
  }

  public GetAllShoppingLists() {
    return this.http.get("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/shoppinglists");
  }

  public GetAllProducts() {
      return this.http.get("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/products");
  }

  public balance: Balance[] = [
    {
      icon: "income",
      title: "Total Savings",
      price: "$7.99",
      //growth: "+$456",
      colorClass: "success",
    },
    {
      icon: "expense",
      title: "Total Expenses",
      price: "$72.97",
      //growth: "+$256",
      colorClass: "danger",
    },
  ];
}


