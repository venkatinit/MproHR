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
declare var $: any;
@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  action: 'create' | 'update' = 'create';
  addReceipt: FormGroup;
  submitted: boolean = false;
  errors: string[] = [];
  spinLoader = false;
  receiptList: any;
  cateId: any;
  showBankField = false;
  invoices: any;
  banks: any;
  services: any;
  receipt_list: any[] = [];
  companyList: any[] = [];

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private util: UtilsServiceService,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private toast:ToastrService
  ) {
    this.addReceipt = this.formBuilder.group({
      dateOfReceipt: ['', [Validators.required]],
      company: ['', [Validators.required]],
      rec_num: ['', [Validators.required]],
      invoice_id: ['', [Validators.required]],
      bank_id: ['0',],
      service_id: ['', [Validators.required]],
      mode: ['', [Validators.required]],
      amount: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50],
      destroy: true,
      processing: true
    };
    this.getReceipt();
    this.getCompanyList();
  }
  getCompanyList() {
    this.api.get('api/company/all').subscribe((res: any) => {
      this.companyList = res?.data?.data || [];
    });
  }
  get f() {
    return this.addReceipt.controls;
  }
  getReceipt() {
    var endpoint = `get_all_receipts`;
    // var endpoint = `api/accounting/get_all_receipts?BankId=${}&FromDate=${}&ToDate=${}&ServiceId=${}&UserId=${}`;
    this.api.get(endpoint).subscribe(
      (res: ApiResponse<any>) => {
        this.receiptList = res.data;
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
      this.addReceipt.get('bank_id')?.setValue('');
    }
  }

  // Load customers from API
  loadCustomers(): void {
    this.api.get('invoice/get_all?status=ALL').subscribe(
      (res: any) => {
        this.invoices = res.data;
      },
      (error) => {
        this.toast.error('Failed to load customers', 'Error');
      }
    );
  }
  loadBanks(): void {
    this.api.get('banks/all').subscribe(
      (res: any) => {
        this.banks = res.data;
      },
      (error) => {
        this.toast.error('Failed to load banks', 'Error');
      }
    );
  }
  loadService(): void {
    this.api.get('get_all_services').subscribe(
      (res: any) => {
        this.services = res.data;
      },
      (error) => {
        this.toast.error('Failed to load services', 'Error');
      }
    );
  }

  saveReceipt() {
    console.log('✅ create form submitted');
    this.submitted = true;
    if (!this.addReceipt.valid) {
      return;
    }
    this.spinLoader = true;
    const decryptedUserId = this.util.decrypt_Text(localStorage.getItem('id') || '');
    const url = 'api/accounting/create_receipt';
    const body = {
      "id": 0,
      "company_Id": this.addReceipt.get('company')?.value,
      "receipt_No": this.addReceipt.get('rec_num')?.value,
      "receipt_Date": this.addReceipt.get('dateOfReceipt')?.value,
      "amount": this.addReceipt.get('amount')?.value,
      "invoice_Id": this.addReceipt.get('invoice_id')?.value,
      "service_Id": this.addReceipt.get('service_id')?.value,
      "cash_Bank_Flag": this.addReceipt.get('mode')?.value,
      "bank_Id": this.addReceipt.get('bank_id')?.value,
      "created_by": 0
    };
    this.api.post(url, body).subscribe(
      (res: any) => {
        this.addReceipt.reset();
        this.submitted = false;
        this.errors = [];
        this.spinLoader = false;
        this.toast.error(this.errors[0], 'Receipt added successfully');
        this.getReceipt();
        $('#newModal').modal('hide');
      },
      (error: any) => {
        this.submitted = false;
        this.spinLoader = false;
        const errorMessage = error?.error?.message || 'Receipt not added successfully';
        this.errors = [errorMessage];
      }
    );
  }
  updateById(id: number) {
    this.action = 'update';
    this.cateId = id;
    this.api.get(`api/accounting/${id}`).subscribe(
      (res: any) => {
        if (res && res.data && res.succeeded) {
          const receipt = res.data;

          this.addReceipt.patchValue({
            dateOfReceipt: receipt.receipt_Date.split('T')[0], // Format date correctly
            invoice_id: receipt.invoice_Id,
            mode: receipt.bank_Id ? 'B' : 'C', // Determine mode based on bank_Id
            bank_id: receipt.bank_Id || '',
            service_id: receipt.service_Id,
            amount: receipt.amount
          });

          this.showBankField = receipt.bank_Id ? true : false; // Show bank field if needed
          this.submitted = false;
          this.errors = [];
        }
        this.spinLoader = false;
      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error?.Message || "Something went wrong"];
        this.toast.error(this.errors[0], 'Receipt Not loaded successfully');
        this.spinLoader = false;
      }
    );
  }
  updateReceipt() {
    console.log('✅ Update form submitted');
    this.submitted = true;
    if (!this.addReceipt.valid) {
      return;
    }
    this.spinLoader = true;
    const encryptedUserId = localStorage.getItem('id');
    const decryptedUserId = this.util.decrypt_Text(encryptedUserId);
    const url = "api/accounting/update_recipt";
    const body = {
      "id": this.cateId,
      "receipt_No": "-",  // Adjust this if needed
      "receipt_Date": this.addReceipt.get("dateOfReceipt")?.value,
      "amount": this.addReceipt.get("amount")?.value,
      "invoice_Id": this.addReceipt.get("invoice_id")?.value,
      "service_Id": this.addReceipt.get("service_id")?.value,
      "cash_Bank_Flag": this.addReceipt.get("mode")?.value,
      "bank_Id": this.addReceipt.get("mode")?.value === 'B' ? this.addReceipt.get("bank_id")?.value : null, // Send bank_Id only if Bank is selected
      "created_by": decryptedUserId
    };
    this.api.put(url, body).subscribe(
      (res: any) => {
        this.addReceipt.reset();
        this.submitted = false;
        this.errors = [];
        this.toast.success('Receipt Updated successfully', 'Success');
        this.spinLoader = false;
        $('#newModal').modal('hide');
        this.getReceipt();
      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.Message];
        this.toast.error(this.errors[0], 'Receipt Not Updated successfully');
        this.spinLoader = false;
      }
    );
  }
  deleteReceipt(id: number) {
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
        this.api.delete(`api/accounting/${id}`).subscribe({
          next: (res: any) => {
            Swal.fire('Deleted!', 'The Receipt has been deleted.', 'success');
            this.getReceipt(); // refresh list without reloading the page
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
