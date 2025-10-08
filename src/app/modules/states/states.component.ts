import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.client';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { ApiResponse } from 'src/app/models/api-response';
declare var $: any;
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.scss']
})
export class StatesComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  action: 'create' | 'update' = 'create';
  addState: FormGroup;
  submitted: boolean = false;
  errors: string[] = [];
  spinLoader = false;
  state_list: any;
  cateId: any;
  constructor(
    private util: UtilsServiceService,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private toast:ToastrService
  ) {
    this.addState = this.formBuilder.group({
      state_name: ['', [Validators.required]],
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
    this.getAllStates();
  }
  get f() {
    return this.addState.controls;
  }
  getAllStates() {
    this.api.get('api/admin/get_all_states').subscribe((res: ApiResponse<any>) => {
      this.state_list = res;
      this.dtTrigger.next(null);
      if (($.fn.DataTable as any).isDataTable('#stateTable')) {
      }
      this.dtTrigger.next(null); // initialize new
    });
  }
  saveState() {
    console.log('✅ create form submitted');
    this.submitted = true;
    if (!this.addState.valid) {
      return;
    }
    this.spinLoader = true;
    const decryptedUserId = this.util.decrypt_Text(localStorage.getItem('id') || '');
    const url = 'api/admin/create_state';
    const body = {
      "stateId": 0,
      "stateName": this.addState.get('state_name')?.value,
      "status": "Active",
    };
    this.api.post(url, body).subscribe(
      (res: any) => {
        this.addState.reset();
        this.submitted = false;
        this.errors = [];
        this.spinLoader = false;
        this.toast.success('State Saved successfully', 'Success');
        $('#newModal').modal('hide');
        this.getAllStates();
      },
      (error: any) => {
        this.submitted = false;
        this.spinLoader = false;
        const errorMessage = error?.error?.message || 'State not added successfully';
        this.errors = [errorMessage];
      }
    );
  }
  updateById(state_id: number) {
    this.action = 'update';
    this.cateId = state_id; 
    const selectedDistrict = this.state_list.find(d => d.state_id === state_id);
    if (selectedDistrict) {
      this.addState.patchValue({
        state: selectedDistrict.state_id,
      });

      this.submitted = false;
      this.errors = [];
    } else {
      console.error('State not found');
    }
  }
  updateState() {
    console.log('✅ Update form submitted');
    this.submitted = true;

    if (!this.addState.valid || !this.cateId) {
      return;
    }

    this.spinLoader = true;

    const url = 'api/admin/update_state';
    const body = {
      stateId: this.cateId,
      stateName: this.addState.get("state_name")?.value,
      status: "Active"
    };

    this.api.post(url, body).subscribe(
      (res: any) => {
        this.addState.reset();
        this.submitted = false;
        this.errors = [];
        this.spinLoader = false;
        this.action = 'create';
        this.toast.success('State Updated successfully', 'Success');
        $('#newModal').modal('hide');
        this.getAllStates(); // Refresh list
      },
      (error: any) => {
        console.error(error);
        this.submitted = false;
        this.errors = [error.error?.Message || 'Update failed'];
        this.spinLoader = false;
      }
    );
  }
  deleteState(id: number) {
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
        this.api.delete(`api/admin/state/delete/${id}`).subscribe({
          next: (res: any) => {
            Swal.fire('Deleted!', 'The state has been deleted.', 'success');
            this.getAllStates(); // refresh list without reloading the page
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
