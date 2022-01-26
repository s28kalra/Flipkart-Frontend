import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Address } from 'src/app/dto/address';
import { AddressService } from 'src/app/services/address.service';
import { FlipkartUtils } from 'src/app/utils/FlipkartUtils';
import { NgxSpinnerService } from 'ngx-bootstrap-spinner';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

  constructor(private addressService: AddressService, private route: Router, private spinner: NgxSpinnerService) { }


  addresses: Address[] = new Array<Address>();
  userEmail!: string;
  selectedAddress!: Address;

  ngOnInit(): void {
    this.spinner.show();
    this.userEmail= FlipkartUtils.getCustomerEmail();
    this.getListOfAddresses();
    this.spinner.hide();
  }

  getListOfAddresses() {
    this.addressService.getListOfAddresses(this.userEmail).subscribe(
      data => {
        if (data.status == 'SUCCESS') {
          this.addresses = data.entity;
          if (this.addresses.length == 0) {
            this.route.navigateByUrl("/addAddress");
          }
          this.selectedAddress = this.addresses[0];
          this.addressSelected();
        }
      }
    );
  }

  addressSelected() {
    this.addressService.addressSelected(this.selectedAddress);
  }



}
