import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionHistoryService {

  baseUrl=environment.baseUrl;

  constructor(private http:HttpClient) { }

  getTransactions(email: string): Observable<any>{
    return this.http.get(this.baseUrl+"transactions?email="+email);
  }

  getTransactionDetail(trackingNumber: string):Observable<any>{
    return this.http.get(this.baseUrl+`transaction/${trackingNumber}`);
  }
}
