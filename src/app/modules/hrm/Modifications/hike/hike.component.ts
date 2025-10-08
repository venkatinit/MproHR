import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-hike',
  templateUrl: './hike.component.html',
  styleUrls: ['./hike.component.scss']
})
export class HikeComponent {
  addHike: FormGroup;
  errors: string[] = [];
  messages: string[] = [];
  submitted: boolean = false;
  spinLoader = false;
  message: string | undefined;
  isSelected:any;
  listData:any =[];
  isDisabled: boolean = false;

  isDisplayed = true;



  constructor(private formBuilder: FormBuilder) { }
 

  ngOnInit(): void {
    this.addHike= this.formBuilder.group({
      emp_code: ['', [Validators.required]],
      hike_date: ['', [Validators.required]],
      emp_name: ['', [Validators.required]],
      hike_ctc: ['', [Validators.required]],
      designation: ['', [Validators.required]],

      effect_date: ['', [Validators.required]],
    
  
    
    });
 
  }
  get f() {
    return this.addHike.controls;
  }
  hike=
  {'id':'NG0001','hike_date':'23-12-2023','emp_name':'Venkat','ctc':'02-02-2024','designation':'Angular Developer',"effect_date":'28-12-2023'}
 
saveaddHike() {
    this.submitted = true;

    if (!this.addHike.valid) {
      return;
    }
    this.spinLoader = true;
    

  

  }

  showMe()
  {
      if(this.isDisplayed)
      {
          this.isDisplayed = false;
      }else{
          this.isDisplayed = true;
      }
  }

}
