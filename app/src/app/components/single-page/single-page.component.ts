import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';

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


  constructor(public config: NgbRatingConfig, private http: HttpClient, private formBuilder: FormBuilder,) {
    // config.max = 5;
		// config.readonly = true;
   }

  public GetAllShoppingLists() {
    return this.http.get("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/shoppinglists");
  }

  public SearchShoppingLists(query) {
    return this.http.get("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/shoppinglists/search?query=" + query);
  }

  search(query) {
    if (query !== "") {
      this.listDataBackup = this.listData;
      this.SearchShoppingLists(query).subscribe(res => {
        // this.areSearchResults = true;
        this.listData = res['data'];
        console.log(this.listData);
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
    // this.searchForm = this.formBuilder.group({
    //   searchField: ['']
    // })
    this.GetAllShoppingLists().subscribe(res => {
      this.listData = res['data'];
      for (let i = 0; i < res['data'].length; i++) {
        if(res['data'][i]['listtype'] == 'Shopping List') {
          this.shoppingListData.push(res['data'][i]);
        }
        else{
          this.wishListData.push(res['data'][i]);
        }
      }
      // for (let item in this.listData) {
      //   if (item.listtype )
      // }

    })
  }

  //  btnnewlist () {
  //   this.router.navigateByUrl('/single-page/newlist');
  //  };

}
