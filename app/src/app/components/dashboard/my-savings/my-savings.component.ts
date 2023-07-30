import { Component } from '@angular/core';
import * as chartData from '../../../shared/data/dashboard/default'

@Component({
  selector: 'app-my-savings',
  templateUrl: './my-savings.component.html',
  styleUrls: ['./my-savings.component.scss']
})
export class MySavingsComponent {

  public recentOrders = chartData.recentOrders;
  public show : boolean = false
  constructor() { }

  toggle(){
    this.show = !this.show
  }
}
