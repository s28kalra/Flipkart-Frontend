import { Component, OnInit } from '@angular/core';
import { TransactionHistory } from 'src/app/model/transaction-history';
import { TransactionHistoryService } from 'src/app/services/transaction-history.service';
import { FlipkartUtils } from 'src/app/utils/FlipkartUtils';
import { NgxSpinnerService } from 'ngx-bootstrap-spinner';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {

  transactionHistoryList: TransactionHistory[] = new Array<TransactionHistory>();
  failureMessage: string = "";
  constructor(private transactionHistoryService: TransactionHistoryService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.handleTransactionHistoryList();
    this.spinner.hide();
  }

  handleTransactionHistoryList() {
    let email = FlipkartUtils.getCustomerEmail();
    console.log(email);
    if (email) {
      this.transactionHistoryService.getTransactions(email).subscribe(
        data => {
          if (data.status == 'SUCCESS') {
            this.transactionHistoryList = data.entity;
          }
          else {
            this.failureMessage = data.message;
          }
        }
      );
    }
  }

}
