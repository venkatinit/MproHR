import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ApiService } from 'src/app/api.client';
// import { DatePipe } from '@angular/common';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit {
  addCustomer: FormGroup;
  submitted: boolean = false;
  spinLoader = false;
  selectedEmpType: any;
  selectedDepartment: any;
  selectedDesignation: any;
  selectedEmpGrade: any;
  customer_details: any;
  selectedDate: Date;
  message: string | undefined;
  errors: string[] = [];
  messages: string[] = [];
  action: any;
  constructor(private formBuilder: FormBuilder, private router: Router, private util: UtilsServiceService, private api: ApiService, private modalService: NgbModal, private userService: UsersService,
    public toast: ToastrService) { }
  salutations = [
    { "value": "1", "name": "Mr." },
    { "value": "2", "name": "Mrs." },
    { "value": "3", "name": "Ms." },
    { "value": "4", "name": "Miss." },
    { "value": "5", "name": "Dr." },
  ]
  ngOnInit(): void {
    this.addCustomer = this.formBuilder.group({
      customer_type: ['option1', [Validators.required]],
      salutation: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      company_name: ['', [Validators.required]],
      display_name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      work_phone: ['', [Validators.required]],
      mbl_no: ['', [Validators.required]],
      GST_treatment: ['', [Validators.required]],
      supply_place: ['', [Validators.required]],
      pan: ['', [Validators.required]],
      tax: ['option1', [Validators.required]],
      opening_balance: ['', [Validators.required]],
      payment_terms: ['', [Validators.required]],
      documents: ['', [Validators.required]],
      Website: ['', [Validators.required]],
      department: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      twitter: ['', [Validators.required]],
      skype: ['', [Validators.required]],
      facebook: ['', [Validators.required]],
      attention: ['', [Validators.required]],
      country: ['', [Validators.required]],
      address: ['', [Validators.required]],
      address_2: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      pincode: ['', [Validators.required]],
      fax: ['', [Validators.required]],
      remarks: ['', [Validators.required]],
    });
  }
  get f() {
    return this.addCustomer.controls;
  }
  activeSection: string = 'details';
  subView: string = ' ';
  showData(section: string) {
    this.activeSection = section;
  }
  setSubView(view: string) {
    this.subView = view;
  }
  onSubmit() {
    this.submitted = true;
    if (!this.addCustomer.valid) {
          this.toast.error('Please correct the errors before submitting');
      return;
    }
    this.spinLoader = true;
    const encryptedUserId = localStorage.getItem('id');
    const decryptedUserId = this.util.decrypt_Text(encryptedUserId);
    const url = "create_bank";
    const body = {
      "id": 0,
      "bank_Name": this.addCustomer.get("bank_name").value,
      "branch": this.addCustomer.get("branch_name").value,
      "address": this.addCustomer.get("bank_address").value,
      "account_Number": this.addCustomer.get("account_number").value,
      "account_Type": this.addCustomer.get("account_type").value,
      "bM_Name": this.addCustomer.get("bm_name").value,
      "bM_Contact_No": this.addCustomer.get("bm_contact_no").value,
      "branch_Contact_No": " ",
      "opening_Balance": this.addCustomer.get("opening_Balance").value,
      "status": true,
    };
    this.api.post(url, body).subscribe(
      (res: any) => {
        this.addCustomer.reset();
        this.submitted = false;
        this.errors = [];
        this.toast.success('Bank added successfully', 'Success');
        this.spinLoader = false;
      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.Message];
        this.toast.error(this.errors[0], 'Bank Not added  successfully');
        this.spinLoader = false;
      }
    );
  }
  updateBank() { }
}