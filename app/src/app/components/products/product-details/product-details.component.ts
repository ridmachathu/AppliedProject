import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Image } from '@ks89/angular-modal-gallery';
import { ModalDismissReasons, NgbModal, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})

export class ProductDetailsComponent implements OnInit {

  public errorMessage = "";
  public successMessage = "";
  public closeResult = '';
  public shoppingListData = [];
  productId;
  product;
  active = 1;
  public imagesRect: Image[] = [
    new Image(0, { img: 'assets/images/ecommerce/04.jpg' }, { img: 'assets/images/ecommerce/03.jpg' })]

  constructor(
    private modalService: NgbModal,
    public config: NgbRatingConfig,
    private productService: ProductService,
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {
    config.max = 5;
    config.readonly = true;

    this.loadProductDetails();
  }

  ngOnInit() { 
    this.displayAllShoppingListNames();
  }

  async loadProductDetails() {

    const params$ = this.route.params;
    const params = await firstValueFrom(params$);
    this.productId = params.id;

    this.productService.GetProductById(this.productId).subscribe(res => {
      this.product = res['data'];
      this.imagesRect = [
        new Image(0, { img: this.product.imageUrl }, { img: this.product.imageUrl }),
        new Image(1, { img: this.product.imageUrl }, { img: this.product.imageUrl })
      ];
      
    })
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

  public UpdateShoppingListItem(id: string, items: string) {
    console.log(id);
    const obj = {
       id: id,
       items: items
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

}
