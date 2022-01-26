import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Purchase } from 'src/app/dto/purchase';
import { Transaction } from 'src/app/dto/transaction';
import { CartItem } from 'src/app/model/cart-item';
import { TransactionHistoryService } from 'src/app/services/transaction-history.service';
import { NgxSpinnerService } from 'ngx-bootstrap-spinner';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.css']
})
export class TransactionDetailComponent implements OnInit {

  constructor(private route: ActivatedRoute, private spinner: NgxSpinnerService, private transactionService: TransactionHistoryService) { }
  trackingNumber!: string;
  transactionDetail: Purchase = new Purchase();
  date!: any;

  ngOnInit(): void {
    this.spinner.show();
    this.transactionDetail.orderItems = new Array<CartItem>();
    this.trackingNumber = this.route.snapshot.paramMap.get('trackingNumber')!;
    this.getTransactionDetail();
    this.spinner.hide();
  }

  getTransactionDetail() {
    if (this.trackingNumber) {
      this.transactionService.getTransactionDetail(this.trackingNumber).subscribe(
        data => {
          if (data.status = 'SUCCESS') {
            this.transactionDetail = data.entity;
            this.transactionDetail.transaction = new Transaction();
            this.transactionDetail.transaction.totalPrice = data.entity.totalPrice;
            this.transactionDetail.transaction.totalQuantity = data.entity.totalQuantity;
            this.transactionDetail.transaction.status = data.entity.status;
            this.transactionDetail.transaction.dateCreated = data.entity.dateCreated;
          }
        }
      );
    }
  }

}


