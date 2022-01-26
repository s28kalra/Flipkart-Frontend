import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { FlipkartUtils } from 'src/app/utils/FlipkartUtils';
import { NgxSpinnerService } from 'ngx-bootstrap-spinner';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName!: string;
  constructor(private oktaAuthService: OktaAuthService, private customerService: CustomerService ,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.oktaAuthService.$authenticationState.subscribe(
      (result) => {
        this.isAuthenticated = result;
        this.getUserDetails();
      }
    );
    this.spinner.hide();
  }

  getUserDetails() {
    if (this.isAuthenticated) {
      this.oktaAuthService.getUser().then(
        (result) => {
          this.userFullName = result.name!;
          FlipkartUtils.setCustomerEmail(result.email!);
          FlipkartUtils.setCustomerName(this.userFullName);
          this.customerService.setCustomer(this.userFullName, result.email!);
        }
      )
    }
  }

  logout() {
    this.spinner.show();
    this.oktaAuthService.signOut();
    FlipkartUtils.removeCustomer();
    this.spinner.hide();
  }

}
