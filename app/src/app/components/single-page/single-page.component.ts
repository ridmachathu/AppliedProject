import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common'

@Component({
  selector: 'app-single-page',
  templateUrl: './single-page.component.html',
  styleUrls: ['./single-page.component.scss']
})
export class SinglePageComponent {
  active = 1;
  public shoppingListData = [];
  public wishListData = [];
  // public searchQuery = "";
  // areSearchResults: boolean = false;
  public searchForm: FormGroup;
  public listDataBackup = [];
  public listData = [];
  public uId;
  public Message = "";

  constructor(public config: NgbRatingConfig, private http: HttpClient, private formBuilder: FormBuilder) {
    
   }

  public GetAllShoppingLists() {
    return this.http.get("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/shoppinglists");
  }

  public SearchShoppingLists(query) {
    return this.http.get("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/shoppinglists/search?query=" + query);
  }

  getFormattedDate(dateTimeString: string) {
    // Convert the string to a JavaScript Date object
    const timestamp = parseInt(dateTimeString, 10);
    const date = new Date(timestamp);

    // Format the date using Angular's date pipe (You can change the format as required)
    return formatDate(date, 'short','en-US');
  }

  search(query) {
    if (query !== "") {
      this.listDataBackup = this.listData;
      this.SearchShoppingLists(query).subscribe(res => {
        // this.areSearchResults = true;
        console.log(res['data']);
        for (let i = 0; i < res['data'].length; i++) {
          if((res['data'][i]['userId'] == this.uId)) {
            this.listData = res['data'];
          }
          else{
            this.listData = [];
          }
        }
        // this.listData = res['data'];
        //console.log(this.listData);
      });
    }
  }

  onSearchChange(event: any) {
    if (event.target.value.length == 0) {
      this.listData = this.listDataBackup;
      // this.areSearchResults = false;
    }
  }

  ngOnInit() {
    this.GetAllShoppingLists().subscribe(res => {
      this.uId = localStorage.getItem('userId');
      for (let i = 0; i < res['data'].length; i++) {
        if((res['data'][i]['userId'] == this.uId)) {
          this.listData.push(res['data'][i]);
          if((res['data'][i]['listtype'] == 'Shopping List')){
            this.shoppingListData.push(res['data'][i]);
          }
          else{
            this.wishListData.push(res['data'][i]);
          }
        }
      }
      //console.log(this.shoppingListData);
    })
  }

}
