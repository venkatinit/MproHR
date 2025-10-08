
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
  selector: 'app-payroll-deductions',
  templateUrl: './payroll-deductions.component.html',
  styleUrls: ['./payroll-deductions.component.scss']
})
export class PayrollDeductionsComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  action: 'create' | 'update' = 'create';
  addDeductions: FormGroup;
  form!: FormGroup;
  submitted: boolean = false;
  errors: string[] = [];
  spinLoader = false;
  deduction_list: any;
  cateId: any;
  companyList: any[] = [];
  companyFilter: string = '';
  originalDeductionList: any[] = [];
  filteredDeductionList: any[] = [];
  companyId: number = 2;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private util: UtilsServiceService,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private toast:ToastrService
  ) {
    this.addDeductions = this.formBuilder.group({
      // company: ['', [Validators.required]],
      deduction_name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      value: ['', [Validators.required]],

    });
  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
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
    this.getDeductions();
    this.getCompanyList();

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
  get f() {
    return this.addDeductions.controls;
  }
  getCompanyList() {
    this.api.get('api/company/all').subscribe((res: any) => {
      this.companyList = res?.data?.data || [];
    });
  }
  filterDeductions() {
    const search = this.companyFilter.trim().toLowerCase();
    this.filteredDeductionList = this.originalDeductionList.filter(deductions =>
      deductions.companyName?.toLowerCase().includes(search)
    );
  }
  getDeductions() {
    // const statusQuery = this.companyId; // Get the current selected status
    this.api.get('api/payroll/deductions').subscribe((res: ApiResponse<any>) => {
      this.deduction_list = res;
      this.dtTrigger.next(null);
      if (($.fn.DataTable as any).isDataTable('#deductionsTable')) {
      }
      this.dtTrigger.next(null); // initialize new
    });
  }
  saveDeduction() {
    console.log('✅ create form submitted');
    this.submitted = true;
    if (!this.addDeductions.valid) {
      return;
    }
    this.spinLoader = true;
    const decryptedUserId = this.util.decrypt_Text(localStorage.getItem('id') || '');
    const url = 'api/payroll/deductions';
    const body = {
      id: 0,
      // company_Id: this.addDeductions.get('company')?.value,
      name: this.addDeductions.get('deduction_name')?.value,
      type: this.addDeductions.get('type')?.value,
      value: this.addDeductions.get('value')?.value,

    };
    this.api.post(url, body).subscribe(
      (res: any) => {
        this.addDeductions.reset();
        this.submitted = false;
        this.errors = [];
        this.spinLoader = false;
        this.toast.success('Deduction Saved successfully', 'Success');
        $('#newModal').modal('hide');
        this.getDeductions();
      },
      (error: any) => {
        this.submitted = false;
        this.spinLoader = false;
        const errorMessage = error?.error?.message || 'Deduction not added successfully';
        this.errors = [errorMessage];
      }
    );
  }
  updateById(id: number) {
    this.action = 'update';
    this.cateId = id; // Store the selected ID

    const selectedDistrict = this.deduction_list.find(d => d.id === id);

    if (selectedDistrict) {
      this.addDeductions.patchValue({
        deduction_name: selectedDistrict.name,
        type: selectedDistrict.type,
        value: selectedDistrict.value

      });

      this.submitted = false;
      this.errors = [];
    } else {
      console.error('Deductions not found');
    }
  }

  updateDeduction() {
    console.log('✅ Update form submitted');
    this.submitted = true;
    if (!this.addDeductions.valid || !this.cateId) {
      return;
    }
    this.spinLoader = true;
    const encryptedUserId = localStorage.getItem('id');
    const decryptedUserId = this.util.decrypt_Text(encryptedUserId);
    const url = `api/payroll/deductions/${this.cateId}`;
    const body = {
      "id": this.cateId,
      // "company_Id": this.addDeductions.get("company").value,
      "name": this.addDeductions.get("deduction_name").value,
      "type": this.addDeductions.get("type").value,
      "value": this.addDeductions.get("value").value,
    };
    this.api.put(url, body).subscribe(
      (res: any) => {
        this.addDeductions.reset();
        this.submitted = false;
        this.errors = [];
        this.toast.success('Deduction Updated successfully', 'Success');
        this.spinLoader = false;
        this.getDeductions();
      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.Message];
        this.toast.error(this.errors[0], 'Deduction Not Updated successfully');
        this.spinLoader = false;
      }
    );
  }
  deleteDeduction(id: number) {
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
        this.api.delete(`api/payroll/deductions/${id}`).subscribe({
          next: (res: any) => {
            Swal.fire('Deleted!', 'The Deduction has been deleted.', 'success');
            this.getDeductions(); // refresh list without reloading the page
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
