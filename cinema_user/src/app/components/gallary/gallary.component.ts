import { Component, OnInit } from '@angular/core';
import { Gallary } from 'src/app/models/gallary.model';
import { GallaryAPIService } from 'src/app/services/gallaryAPI.service';

@Component({
  
  templateUrl: './gallary.component.html',
})
export class GallaryComponent implements OnInit{
  gallaries: Gallary[];
  constructor(
    private gallaryService: GallaryAPIService
  
  ){}
  
  
  ngOnInit(): void {
    this.gallaryService.findAll().then(
      res => {
          this.gallaries = res as Gallary[]; 
        console.log(this.gallaries);
      },
      err => {
          console.log(err);
      }
     );
     
  }
}
