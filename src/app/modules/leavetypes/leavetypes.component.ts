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
  selector: 'app-leavetypes',
  templateUrl: './leavetypes.component.html',
  styleUrls: ['./leavetypes.component.scss']
})
export class LeavetypesComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  action: 'create' | 'update' = 'create';
  addLeaves: FormGroup;
  submitted: boolean = false;
  errors: string[] = [];
  spinLoader = false;
  leaves_list: any;
  cateId: any;
  companyList: any[] = [];
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private util: UtilsServiceService,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private toast: ToastrService
  ) {
    this.addLeaves = this.formBuilder.group({
      leave_type: ['', [Validators.required]],
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
  }
  get f() {
    return this.addLeaves.controls;
  }
  getCompanyList() {
    this.api.get('api/company/all').subscribe((res: any) => {
      this.companyList = res?.data?.data || [];
    });
  }
  getLeaves() {
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';

    this.api.get(`api/admin/leave/types?companyId=${companyId}`).subscribe((res: ApiResponse<any>) => {
      this.leaves_list = res;
      this.dtTrigger.next(null);
      if (($.fn.DataTable as any).isDataTable('#LeaveTable')) {
      }
      this.dtTrigger.next(null); // initialize new
    });
  }

  saveLeaves() {
    this.action = 'create';
    console.log('✅ create form submitted');
    this.submitted = true;
    if (!this.addLeaves.valid) {
      return;
    }
    this.spinLoader = true;
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';

    const decryptedUserId = this.util.decrypt_Text(localStorage.getItem('id') || '');
    const url = 'api/admin/leave/type';
    const body = {
      "id": 0,
      "company_Id": companyId,
      "name": this.addLeaves.get('leave_type')?.value,
    };
    this.api.post(url, body).subscribe(
      (res: any) => {
        this.addLeaves.reset();
        window.location.reload();
        this.submitted = false;
        this.errors = [];
        this.spinLoader = false;
        this.toast.success('Type Saved successfully', 'Success');
        $('#newModal').modal('hide');
        this.getLeaves();
      },
      (error: any) => {
        this.submitted = false;
        this.spinLoader = false;
        const errorMessage = error?.error?.message || 'Leave not added successfully';
        this.errors = [errorMessage];
      }
    );
  }
  updateById(id: number) {
    this.action = 'update';
    this.cateId = id; // Store the selected ID

    const selectedLeave = this.leaves_list.find(d => d.id === id);

    if (selectedLeave) {
      this.addLeaves.patchValue({
        company: selectedLeave.company_Id,
        leave_type: selectedLeave.name
      });

      this.submitted = false;
      this.errors = [];
    } else {
      console.error('District not found');
    }
  }
  updateLeaves() {
    // this.cateId = id;
    console.log('✅ Update form submitted');
    this.submitted = true;

    if (!this.addLeaves.valid || !this.cateId) {
      return;
    }

    this.spinLoader = true;

    const url = `api/admin/leave/type/${this.cateId}`;
    const body = {
      id: this.cateId,
      company_Id: this.addLeaves.get('company')?.value,
      name: this.addLeaves.get('leave_type')?.value,
      // status: 'Active'
    };

    this.api.put(url, body).subscribe(
      (res: any) => {
        this.addLeaves.reset();
        this.submitted = false;
        this.errors = [];
        this.spinLoader = false;
        this.action = 'create';
        this.toast.success('Type Updated successfully', 'Success');
        $('#newModal').modal('hide');
        this.getLeaves(); // Refresh list
      },
      (error: any) => {
        console.error(error);
        this.submitted = false;
        this.errors = [error.error?.Message || 'Update failed'];
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
        this.api.delete(`api/admin/leave/type/${id}`).subscribe({
          next: (res: any) => {
            Swal.fire('Deleted!', 'The Type has been deleted.', 'success');
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
