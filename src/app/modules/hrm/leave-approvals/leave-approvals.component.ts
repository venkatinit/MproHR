import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  form!: FormGroup;
  submitted: boolean = false;
  errors: string[] = [];
  spinLoader = false;
  leaves_list: any;
  cateId: any;
  acceptLeave: any;
  rejectLeaves: any;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private util: UtilsServiceService,
    private formBuilder: FormBuilder,
    private api: ApiService
  ) { }
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50],
      destroy: true,
      processing: true
    };
    this.PendingLeaves();
  }
  PendingLeaves() {
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    const queryParams = new URLSearchParams({
      companyId: companyId,
    }).toString();
    // const statusQuery = this.companyId; // Get the current selected status
    this.api.get('api/admin/leave/pending-for-approval').subscribe((res: ApiResponse<any>) => {
      this.leaves_list = res;
      this.dtTrigger.next(null);
      if (($.fn.DataTable as any).isDataTable('#LeavesTable')) {
      }
      this.dtTrigger.next(null); // initialize new
    });
  }

  handleLeaveAction(Id: number) {
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
          Id: Id,
          status: 'Approved',
          role: 'Admin',
        };
        this.api.put(`leave/approve/${Id}`, body).subscribe({
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
          Id: Id,
          status: 'Rejected',
          role: 'Admin',
        };
        this.api.put(`leave/reject/${Id}`, body).subscribe({
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
            this.api.delete(`api/admin/leave/allotment/${Id}`).subscribe({
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
