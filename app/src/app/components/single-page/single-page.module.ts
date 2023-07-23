import { NewListComponent } from './create-new/new-list/new-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SinglePageRoutingModule } from './single-page-routing.module';
import { SinglePageComponent } from './single-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxPrintModule } from 'ngx-print';
import { ListItemComponent } from './list-item/list-item.component';



@NgModule({
  declarations: [
    SinglePageComponent,
    NewListComponent,
    ListItemComponent
  ],
  imports: [
    CommonModule,
    SinglePageRoutingModule,
    SharedModule,
    NgxDropzoneModule,
    NgxPrintModule
  ]
})
export class SinglePageModule { }
