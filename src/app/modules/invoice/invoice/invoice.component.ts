// import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { Subject } from 'rxjs';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { ApiService } from 'src/app/api.client';
// import { UtilsServiceService } from 'src/app/utils/utils-service.service';
// import { DataTableDirective } from 'angular-datatables';
// import Swal from 'sweetalert2';
// import { ApiResponse } from 'src/app/models/api-response';
// import { ToastrService } from 'ngx-toastr';
// // import * as $ from 'jquery';
// declare var $: any;
// @Component({
//   selector: 'app-invoice',
//   templateUrl: './invoice.component.html',
//   styleUrls: ['./invoice.component.scss']
// })
// export class InvoiceComponent implements OnInit, OnDestroy {
//   @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
//   dtTrigger: Subject<any> = new Subject<any>();
//   dtOptions: DataTables.Settings = {};
//   action: 'create' | 'update' = 'create';
//   addBank: FormGroup;
//   form!: FormGroup;
//   submitted: boolean = false;
//   errors: string[] = [];
//   spinLoader = false;
//   invoice_list: any[] = [];
//   cateId: any;
//   companyList: any[] = [];
//   companyFilter: string = '';
//   originalBankList: any[] = [];
//   filteredBankList: any[] = [];
//   companyId: number = 4;
//   constructor(
//     private modalService: NgbModal,
//     private router: Router,
//     private util: UtilsServiceService,
//     private formBuilder: FormBuilder,
//     private api: ApiService,
//     private toast:ToastrService
//   ) {
//     this.addBank = this.formBuilder.group({
//       company: ['', [Validators.required]],
//       bank_name: ['', [Validators.required]],
//       branch_name: ['', [Validators.required]],
//       bank_address: ['', [Validators.required]],
//       account_number: ['', [Validators.required]],
//       account_type: ['', [Validators.required]],
//       bm_name: ['', [Validators.required]],
//       bm_contact_no: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
//       txn_Start_Date: ['', [Validators.required]],
//       opening_Balance: ['', [Validators.required]],
//     });
//   }
//   ngOnInit(): void {
//     this.form = this.formBuilder.group({
//       company: [{ value: '', disabled: true }, Validators.required],
//       // other controls...
//     });
//     this.dtOptions = {
//       pagingType: 'full_numbers',
//       pageLength: 10,
//       lengthMenu: [5, 10, 25, 50],
//       destroy: true,
//       processing: true
//     };
//     this.getBanks();
//     this.getCompanyList();

//   }
//   isCompanyFilterVisible: boolean = false;

//   toggleCompanyFilter() {
//     this.isCompanyFilterVisible = !this.isCompanyFilterVisible;

//     const companyControl = this.form.get('company');

