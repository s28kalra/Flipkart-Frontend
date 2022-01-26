import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddProduct } from 'src/app/dto/add-product';
import { Category } from 'src/app/model/category';
import { FlipkartValidators } from 'src/app/model/form-validators';
import { Product } from 'src/app/model/product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { FlipkartUtils } from 'src/app/utils/FlipkartUtils';
import { NgxSpinnerService } from 'ngx-bootstrap-spinner';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  productDetail: AddProduct = new AddProduct();
  mainFile!: File;
  secImages: File[] = new Array<File>();
  preventMultipleClicks = false;
  productForm!: FormGroup;
  categories: Category[] = new Array<Category>();

  admins = new Array<String>();
  constructor(private route: Router, private formBuilder: FormBuilder, private productService: ProductService,
    private categoryService: CategoryService, private spinner: NgxSpinnerService) {
    this.admins.push('sagarkalra03@gmail.com');
  }

  ngOnInit(): void {
    this.spinner.show();
    let user: string = FlipkartUtils.getCustomerEmail();
    if (this.admins.some(a => a == user)) {
      this.loadPage();
    } else {
      this.route.navigateByUrl("/");
    }
    this.spinner.hide();
  }

  loadPage() {
    this.loadcategories();

    this.productForm = this.formBuilder.group({
      product: this.formBuilder.group({
        name: new FormControl('', [Validators.required, FlipkartValidators.notOnlyWhiteSpace]),
        category: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required, FlipkartValidators.notOnlyWhiteSpace]),
        sku: new FormControl('', [Validators.required, FlipkartValidators.notOnlyWhiteSpace]),
        unitPrice: new FormControl('', [Validators.required]),
        unitsInStock: new FormControl('', [Validators.required]),
        mainImage: new FormControl('', [Validators.required]),
      })
    });
  }

  loadcategories() {
    this.categoryService.getCategories().subscribe(
      data => {
        if (data.status == 'SUCCESS') {
          this.categories = data.entity;
        }
      }
    );
  }

  mainFileSelected(event: any) {
    this.mainFile = event.target.files[0];
  }

  secondaryFilesSelected(event: any) {
    for (var i = 0; i < event.target.files.length; i++) {
      this.secImages.push(event.target.files[i]);
    }
  }

  get name() { return this.productForm.get('product.name'); }
  get category() { return this.productForm.get('product.category'); }
  get description() { return this.productForm.get('product.description'); }
  get sku() { return this.productForm.get('product.sku'); }
  get unitPrice() { return this.productForm.get('product.unitPrice'); }
  get unitsInStock() { return this.productForm.get('product.unitsInStock'); }
  get mainImage() { return this.productForm.get('product.mainImage'); }

  addProduct() {
    this.spinner.show();

    // creating Product
    let product: Product = new Product();
    product.name = this.name?.value;
    product.description = this.description?.value;
    product.sku = this.sku?.value;
    product.unitPrice = this.unitPrice?.value;
    product.unitsInStock = this.unitsInStock?.value;
    product.active = product.unitsInStock > 0;

    // creating Category
    let category = new Category();
    category = this.category?.value;

    // creating product Detail
    this.productDetail.product = product;
    this.productDetail.category = category;

    // appending to formData
    let formData = new FormData();
    formData.append('productDetail', JSON.stringify(this.productDetail));
    formData.append('mainImage', this.mainFile);
    let param = "secondaryImages";
    for (let i = 0; i < this.secImages.length; i++)
      formData.append(param, this.secImages[i], this.secImages[i].name);

    this.productService.addProduct(formData).subscribe(
      data => {
        this.spinner.hide();
        if (data == true) {
          this.route.navigateByUrl("/");
        } else {
          alert("Product Not Added, Try again");
        }
      }
    );

  }


}
