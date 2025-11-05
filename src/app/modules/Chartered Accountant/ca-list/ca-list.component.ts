import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.client';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { ApiResponse } from 'src/app/models/api-response';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
@Component({
  selector: 'app-ca-list',
  templateUrl: './ca-list.component.html',
  styleUrls: ['./ca-list.component.scss']
})
export class CaListComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  action: 'create' | 'update' = 'create';
  addCA: FormGroup;
  form: FormGroup;
  submitted: boolean = false;
  errors: string[] = [];
  spinLoader = false;
  ca_list: any[] = [];
  cateId: any;
  companyList: any[] = [];
  companyFilter: string = '';
  originalCaList: any[] = [];
  filteredCaList: any[] = [];
  companyId: number = 2;
  constructor(
    private modalService: NgbModal,
    private toast: ToastrService,
    private util: UtilsServiceService,
    private formBuilder: FormBuilder,
    private api: ApiService
  ) {
    this.addCA = this.formBuilder.group({
      // company: ['', [Validators.required]],
      bank_name: ['', [Validators.required]],
      branch_name: ['', [Validators.required]],
      bank_address: ['', [Validators.required]],
      account_number: ['', [Validators.required]],
      account_type: ['', [Validators.required]],
      bm_name: ['', [Validators.required]],
      bm_contact_no: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      txn_Start_Date: ['', [Validators.required]],
      opening_Balance: ['', [Validators.required]],
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
    this.getCa();
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
    return this.addCA.controls;
  }
  getCompanyList() {
    this.api.get('api/company/all').subscribe((res: any) => {
      this.companyList = res?.data?.data || [];
    });
  }
  getCa() {
    if (this.form.invalid) return;
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    const queryParams = new URLSearchParams({
      companyId: companyId,
    }).toString();
    this.api.get(`api/accounting/banks/all?${queryParams}`).subscribe((res: ApiResponse<any>) => {
      this.ca_list = Array.isArray(res.data) ? res.data : [res.data];
      this.dtTrigger.next(null);
      this.toast.success('CA Data Retrieved successfully', 'Success');
      if (($.fn.DataTable as any).isDataTable('#caTable')) {
      }
      (error: any) => {
        this.submitted = false;
        this.spinLoader = false;
        const errorMessage = error?.error?.message || 'CA  Data not Retrieved successfully';
        this.errors = [errorMessage];
      }
      this.dtTrigger.next(null); // initialize new
    });
  }
  saveCA() {
    console.log('✅ create form submitted');
    this.submitted = true;
    if (!this.addCA.valid) {
      return;
    }
    this.spinLoader = true;
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    const url = 'api/accounting/create_bank';
    const body = {
      id: 0,
      company_Id: companyId,
      bank_Name: this.addCA.get('bank_name')?.value,
      branch: this.addCA.get('branch_name')?.value,
      address: this.addCA.get('bank_address')?.value,
      account_Number: this.addCA.get('account_number')?.value,
      account_Type: this.addCA.get('account_type')?.value,
      bM_Name: this.addCA.get('bm_name')?.value,
      bM_Contact_No: this.addCA.get('bm_contact_no')?.value,
      branch_Contact_No: '',
      opening_Balance: this.addCA.get('opening_Balance')?.value,
      txn_Start_Date: new Date(),
      created_At: new Date(),
      status: true,
    };
    this.api.post(url, body).subscribe(
      (res: any) => {
        this.addCA.reset();
        this.submitted = false;
        this.errors = [];
        this.spinLoader = false;
        this.toast.success('CA Saved successfully', 'Success');
        $('#newModal').modal('hide');
        this.getCa();
        window.location.reload();
      },
      (error: any) => {
        this.submitted = false;
        this.spinLoader = false;
        const errorMessage = error?.error?.message || 'CA not Saved successfully';
        this.errors = [errorMessage];
      }
    );
  }
  updateById(id: number) {
    this.action = 'update';
    this.cateId = id;

    this.api.get(`api/accounting/bank/${id}`).subscribe(
      (res: any) => {
        if (res && res.data && res.succeeded && res.data.status) {
          this.addCA.controls['bank_name'].setValue(res.data.bank_Name);
          this.addCA.controls['branch_name'].setValue(res.data.branch);
          this.addCA.controls['bank_address'].setValue(res.data.address);
          this.addCA.controls['account_number'].setValue(res.data.account_Number);
          this.addCA.controls['account_type'].setValue(res.data.account_Type);
          this.addCA.controls['bm_name'].setValue(res.data.bM_Name);
          this.addCA.controls['bm_contact_no'].setValue(res.data.bM_Contact_No);
          this.addCA.controls['opening_Balance'].setValue(res.data.opening_Balance);
          this.submitted = false;
          this.errors = [];
        }
        this.spinLoader = false;
      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.Message];
        this.toast.error(this.errors[0], 'CA Not added successfully');
        this.spinLoader = false;
      }
    );
  }
  updateCA() {
    console.log('✅ Update form submitted');
    this.submitted = true;
    if (!this.addCA.valid) {
      return;
    }
    this.spinLoader = true;
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    const url = "api/accounting/update_bank";
    const body = {
      "id": this.cateId,
      "company_Id": companyId,
      "bank_Name": this.addCA.get("bank_name").value,
      "branch": this.addCA.get("branch_name").value,
      "address": this.addCA.get("bank_address").value,
      "account_Number": this.addCA.get("account_number").value,
      "account_Type": this.addCA.get("account_type").value,
      "bM_Name": this.addCA.get("bm_name").value,
      "bM_Contact_No": this.addCA.get("bm_contact_no").value,
      "branch_Contact_No": " ",
      "opening_Balance": this.addCA.get("opening_Balance").value,
      "txn_Start_Date": new Date(),
      "created_At": new Date(),
      "status": true
    };
    this.api.put(url, body).subscribe(
      (res: any) => {
        this.addCA.reset();
        this.submitted = false;
        this.errors = [];
        this.toast.success('CA Updated successfully', 'Success');
        this.spinLoader = false;
        // window.location.reload();
        $('#newModal').modal('hide');
        this.getCa();
      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.Message];
        this.toast.error(this.errors[0], 'CA Not Updated successfully');
        this.spinLoader = false;
      }
    );
  }
  deleteCA(id: number) {
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
        this.api.delete(`api/accounting/bank/delete/${id}`).subscribe({
          next: (res: any) => {
            Swal.fire('Deleted!', 'The CA has been deleted.', 'success');
            window.location.reload();
            this.getCa(); // refresh list without reloading the page
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
