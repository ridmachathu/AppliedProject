import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
   selector: 'app-list-item',
   templateUrl: './list-item.component.html',
   styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit {
   public listData = [];
   public alllistData = [];
   public shoppingListData = [];
   public listname : string;
   public listtype : string;
   public plist = [];
   public plistId = [];
   public id: String;
   public plistIdString: String;
   public errorMessage = "";
   public successMessage = "";
   public closeResult = '';
   public totPrice = 0;
   public totPriceSaving = 0;
   public uId;

   constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private modalService: NgbModal,) { }

   ngOnInit() {
      this.displayAllShoppingListNames();
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
                  this.totPrice = this.totPrice + parseFloat(res['data'][i]['price'].toFixed(2))
                  if(res['data'][i]['priceBefore'] != 0){
                     let deal = parseFloat(res['data'][i]['priceBefore'].toFixed(2)) - parseFloat(res['data'][i]['price'].toFixed(2));
                     this.totPriceSaving = this.totPriceSaving + deal;
                  }
               }
            }
         }
         // console.log(this.plist);
      })
   }

   displayAllShoppingListNames(){
      this.GetAllShoppingLists().subscribe(res => {
         this.uId = localStorage.getItem('userId');
         for (let i = 0; i < res['data'].length; i++) {
           if((res['data'][i]['userId'] == this.uId)) {
             this.shoppingListData.push(res['data'][i]);
           }
         }
         //console.log(this.shoppingListData);
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
            window.location.reload();
            //this.router.navigate(['/single-page/']);
         }, err => {
            this.errorMessage = err.error.message
            // console.log(err);
         }
         )
   }

   public moveShoppingListItem(id: string, items: string) {
      //this.DeleteShoppingListItem(id);
      console.log(id);
      const obj = {
         id: id,
         items: items
       };
      //const obj = JSON.parse(text);
      this.http.post<any>("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/shoppinglists/update/", obj)
         .subscribe(res => {
            this.successMessage = "The item successfully moved!"
            //this.router.navigate(['/comparison']);
         }, err => {
            this.errorMessage = err.error.message
            // console.log(err);
         }
      )
    }

    open(content,id) {
      console.log(id);
      this.errorMessage = "";
      this.successMessage = "";
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
           (result) => {
              this.closeResult = `Closed with: ${result}`;
           },
           (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
           },
        );
     }

     private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}

   public GetAllShoppingLists() {
      return this.http.get("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/shoppinglists");
   }

   public GetAllProducts() {
      return this.http.get("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/products");
   }

}
