import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FeedbackAPI } from 'src/app/models/feedbackapi.model';
import { FeedbackAPIService } from 'src/app/services/feedbackapi.service';

@Component({
  
  templateUrl: './feedback.component.html',
})
export class FeedbackComponent {
  FeedbackForm: FormGroup;
  constructor(
    private formBuilder : FormBuilder,
    private feedbackAPIService: FeedbackAPIService,
    private router : Router,
    private messageService : MessageService
  ){}
  ngOnInit(){
    this.FeedbackForm = this.formBuilder.group({
      name:'',
      message:'',
      value:'',
      title:'',
      


  });
  }
  save(){
    var feedback:FeedbackAPI =this.FeedbackForm.value as FeedbackAPI;
    var msg = feedback.message.slice(3, -4);
    feedback.message = msg;
    this.feedbackAPIService.create(feedback).then(
      res=>{
         var result:any=res as any;
         console.log(result.status);
         if(result.status){
          this.messageService.add({severity:'success',summary:'Success',detail:'Thành công'}); 
              this.router.navigate(['/feedback']);
         }
      },
      err=>{
          this.messageService.add({severity:'error',summary:'Failed',detail:'Thất bại'}); 
      }

  );
  }
}