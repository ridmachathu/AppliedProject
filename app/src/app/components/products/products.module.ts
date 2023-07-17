import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { PriceComparisonComponent } from './price-comparison/price-comparison.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuickViewComponent } from './quick-view/quick-view.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

import { GalleryModule } from '@ks89/angular-modal-gallery';
import { HighlightDirective } from './highlight/highlight.directive';


@NgModule({
  declarations: [
    ProductsComponent,
    QuickViewComponent,
    PriceComparisonComponent,
    ProductDetailsComponent,
    HighlightDirective
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule,
    GalleryModule
  ],
  exports: [HighlightDirective]
})
export class ProductsModule { }
