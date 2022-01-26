import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Address } from 'src/app/dto/address';
import { Country } from 'src/app/model/country';
import { FlipkartValidators } from 'src/app/model/form-validators';
import { State } from 'src/app/model/state';
import { AddressService } from 'src/app/services/address.service';
import { FormService } from 'src/app/services/form.service';
import { FlipkartUtils } from 'src/app/utils/FlipkartUtils';
import { NgxSpinnerService } from 'ngx-bootstrap-spinner';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.css']
})
export class AddAddressComponent implements OnInit {

  countries: Country[] = new Array<Country>();
  states: State[] = new Array<State>();
  addressFormGroup!: FormGroup;
  preventMultipleClicks = false;

  constructor(private formService: FormService, private formBuilder: FormBuilder,
    private addressService: AddressService, private route: Router, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();

    this.getCountries();

    this.addressFormGroup = this.formBuilder.group({
      address: this.formBuilder.group({
        zipcode: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{6}$")]),
        country: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), FlipkartValidators.notOnlyWhiteSpace]),
        street: new FormControl('', [Validators.required, Validators.minLength(2), FlipkartValidators.notOnlyWhiteSpace])
      })
    });
    
    this.spinner.hide();
  }

  getCountries() {
    this.formService.getCountries().subscribe(
      data => {
        if (data.status == 'SUCCESS') {
          this.countries = data.entity;
        }
      }
    );
  }

  getStates() {
    this.spinner.show();
    let countryId = Number(this.country?.value.countryId);
    this.formService.getStates(countryId).subscribe(
      data => {
        if (data.status == 'SUCCESS') {
          this.states = data.entity;
        }
        this.spinner.hide();
      }
    )
  }

  get zipcode() { return this.addressFormGroup.get('address.zipcode'); }
  get country() { return this.addressFormGroup.get('address.country'); }
  get state() { return this.addressFormGroup.get('address.state'); }
  get city() { return this.addressFormGroup.get('address.city'); }
  get street() { return this.addressFormGroup.get('address.street'); }

  getDetailsFromZipcode() {
    if (this.zipcode?.valid) {
      this.spinner.show();
      let zipcode = this.zipcode?.value;
      this.formService.getDetailsFromZipcode(zipcode).subscribe(
        data => {
          if (data[0].Status == 'Success') {
            let postData = data[0].PostOffice[0];
            this.addressFormGroup.get('address.country')?.setValue(this.countries[3]);
            this.getStates();
            this.addressFormGroup.get('address.state')?.setValue(postData.State);
            this.addressFormGroup.get('address.city')?.setValue(postData.District);
          }
          this.spinner.hide();
        }
      );
    }
  }

  addAddress() {
    this.preventMultipleClicks=true;
    let userEmail= FlipkartUtils.getCustomerEmail();
    let address = new Address();
    address.zipCode = this.zipcode?.value;
    address.country = this.country?.value.name;
    address.state = this.state?.value;
    address.city = this.city?.value;
    address.street = this.street?.value;
    this.spinner.show();

    this.addressService.addAddress(address, userEmail).subscribe(
      data => {
        this.preventMultipleClicks=false;
        if (data == true) {
          this.route.navigateByUrl('/address');
        }
        this.spinner.hide();
      }
    );
  }

}
