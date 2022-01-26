import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from '../dto/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  setCustomer(name: string, email: string): Observable<any> {
    let customer: Customer = new Customer();
    customer.firstName = name;
    customer.lastName = email;
    return this.http.post(this.baseUrl + "addCustomer", customer);
  }


}
