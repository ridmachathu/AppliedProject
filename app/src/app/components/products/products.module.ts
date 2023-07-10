import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { PriceComparisonComponent } from './price-comparison/price-comparison.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuickViewComponent } from './quick-view/quick-view.component';


@NgModule({
  declarations: [
    ProductsComponent,
    QuickViewComponent,
    PriceComparisonComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule
  ]
})
export class ProductsModule { }
