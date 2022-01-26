import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/model/cart-item';
import { CartService } from 'src/app/services/cart.service';
import { NgxSpinnerService } from 'ngx-bootstrap-spinner';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.css']
})
export class CartDetailComponent implements OnInit {

  cartItems: CartItem[]= new Array<CartItem>();
  totalPrice: number=0;
  totalQuantity: number=0;

  constructor(private cartService: CartService, private spinner: NgxSpinnerService) { }

  failureMessage="Cart is empty";

  ngOnInit(): void {
    this.spinner.show();
    this.listCartDetails();
    this.spinner.hide();
  }

  listCartDetails(){
    this.cartItems=this.cartService.cartItems;
    
    this.cartService.totalPrice.subscribe(data=> this.totalPrice=data);
    this.cartService.totalQuantity.subscribe(data=> this.totalQuantity=data);

    this.cartService.computeCartTotals();
  }

  incrementQuantity(item: CartItem){
    this.cartService.addToCart(item);
  }

  decrementQuanity(item: CartItem){
    this.cartService.decrementQuantity(item);
  }

}
