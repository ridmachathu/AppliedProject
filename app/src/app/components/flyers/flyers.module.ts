import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlyersRoutingModule } from './flyers-routing.module';
import { FlyersComponent } from './flyers.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    FlyersComponent
  ],
  imports: [
    CommonModule,
    FlyersRoutingModule,
    SharedModule
  ]
})
export class FlyersModule { }
