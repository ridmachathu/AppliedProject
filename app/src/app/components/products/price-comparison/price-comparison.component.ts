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

  sidebaron: boolean = false;
  public products = PRODUCT;
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
        this.listData = res['data'];
      });
    }
  }

  onSearchChange(event: any){
    if(event.target.value.length == 0){
      this.listData = this.listDataBackup;
    }
  }
}

export interface Product {
  id: number;
  img?: string;
  name: string;
  desc: string;
  amount: number;
  stock: string;
  store: string;
}

export const PRODUCT: Product[] = [
  {
    id: 1,
    img: "assets/images/ecommerce/product-table-1.png",
    name: "Men's Shirt",
    desc: "Vida Loca - Blue Denim Fit Men's Casual Shirt.",
    amount: 10,
    stock: "In Stock",
    store: "Walmart",
  },
  {
    id: 2,
    img: "assets/images/ecommerce/product-table-2.png",
    name: "Red Shirt",
    desc: "Wild West - Red Cotton Blend Regular Fit Men's Formal Shirt.",
    amount: 7,
    stock: "out of stock",
    store: "Safeway",
  },
  {
    id: 3,
    img: "assets/images/ecommerce/product-table-3.png",
    name: "Brown Dress",
    desc: "aask - Brown Polyester Blend Women's Fit & Flare Dress.",
    amount: 14,
    stock: "In Stock",
    store: "Save on foods",
  },
  {
    id: 4,
    img: "assets/images/ecommerce/product-table-4.png",
    name: "Red Skirt",
    desc: "R L F - Red Cotton Blend Women's A-Line Skirt.",
    amount: 8,
    stock: "Low Stock",
    store: "Costco",
  },
  {
    id: 5,
    img: "assets/images/ecommerce/product-table-5.png",
    name: "Jeans Jacket",
    desc: "The Dry State - Blue Denim Regular Fit Men's Denim Jacket.",
    amount: 8,
    stock: "In Stock",
    store: "Super store"
  }
];
