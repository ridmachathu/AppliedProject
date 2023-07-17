import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-price-comparison',
  templateUrl: './price-comparison.component.html',
  styleUrls: ['./price-comparison.component.scss']
})
export class PriceComparisonComponent {
  openSidebar: boolean = false;
  OpenFilter: Boolean = false;
  public listData = [];
  public listDataBackup = [];
  public searchQuery= "";
  public minPrice: string;
  public minStore: string;
  isDivVisible = false;
  public searchTerm: string;
  public caseSensitive = false;

  sidebaron: boolean = false;
  // public products = PRODUCT;
  active = 1;

  // sidebarToggle() {
  //   this.openSidebar = !this.openSidebar;
  // }

  constructor(
    private modalService: NgbModal,
    private productService: ProductService,
    private formBuilder: FormBuilder
  ) {}

  search(query){
    if(query !== ""){
      this.listDataBackup = this.listData;
      this.productService.SearchProducts(query).subscribe(res => {
        //console.log(res['data'][0])
        this.listData = res['data'];
        this.isDivVisible = true;
        this.minPrice = res['data'][0]['price']
        this.minStore = res['data'][0]['store']
        for (let i = 0; i < res['data'].length; i++) {
          if(this.minPrice > res['data'][i]['price']) {
            this.minPrice = res['data'][i]['price'];
            this.minStore = res['data'][i]['store']
          }
        }
        this.searchTerm = this.minPrice;
      });
    }
  }

  onSearchChange(event: any){
    if(event.target.value.length == 0){
      this.listData = this.listDataBackup;
    }
  }
}

