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
  selector: 'app-district',
  templateUrl: './district.component.html',
  styleUrls: ['./district.component.scss']
})
export class DistrictComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  action: 'create' | 'update' = 'create';
  addDistrict: FormGroup;
  submitted: boolean = false;
  errors: string[] = [];
  spinLoader = false;
  district_list: any;
  stateId: any;
  states: any;
  form!: FormGroup;
  cateId: any;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private util: UtilsServiceService,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private toast: ToastrService
  ) {
    this.addDistrict = this.formBuilder.group({
      district: ['', [Validators.required]],
      state: ['', [Validators.required]],

    });
  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      state: ['', Validators.required],  // keep it enabled directly
    });

    // whenever state changes, update district list
    this.form.get('state')?.valueChanges.subscribe((selectedStateId) => {
      if (selectedStateId) {
        this.stateId = selectedStateId;
        this.getDistrict();
      } else {
        this.district_list = []; // reset if no state selected
      }
    });

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50],
      destroy: true,
      processing: true
    };

    this.getState(); // load states initially
  }
  getState() {
    this.api.get('api/admin/get_all_states').subscribe((res: any) => {
      this.states = res;
    });
  }
  isStateFilterVisible: boolean = false;
  toggleStateFilter() {
    this.isStateFilterVisible = !this.isStateFilterVisible;

    const stateControl = this.form.get('state');

    if (this.isStateFilterVisible) {
      stateControl?.enable();
    } else {
      stateControl?.disable();
      stateControl?.setValue('');
      this.district_list = []; // clear districts when hiding filter
    }
  }
  get f() {
    return this.addDistrict.controls;
  }
  
  getDistrict() {
    this.api.get(`api/admin/get_all_district_by_state_id?state_id=${this.stateId}`).subscribe((res: ApiResponse<any>) => {
      this.district_list = res;

      // Destroy existing datatable before re-render
      if (this.dtElement && this.dtElement.dtInstance) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.clear().destroy();   // ✅ clear old rows
          this.dtTrigger.next(null);      // ✅ trigger re-render
        });
      } else {
        this.dtTrigger.next(null); // for first-time load
      }
    });
  }

  saveDistrict() {
    console.log('✅ create form submitted');
    this.submitted = true;
    if (!this.addDistrict.valid) {
      return;
    }
    this.spinLoader = true;
    const decryptedUserId = this.util.decrypt_Text(localStorage.getItem('id') || '');
    const url = 'api/admin/create_district';
    const body = {

      "districtId": 0,
      "stateId": this.addDistrict.get('state')?.value,
      "districtTitle": this.addDistrict.get('district')?.value,
      "status": "In Active"
    };
    this.api.post(url, body).subscribe(
      (res: any) => {
        this.addDistrict.reset();
        this.submitted = false;
        this.errors = [];
        this.spinLoader = false;
        this.toast.success('District Saved successfully', 'Success');
        $('#newModal').modal('hide');
        this.getDistrict();
      },
      (error: any) => {
        this.submitted = false;
        this.spinLoader = false;
        const errorMessage = error?.error?.message || 'State not added successfully';
        this.errors = [errorMessage];
      }
    );
  }
  updateById(districtid: number) {
    this.action = 'update';
    this.cateId = districtid; // Store the selected ID

    const selectedDistrict = this.district_list.find(d => d.districtid === districtid);

    if (selectedDistrict) {
      this.addDistrict.patchValue({
        state: selectedDistrict.state_id,
        district: selectedDistrict.district_title
      });

      this.submitted = false;
      this.errors = [];
    } else {
      console.error('District not found');
    }
  }
  updateDistrict() {
    console.log('✅ Update form submitted');
    this.submitted = true;
    if (!this.addDistrict.valid || !this.cateId) {
      return;
    }
    this.spinLoader = true;
    const url = 'api/admin/update_district';
    const body = {
      districtId: this.cateId,
      stateId: this.addDistrict.get('state')?.value,
      districtTitle: this.addDistrict.get('district')?.value,
      status: 'Active'
    };
    this.api.post(url, body).subscribe(
      (res: any) => {
        this.addDistrict.reset();
        this.submitted = false;
        this.errors = [];
        this.spinLoader = false;
        this.action = 'create';
        this.toast.success('District Updated successfully', 'Success');
        $('#newModal').modal('hide');
        this.getDistrict(); // Refresh list
      },
      (error: any) => {
        console.error(error);
        this.submitted = false;
        this.errors = [error.error?.Message || 'Update failed'];
        this.spinLoader = false;
      }
    );
  }
  deleteDistrict(id: number) {
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
        this.api.delete(`api/accounting/state/delete/${id}`).subscribe({
          next: (res: any) => {
            Swal.fire('Deleted!', 'The state has been deleted.', 'success');
            this.getDistrict(); // refresh list without reloading the page
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

