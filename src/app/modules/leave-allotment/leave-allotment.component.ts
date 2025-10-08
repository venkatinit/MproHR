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
  selector: 'app-leave-allotment',
  templateUrl: './leave-allotment.component.html',
  styleUrls: ['./leave-allotment.component.scss']
})
export class LeaveAllotmentComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  action: 'create' | 'update' = 'create';
  addLeaves: FormGroup;
  submitted: boolean = false;
  errors: string[] = [];
  spinLoader = false;
  leaves_list: any;
  companyList: any[] = [];
  employee_List: any[] = [];
  allotment_list: any;
  cateId: any;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private util: UtilsServiceService,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private toast:ToastrService
  ) {
    this.addLeaves = this.formBuilder.group({
      leave_type: ['', [Validators.required]],
      employee: ['', [Validators.required]],
      no_of_days: ['', [Validators.required]],
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
    this.getLeaves();
    this.getCompanyList();
    this.getAllotments();
    this.getEmployeeList();
  }
  get f() {
    return this.addLeaves.controls;
  }
  getCompanyList() {
    this.api.get('api/company/all').subscribe((res: any) => {
      this.companyList = res?.data?.data || [];
    });
  }
  getEmployeeList() {
    this.api.get('1').subscribe((res: any) => {
      this.companyList = res?.data?.data || [];
    });
  }
  getLeaves() {
    this.api.get('api/admin/leave/types?companyId=2').subscribe((res: ApiResponse<any>) => {
      this.leaves_list = res;
    });
  }
  getAllotments() {
    this.api.get('api/admin/leave/allotments/1').subscribe((res: ApiResponse<any>) => {
      this.allotment_list = res;
      this.dtTrigger.next(null);
      if (($.fn.DataTable as any).isDataTable('#allotmentTable')) {
      }
      this.dtTrigger.next(null); // initialize new
    });
  }
  saveLeaves() {
    console.log('✅ create form submitted');
    this.submitted = true;
    if (!this.addLeaves.valid) {
      return;
    }
    this.spinLoader = true;
    const decryptedUserId = this.util.decrypt_Text(localStorage.getItem('id') || '');
    const url = 'api/admin/leave/allotment';
    const body = {
      "id": 0,
      "employeeId": this.addLeaves.get('employee')?.value,
      "leaveTypeId": this.addLeaves.get('leave_type')?.value,
      "totalDays": this.addLeaves.get('no_of_days')?.value,
    };
    this.api.post(url, body).subscribe(
      (res: any) => {
        this.addLeaves.reset();
        window.location.reload();
        this.submitted = false;
        this.errors = [];
        this.spinLoader = false;
        this.toast.success('Leave Saved successfully', 'Success');
        $('#newModal').modal('hide');
        this.getLeaves();
      },
      (error: any) => {
        this.submitted = false;
        this.spinLoader = false;
        const errorMessage = error?.error?.message || 'Leave Allotment not added successfully';
        this.errors = [errorMessage];
      }
    );
  }
  updateById(id: number) {
    this.action = 'update';
    this.cateId = id;
    this.api.get(`api/admin/leave/allotment/${id}`).subscribe(
      (res: any) => {
        if (res && res.data && res.succeeded && res.data.status) {
          this.addLeaves.controls['name'].setValue(res.data.leave_type);
          this.addLeaves.controls['company_Id'].setValue(res.data.company);

          this.submitted = false;
          this.errors = [];
        }
        this.spinLoader = false;
      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.Message];
        this.toast.error(this.errors[0], 'Leave Not added successfully');
        this.spinLoader = false;
      }
    );
  }
  updateLeaves() {
    console.log('✅ Update form submitted');
    this.submitted = true;
    if (!this.addLeaves.valid) {
      return;
    }
    this.spinLoader = true;
    const encryptedUserId = localStorage.getItem('id');
    const decryptedUserId = this.util.decrypt_Text(encryptedUserId);
    const url = "api/admin/leave/allotment/${id}";
    const body = {
      "id": this.cateId,
      "company_Id": this.addLeaves.get("company").value,
      "name": this.addLeaves.get("leave_type").value,
    };
    this.api.put(url, body).subscribe(
      (res: any) => {
        this.addLeaves.reset();
        this.submitted = false;
        window.location.reload()
        this.errors = [];
        this.toast.success('Leave Updated successfully', 'Success');
        this.spinLoader = false;
        this.getLeaves();
      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.Message];
        this.toast.error(this.errors[0], 'Leave Not Updated successfully');
        this.spinLoader = false;
      }
    );
  }
  deleteLeaves(id: number) {
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
        this.api.delete(`api/admin/leave/allotment/${id}`).subscribe({
          next: (res: any) => {
            Swal.fire('Deleted!', 'The Leave has been deleted.', 'success');
            window.location.reload()
            this.getLeaves(); // refresh list without reloading the page
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
