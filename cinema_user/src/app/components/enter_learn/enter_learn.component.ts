import { Component, OnInit } from '@angular/core';
import { Shop } from 'src/app/models/shop.model';
import { ShopAPIService } from 'src/app/services/shopAPI.service';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({

  templateUrl: './enter_learn.component.html',
})
export class Enter_learnComponent implements OnInit{
  searchByName: FormGroup;
  constructor(
    private shopAPIService: ShopAPIService,
    private formBuilder: FormBuilder,
  ){}
  shops: Shop[];
  
  ngOnInit(): void {
    this.shopAPIService.findByCategoryID(3).then(
      res => {
          this.shops = res as Shop[]; 
          console.log(this.shops);
          
      },
      err => {
          console.log(err);
      }
     );
     this.searchByName = this.formBuilder.group({
      keyword: ''
    });
  }
  search(){
    
    var keyword: string = this.searchByName.value.keyword;
    this.shopAPIService.findByName(keyword, 3).then(
      res => {
          this.shops = res as Shop[]; 
          console.log(this.shops);
          
      },
      err => {
          console.log(err);
      }
     );
     if(keyword == ''){
      this.shopAPIService.findByCategoryID(1).then(
        res => {
            this.shops = res as Shop[]; 
            console.log(this.shops);
            
        },
        err => {
            console.log(err);
        }
       );
     }
  }
}