import { Injectable, OnDestroy } from "@angular/core";
import { Subject, BehaviorSubject, fromEvent } from "rxjs";
import { takeUntil, debounceTime } from "rxjs/operators";
import { Router } from "@angular/router";

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

  constructor(private router: Router) {
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
  }

  ngOnDestroy() {
    // this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  private setScreenWidth(width: number): void {
    this.screenWidth.next(width);
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
    { path: "/single-page", icon: "task", title: "Coupons", type: "link", bookmark: true },
    {
      headTitle1: "Categories",
    },
    { path: "/products", icon: "ecommerce", title: "All", type: "link", bookmark: true },
    {
      title: "Forms",
      icon: "form",
      type: "sub",
      active: false,
      children: [
        {
          title: "Form Controls",
          icon: "file-text",
          type: "sub",
          active: false,
          children: [
            { path: "/form/form-controls/validation", title: "Form Validation", type: "link" },
            { path: "/form/form-controls/inputs", title: "Base Inputs", type: "link" },
            { path: "/form/form-controls/checkbox-radio", title: "Checkbox & Radio", type: "link" },
            { path: "/form/form-controls/input-groups", title: "Input Groups", type: "link" },
            { path: "/form/form-controls/mega-options", title: "Mega Options", type: "link" },
          ],
        },
        {
          title: "Form Widgets",
          icon: "file-text",
          type: "sub",
          active: false,
          children: [
            { path: "/form/form-widgets/touchspin", title: "Touchspin", type: "link" },
            { path: "/form/form-widgets/ngselect", title: "Ng-Select", type: "link" },
            { path: "/form/form-widgets/switch", title: "Switch", type: "link" },
            { path: "/form/form-widgets/clipboard", title: "Clipboard", type: "link" },
          ],
        },
        {
          title: "Form Layout",
          icon: "file-text",
          type: "sub",
          active: false,
          children: [
            { path: "/form/form-layout/default-form", title: "Default Forms", type: "link" },
            { path: "/form/form-layout/form-wizard", title: "Form Wizard 1", type: "link" },
            { path: "/form/form-layout/form-wizard-two", title: "Form Wizard 2", type: "link" },
            { path: "/form/form-layout/form-wizard-three", title: "Form Wizard 3", type: "link" },
            { path: "/form/form-layout/form-wizard-four", title: "Form Wizard 4", type: "link" },
          ],
        },
      ],
    },
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
