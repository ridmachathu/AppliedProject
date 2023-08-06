import { Component, Input, Output, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from "../../shared/services/product.service";
import * as feather from "feather-icons";
import { QuickViewComponent } from './quick-view/quick-view.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  @Input("icon") public icon;
  @Output() productDetail: any;

  // public listData = data.product;
  public listData = [];
  public shoppingListData = [];
  public errorMessage = "";
  public successMessage = "";
  public closeResult = '';
  openSidebar: boolean = false;
  OpenFilter: Boolean = false;

  sidebaron: boolean = false;
  show: boolean = false;
  open: boolean = false;
  public listView: boolean = false;
  public col_xl_12: boolean = false;
  public col_xl_2: boolean = false;

  public col_sm_3: boolean = false;
  public col_xl_3: boolean = true;
  public xl_4: boolean = true;
  public col_sm_4: boolean = false;
  public col_xl_4: boolean = false;
  public col_sm_6: boolean = true;
  public col_xl_6: boolean = false;
  public gridOptions: boolean = true;
  public active: boolean = false;

  public searchQuery = "";
  public searchForm: FormGroup;
  public listDataBackup = [];
  areSearchResults: boolean = false;

  pageType: string;

  @ViewChild("quickView") QuickView: QuickViewComponent;
  constructor(
    private modalService: NgbModal,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.grid6s();
    this.searchForm = this.formBuilder.group({
      searchField: ['']
    })
    setTimeout(() => {
      feather.replace();
    });


    this.route.params.subscribe(
      (params: { category: string }) => {
        // since this page is used for other purposes but we still need to display products, therefore reusing this page
        if (params.category) {
          this.pageType = 'category';
          this.productService.GetProductsByCategory(params.category).subscribe(res => {
            this.listData = res['data'];
          });
        } else {
          // logic to decide if to load all or product deals
          if (this.router.url==="/products/deals") {
            this.pageType = 'deals';
            this.productService.GetProductsDeals().subscribe(res => {
              this.listData = res['data'];
            })
          }else{
            this.pageType = 'all';
            this.productService.GetAllProducts().subscribe(res => {
              this.listData = res['data'];
            })
          }
        }
      }
    );
    this.displayAllShoppingListNames()
  }

  search(query) {
    if (query !== "") {
      this.listDataBackup = this.listData;
      this.productService.SearchProducts(query).subscribe(res => {
        this.areSearchResults = true;
        this.listData = res['data'];
      });
    }
  }

  onSearchChange(event: any) {
    if (event.target.value.length == 0) {
      this.listData = this.listDataBackup;
      this.areSearchResults = false;
    }
  }

  toggleListView(val) {
    this.listView = val;
  }

  sidebarToggle() {
    this.openSidebar = !this.openSidebar;
  }
  openFilter() {
    this.OpenFilter = !this.OpenFilter;
  }

  displayAllShoppingListNames(){
    this.productService.GetAllShoppingLists().subscribe(res => {
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

  openListPage(content,id) {
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

  gridOpens() {
    this.listView = false;
    this.gridOptions = true;
    this.listView = false;
    this.col_xl_3 = true;

    this.xl_4 = true;
    this.col_xl_4 = false;
    this.col_sm_4 = false;

    this.col_xl_6 = false;
    this.col_sm_6 = true;

    this.col_xl_2 = false;
    this.col_xl_12 = false;
  }
  listOpens() {
    this.listView = true;
    this.gridOptions = false;
    this.listView = true;
    this.col_xl_3 = true;
    this.xl_4 = true;
    this.col_xl_12 = true;
    this.col_xl_2 = false;

    this.col_xl_4 = false;
    this.col_sm_4 = false;
    this.col_xl_6 = false;
    this.col_sm_6 = true;
  }
  grid2s() {
    this.listView = false;
    this.col_xl_3 = false;
    this.col_sm_3 = false;

    this.col_xl_2 = false;

    this.col_xl_4 = false;
    this.col_sm_4 = false;

    this.col_xl_6 = true;
    this.col_sm_6 = true;

    this.col_xl_12 = false;
  }
  grid3s() {
    this.listView = false;
    this.col_xl_3 = false;
    this.col_sm_3 = false;

    this.col_xl_2 = false;
    this.col_xl_4 = true;
    this.col_sm_4 = true;

    this.col_xl_6 = false;
    this.col_sm_6 = false;

    this.col_xl_12 = false;
  }
  grid6s() {
    this.listView = false;
    this.col_xl_3 = false;
    this.col_sm_3 = false;

    this.col_xl_2 = true;
    this.col_xl_4 = false;
    this.col_sm_4 = false;

    this.col_xl_6 = false;
    this.col_sm_6 = false;

    this.col_xl_12 = false;
  }

  openProductDetail(content: any, item: any) {
    this.modalService.open(content, { centered: true, size: "lg" });
    this.productDetail = item;
  }

  ngDoCheck() {
    this.col_xl_12 = this.col_xl_12;
    this.col_xl_2 = this.col_xl_2;
    this.col_sm_3 = this.col_xl_12;
    this.col_xl_3 = this.col_xl_3;
    this.xl_4 = this.xl_4;
    this.col_sm_4 = this.col_sm_4;
    this.col_xl_4 = this.col_xl_4;
    this.col_sm_6 = this.col_sm_6;
    this.col_xl_6 = this.col_xl_6;
  }
}

