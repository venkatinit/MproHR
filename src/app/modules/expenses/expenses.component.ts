import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.client';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { ApiResponse } from 'src/app/models/api-response';
import { ToastrService } from 'ngx-toastr';
// import * as $ from 'jquery';
declare var $: any;
@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  action: 'create' | 'update' = 'create';
  addPayments: FormGroup;
  filterPayments: FormGroup;
  submitted: boolean = false;
  errors: string[] = [];
  spinLoader = false;
  paymentList: any;
  cateId: any;
  showBankField = false;
  customers: any;
  banks: any;
  serviceGroups: any[] = []; // Populate this with service data
  receipt_list: any[] = [];
  companyList: any[] = [];
  delete_payment: any
  form: FormGroup;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private util: UtilsServiceService,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private toast: ToastrService
  ) { }
  ngOnInit(): void {
    this.addPayments = this.formBuilder.group({
      dateOfPayments: ['', [Validators.required]],
      customer: ['', [Validators.required]],
      bank_id: ['0'],
      service_Id: ['', [Validators.required]],
      mode: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      description: [''],
    });
    this.filterPayments = this.formBuilder.group({
      from_date: ['2025-08-09', [Validators.required]],
      to_date: [this.getTodayDate(), Validators.required],
      bank_id: [],
      service_Id: [],
      user_id: [],
      // companyId: []
    });
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    };
    this.getPayments();
    this.loadCustomers();
    this.loadBanks();
    this.loadServiceGroups();
    this.getCompanyList();
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Extract YYYY-MM-DD
  }
  getCompanyList() {
    this.api.get('api/company/all').subscribe((res: any) => {
      this.companyList = res?.data?.data || [];
    });
  }
  get f() {
    return this.addPayments.controls;
  }
  getPayments() {
    if (this.filterPayments.invalid) {
      return;
    }
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    const fromDate = this.filterPayments.get('from_date')?.value || '';
    const toDate = this.filterPayments.get('to_date')?.value || '';
    const bankId = this.filterPayments.get('bank_id')?.value || '';
    const serviceId = this.filterPayments.get('service_id')?.value || '';
    const userId = this.filterPayments.get('user_id')?.value || '';

    const queryParams = `companyId=${companyId}&BankId=${bankId}&ServiceId=${serviceId}&UserId=${userId}&FromDate=${fromDate}&ToDate=${toDate}`;
    this.api.get(`api/accounting/Get_All_Payments?${queryParams}`).subscribe(
      (res: ApiResponse<any>) => {
        this.paymentList = res.data;
        this.dtTrigger.next(0);
        this.spinLoader = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  onModeChange(event: Event): void {
    const selectedMode = (event.target as HTMLSelectElement).value; // Explicitly cast target to HTMLSelectElement
    this.showBankField = selectedMode === 'B'; // Show only when mode is "Bank"
    if (!this.showBankField) {
      // Clear the bank_id field if "Cash" is selected
      this.addPayments.get('bank_id')?.setValue('');
    }
  }

  // Load customers from API
  loadCustomers(): void {
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    this.api.get(`api/accounting/get_all_customers?companyId=${companyId}`).subscribe((res: ApiResponse<any>) => {
      this.customers = Array.isArray(res.data) ? res.data : [res.data];
      this.dtTrigger.next(null);
      if (($.fn.DataTable as any).isDataTable('#customerTable')) {
      }
      this.dtTrigger.next(null); // initialize new
    });
  }
  loadBanks(): void {
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    this.api.get(`api/accounting/banks/all?companyId=${companyId}`).subscribe((res: ApiResponse<any>) => {
      this.banks = Array.isArray(res.data) ? res.data : [res.data];
      this.dtTrigger.next(null);
      if (($.fn.DataTable as any).isDataTable('#bankTable')) {
      }
      this.dtTrigger.next(null); // initialize new
    });
  }
  loadServiceGroups(): void {
    if (this.form.invalid) return;
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    const queryParams = new URLSearchParams({
      companyId: companyId,
    }).toString();
    this.api.get(`api/accounting/get_all_services?${queryParams}`).subscribe((res: ApiResponse<any>) => {
      this.serviceGroups = Array.isArray(res.data) ? res.data : [res.data];
      this.dtTrigger.next(null);
      if (($.fn.DataTable as any).isDataTable('#serviceTable')) {
      }
      this.dtTrigger.next(null); // initialize new
    });
  }

  savePayments() {
    console.log('✅ create form submitted');
    this.submitted = true;
    if (!this.addPayments.valid) {
      return;
    }
    this.spinLoader = true;
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    const url = 'api/accounting/create_payment';
    const body = {
      "company_Id": this.addPayments.get("company").value,
      "id": 0,
      "payment_No": "-",
      "payment_Date": this.addPayments.get("dateOfPayments").value,
      "amount": this.addPayments.get("amount").value,
      "service_Id": this.addPayments.get("service_id").value,
      "cash_Bank_Flag": this.addPayments.get("mode").value,
      "employee_Id": 2,
      "bank_Id": this.addPayments.get("bank_id").value,
      "approval_Id": 1,
      "created_By": 2,
      "meesava_Id": this.addPayments.get("description").value,
      "voucher_Description": "-",
      "status": "true"
    };
    this.api.post(url, body).subscribe(
      (res: any) => {
        this.addPayments.reset();
        this.submitted = false;
        this.errors = [];
        this.spinLoader = false;
        this.toast.success('Payment Saved successfully', 'Success');
        $('#newModal').modal('hide');
        this.getPayments();
      },
      (error: any) => {
        this.submitted = false;
        this.spinLoader = false;
        const errorMessage = error?.error?.message || 'State not added successfully';
        this.errors = [errorMessage];
      }
    );
  }
  updateById(id: number) {
    this.action = 'update';
    this.cateId = id;
    this.api.get(`Get_Payment_By_Id/${id}`).subscribe(
      (res: any) => {
        if (res && res.data && res.succeeded && res.data.status) {
          this.addPayments.controls['company'].setValue(res.data.company_Id);
          this.addPayments.controls['dateOfPayments'].setValue(res.data.payment_Date);
          this.addPayments.controls['meeseva_id'].setValue(res.data.meesava_Id);
          this.addPayments.controls['mode'].setValue(res.data.cash_Bank_Flag);
          this.addPayments.controls['bank_id'].setValue(res.data.bank_Id);
          this.addPayments.controls['service_id'].setValue(res.data.service_Id);
          this.addPayments.controls['amount'].setValue(res.data.amount);
          this.submitted = false;
          this.errors = [];
        }
        this.spinLoader = false;
      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.Message];
        // this.toast.error(this.errors[0], 'Payments Not added successfully');
        this.spinLoader = false;
      }
    );
  }
  updatePayments() {
    console.log('✅ Update form submitted');
    this.submitted = true;
    if (!this.addPayments.valid) {
      return;
    }
    this.spinLoader = true;
    const encryptedUserId = localStorage.getItem('id');
    const decryptedUserId = this.util.decrypt_Text(encryptedUserId);
    const url = "api/accounting/update_payment";
    const body = {
      "id": this.cateId,
      "company_Id": this.addPayments.get("company")?.value,
      "payment_No": "-",
      "employee_Id": 2,
      "payment_Date": this.addPayments.get("dateOfPayments")?.value,
      "amount": this.addPayments.get("amount")?.value,
      "meesava_Id": this.addPayments.get("meeseva_id")?.value,
      "service_Id": this.addPayments.get("service_id")?.value,
      "cash_Bank_Flag": this.addPayments.get("mode")?.value,
      "bank_Id": this.addPayments.get("bank_id")?.value,
      "created_by": 2,
      "approval_Id": 1,
      "voucher_Description": "-",
      "status": "True"
    };
    this.api.put(url, body).subscribe(
      (res: any) => {
        this.addPayments.reset();
        this.submitted = false;
        this.errors = [];
        this.toast.success('Payment Updated successfully', 'Success');
        this.spinLoader = false;
        $('#newModal').modal('hide');
        this.getPayments();
      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.Message];
        this.toast.error(this.errors[0], 'Payment Not Updated successfully');
        this.spinLoader = false;
      }
    );
  }
  clearField(fieldName: string): void {
    this.filterPayments.get(fieldName)?.setValue(''); // Reset the field value
  }
  approveId(id: number) {

    Swal.fire({
      position: 'center',
      title: 'Are you sure?',
      text: 'Do you want to approve or reject this record?',
      icon: 'warning',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Approve',
      denyButtonText: 'Reject',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      let status = ''; // Initialize status variable

      if (result.isConfirmed) {
        status = 'Approved';
      } else if (result.isDenied) {
        status = 'Cancelled';
      } else {
        Swal.fire('Pending', 'Action in pending status.', 'info');
        return; // Stop execution if cancelled
      }

      // Constructing API URL
      const apiUrl = `api/accounting/Approve_Reject_Voucher/${id}?status=${status}&userId=2`;

      // API Call with PATCH Method
      this.api.patch(apiUrl, {}).subscribe(
        (res: any) => {
          this.delete_payment = res;
          Swal.fire(
            `${status}!`,
            `Expense ${status} Successfully.`,
            status === 'Approved' ? 'success' : 'error'
          );
        },
        (error) => {
          Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
        }
      );
    });

  }

  deletePayments(id: number) {
    Swal.fire({
      position: 'center',
      title: 'Are you sure?',
      text: 'You want to delete this record?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.delete(`api/accounting/Delete_Payment/${id}`).subscribe({
          next: (res: any) => {
            Swal.fire('Deleted!', 'The state has been deleted.', 'success');
            this.getPayments(); // refresh list without reloading the page
          },
          error: (err: any) => {
            console.error('Delete failed:', err);
            Swal.fire('Failed!', 'Something went wrong while deleting.', 'error');
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your record is safe.', 'info');
      }
    });
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
