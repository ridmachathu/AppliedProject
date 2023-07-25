import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit {

  constructor() { }

  invoice = [
    {
       itemDesc: "Apple",
       subDesc: "Crisp Apple, 200 Gram$0.66/100g",
       subTotal: 1.32  
    },
    {
       itemDesc: "Mushroom",
       subDesc: "Mushroom White, Sliced227 g, $1.76/100g",
       subTotal: 4  
    },
    {
       itemDesc: "Milk",
       subDesc: "DairylandOrganic 1% Milk",
       subTotal: 8.79  
    }
 ]

 ngOnInit() {
}

}
