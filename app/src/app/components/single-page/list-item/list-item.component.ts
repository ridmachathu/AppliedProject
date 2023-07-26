import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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

   constructor(private http: HttpClient, private route: ActivatedRoute) { }

   ngOnInit() {
      this.route.paramMap.subscribe(params => {
         const listId = params.get('id');
         this.id = listId;
       });
      this.GetAllShoppingLists().subscribe(res => {
         this.listData = res['data'];
         // console.log(this.listData);
         for (let i = 0; i < res['data'].length; i++) {
            if (res['data'][i]['id'] == this.id) {
               //console.log(res['data'][i]['listname']);
               this.listname = res['data'][i]['listname'];
               this.listtype = res['data'][i]['listtype'];
               this.plistId = ['productCard_title__00062639316211','20083526001_KG','productCard_title__4069'];
            }
         }
      })
      this.GetAllProducts().subscribe(res => {
         this.listData = res['data'];
         // console.log(this.listData);
         let j = 0;
         for (let i = 0; i < res['data'].length; i++) {
            if (res['data'][i]['id'] == this.plistId[j]) {
               this.plist.push(res['data'][i]);
               j = j + 1;
               if (j == this.plistId.length){
                  break;
               }
            }
         }
         console.log(this.plist);
      })
   }

   public GetAllShoppingLists() {
      return this.http.get("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/shoppinglists");
   }

   public GetAllProducts() {
      return this.http.get("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/products");
   }

}