//     if (this.isCompanyFilterVisible) {
//       companyControl?.enable();
//     } else {
//       companyControl?.disable();
//       companyControl?.setValue('');
//     }
//   }
//   get f() {
//     return this.addBank.controls;
//   }
//   getCompanyList() {
//     this.api.get('api/company/all').subscribe((res: any) => {
//       this.companyList = res?.data?.data || [];
//     });
//   }
//   filterBanks() {
//     const search = this.companyFilter.trim().toLowerCase();
//     this.filteredBankList = this.originalBankList.filter(bank =>
//       bank.companyName?.toLowerCase().includes(search)
//     );
//   }
//   getBanks() {
//     const statusQuery = this.companyId; // Get the current selected status
//     this.api.get(`api/accounting/invoice/get_all?companyId=${statusQuery}&status=ALL`).subscribe((res: ApiResponse<any>) => {
//       this.invoice_list = Array.isArray(res.data) ? res.data : [res.data];
//       this.dtTrigger.next(null);
//       if (($.fn.DataTable as any).isDataTable('#bankTable')) {
//       }
//       this.dtTrigger.next(null); // initialize new
//     });
//   }
//   saveBank() {
//     console.log('✅ create form submitted');
//     this.submitted = true;
//     if (!this.addBank.valid) {
//       return;
//     }
//     this.spinLoader = true;
//     const decryptedUserId = this.util.decrypt_Text(localStorage.getItem('id') || '');
//     const url = 'api/accounting/create_bank';
//     const body = {
//       id: 0,
//       company_Id: this.addBank.get('company')?.value,
//       bank_Name: this.addBank.get('bank_name')?.value,
//       branch: this.addBank.get('branch_name')?.value,
//       address: this.addBank.get('bank_address')?.value,
//       account_Number: this.addBank.get('account_number')?.value,
//       account_Type: this.addBank.get('account_type')?.value,
//       bM_Name: this.addBank.get('bm_name')?.value,
//       bM_Contact_No: this.addBank.get('bm_contact_no')?.value,
//       branch_Contact_No: '',
//       opening_Balance: this.addBank.get('opening_Balance')?.value,
//       txn_Start_Date: new Date(),
//       created_At: new Date(),
//       status: true,
//     };
//     this.api.post(url, body).subscribe(
//       (res: any) => {
//         this.addBank.reset();
//         this.submitted = false;
//         this.errors = [];
//         this.spinLoader = false;
//         this.toast.success('Invoice Saved successfully', 'Success');
//         $('#newModal').modal('hide');
//         this.getBanks();
//       },
//       (error: any) => {
//         this.submitted = false;
//         this.spinLoader = false;
//         const errorMessage = error?.error?.message || 'Bank not added successfully';
//         this.errors = [errorMessage];
//       }
//     );
//   }
//   updateById(id: number) {
//     this.action = 'update';
//     this.cateId = id;
//     this.api.get(`api/accounting/bank/${id}`).subscribe(
//       (res: any) => {
//         if (res && res.data && res.succeeded && res.data.status) {
//           this.addBank.controls['company'].setValue(res.data.company_Id);
//           this.addBank.controls['bank_name'].setValue(res.data.bank_Name);
//           this.addBank.controls['branch_name'].setValue(res.data.branch);
//           this.addBank.controls['bank_address'].setValue(res.data.address);
//           this.addBank.controls['account_number'].setValue(res.data.account_Number);
//           this.addBank.controls['account_type'].setValue(res.data.account_Type);
//           this.addBank.controls['bm_name'].setValue(res.data.bM_Name);
//           this.addBank.controls['bm_contact_no'].setValue(res.data.bM_Contact_No);
//           // this.addBank.controls['branch_contact_number'].setValue(res.data.branch_Contact_No);
//           this.addBank.controls['opening_Balance'].setValue(res.data.opening_Balance);
//           this.submitted = false;
//           this.errors = [];
//         }
//         this.spinLoader = false;
//       },
//       (error: any) => {
//         console.log(error);
//         this.submitted = false;
//         this.errors = [error.error.Message];
//         // this.toast.error(this.errors[0], 'Bank Not added successfully');
//         this.spinLoader = false;
//       }
//     );
//   }
//   updateInvoice() {
//     console.log('✅ Update form submitted');
//     this.submitted = true;
//     if (!this.addBank.valid) {
//       return;
//     }
//     this.spinLoader = true;
//     const encryptedUserId = localStorage.getItem('id');
//     const decryptedUserId = this.util.decrypt_Text(encryptedUserId);
//     const url = "api/accounting/update_bank";
//     const body = {
//       "id": this.cateId,
//       "company_Id": this.addBank.get("company").value,
//       "bank_Name": this.addBank.get("bank_name").value,
//       "branch": this.addBank.get("branch_name").value,
//       "address": this.addBank.get("bank_address").value,
//       "account_Number": this.addBank.get("account_number").value,
//       "account_Type": this.addBank.get("account_type").value,
//       "bM_Name": this.addBank.get("bm_name").value,
//       "bM_Contact_No": this.addBank.get("bm_contact_no").value,
//       "branch_Contact_No": " ",
//       "opening_Balance": this.addBank.get("opening_Balance").value,
//       "txn_Start_Date": new Date(),
//       "created_At": new Date(),
//       "status": true
//     };
//     this.api.put(url, body).subscribe(
//       (res: any) => {
//         this.addBank.reset();
//         this.submitted = false;
//         this.errors = [];
//         this.toast.success('Bank Updated successfully', 'Success');
//         this.spinLoader = false;
//         this.getBanks();
//       },
//       (error: any) => {
//         console.log(error);
//         this.submitted = false;
//         this.errors = [error.error.Message];
//         this.toast.error(this.errors[0], 'Bank Not Updated successfully');
//         this.spinLoader = false;
//       }
//     );
//   }
//   deleteInvoice(id: number) {
//     Swal.fire({
//       position: 'center',
//       title: 'Are you sure?',
//       text: 'You want to delete this record?',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, delete it',
//       cancelButtonText: 'No, cancel'
//     }).then((result) => {
//       if (result.isConfirmed) {
//         this.api.delete(`api/accounting/bank/delete/${id}`).subscribe({
//           next: (res: any) => {
//             Swal.fire('Deleted!', 'The bank has been deleted.', 'success');
//             this.getBanks(); // refresh list without reloading the page
//           },
//           error: (err: any) => {
//             console.error('Delete failed:', err);
//             Swal.fire('Failed!', 'Something went wrong while deleting.', 'error');
//           }
//         });
//       } else if (result.dismiss === Swal.DismissReason.cancel) {
//         Swal.fire('Cancelled', 'Your record is safe.', 'info');
//       }
//     });
//   }
//   ngOnDestroy(): void {
//     this.dtTrigger.unsubscribe();
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiResponse } from 'src/app/models/api-response';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ActivatedRoute, Router } from '@angular/router';
// import { UtilsService } from 'src/app/utils/utilities-service';
import { ApiService } from 'src/app/api.client';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  invoices: any[] = [];
  errors: string[] = [];
  messages: string[] = [];
  submitted = false;
  spinLoader = false;
  delete_invoice: any;
  action = 'create';
  cateId: any;
  created_date: any;
  invoiceForm: FormGroup;
  form:FormGroup;
  customers: any[] = []; // Populate this with customer data
  serviceGroups: any[] = []; // Populate this with service data
  Invoice: any;
  companyList:any[]=[];
  showGSTFields: any;
  selectedInvoiceType: string = '';
  isNormalInvoice: boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private toast: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,
    // private util: UtilsService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      company: [{ value: '', disabled: true }, Validators.required],
      // other controls...
    });
    this.invoiceForm = this.fb.group({
      invoice_No: [''],
      invoice_Date: [new Date().toISOString().substring(0, 10), Validators.required],
      customer_Id: ['', Validators.required],
      invoice_type: ['', Validators.required],
      total_Amount: ['', Validators.required],
      service_total_Amount: [{ value: 0, disabled: true }, Validators.required],
      gst_percent: [0, Validators.required],
      sgst_total: [{ value: 0, disabled: true }, Validators.required],
      cgst_total: [{ value: 0, disabled: true }, Validators.required],
      total_tax: [{ value: 0, disabled: true }, Validators.required],
      net_amount: [{ value: 0, disabled: true }, Validators.required],
      created_By: [1],
      invoiceDetails: this.fb.array([this.createInvoiceDetail()])
    });

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      // scrollX: true,
    };
    this.getCompanyList();
    this.getInvoice();
    this.loadCustomers();
    this.loadServiceGroups();
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

  getCompanyList() {
    this.api.get('api/company/all').subscribe((res: any) => {
      this.companyList = res?.data?.data || [];
    });
  }
  // Accessors
  get f() {
    return this.invoiceForm.controls;
  }

  get invoiceDetails(): FormArray {
    return this.invoiceForm.get('invoiceDetails') as FormArray;
  }
  getInvoice() {
    if (this.form.invalid) return;
    const queryParams = new URLSearchParams({
      companyId: this.form.get('company')?.value || '2',
    }).toString();
    this.api.get(`api/accounting/invoice/get_all?${queryParams}&status=ALL`).subscribe((res: ApiResponse<any>) => {
      this.invoices = res.data;
      this.dtTrigger.next(0);
    }, (error) => {
      console.log(error);
    })
  }

  loadCustomers(): void {
    this.api.get('api/accounting/get_all_customers?companyId=2').subscribe(
      (res: any) => this.customers = res.data,
      () => this.toast.error('Failed to load customers', 'Error')
    );
  }

  loadServiceGroups(): void {
    this.api.get('api/accounting/get_all_services').subscribe(
      (res: any) => {
        if (res.succeeded) {
          this.serviceGroups = res.data;
        } else {
          this.toast.error('Failed to load service groups', 'Error');
        }
      },
      () => this.toast.error('Failed to load service groups', 'Error')
    );
  }

  createInvoiceDetail(): FormGroup {
    return this.fb.group({
      service_Id: [null, Validators.required],
      qty: [0, Validators.required],
      amount: [0, Validators.required],
      service_total_Amount: [0, Validators.required],
      service_gst_percent: [0, Validators.required],
      service_sgst_total: [{ value: 0, disabled: true }, Validators.required],
      service_cgst_total: [{ value: 0, disabled: true }, Validators.required],
      service_total_tax: [{ value: 0, disabled: true }, Validators.required],
      service_net_amount: [{ value: 0, disabled: true }, Validators.required]
    });
  }

  addInvoiceDetail(): void {
    this.invoiceDetails.push(this.createInvoiceDetail());
  }

  removeInvoiceDetail(index: number): void {
    if (this.invoiceDetails.length > 1) {
      this.invoiceDetails.removeAt(index);
      this.recalculateInvoice();
    }
  }

  calculateDetailTax(index: number): void {
    const item = this.invoiceDetails.at(index);
    const qty = +item.get('qty')?.value || 0;
    const amount = +item.get('amount')?.value || 0;
    const gstPercent = +item.get('service_gst_percent')?.value || 0;

    const totalAmount = qty * amount;
    const gstAmount = (totalAmount * gstPercent) / 100;
    const sgst = gstAmount / 2;
    const cgst = gstAmount / 2;
    const netAmount = totalAmount + gstAmount;

    item.patchValue({
      service_total_Amount: totalAmount,
      service_sgst_total: sgst,
      service_cgst_total: cgst,
      service_total_tax: gstAmount,
      service_net_amount: netAmount
    });

    this.recalculateInvoice();
  }

  recalculateInvoice(): void {
    let total = 0;
    let total_amount = 0;
    let totalTax = 0;

    this.invoiceDetails.controls.forEach(detail => {
      total_amount += parseFloat(detail.get('service_total_Amount')?.value) || 0;
      total += parseFloat(detail.get('service_total_Amount')?.value) || 0;
      totalTax += parseFloat(detail.get('service_total_tax')?.value) || 0;
    });

    const net = total + totalTax;

    this.invoiceForm.patchValue({
      total_Amount: total_amount,
      service_total_Amount: total,
      total_tax: totalTax,
      net_amount: net
    });

    if (!this.isNormalInvoice) {
      this.onGstPercentChange();
    }
  }

  onGstPercentChange(): void {
    const gstPercent = +this.f['gst_percent'].value || 0;
    const totalAmount = +this.f['service_total_Amount'].value || 0;

    const sgst = (gstPercent / 2 / 100) * totalAmount;
    const cgst = (gstPercent / 2 / 100) * totalAmount;
    const totalTax = sgst + cgst;
    const netAmount = totalAmount + totalTax;

    this.invoiceForm.patchValue({
      sgst_total: sgst,
      cgst_total: cgst,
      total_tax: totalTax,
      net_amount: netAmount
    });
  }

  onInvoiceTypeChange(): void {
    const invoiceType = this.f['invoice_type'].value;
    this.isNormalInvoice = invoiceType === 'Normal_Invoice';

    if (this.isNormalInvoice) {
      // Disable main form GST fields
      this.f['gst_percent'].disable();
      this.f['sgst_total'].disable();
      this.f['cgst_total'].disable();
      this.f['total_tax'].disable();
      this.f['net_amount'].disable();

      // Disable each detail GST fields
      this.invoiceDetails.controls.forEach(detail => {
        detail.get('service_gst_percent')?.disable();
        detail.get('service_sgst_total')?.disable();
        detail.get('service_cgst_total')?.disable();
        detail.get('service_total_tax')?.disable();
        detail.get('service_net_amount')?.disable();

        // Also set GST values to 0
        detail.patchValue({
          service_gst_percent: 0,
          service_sgst_total: 0,
          service_cgst_total: 0,
          service_total_tax: 0,
          service_net_amount: detail.get('service_total_Amount')?.value || 0
        });
      });

      // Reset GST values in main form
      this.invoiceForm.patchValue({
        gst_percent: 0,
        sgst_total: 0,
        cgst_total: 0,
        total_tax: 0
      });

    } else {
      // Enable GST fields
      this.f['gst_percent'].enable();
      this.f['sgst_total'].enable();
      this.f['cgst_total'].enable();
      this.f['total_tax'].enable();
      this.f['net_amount'].enable();

      this.invoiceDetails.controls.forEach(detail => {
        detail.get('service_gst_percent')?.enable();
        detail.get('service_sgst_total')?.enable();
        detail.get('service_cgst_total')?.enable();
        detail.get('service_total_tax')?.enable();
        detail.get('service_net_amount')?.enable();
      });
    }

    this.recalculateInvoice();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.invoiceForm.invalid) {
      this.toast.error('Please fill all required fields', 'Error');
      return;
    }

    const invoiceDetailsPayload = this.invoiceDetails.controls.map((detail) => ({
      id: 0,
      service_Id: detail.get('service_Id')?.value,
      qty: detail.get('qty')?.value,
      amount: detail.get('amount')?.value,
      total_Amount: detail.get('service_total_Amount')?.value,
      gst_Percent: detail.get('service_gst_percent')?.value,
      sgst: detail.get('service_sgst_total')?.value,
      cgst: detail.get('service_cgst_total')?.value,
      total_Tax: detail.get('service_total_tax')?.value,
      net_Amount: detail.get('service_net_amount')?.value
    }));

    const body = {
      id: 0,
      invoice_No: '',
      invoice_Type: this.invoiceForm.get("invoice_type")?.value,
      invoice_Date: this.invoiceForm.get("invoice_Date")?.value,
      customer_Id: this.invoiceForm.get("customer_Id")?.value,
      total_Amount: this.invoiceForm.get("service_total_Amount")?.value,
      gst_Percent: this.invoiceForm.get("gst_percent")?.value,
      sgst: this.invoiceForm.get("sgst_total")?.value,
      cgst: this.invoiceForm.get("cgst_total")?.value,
      total_Tax: this.invoiceForm.get("total_tax")?.value,
      net_Amount: this.invoiceForm.get("net_amount")?.value,
      created_By: 0, // Or the actual logged-in user ID
      invoiceDetails: invoiceDetailsPayload
    };
    this.api.post('api/accounting/create_invoice', body).subscribe(
      (res: any) => {
        this.toast.success('Invoice created successfully', 'Success');
        this.invoiceForm.reset();
        this.invoiceDetails.clear();
        window.location.reload();
        this.invoiceDetails.push(this.createInvoiceDetail());
      },
      (error) => {
        this.toast.error('Failed to create invoice', 'Error');
      }
    );
  }

  closeModal(): void {
    this.invoiceForm.reset();
    this.invoiceDetails.clear();
    this.invoiceDetails.push(this.createInvoiceDetail());
    this.submitted = false;
  }



  UpdateById(id: number) {
    this.action = 'update';
    this.cateId = id;
    this.spinLoader = true; // Show loader while fetching data

    this.api.get(`api/accounting/get_invoice/${id}`).subscribe(
      (res: any) => {
        if (res && res.data && res.succeeded) {
          const invoiceData = res.data;

          this.invoiceForm.patchValue({
            invoice_Date: invoiceData.invoice_Date,
            customer_Id: invoiceData.customer_Id,
            total_Amount: invoiceData.total_Amount,
            invoice_type: invoiceData.invoice_Type,
            gst_percent: invoiceData.gst_Percent,
            sgst_total: invoiceData.sgst,
            cgst_total: invoiceData.cgst,
            total_tax: invoiceData.total_Tax,
            net_amount: invoiceData.net_Amount,
          });
          // Loop through invoiceDetails and push new form groups
          invoiceData.invoiceDetails.forEach((detail: any) => {
            this.invoiceDetails.push(
              this.fb.group({
                service_Id: [detail.service_Id],
                qty: [detail.qty],
                amount: [detail.amount],
                total_Amount: [detail.total_Amount],
                service_gst_percent: [detail.gst_Percent],
                service_sgst_total: [detail.sgst],
                service_cgst_total: [detail.cgst],
                service_total_tax: [detail.total_Tax],
                service_net_amount: [detail.net_Amount],
              })
            );
          });

          this.submitted = false;
          this.errors = [];
        }
        this.spinLoader = false; // Hide loader
      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.Message];
        this.toast.error(this.errors[0], 'Failed to fetch invoice details');
        this.spinLoader = false; // Hide loader on error
      }
    );
  }
  deleteInvoice(id: number) {
    Swal.fire({
      position: 'center',
      title: 'Are you sure?',
      text: 'You want to delete this Record.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think'
    }).then((result) => {
      if (result.value) {
        this.api.delete(`api/accounting/delete_invoice/${id}`).subscribe(
          (res: any) => {
            this.delete_invoice = res;
            window.location.reload();
            Swal.fire(
              'Removed!',
              'Item removed successfully.',
              'success'
            )
          })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Item is safe',
          'error'
        )
      }
    })
  }
  updateInvoice() {
    this.submitted = true;

    if (this.invoiceForm.invalid) return;

    this.spinLoader = true;
    const encryptedUserId = localStorage.getItem('id');
    // const decryptedUserId = this.util.decrypt_Text(encryptedUserId);
    const url = "api/accounting/update_invoice";

    const invoiceDetailsPayload = this.invoiceDetails.controls.map((detail: any) => ({
      id: detail.get('id')?.value || 0,
      service_Id: detail.get('service_Id')?.value,
      qty: detail.get('qty')?.value,
      amount: detail.get('amount')?.value,
      total_Amount: detail.get('service_total_Amount')?.value,
      gst_Percent: detail.get('service_gst_percent')?.value,
      sgst: detail.get('service_sgst_total')?.value,
      cgst: detail.get('service_cgst_total')?.value,
      total_Tax: detail.get('service_total_tax')?.value,
      net_Amount: detail.get('service_net_amount')?.value
    }));

    const body = {
      id: this.cateId,
      invoice_No: this.invoiceForm.get("invoice_No")?.value || "INV-00000",
      invoice_Type: this.invoiceForm.get("invoice_type")?.value,
      invoice_Date: this.invoiceForm.get("invoice_Date")?.value,
      customer_Id: this.invoiceForm.get("customer_Id")?.value,
      total_Amount: this.invoiceForm.get("service_total_Amount")?.value,
      gst_Percent: this.invoiceForm.get("gst_percent")?.value,
      sgst: this.invoiceForm.get("sgst_total")?.value,
      cgst: this.invoiceForm.get("cgst_total")?.value,
      total_Tax: this.invoiceForm.get("total_tax")?.value,
      net_Amount: this.invoiceForm.get("net_amount")?.value,
      // created_By: Number(decryptedUserId),
      invoiceDetails: invoiceDetailsPayload
    };

    this.api.post(url, body).subscribe(
      (res: any) => {
        if (res.succeeded) {
          this.toast.success('Invoice updated successfully');
        } else {
          this.toast.error(res.message || 'Failed to update invoice');
        }
        this.spinLoader = false;
      },
      (error: any) => {
        console.error(error);
        this.toast.error(error.error?.message || 'Something went wrong');
        this.spinLoader = false;
      }
    );
  }

  // Calculate the total amount for the entire invoice
  calculateInvoiceTotal(): void {
    const total = this.invoiceDetails.controls.reduce(
      (sum, detail) => sum + (detail.get('total_Amount')?.value || 0),
      0
    );
    this.invoiceForm.get('total_Amount')?.setValue(total);
  }

  calculateTotalAmount(index: number) {
    const item = this.invoiceDetails.at(index);
    const qty = +item.get('qty')?.value || 0;
    const amount = +item.get('amount')?.value || 0;
    const gstPercent = +item.get('service_gst_percent')?.value || 0;

    const totalAmount = qty * amount;
    const gstAmount = (totalAmount * gstPercent) / 100;
    const sgst = gstAmount / 2;
    const cgst = gstAmount / 2;
    const netAmount = totalAmount + gstAmount;

    item.patchValue({
      // total_Amount: totalAmount,
      service_total_Amount: totalAmount,
      service_sgst_total: sgst,
      service_cgst_total: cgst,
      service_total_tax: gstAmount,
      service_net_amount: netAmount
    });

    this.recalculateInvoice();
  }

  invoice = {
    companyName: 'NARAYANA GAYATHRI INFO SOLUTIONS PVT LTD',
    companyAddress: '1-1-189/19/1 Vivek Nagar, Near Pendangati Law College,',
    location: 'Chikkadpally, Hyderabad- 500020',
    phone: '7075323265',
    email: 'nginfosolutions2024@gmail.com',
    gstin: '36AAJCN1320J1ZL',
    billTo: 'L & W Construction Pvt Ltd',
    invoiceDate: '07/05/2024',
    invoiceNo: 'NG2024/0042',
    items: [
      { description: 'ENROLMENT LABOURS IN BOC', qty: 50, unitPrice: 235, total: 11750 }
    ],
    bankDetails: {
      accountName: 'NARAYANA GAYATHRI INFO SOLUTIONS PVT LTD',
      accountNumber: '2741870595',
      ifsc: 'KKBK0007466',
      accountType: 'CURRENT',
      bankName: 'KOTAK MAHINDRA BANK'
    },

  };
  generatePDF(id: string) {
    // Fetch the invoice data from the API
    this.api.get(`get_invoice/${id}`).subscribe(
      (res: any) => {
        if (res && res.data && res.succeeded) {
          const invoice = res.data; // Extract the invoice data from the response
          // Use jsPDF to generate the PDF
          const doc = new jsPDF();
          const topMargin = 50;
          // Company Header
          doc.setFontSize(14);
          doc.setTextColor(255, 170, 0);
          doc.text(this.invoice.companyName || 'Your Company Name', 10, topMargin);
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text(this.invoice.companyAddress || 'Your Company Address', 10, topMargin + 5);
          doc.text(this.invoice.location || 'Your City, State, Zip', 10, topMargin + 10);
          doc.text(`Phone: ${this.invoice.phone || 'N/A'} | Email: ${this.invoice.email || 'N/A'}`, 10, topMargin + 15);
          doc.text(`GSTIN: ${this.invoice.gstin || 'N/A'}`, 10, topMargin + 20);
          // Invoice Details
          doc.text(`Invoice No: ${invoice.invoice_No || 'N/A'}`, 150, topMargin + 40);
          const formattedDate = invoice.invoice_Date
            ? new Date(invoice.invoice_Date).toLocaleDateString('en-GB') // Formats to DD/MM/YYYY
            : 'N/A';
          doc.text(`Invoice Date: ${formattedDate}`, 150, topMargin + 45);
          // Customer Details
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 255);
          doc.text('Bill To:', 10, topMargin + 35);
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text(`Name: ${invoice.customer_Name || 'N/A'}`, 10, topMargin + 40);
          doc.text(`Contact No: ${invoice.contact_No || 'N/A'}`, 10, topMargin + 45);
          // Calculate GST and Grand Total
          const gstRate = 0.18; // 18% GST
          const gstAmount = (invoice.total_Amount * gstRate).toFixed(2); // GST Amount
          const grandTotal = (invoice.total_Amount + parseFloat(gstAmount)).toFixed(2);
          // Generate Invoice Table
          autoTable(doc, {
            startY: topMargin + 60,
            head: [['Description', 'Qty', 'Unit Price', 'Total']],
            body: [
              ...invoice.invoiceDetails.map((item: any) => [
                item.service_Name || 'N/A',
                item.qty?.toString() || '0',
                `RS.${item.amount?.toFixed(2) || '0.00'}`,
                `RS.${item.total_Amount?.toFixed(2) || '0.00'}`,
              ]),
              // Add summary rows
              [{ content: '', colSpan: 4 }],
              ['Subtotal', '', '', `RS.${invoice.total_Amount.toFixed(2)}`],
              ['GST (18%)', '', '', `RS.${gstAmount}`],
              ['Grand Total', '', '', `RS.${grandTotal}`],
            ],
            theme: 'grid',
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: { fillColor: [41, 128, 185] },
            bodyStyles: { halign: 'left' },
            columnStyles: {
              0: { halign: 'left' },
            },
          });

          // Access the finalY position
          const currentY = (doc as any).lastAutoTable.finalY + 10;
          // Bank Details
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          doc.text('Bank Details:', 10, currentY);
          let newY = currentY + 6; // Adjust vertical spacing
          doc.setFontSize(10);
          doc.text(`Account Name: NARAYANA GAYATHRI INFO SOLUTIONS PVT LTD `, 10, newY);
          newY += 5;
          doc.text(`Account Number: 2748170595`, 10, newY);
          newY += 5;
          doc.text(`IFSC: KKBK0007466`, 10, newY);
          newY += 5;
          doc.text(`Account Type: CURRENT`, 10, newY);
          newY += 5;
          doc.text(`Bank Name: KOTAK MAHINDRA BANK`, 10, newY);
          newY += 30;
          doc.text(`NG INFO SOLUTIONS PVT LTD`, 140, newY);
          newY += 5;
          doc.text(`AUTHORIZED SIGNATURE`, 145, newY);

          // Open PDF in a new tab
          // const fileName = `Invoice_${invoice.invoice_No || 'N/A'}.pdf`;
          window.open(doc.output('bloburl'), '_blank');
        } else {
          this.toast.success('Failed to fetch invoice data or no data available.', 'error');
          console.error('Failed to fetch invoice data or no data available.');
        }
      },
      (error: any) => {
        console.error('Error fetching invoice data:', error);
      }
    );
  }
}