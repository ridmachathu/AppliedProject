import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProductsComponent } from "./products.component";
import { PriceComparisonComponent } from "./price-comparison/price-comparison.component";
import { ProductDetailsComponent } from "./product-details/product-details.component";

const routes: Routes = [
  {
    path: "",
    component: ProductsComponent,
  },
  {
    path: "comparison",
    component: PriceComparisonComponent,
  },
  {
    path: "details/:id",
    component: ProductDetailsComponent,
  },
  {
    path: "category/:category",
    component: ProductsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
