import { Routes } from "@angular/router";

export const content: Routes = [
  {
    path: "simple-page",
    loadChildren: () => import("../../components/simple-page/simple-page.module").then((m) => m.SimplePageModule),
  },
  {
    path: "single-page",
    loadChildren: () => import("../../components/single-page/single-page.module").then((m) => m.SinglePageModule),
  },
  {
    path: "dashboard",
    loadChildren: () => import("../../components/dashboard/dashboard.module").then((m) => m.DashboardModule),
  },
  {
    path: "flyers",
    loadChildren: () => import("../../components/flyers/flyers.module").then((m) => m.FlyersModule),
  },
  {
    path: "products",
    loadChildren: () => import("../../components/products/products.module").then((m) => m.ProductsModule),
  },
  // {
  //   path: "price-comparison",
  //   loadChildren: () => import("../../components/products/price-comparison/price-comparison.module").then((m) => m.PriceComparisonModule),
  // }
];
