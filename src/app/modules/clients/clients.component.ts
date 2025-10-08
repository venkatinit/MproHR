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
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  action: 'create' | 'update' = 'create';
  addUser: FormGroup;
  form!: FormGroup;
  submitted: boolean = false;
  errors: string[] = [];
  spinLoader = false;
  clients_list: any[] = [];
  cateId: any;
  companyList: any[] = [];
  companyFilter: string = '';
  originalClientList: any[] = [];
  filteredClientList: any[] = [];
  statusId: string = "ALL";
  statusList = [
    { "status": "All", "value": "ALL" },
    { "status": "Active", "value": "active" },
    { "status": "Inactive", "value": "inactive" },
    // { "status": "Pending", "value": "Pending" },
  ]
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private util: UtilsServiceService,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private toast: ToastrService
  ) {
    this.addUser = this.formBuilder.group({
      first_Name: ['', Validators.required],
      last_Name: ['', Validators.required],
      mobile_Number: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email_Id: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      aadhar_Number: ['', [Validators.required, Validators.pattern(/^[0-9]{12}$/)]],
      ref_By: [''],
      role: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      status: ['ALL'],
    });
    this.form.get('status')?.valueChanges.subscribe((value: string) => {
      this.statusId = value;
      this.getClients();
    });
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50],
      destroy: true,
      processing: true
    };
    this.getClients();
    // this.getCompanyList();

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
    return this.addUser.controls;
  }
  getClients() {
    if (this.form.invalid) return;
    const queryParams = new URLSearchParams({
      status: this.form.get('status')?.value || '',
    }).toString();
    // const status = this.form.get('status')?.value || 'ALL';
    this.api.get(`api/admin/get_all_users?${queryParams}`).subscribe((res: ApiResponse<any>) => {
      this.clients_list = Array.isArray(res.data) ? res.data : [];
      if (($.fn.DataTable as any).isDataTable('#bankTable')) {
        $('#bankTable').DataTable().clear().destroy();
      }
      this.dtTrigger.next(null);
    });
  }
  saveUser() {
    console.log('✅ create form submitted');
    this.submitted = true;
    if (!this.addUser.valid) {
      return;
    }
    this.spinLoader = true;
    const decryptedUserId = this.util.decrypt_Text(localStorage.getItem('id') || '');
    const url = 'api/admin/add_user';
    const body = {
      id: 0,
      first_Name: this.addUser.get('first_Name')?.value,
      last_Name: this.addUser.get('last_Name')?.value,
      mobile_Number: this.addUser.get('mobile_Number')?.value,
      email_Id: this.addUser.get('email_Id')?.value,
      password: this.addUser.get('password')?.value,
      aadhar_Number: this.addUser.get('aadhar_Number')?.value,
      ref_By: this.addUser.get('ref_By')?.value,
      role: this.addUser.get('role')?.value,
      "under_Id": 0
    };
    this.api.post(url, body).subscribe(
      (res: any) => {
        this.addUser.reset();
        this.submitted = false;
        this.errors = [];
        this.spinLoader = false;
        this.getClients();
        this.toast.error(this.errors[0], 'Client added successfully');
        $('#newModal').modal('hide');

      },
      (error: any) => {
        this.submitted = false;
        this.spinLoader = false;
        const errorMessage = error?.error?.message || 'Client not added successfully';
        this.errors = [errorMessage];
      }
    );
  }
  updateById(id: number) {
    this.action = 'update';
    this.cateId = id; // Store the selected ID

    const selectedList = this.clients_list.find(d => d.id === id);

    if (selectedList) {
      this.addUser.patchValue({
        id: selectedList.id,
        first_Name: selectedList.first_Name,
        last_Name: selectedList.last_Name,
        user_Id: selectedList.user_Id,
        mobile_Number: selectedList.mobile_Number,
        email_Id: selectedList.email_Id,
        otp: selectedList.otp,
        role: selectedList.role,
        password: selectedList.password,
        ref_By: selectedList.ref_By,
        created_At: selectedList.created_At,
        status: selectedList.status,
        aadhar_Number: selectedList.aadhar_Number
      });

      this.submitted = false;
      this.errors = [];
    } else {
      console.error('Client not found');
    }
  }
  updateUser() {
    console.log('✅ Update form submitted');
    this.submitted = true;
    if (!this.addUser.valid || !this.cateId) {
      return;
    }
    this.spinLoader = true;
    const url = 'api/admin/update_user';
    const body = {
      id: this.cateId,
      first_Name: this.addUser.get('first_Name')?.value,
      last_Name: this.addUser.get('last_Name')?.value,
      user_Id: this.addUser.get('user_Id')?.value || '-',   // default if empty
      mobile_Number: this.addUser.get('mobile_Number')?.value,
      email_Id: this.addUser.get('email_Id')?.value,
      otp: this.addUser.get('otp')?.value || '-',
      role: this.addUser.get('role')?.value,
      password: this.addUser.get('password')?.value,
      ref_By: this.addUser.get('ref_By')?.value,
      created_At: new Date().toISOString(),   // auto set current timestamp
      status: this.addUser.get('status')?.value || 'active', // default Active
      aadhar_Number: this.addUser.get('aadhar_Number')?.value
    };
    this.api.put(url, body).subscribe(
      (res: any) => {
        this.addUser.reset();
        this.submitted = false;
        this.errors = [];
        this.spinLoader = false;
        this.action = 'create';
        this.toast.success('Client Updated successfully', 'Success');
        $('#newModal').modal('hide');
        this.getClients(); // Refresh list
      },
      (error: any) => {
        console.error(error);
        this.submitted = false;
        this.errors = [error.error?.Message || 'Update failed'];
        this.spinLoader = false;
      }
    );
  }
  deleteClient(id: number) {
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
        this.api.delete(`api/accounting/user/delete/${id}`).subscribe({
          next: (res: any) => {
            Swal.fire('Deleted!', 'The Client has been deleted.', 'success');
            this.getClients(); // refresh list without reloading the page
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
