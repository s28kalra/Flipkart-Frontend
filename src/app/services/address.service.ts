import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Address } from '../dto/address';
import { Customer } from '../dto/customer';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  selectedAddress: BehaviorSubject<Address>= new BehaviorSubject<Address>(new Address());

  private baseUrl: string= environment.baseUrl;

  constructor(private http: HttpClient) { }

  getListOfAddresses(userEmail: string): Observable<any>{
    return this.http.get(this.baseUrl+"addresses/"+userEmail);
  }

  addAddress(address: Address, userEmail: string): Observable<any>{
    return this.http.post(this.baseUrl+"address/"+userEmail, address);
  }

  addressSelected(address: Address){
    this.selectedAddress.next(address);
  }

  getCountryCode(countryName: string):Observable<any>{
    return this.http.get(this.baseUrl+"countryCode/"+countryName);
  }

}
