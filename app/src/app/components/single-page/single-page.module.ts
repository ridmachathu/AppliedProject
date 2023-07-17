import { NewListComponent } from './create-new/new-list/new-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SinglePageRoutingModule } from './single-page-routing.module';
import { SinglePageComponent } from './single-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxDropzoneModule } from 'ngx-dropzone';



@NgModule({
  declarations: [
    SinglePageComponent,
    NewListComponent
  ],
  imports: [
    CommonModule,
    SinglePageRoutingModule,
    SharedModule,
    NgxDropzoneModule
  ]
})
export class SinglePageModule { }
