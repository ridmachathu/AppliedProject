import { Component } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-single-page',
  templateUrl: './single-page.component.html',
  styleUrls: ['./single-page.component.scss']
})
export class SinglePageComponent {
  active = 1;

  constructor(public config: NgbRatingConfig) {
    config.max = 5;
		config.readonly = true;
   }

  //  btnnewlist () {
  //   this.router.navigateByUrl('/single-page/newlist');
  //  };

}
