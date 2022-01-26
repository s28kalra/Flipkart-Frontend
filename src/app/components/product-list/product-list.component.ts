import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/model/cart-item';
import { PageInfo } from 'src/app/model/page-info';
import { Product } from 'src/app/model/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  //templateUrl: './product-list-template.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  constructor(private productService: ProductService, private cartService: CartService,
    private route: ActivatedRoute, private spinner: NgxSpinnerService) { }

  products!: Product[];
  pageInfo!: PageInfo;

  failureMessage!: string;
  thePageNumber!: number;
  sort = "";
  size = 10;

  ngOnInit(): void {
    this.spinner.show();
    this.route.paramMap.subscribe(() => {
      this.getListOfProducts();
    });
    this.spinner.hide();
  }

  sizeChanged() {
    this.thePageNumber = 1;
    this.nextPage();
  }

  nextPage() {
    let path = window.location.pathname;
    if (path.includes("products")) {
      this.productService.getProductListPaginate(this.thePageNumber - 1, this.size, this.sort)
        .subscribe((data) => { this.updatePage(data); });
    }
    else if (path.includes("category")) {
      let categoryId = Number(path.substring(path.lastIndexOf("/") + 1));
      this.productService.getProductListPaginateForCategory(categoryId, this.thePageNumber - 1, this.size, this.sort)
        .subscribe((data) => { this.updatePage(data) });
    }
    else if (path.includes("search")) {
      let keyword = String(path.substring(path.lastIndexOf("/") + 1));
      this.productService.getProductListPaginateForSearch(keyword, this.thePageNumber - 1, this.size, this.sort)
        .subscribe((data) => { this.updatePage(data) });
    }
  }

  getListOfProducts() {
    let hascategoryId = this.route.snapshot.paramMap.has('categoryId');
    let hasKeyword = this.route.snapshot.paramMap.has('keyword')
    this.products = new Array<Product>();
    this.pageInfo = new PageInfo();
    if (hascategoryId)
      this.getProductsForCategoryId();
    else if (hasKeyword)
      this.getProductsFromSearching();
    else
      this.getAllProducts();

  }

  getProductsForCategoryId() {
    let categoryId!: number;
    categoryId = Number(this.route.snapshot.paramMap.get('categoryId'));
    this.productService.getProductListPaginateForCategory(categoryId, 0, this.size, "").subscribe(
      (data) => { this.updatePage(data); });
  }

  getProductsFromSearching() {
    let keyword = String(this.route.snapshot.paramMap.get('keyword'));
    this.productService.getProductListPaginateForSearch(keyword, 0, this.size, "").subscribe(
      (data) => { this.updatePage(data); });
  }

  getAllProducts() {
    this.productService.getProductListPaginate(0, this.size, "").subscribe(
      (data) => { this.updatePage(data); });
  }

  private updatePage(data: any) {
    if (data.status == "SUCCESS") {
      this.products = data.entity;
      this.pageInfo = data.pageInfo;
      this.thePageNumber = this.pageInfo.number + 1;
    } else {
      this.failureMessage = data.message;
    }
  }

  addToCart(product: Product) {
    let cartItem: CartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }



}
