import { Component, Input, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from "../../shared/services/product.service";
import * as feather from "feather-icons";
import { QuickViewComponent } from './quick-view/quick-view.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
  public wishListData = [];
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

  @ViewChild("quickView") QuickView: QuickViewComponent;
  constructor(
    private modalService: NgbModal,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
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
          debugger
          this.productService.GetProductsByCategory(params.category).subscribe(res => {
            this.listData = res['data'];
          });
        } else {
          // logic to decide if to load all or product deals
          if (this.router.url==="/products/deals") {
            this.productService.GetProductsDeals().subscribe(res => {
              this.listData = res['data'];
            })
          }else{
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
      // this.listData = res['data'];
      for (let i = 0; i < res['data'].length; i++) {
        if(res['data'][i]['listtype'] == 'Shopping List') {
          this.shoppingListData.push(res['data'][i]);
        }
        else{
          this.wishListData.push(res['data'][i]);
        }
      }
      console.log(this.shoppingListData.length);

    })
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

