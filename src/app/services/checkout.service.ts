import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentDto } from '../dto/payment-dto';
import { Purchase } from '../dto/purchase';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  purchaseUrl = environment.baseUrl + "checkout/purchase";
  paymentIntentUrl = environment.baseUrl+ "checkout/payment-intent";

  constructor(private http: HttpClient) { }

  placeOrder(purchase: Purchase): Observable<any> {
    return this.http.post(this.purchaseUrl, purchase);
  }

  createPaymentIntent(paymentDto: PaymentDto): Observable<any> {
    return this.http.post(this.paymentIntentUrl, paymentDto);
  }
}
