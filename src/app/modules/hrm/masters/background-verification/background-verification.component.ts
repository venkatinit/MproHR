import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.client';

@Component({
  selector: 'app-background-verification',
  templateUrl: './background-verification.component.html',
  styleUrls: ['./background-verification.component.scss']
})
export class BackgroundVerificationComponent {
  addEmployee:FormGroup;
  submitted: boolean = false;
  spinLoader = false;
  selectedEmpType: any;
  selectedDepartment: any;
  selectedDesignation:any;
  selectedEmpGrade:any;
  Member_details: any;
  minDate: Date = new Date();
  constructor(private formBuilder:FormBuilder,private api: ApiService,){}
  isDisplayed = true;

  showMe()
  {
      if(this.isDisplayed)
      {
          this.isDisplayed = false;
      }else{
          this.isDisplayed = true;
      }
  }
  getEmployeedetails() {
    this.api.get('').subscribe((response: any) => {
      this.Member_details = response.data;
      this.addEmployee.controls['date_of_join'].setValue(this.Member_details['doj']);
      this.addEmployee.controls['application_no'].setValue(this.Member_details['']);
      this.addEmployee.controls['member_name'].setValue(this.Member_details['member_Name']);
      this.addEmployee.controls['mobile_no'].setValue(this.Member_details['mobileNo']);                 
      this.addEmployee.controls['email'].setValue(this.Member_details['email_ID']);
      this.addEmployee.controls['age'].setValue(this.Member_details['age']);
      this.addEmployee.controls['gender'].setValue(this.Member_details['gender']);
      this.addEmployee.controls['occupation'].setValue(this.Member_details['occoupation']);
      this.addEmployee.controls['blood_group'].setValue(this.Member_details['']);
 }, (error) => {
      console.log(error);

    })
  }
ngOnInit(): void {
  this.addEmployee=this.formBuilder.group({
    emp_id:['',[Validators.required]],
    emp_name:['',[Validators.required]],
    full_name:['',[Validators.required]],
    email:['',[Validators.required]],
    mbl_no:['',[Validators.required],Validators.pattern("[0-9 ]{10}")],
    date_of_join:['',[Validators.required]],
    joining_ctc:['',[Validators.required]],
    joining_designation:['',[Validators.required]],
    technology:['',[Validators.required]],
    reliving_date:['',[Validators.required]],
    reliving_ctc:['',[Validators.required]],
    reliving_designation:['',[Validators.required]],
    reason_for_leaving:['',[Validators.required]],   
  })
}
get f(){
  return this.addEmployee.controls
}
saveaddEmpolyee(){
  this.submitted=true;
  if(!this.addEmployee.valid){
    return;
  }
  this.spinLoader=true;
}
}
