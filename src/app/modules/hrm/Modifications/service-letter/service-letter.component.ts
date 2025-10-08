import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-service-letter',
  templateUrl: './service-letter.component.html',
  styleUrls: ['./service-letter.component.scss']
})
export class ServiceLetterComponent {
  addService: FormGroup;
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
    this.addService= this.formBuilder.group({
      emp_code: ['', [Validators.required]],
      service_date: ['', [Validators.required]],
      service_period: ['', [Validators.required]],
      designation: ['', [Validators.required]], 
    });
 
  }
  get f() {
    return this.addService.controls;
  }
  service=
  {'id':'NG0001','service_date':'23-12-2023','emp_name':'Venkat','ctc':'02-02-2024','designation':'Angular Developer',"effect_date":'28-12-2023'}
 
  saveaddService() {
    this.submitted = true;

    if (!this.addService.valid) {
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
