import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.client';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';
import { DataTableDirective } from 'angular-datatables';
import { ApiResponse } from 'src/app/models/api-response';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  action: 'create' | 'update' = 'create';
  addService: FormGroup;
  form: FormGroup;
  submitted: boolean = false;
  errors: string[] = [];
  spinLoader = false;
  service_list: any[] = [];
  cateId: any;
  companyList: any[] = [];
  constructor(
    private toast: ToastrService,
    private util: UtilsServiceService,
    private formBuilder: FormBuilder,
    private api: ApiService
  ) {
    this.addService = this.formBuilder.group({
      service_name: ['', [Validators.required]],
      // company: ['', [Validators.required]],
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
    this.getServices();
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
    return this.addService.controls;
  }
  getCompanyList() {
    this.api.get('api/company/all').subscribe((res: any) => {
      this.companyList = res?.data?.data || [];
    });
  }
  getServices() {
    if (this.form.invalid) return;
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    const queryParams = new URLSearchParams({
      companyId: companyId,
    }).toString();
    this.api.get(`api/accounting/get_service_groups?${queryParams}`).subscribe((res: ApiResponse<any>) => {
      this.service_list = Array.isArray(res.data) ? res.data : [res.data];
      this.dtTrigger.next(null);
      if (($.fn.DataTable as any).isDataTable('#serviceTable')) {
      }
      this.dtTrigger.next(null); // initialize new
    });
  }
  saveService() {
    this.submitted = true;
    if (!this.addService.valid) {
      return;
    }
    this.spinLoader = true;
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    const url = 'api/accounting/create_service_group';
    const body = {
      id: 0,
      company_Id: companyId,
      group_Name: this.addService.get('service_name')?.value,
      created_at: new Date(),
      status: true,
    };
    this.api.post(url, body).subscribe(
      (res: any) => {
        this.addService.reset();
        this.submitted = false;
        this.errors = [];
        this.spinLoader = false;
        this.toast.success('Service Saved successfully', 'Success');
        window.location.reload();
        // $('#newModal').modal('hide');
        this.getServices();
      },
      (error: any) => {
        this.submitted = false;
        this.spinLoader = false;
        const errorMessage = error?.error?.message || 'Service not added successfully';
        this.errors = [errorMessage];
      }
    );
  }
  updateById(id: number) {
    this.action = 'update';
    this.cateId = id;
    this.api.get(`api/accounting/get_service_group_by_id/${id}`).subscribe(
      (res: any) => {
        if (res && res.data && res.succeeded && res.data.status) {
          // this.addService.controls['company'].setValue(res.data.company_Id);
          this.addService.controls['service_name'].setValue(res.data.group_Name);
          this.submitted = false;
          this.errors = [];
        }
        this.spinLoader = false;
      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.Message];
        this.toast.error(this.errors[0], 'Service Not added successfully');
        this.spinLoader = false;
      }
    );
  }
  updateService() {
    console.log('✅ Update form submitted');
    this.submitted = true;
    if (!this.addService.valid) {
      return;
    }
    this.spinLoader = true;
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    const url = "api/accounting/update_service_group";
    const body = {
      "id": this.cateId,
      "company_Id": companyId,
      "group_Name": this.addService.get("service_name").value,
      "created_At": new Date(),
      "status": true
    };
    this.api.put(url, body).subscribe(
      (res: any) => {
        this.addService.reset();
        this.submitted = false;
        this.errors = [];
        this.toast.success('Service Updated successfully', 'Success');
        this.spinLoader = false;
        window.location.reload();
        this.getServices();
      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.Message];
        this.toast.error(this.errors[0], 'Service Not Updated successfully');
        this.spinLoader = false;
      }
    );
  }
  deleteService(id: number) {
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
        this.api.delete(`api/accounting/delete_service_group/${id}`).subscribe({
          next: (res: any) => {
            Swal.fire('Deleted!', 'The Service has been deleted.', 'success');
            window.location.reload();
            this.getServices(); // refresh list without reloading the page
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
