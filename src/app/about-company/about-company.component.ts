import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { percentageValidator } from '../validators';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../api.client';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { UtilsServiceService } from '../utils/utils-service.service';
@Component({
  selector: 'app-about-company',
  templateUrl: './about-company.component.html',
  styleUrls: ['./about-company.component.scss']
})
export class AboutCompanyComponent implements OnInit {
  addEmployee: FormGroup;
  submitted: boolean = false;
  spinLoader = false;
  selectedEmpType: any;
  selectedDepartment: any;
  selectedDesignation: any;
  selectedEmpGrade: any;
  Member_details: any;
  errors: string[] = [];
  @Input() response: any;
  companyCode: string = '';
  UploadTypes: any;
  type: string;
  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private util: UtilsServiceService, private api: ApiService,
    private userService: UsersService, protected service: AuthService,
    public toast: ToastrService) { }

  ngOnInit(): void {
    this.addEmployee = this.formBuilder.group({
      emp_prefix: [''],
      emp_start_no: [''],
      no_of_digits: [''],
      company_name: [''],
      mobile: ['', [Validators.required, Validators.pattern("[0-9 ]{10}")]],
      letter_head_url: [''],
      stamp_url: [''],
      signature_url: [''],
      offer_url: [''],
      payslip_url: [''],
      hike_url: [''],
      service_url: [''],
      experience_url: [''],
      basic_percent: ['', [Validators.required, percentageValidator()]],
      house_rent_percent: ['', [Validators.required, percentageValidator()]],
      conveyance_percent: ['', [Validators.required, percentageValidator()]],
      bonus_percent: ['', [Validators.required, percentageValidator()]],
      mediacal_percent: ['', [Validators.required, percentageValidator()]],
      other_allowance_percent: ['', [Validators.required, percentageValidator()]],
      pf_deduction_percent: ['', [Validators.required, percentageValidator()]],
      proficinal_tax_percent: ['', [Validators.required, percentageValidator()]],
      income_tax_percent: ['', [Validators.required, percentageValidator()]],
      food_coupon_percent: ['', [Validators.required, percentageValidator()]],
      other_deductions_percent: ['', [Validators.required, percentageValidator()]],
      
    })
  }
  get f() {
    return this.addEmployee.controls
  }
  sendFileToserver(event, type: string) {
    console.log(event?.target?.files[0]);
    const formData = new FormData();
    formData.append('file', event.target?.files[0]);
    console.log(formData);
    const company_Code = this.util.decrypt_Text(localStorage.getItem('company_code'));
    // const urlTypes={
    //   emp_code_prefix
    // }
    const uploadTypes = {
      'offer': 'OFFER',
      'payslip1': 'PAYSLIP',
      'hike': 'HIKE',
      'service': 'SERVICE',
      'experience': 'EXPERIENCE',
      'latter_head': 'LATTERHEAD',
      'stamp_url': 'STAMP',
      'signature1': 'SIGNATURE',
      'logo': 'LOGO',
      'emp_data': 'EMPDATA',
      'emp_aadhar': 'EMP_AADHAR',
      'emp_pan': 'EMP_PAN',
      'emp_profile': 'EMP_PROFILE',
      'emp_bank': 'EMP_BANK',
 
    };
    const fileType = uploadTypes[type];
    const url = `company/${company_Code}/${fileType}`;
   
  this.api.upload_docs(url, formData).subscribe((res: any) => {
    if (res.statusCode === 201) {
      // Patch the values in the form group
      this.addEmployee.patchValue({
        [type]: res, // Assuming `res` contains the updated value
      
      });
       
      // Alert or notify the user about successful file upload
      alert('File uploaded successfully');
    }
  });
  }
}
