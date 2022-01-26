import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/model/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-product-menu',
  templateUrl: './product-menu.component.html',
  styleUrls: ['./product-menu.component.css']
})
export class ProductMenuComponent implements OnInit {

  categories: Category[]= new Array<Category>();

  constructor(private categoryService: CategoryService){ }
  
  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(
      (data)=>{
        if(data.status=="SUCCESS"){
          this.categories= data.entity;
        }
      }
    )
  }
}
