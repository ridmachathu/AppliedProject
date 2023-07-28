import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
   selector: 'app-list-item',
   templateUrl: './list-item.component.html',
   styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit {
   public listData = [];
   public listname : string;
   public listtype : string;
   public plist = [];
   public plistId = [];
   public id: String;
   public plistIdString: String;
   public errorMessage = "";
   public successMessage = "";
   public totPrice = 0;

   constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

   ngOnInit() {
      this.route.paramMap.subscribe(params => {
         const id = params.get('id');
         this.id = id;
       });
      this.GetAllShoppingLists().subscribe(res => {
         this.listData = res['data'];
         // console.log(this.listData);
         for (let i = 0; i < res['data'].length; i++) {
            if (res['data'][i]['id'] == this.id) {
               //console.log(res['data'][i]['listname']);
               this.listname = res['data'][i]['listname'];
               this.listtype = res['data'][i]['listtype'];
               this.plistIdString = res['data'][i]['items']
               this.plistId = this.plistIdString.split(",");
               console.log(this.plistId);
            }
         }
      })
      this.GetAllProducts().subscribe(res => {
         this.listData = res['data'];
         //console.log(this.listData);
         for (let i = 0; i < res['data'].length; i++) {
            for(let j = 0; j < this.plistId.length; j++){
               if (res['data'][i]['id'] == this.plistId[j]) {
                  this.plist.push(res['data'][i]);
                  this.totPrice = this.totPrice + parseFloat(res['data'][i]['price'])
               }
            }
         }
         // console.log(this.plist);
      })
   }

   public DeleteShoppingListItem(pid: string) {
      const obj = {
         id: this.id,
         pid: pid
       };
      //const obj = JSON.parse(text);
      this.http.post<any>("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/shoppinglists/deleteItem/", obj)
         .subscribe(res => {
            this.successMessage = "Delete successful!"
            this.router.navigate(['/single-page/']);
         }, err => {
            this.errorMessage = err.error.message
            // console.log(err);
         }
         )
   }

   public GetAllShoppingLists() {
      return this.http.get("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/shoppinglists");
   }

   public GetAllProducts() {
      return this.http.get("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/products");
   }

}
