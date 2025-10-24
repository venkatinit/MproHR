import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';
import { ApiService } from 'src/app/api.client';
import { ApiResponse } from 'src/app/models/api-response';
import { DatePipe } from '@angular/common';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-ca-company-employee',
  templateUrl: './ca-company-employee.component.html',
  styleUrls: ['./ca-company-employee.component.scss']
})
export class CaCompanyEmployeeComponent implements OnInit {
  form: FormGroup;
  employee_list: any;
  submitted: boolean = false;
  errors: string[] = [];
  companyList: any[] = [];
  loading: boolean = false;
  attendance: FormGroup;
  attendance_data: any;
  addEmployee: any;
  invoice: any;

  dtOptions: DataTables.Settings = {};
  persons: any[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  minDate: Date = new Date();
  Students = {
    dob: ''
  }
  constructor(
    private toast: ToastrService,
    private formBuilder: FormBuilder,
    private util: UtilsServiceService,
    private api: ApiService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    this.form = this.formBuilder.group({
      company: [{ value: '', disabled: true }, Validators.required],
    });
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';

    this.addEmployee = this.formBuilder.group({
      company: [companyId],
      employee_Id: ['', Validators.required],
      full_name: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      gender: ['', Validators.required],
      father_Name: ['', Validators.required],
      mother_Name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mbl_no: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      employee_type: ['', Validators.required],
      present_address: ['', Validators.required],
      permanent_address: ['', Validators.required],
      department: ['', Validators.required],
      technology: ['', Validators.required],
      offer_date: ['', Validators.required],
      join_date: ['', Validators.required],
      offer_designation: ['', Validators.required],
      offer_ctc: ['', Validators.required],
      current_designation: ['', Validators.required],
      uan_no: ['', Validators.pattern('^[0-9]{12}$')],
      pf_no: [''],
      adhar_no: ['', Validators.required],
      pan_no: [
        '',
        [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]
      ],
      ref_name: ['', Validators.required],
      ref_contact_no: ['', Validators.required],
      bank_name: ['', Validators.required],
      account_no: ['', Validators.required],
      ifsc: ['', Validators.required],
    });
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50],
      destroy: true,
      processing: true
    };
    this.getCompanyList();
    this.GetAllEmployees();
  }
  checkDate() {
    const dateSendingToServer = new DatePipe('en-US').transform(this.Students.dob, 'dd/MM/yyyy')
    console.log(dateSendingToServer);
  }
  convertToUppercase(controlName: string) {
    const currentValue = this.addEmployee.get(controlName)?.value || '';
    this.addEmployee.get(controlName)?.setValue(currentValue.toUpperCase(), { emitEvent: false });
  }

  isCompanyFilterVisible: boolean = false;
  toggleCompanyFilter() {
    this.isCompanyFilterVisible = !this.isCompanyFilterVisible;

    const companyControl = this.form.get('company');

    if (this.isCompanyFilterVisible) {
      companyControl?.enable();
    } else {
      companyControl?.disable();
      companyControl?.setValue('');
    }
  }
  goToDashboard(id: number) {
    this.router.navigate(['/hrm/employee_dashboard', id]);
  }
  get f() {
    return this.addEmployee.controls;
  }
  getCompanyList() {
    this.api.get('api/company/all').subscribe((res: any) => {
      this.companyList = res?.data?.data || [];
    });
  }
  getEmloyeeType = [{
    "name": "Full-Time",
  },
  {
    "name": "Part-Time",
  },
  {
    "name": "Seasonal",
  },
  {
    "name": "Contract",
  },
  {
    "name": "Intern",
  }
  ]
  saveNewEmpolyee() {
    this.submitted = true;

    if (!this.addEmployee.valid) {
      return;
    }

    // this.spinLoader = true;

    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    const url = 'register';

    const body = {
      "id": 0,
      "company_Id": companyId,
      "employee_Code": this.addEmployee.get("employee_Id")?.value,
      "full_Name": this.addEmployee.get("full_name")?.value,
      "date_Of_Birth": this.addEmployee.get("date_of_birth")?.value,
      "gender": this.addEmployee.get("gender")?.value,
      "father_Name": this.addEmployee.get("father_Name")?.value,
      "mother_Name": this.addEmployee.get("mother_Name")?.value,
      "email": this.addEmployee.get("email")?.value,
      "mobile_No": this.addEmployee.get("mbl_no")?.value,
      "employee_Type": this.addEmployee.get("employee_type")?.value,
      "present_Address": this.addEmployee.get("present_address")?.value,
      "permanent_Address": this.addEmployee.get("permanent_address")?.value,
      "department": this.addEmployee.get("department")?.value,
      "technology": this.addEmployee.get("technology")?.value,
      "offer_Date": this.addEmployee.get("offer_date")?.value,
      "joining_Date": this.addEmployee.get("join_date")?.value,
      "offer_Designation": this.addEmployee.get("offer_designation")?.value,
      "offer_CTC": this.addEmployee.get("offer_ctc")?.value,
      "designation": this.addEmployee.get("current_designation")?.value,
      // "current_ctc": this.addEmployee.get("current_ctc")?.value,
      "uaN_Number": this.addEmployee.get("uan_no")?.value,
      "pF_Number": this.addEmployee.get("pf_no")?.value,
      "aadhar_Number": this.addEmployee.get("adhar_no")?.value,
      "paN_Number": this.addEmployee.get("pan_no")?.value,
      "referee_Name": this.addEmployee.get("ref_name")?.value,
      "referee_Contact": this.addEmployee.get("ref_contact_no")?.value,
      "bank_Name": this.addEmployee.get("bank_name")?.value,
      "account_number": this.addEmployee.get("account_no")?.value,
      "ifsC_Code": this.addEmployee.get("ifsc")?.value,
      // Add extra fields here if your form includes them
    };

    this.api.addEmployee(url, body).subscribe(
      (res: any) => {
        this.submitted = false;
        // this.spinLoader = false;
        this.toast.success("Employee added successfully", "Success");
        // $('#newModal').modal('hide');
        // this.addEmployee.reset();
        this.addEmployee.reset({
          companyId: this.util.decrypt_Text(localStorage.getItem('company_id')) || ''
        });
      },
      (error: any) => {
        // this.spinLoader = false;
        this.submitted = false;
        this.errors = [error.error?.Message || 'An error occurred'];
        this.toast.error(this.errors[0], "Validation Failed");
      }
    );
  }
  GetAllEmployees() {
     
    if (this.form.invalid) return;
    const queryParams = new URLSearchParams({
      compannyId: this.form.get('company')?.value || 4,
    }).toString();
    this.api.get(`all_employees?${queryParams}`).subscribe((res: ApiResponse<any>) => {
      this.employee_list = res;
      this.dtTrigger.next(null);
      if (($.fn.DataTable as any).isDataTable('#bankTable')) {
      }
      this.dtTrigger.next(null); // initialize new
    });
  }
}
