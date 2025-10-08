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
declare var $: any;
@Component({
  selector: 'app-leave-approvals',
  templateUrl: './leave-approvals.component.html',
  styleUrls: ['./leave-approvals.component.scss']
})
export class LeaveApprovalsComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  action: 'create' | 'update' = 'create';
  addBank: FormGroup;
  form!: FormGroup;
  submitted: boolean = false;
  errors: string[] = [];
  spinLoader = false;
  banks_list: any[] = [];
  cateId: any;
  companyList: any[] = [];
  companyFilter: string = '';
  originalBankList: any[] = [];
  filteredBankList: any[] = [];
  companyId: number = 2;
  acceptLeave: any;
  rejectLeaves: any;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private util: UtilsServiceService,
    private formBuilder: FormBuilder,
    private api: ApiService
  ) {
    // this.addBank = this.formBuilder.group({
    //   company: ['', [Validators.required]],
    //   bank_name: ['', [Validators.required]],
    // });
  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      company: ['', [Validators.required]],
    });
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50],
      destroy: true,
      processing: true
    };
    this.PendingLeaves();

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
    return this.addBank.controls;
  }
  getCompanyList() {
    this.api.get('api/company/all').subscribe((res: any) => {
      this.companyList = res?.data?.data || [];
    });
  }
  // filterBanks() {
  //   const search = this.companyFilter.trim().toLowerCase();
  //   this.filteredBankList = this.originalBankList.filter(bank =>
  //     bank.companyName?.toLowerCase().includes(search)
  //   );
  // }
  PendingLeaves() {
    if (this.form.invalid) return;
    const queryParams = new URLSearchParams({
      companyId: this.form.get('company')?.value || '',
    }).toString();
    // const statusQuery = this.companyId; // Get the current selected status
    this.api.get('api/admin/leave/pending-for-approval').subscribe((res: ApiResponse<any>) => {
      this.banks_list = Array.isArray(res.data) ? res.data : [res.data];
      this.dtTrigger.next(null);
      if (($.fn.DataTable as any).isDataTable('#bankTable')) {
      }
      this.dtTrigger.next(null); // initialize new
    });
  }

  handleLeaveAction(id: number) {
    Swal.fire({
      title: 'Choose an action',
      text: 'What would you like to do with this leave request?',
      icon: 'question',
      showCancelButton: true,
      showDenyButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Approve',
      denyButtonText: 'Reject',
      cancelButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        // Approve
        const body = {
          id: id,
          status: 'Approved',
          role: 'Admin',
        };
        this.api.put(`leave/approve/${id}`, body).subscribe({
          next: (res: any) => {
            Swal.fire('Approved!', 'Leave has been approved.', 'success');
            this.PendingLeaves();
          },
          error: (err: any) => {
            Swal.fire('Error!', 'Failed to approve the leave.', 'error');
            console.log(err);
          }
        });

      } else if (result.isDenied) {
        // Reject
        const body = {
          id: id,
          status: 'Rejected',
          role: 'Admin',
        };
        this.api.put(`leave/reject/${id}`, body).subscribe({
          next: (res: any) => {
            Swal.fire('Rejected!', 'Leave has been rejected.', 'info');
            this.PendingLeaves();
          },
          error: (err: any) => {
            Swal.fire('Error!', 'Failed to reject the leave.', 'error');
            console.log(err);
          }
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Delete
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to delete this leave record?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it',
          cancelButtonText: 'No, cancel',
        }).then((confirmDelete) => {
          if (confirmDelete.isConfirmed) {
            this.api.delete(`api/admin/leave/allotment/${id}`).subscribe({
              next: (res: any) => {
                Swal.fire('Deleted!', 'The leave has been deleted.', 'success');
                this.PendingLeaves();
              },
              error: (err: any) => {
                Swal.fire('Error!', 'Failed to delete the leave.', 'error');
                console.log(err);
              }
            });
          } else {
            Swal.fire('Cancelled', 'Leave record is safe.', 'info');
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
