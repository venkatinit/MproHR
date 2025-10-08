import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-experience-letter',
  templateUrl: './experience-letter.component.html',
  styleUrls: ['./experience-letter.component.scss']
})
export class ExperienceLetterComponent {
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
      emp_name: ['', [Validators.required]],
      resignation_date: ['', [Validators.required]],
      last_working_day: ['', [Validators.required]],   
    });
 
  }
  getBranchdetails() {
    // Log experience data to verify its contents
    console.log('Experience Data:', this.experience);
  
    // Check if this.experience has valid data before setting form values
    if (this.experience) {
      setTimeout(() => {
        this.addExperience.patchValue({
          resignation_date: this.experience['reg_date'],
          emp_name: this.experience['emp_name'],
          last_working_day: this.experience['last_working_day']
        });
      });
    } else {
      console.error('Experience data is invalid or empty.');
    }
  }
  

  get f() {
    return this.addExperience.controls;
  }
experience=
  {'id':'NG0001','reg_date':'23-12-2023','emp_name':'Venkat','last_working_day':'02-02-2024'}

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
