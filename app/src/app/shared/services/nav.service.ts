import { Injectable, OnDestroy } from "@angular/core";
import { Subject, BehaviorSubject, fromEvent } from "rxjs";
import { takeUntil, debounceTime } from "rxjs/operators";
import { Router } from "@angular/router";
import { ProductService } from "./product.service";

// Menu
export interface Menu {
  headTitle1?: string;
  headTitle2?: string;
  path?: string;
  title?: string;
  icon?: string;
  type?: string;
  badgeType?: string;
  badgeValue?: string;
  active?: boolean;
  bookmark?: boolean;
  children?: Menu[];
}

@Injectable({
  providedIn: "root",
})
export class NavService implements OnDestroy {
  private unsubscriber: Subject<any> = new Subject();
  public screenWidth: BehaviorSubject<number> = new BehaviorSubject(window.innerWidth);

  // Search Box
  public search: boolean = false;

  // Language
  public language: boolean = false;

  // Mega Menu
  public megaMenu: boolean = false;
  public levelMenu: boolean = false;
  public megaMenuColapse: boolean = window.innerWidth < 1199 ? true : false;

  // Collapse Sidebar
  public collapseSidebar: boolean = window.innerWidth < 991 ? true : false;

  // For Horizontal Layout Mobile
  public horizontal: boolean = window.innerWidth < 991 ? false : true;

  // Full screen
  public fullScreen: boolean = false;

  constructor(
    private router: Router,
    private productService: ProductService,
  ) {
    this.setScreenWidth(window.innerWidth);
    fromEvent(window, "resize")
      .pipe(debounceTime(1000), takeUntil(this.unsubscriber))
      .subscribe((evt: any) => {
        this.setScreenWidth(evt.target.innerWidth);
        if (evt.target.innerWidth < 991) {
          this.collapseSidebar = true;
          this.megaMenu = false;
          this.levelMenu = false;
        }
        if (evt.target.innerWidth < 1199) {
          this.megaMenuColapse = true;
        }
      });
    if (window.innerWidth < 991) {
      // Detect Route change sidebar close
      this.router.events.subscribe((event) => {
        this.collapseSidebar = true;
        this.megaMenu = false;
        this.levelMenu = false;
      });
    }

    // load menu items for product classes, types and categories from DB
    this.productService.GetProductClasses().subscribe(res => {
      let productClasses = res['data'];
      productClasses.forEach(productClass => {
        this.MENUITEMS.push(this.getClassMenuItem(productClass))
      });
    })
  }

  private getClassMenuItem(title) {
    return {
      title: title,
      isDynamic: true,
      menuType: 'class',
      icon: "ecommerce",
      type: "sub",
      active: false,
      children: []
    }
  }

  private getTypeMenuItem(title) {
    return {
      title: title,
      isDynamic: true,
      menuType: 'type',
      icon: "file-text",
      type: "sub",
      active: false,
      children: []
    }
  }

  private getCategoryMenuItem(title) {
    return {
      isDynamic: true,
      menuType: 'type',
      path: "/products/category",
      title: title,
      type: "link"
    }
  }

  ngOnDestroy() {
    // this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  private setScreenWidth(width: number): void {
    this.screenWidth.next(width);
  }

  public GetAllTypesForClass(productClass) {
    this.productService.GetProductTypesForClass(productClass).subscribe(res => {
      let productTypes = res['data'];
      this.MENUITEMS.forEach(menuItem => {
        productTypes.forEach(productType => {
          if (menuItem.title === productClass && menuItem.children.length !== productTypes.length) {
            menuItem.children.push(this.getTypeMenuItem(productType))
          }
        });
      });
    })
  }

  public GetAllCategoriesForType(productType, parentItem) {
    this.productService.GetProductCategoriesForType(productType).subscribe(res => {
      let productCategories = res['data'];
      this.MENUITEMS.forEach(menuItem => {
        if (menuItem.title === parentItem.title) {
          menuItem.children.forEach(childMenuItem => {
            productCategories.forEach(productCategory => {
              if (childMenuItem.title === productType && childMenuItem.children.length !== productCategories.length) {
                childMenuItem.children.push(this.getCategoryMenuItem(productCategory))
              }
            });
          });
        }
      });
    })
  }

  MENUITEMS: Menu[] = [

    {
      headTitle1: "General",
    },
    { path: "/dashboard", icon: "home", title: "Dashboard", type: "link", bookmark: true },
    { path: "/single-page", icon: "ecommerce", title: "Smart Shopping List", type: "link", bookmark: true },
    { path: "/single-page", icon: "bookmark", title: "Favorites", type: "link", bookmark: true },
    { path: "/flyers", icon: "others", title: "Flyers", type: "link", bookmark: true },
    { path: "/products/comparison", icon: "ecommerce", title: "Compare", type: "link", bookmark: true },
    { path: "/products/deals", icon: "task", title: "Deals", type: "link", bookmark: true },
    {
      headTitle1: "Categories",
    },
    { path: "/products", icon: "bonus-kit", title: "All", type: "link", bookmark: true }
  ];

  // Array
  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);

  // {
  //   title: "Simple Page",
  //   icon: "home",
  //   type: "sub",
  //   badgeType: "light-primary",
  //   badgeValue: "2",
  //   active: true,
  //   children: [
  //     { path: "/simple-page/first-page", title: "First Page", type: "link" },
  //     { path: "/simple-page/second-page", title: "Second Page", type: "link" },
  //   ],
  // },
  // { path: "/single-page", icon: "search", title: "Single Page", type: "link", bookmark: true },





}
