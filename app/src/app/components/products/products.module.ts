import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { PriceComparisonComponent } from './price-comparison/price-comparison.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuickViewComponent } from './quick-view/quick-view.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import {NgFor} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';


@NgModule({
  declarations: [
    ProductsComponent,
    QuickViewComponent,
    PriceComparisonComponent,
    ProductDetailsComponent,
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule,
    GalleryModule,
    NgbDropdownModule,
    MatRadioModule, FormsModule, NgFor, ReactiveFormsModule
  ],
  exports: []
})
export class ProductsModule { }
