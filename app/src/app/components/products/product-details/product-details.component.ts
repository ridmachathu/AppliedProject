import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Image } from '@ks89/angular-modal-gallery';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})

export class ProductDetailsComponent implements OnInit {

  productId;
  product;
  active = 1;
  public imagesRect: Image[] = [
    new Image(0, { img: 'assets/images/ecommerce/04.jpg' }, { img: 'assets/images/ecommerce/03.jpg' })]

  constructor(
    public config: NgbRatingConfig,
    private productService: ProductService,
    private route: ActivatedRoute
  ) {
    config.max = 5;
    config.readonly = true;

    this.loadProductDetails();
  }

  ngOnInit() { }

  async loadProductDetails() {

    const params$ = this.route.params;
    const params = await firstValueFrom(params$);
    this.productId = params.id;

    this.productService.GetProductById(this.productId).subscribe(res => {
      this.product = res['data'];
      this.imagesRect = [
        new Image(0, { img: this.product.imageUrl }, { img: this.product.imageUrl }),
        new Image(1, { img: this.product.imageUrl }, { img: this.product.imageUrl })
      ];
      
    })
  }

}
