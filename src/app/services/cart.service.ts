import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../model/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  storage: Storage= localStorage;

  cartItems: CartItem[] = new Array<CartItem>();

  constructor() { 
    let data= JSON.parse(this.storage.getItem('cartItems')!);
    if(data!=null)
      this.cartItems= data;
    this.computeCartTotals();
   }

  totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  addToCart(cartItem: CartItem) {
    let hasItem: boolean = false;
    let currentItem!: CartItem ; // telling that currentItem can be undefined as well
    
    currentItem= this.cartItems.find(item => item.productId==cartItem.productId)!;
    hasItem= currentItem!=undefined;

    if (hasItem) {
      currentItem!.quantity += 1; //because quantity has be incremented for the item present in array
    } else {
      this.cartItems.push(cartItem);
    }

    this.computeCartTotals();
  }

  decrementQuantity(item: CartItem){
    item.quantity--;
    if(item.quantity==0){
      this.remove(item);
    }

    this.computeCartTotals();

  }

  private remove(item: CartItem){
    let index = this.cartItems.findIndex(i=> i.productId== item.productId);
    if(index>-1)
      this.cartItems.splice(index, 1);
  }

  computeCartTotals() {

    let totalPriceValue = 0;
    let totalQuantityValue = 0;

    for (let temp of this.cartItems) {
      totalPriceValue += temp.quantity * temp.unitPrice;
      totalQuantityValue += temp.quantity;
    }

    // publish all new values ,,,, all subscribers will receive new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    
    this.persistCartItems();
  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }
}
