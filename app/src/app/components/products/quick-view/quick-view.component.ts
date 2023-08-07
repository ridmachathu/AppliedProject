import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-quick-view",
  templateUrl: "./quick-view.component.html",
  styleUrls: ["./quick-view.component.scss"],
})
export class QuickViewComponent implements OnInit {
  public counter: number = 1;
  public errorMessage = "";
  public successMessage = "";
  public closeResult = '';
  public listData = [];
  public shoppingListData = [];

  @Input() productDetail: any;

  constructor(private router: Router, private ngb: NgbModal, private modalService: NgbModal, private http: HttpClient) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.ngb.dismissAll();
      }
    });
  }

  ngOnInit(): void {
    this.displayAllShoppingListNames();
  }

  public increment() {
    this.counter += 1;
  }

  public decrement() {
    if (this.counter > 1) {
      this.counter -= 1;
    }
  }

  public GetAllShoppingLists() {
    return this.http.get("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/shoppinglists");
  }

  displayAllShoppingListNames(){
    this.GetAllShoppingLists().subscribe(res => {
      let uId = localStorage.getItem('userId');
      for (let i = 0; i < res['data'].length; i++) {
        if((res['data'][i]['userId'] == uId)) {
          this.shoppingListData.push(res['data'][i]);
        }
      }
      console.log(this.shoppingListData);

    })
  }

  public UpdateShoppingListItem(id: string, items: string, price, priceBefore) {
    console.log(id);
    let dealval = 0;
    if(priceBefore != 0){
      dealval = priceBefore - price;
    }
    const obj = {
       id: id,
       items: items,
       price: price,
       deal: dealval
     };
    //const obj = JSON.parse(text);
    this.http.post<any>("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/shoppinglists/update/", obj)
       .subscribe(res => {
          this.successMessage = "One item successfully added!"
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
}
