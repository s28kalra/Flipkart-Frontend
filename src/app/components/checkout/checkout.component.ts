import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Purchase } from 'src/app/dto/purchase';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Transaction } from 'src/app/dto/transaction';
import { CartItem } from 'src/app/model/cart-item';
import { environment } from 'src/environments/environment';
import { PaymentDto } from 'src/app/dto/payment-dto';
import { AddressService } from 'src/app/services/address.service';
import { Address } from 'src/app/dto/address';
import { Customer } from 'src/app/dto/customer';
import { FlipkartUtils } from 'src/app/utils/FlipkartUtils';
import { NgxSpinnerService } from 'ngx-bootstrap-spinner';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;
  totalPrice = 0;
  totalQuantity = 0;
  preventMultipleClicks: boolean = false;

  stripe = Stripe(environment.stripePublishableKey);

  paymentDto: PaymentDto = new PaymentDto();
  cardElement!: any;
  displayError!: any;
  address: Address = new Address();
  orderItems: CartItem[] = new Array<CartItem>();
  customer: Customer = new Customer();
  countryCode!: string;

  constructor(private cartService: CartService, private router: Router, private checkoutService: CheckoutService,
    private addressService: AddressService, private formBuilder: FormBuilder, private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.spinner.show();
    this.getTotals();
    this.getAddress();
    this.getCustomerDetails();
    this.setupStripePaymentForm();
    this.checkoutFormGroup = this.formBuilder.group({
      card: {}
    });
    this.spinner.hide();
  }

  getAddress() {
    this.addressService.selectedAddress.subscribe(data => this.address = data);
    this.addressService.getCountryCode(this.address.country).subscribe(
      data=> {
        if(data.status=='SUCCESS'){
          this.countryCode= data.entity;
        }
      }
    );
  }

  getCustomerDetails() {
    this.customer.email= FlipkartUtils.getCustomerEmail();
    this.customer.firstName= FlipkartUtils.getCustomerName();
  }

  setupStripePaymentForm() {
    var elements = this.stripe.elements();
    this.cardElement = elements.create('card', { hidePostalCode: true });
    this.cardElement.mount("#card-element");
    this.cardElement.on('change', (event: any) => {
      this.displayError = document.getElementById("card-errors");
      if (event.complete) {
        this.displayError.textContent = "";
      } else if (event.error) {
        this.displayError.textContent = event.error.message;
      }
    });
  }

  getTotals() {
    this.cartService.totalPrice.subscribe(data => this.totalPrice = data);
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);
    this.orderItems = this.cartService.cartItems;
  }

  placeOrder() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    this.spinner.show();

    this.preventMultipleClicks = true;
    let purchase = new Purchase();

    //customer
    purchase.customer = this.customer;

    // address
    purchase.address = this.address;

    // order Items
    purchase.orderItems = this.orderItems;

    // Transaction details
    purchase.transaction = new Transaction();
    purchase.transaction.totalPrice = this.totalPrice;
    purchase.transaction.totalQuantity = this.totalQuantity;

    this.paymentDto.amount = Math.ceil(this.totalPrice * 100);
    this.paymentDto.currency = "INR";
    this.paymentDto.receiptEmail = purchase.customer.email;

    // if valid form then ::
    // -- create payment intent
    // confirm card payment
    // place order

    if (this.displayError.textContent! == "") {

      this.checkoutService.createPaymentIntent(this.paymentDto).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.entity,
            {
              payment_method: {
                card: this.cardElement,
                billing_details: {
                  email: purchase.customer.email,
                  name: `${purchase.customer.firstName}`,
                  address: {
                    line1: purchase.address.street,
                    city: purchase.address.city,
                    state: purchase.address.state,
                    postal_code: purchase.address.zipCode,
                    country: this.countryCode
                  }

                }
              }
            }, { handleActions: false })
            .then((result: any) => {
              if (result.error) {
                this.spinner.hide();
                // inform the customer there was an error
                alert(`There was an error: ${result.error.message}`);
                this.preventMultipleClicks = false;
              } else {
                // call REST API via the CheckoutService
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: (response: any) => {
                    this.spinner.hide();
                    alert(`Your order has been received.\nOrder tracking number: ${response.entity}`);
                    this.preventMultipleClicks = true;
                    // reset cart
                    this.resetCart();
                  },
                  error: (err: any) => {
                    alert(`There was an error: ${err.message}`);
                    this.preventMultipleClicks = false;
                  }
                })
              }
            });
        }
      );
    }

  }

  resetCart() {
    this.cartService.cartItems = new Array<CartItem>();
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();
    this.checkoutFormGroup.reset();
    this.router.navigateByUrl("/transactions");
  }

}
