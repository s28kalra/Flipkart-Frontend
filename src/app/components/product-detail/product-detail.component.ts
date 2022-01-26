import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/model/cart-item';
import { Image } from 'src/app/model/image';
import { Product } from 'src/app/model/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { NgxSpinnerService } from 'ngx-bootstrap-spinner';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  product!: Product;
  failMessage!: string;
  images!: Image[];

  constructor(private route: ActivatedRoute, private productService: ProductService,
    private cartService: CartService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show()
    this.route.paramMap.subscribe(() => {
      this.getProduct();
    });
    this.spinner.hide();
  }

  addToCart(product: Product) {
    let cartItem: CartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }

  getProduct() {
    let hasProductId = this.route.snapshot.paramMap.has('productId');
    this.product = new Product();
    this.images = new Array<Image>();
    if (hasProductId) {
      let productId = Number(this.route.snapshot.paramMap.get('productId'));
      this.productService.getProductWithId(productId).subscribe(
        (data) => {
          console.log(data);
          if (data.status = "SUCCESS") {
            this.product = data.entity;
            this.images = data.entity.images;
          } else {
            this.failMessage = data.message;
          }
        });
    }
  }

}
