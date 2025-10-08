import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent {
  addExperience: FormGroup;
  errors: string[] = [];
  messages: string[] = [];
  submitted: boolean = false;
  spinLoader = false;
  message: string | undefined;
  isSelected:any;
  isDisplayed = true;

  constructor(private formBuilder: FormBuilder) { }
  ngOnInit(): void {
    this.addExperience= this.formBuilder.group({
      emp_code: ['', [Validators.required]],
      resignation_date: ['', [Validators.required]],
      last_working_day: ['', [Validators.required]],   
    });
 
  }
  get f() {
    return this.addExperience.controls;
  }
experience=[
  {'id':'NG001','reg_date':'23-12-2023','emp_name':'Venkat','last_working_day':'02-02-2024'},
  {'id':'NG002','reg_date':'23-12-2023','emp_name':' Siva','last_working_day':'02-02-2024'},
]
  saveaddExperience() {
    this.submitted = true;

    if (!this.addExperience.valid) {
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
