
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
// import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
@Component({
  selector: 'app-payroll-allowances',
  templateUrl: './payroll-allowances.component.html',
  styleUrls: ['./payroll-allowances.component.scss']
})
export class PayrollAllowancesComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  action: 'create' | 'update' = 'create';
  addAllowances: FormGroup;
  filterForm: FormGroup;
  submitted: boolean = false;
  errors: string[] = [];
  spinLoader = false;
  allowance_list: any;
  cateId: any;
  companyList: any[] = [];
  companyFilter: string = '';
  originalAllowancesList: any[] = [];
  filteredAllowancesList: any[] = [];
  companyId: number = 2;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private util: UtilsServiceService,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private toast: ToastrService
  ) {
    this.addAllowances = this.formBuilder.group({
      // company: ['', [Validators.required]],
      allowance_name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      value: ['', [Validators.required]],

    });
  }
  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      company: [{ value: '', disabled: true }, Validators.required],
      // other controls...
    });
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50],
      destroy: true,
      processing: true
    };
    this.getAllowances();
    this.getCompanyList();

  }
  isCompanyFilterVisible: boolean = false;

  toggleCompanyFilter() {
    this.isCompanyFilterVisible = !this.isCompanyFilterVisible;

    const companyControl = this.filterForm.get('company');

    if (this.isCompanyFilterVisible) {
      companyControl?.enable();
    } else {
      companyControl?.disable();
      companyControl?.setValue('');
    }
  }
  get f() {
    return this.addAllowances.controls;
  }
  getCompanyList() {
    this.api.get('api/company/all').subscribe((res: any) => {
      this.companyList = res?.data?.data || [];
    });
  }
  filterAllowancess() {
    
    const search = this.companyFilter.trim().toLowerCase();
    this.filteredAllowancesList = this.originalAllowancesList.filter(allowances =>
      allowances.companyName?.toLowerCase().includes(search)
    );
  }
  getAllowances() {
    if (this.filterForm.invalid) return;

    // const queryParams = new URLSearchParams({
    //   fromDate: this.filterForm.get('from_date')?.value || '',
    //   toDate: this.filterForm.get('to_date')?.value || '',
    //   clientName: this.filterForm.get('client_name')?.value || '',
    //   cardNumber: this.filterForm.get('card_number')?.value || '',
    //   status: this.filterForm.get('status')?.value || '',
    //   claimType: this.filterForm.get('claim_type')?.value || '',
    //   cardHolderName: this.filterForm.get('holder_name')?.value || ''
    // }).toString();
    // const statusQuery = this.companyId; // Get the current selected status
    this.api.get('api/payroll/allowances').subscribe((res: ApiResponse<any>) => {
      this.allowance_list = res;
      this.dtTrigger.next(null);
      if (($.fn.DataTable as any).isDataTable('#allowancesTable')) {
      }
      this.dtTrigger.next(null); // initialize new
    });
  }
  saveAllowance() {
    console.log('✅ create form submitted');
    this.submitted = true;
    if (!this.addAllowances.valid) {
      return;
    }
    this.spinLoader = true;
    const decryptedUserId = this.util.decrypt_Text(localStorage.getItem('id') || '');
    const url = 'api/payroll/allowances';
    const body = {
      id: 0,
      // company_Id: this.addAllowances.get('company')?.value,
      name: this.addAllowances.get('allowance_name')?.value,
      type: this.addAllowances.get('type')?.value,
      value: this.addAllowances.get('value')?.value,

    };
    this.api.post(url, body).subscribe(
      (res: any) => {
        this.addAllowances.reset();
        this.submitted = false;
        this.errors = [];
        this.spinLoader = false;
        this.toast.success('Allowance Saved successfully', 'Success');
        $('#newModal').modal('hide');
        this.getAllowances();
      },
      (error: any) => {
        this.submitted = false;
        this.spinLoader = false;
        const errorMessage = error?.error?.message || 'allowances not added successfully';
        this.errors = [errorMessage];
      }
    );
  }
  updateById(id: number) {
    this.action = 'update';
    this.cateId = id; // Store the selected ID

    const selectedDistrict = this.allowance_list.find(d => d.id === id);

    if (selectedDistrict) {
      this.addAllowances.patchValue({
        allowance_name: selectedDistrict.name,
        type: selectedDistrict.type,
        value: selectedDistrict.value

      });

      this.submitted = false;
      this.errors = [];
    } else {
      console.error('Allowances not found');
    }
  }

  updateAllowance() {
    console.log('✅ Update form submitted');
    this.submitted = true;
    if (!this.addAllowances.valid || !this.cateId) {
      return;
    }
    this.spinLoader = true;
    const encryptedUserId = localStorage.getItem('id');
    const decryptedUserId = this.util.decrypt_Text(encryptedUserId);
    const url = `api/payroll/allowances/${this.cateId}`;
    const body = {
      "id": this.cateId,
      // "company_Id": this.addAllowances.get("company").value,
      "name": this.addAllowances.get("allowance_name").value,
      "type": this.addAllowances.get("type").value,
      "value": this.addAllowances.get("value").value,
    };
    this.api.put(url, body).subscribe(
      (res: any) => {
        this.addAllowances.reset();
        this.submitted = false;
        this.errors = [];
        this.toast.success('allowances Updated successfully', 'Success');
        this.spinLoader = false;
        $('#newModal').modal('hide');
        this.getAllowances();
        window.location.reload();
      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.Message];
        this.toast.error(this.errors[0], 'allowances Not Updated successfully');
        this.spinLoader = false;
      }
    );
  }
  deleteAllowance(id: number) {
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
        this.api.delete(`api/payroll/allowances/${id}`).subscribe({
          next: (res: any) => {
            Swal.fire('Deleted!', 'The allowances has been deleted.', 'success');
            this.getAllowances(); // refresh list without reloading the page
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
