import { Component, OnInit } from "@angular/core";
import { Product } from "src/app/models/product.model";
import { ProductAPIService } from "src/app/services/productAPI.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { DatePipe } from "@angular/common";
@Component({
  templateUrl: "./product.component.html",
})
export class ProductComponent implements OnInit {
  searchByName: FormGroup;
  options: any[];
  today: Date = new Date();
  status: boolean;
  constructor(
    private productAPIService: ProductAPIService,
    private formBuilder: FormBuilder
  ) {}
  products: Product[];
  sale(status: boolean) {
    for (let p of this.products) {
      var startDate = p.startSale.toString();
      var endDate = p.endSale.toString();
      console.log(startDate);
      this.status = status;
      console.log(endDate);
      console.log("---------");
      const [day, month, year] = startDate.split("/");
      const [day1, month1, year1] = endDate.split("/");
      var dateFormat1 = new Date(
        parseInt(year),
        parseInt(month),
        parseInt(day)
      );
      var dateFormat2 = new Date(
        parseInt(year1),
        parseInt(month1),
        parseInt(day1)
      );

      p.startSale = dateFormat1;
      p.endSale = dateFormat2;
    }
  }
  ngOnInit(): void {
    this.productAPIService.findAll().then(
      (res) => {
        this.products = res as Product[];
        this.sale(true);
      },
      (err) => {
        console.log(err);
      }
    );
    this.searchByName = this.formBuilder.group({
      keyword: "",
    });
    this.options = ["Giá tăng dần", "Giá giảm dần"];
  }
  search() {
    var keyword: string = this.searchByName.value.keyword;
    this.productAPIService.findByName(keyword).then(
      (res) => {
        this.products = res as Product[];
        this.sale(true);
        console.log(this.products);
      },
      (err) => {
        console.log(err);
      }
    );
    if (keyword == "") {
      this.productAPIService.findAll().then(
        (res) => {
          this.products = res as Product[];
          this.sale(true);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  order(evt: any) {
    var type: number = evt.target.value;
    if (type == 0) {
      this.productAPIService.findAll().then(
        (res) => {
          this.products = res as Product[];
          this.sale(true);
        },
        (err) => {
          console.log(err);
        }
      );
    } else if (type == 1) {
      this.productAPIService.sale().then(
        (res) => {
          this.products = res as Product[];
          this.sale(false);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
}
