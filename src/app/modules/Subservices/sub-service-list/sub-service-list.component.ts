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
  selector: 'app-sub-service-list',
  templateUrl: './sub-service-list.component.html',
  styleUrls: ['./sub-service-list.component.scss']
})
export class SubServiceListComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  action: 'create' | 'update' = 'create';
  addService: FormGroup;
  form: FormGroup;
  submitted: boolean = false;
  errors: string[] = [];
  spinLoader = false;
  services_list: any[] = [];
  cateId: any;
  groupId: any;
  companyList: any[] = [];
  service_list: any[] = [];
  service_group: any[] = [];
  constructor(
    private modalService: NgbModal,
    private toast: ToastrService,
    private util: UtilsServiceService,
    private formBuilder: FormBuilder,
    private api: ApiService
  ) {
    this.addService = this.formBuilder.group({
      // company: ['', [Validators.required]],
      group_id: ['', [Validators.required]],
      ledgerName: ['', [Validators.required]],
      prise: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      company: [{ value: '', disabled: true }, Validators.required],
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
    this.getServicesGroup();
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
    this.api.get('api/company/all').subscribe(
      (res: any) => {
        this.companyList = res?.data?.data || [];
        this.toast.success('Subservices loaded successfully', 'Success');
      },
      (error) => {
        console.error(error);
        this.toast.error('Failed to load Subservices', 'Error');
      }
    );
  }
  getServicesGroup() {
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
  getServices() {
    if (this.form.invalid) return;
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    const queryParams = new URLSearchParams({
      companyId: companyId,
    }).toString();
    this.api.get(`api/accounting/get_all_services?${queryParams}`).subscribe((res: ApiResponse<any>) => {
      this.services_list = Array.isArray(res.data) ? res.data : [res.data];
      this.dtTrigger.next(null);
      if (($.fn.DataTable as any).isDataTable('#serviceTable')) {
      }
      this.dtTrigger.next(null); // initialize new
    });
  }
  rerenderTable() {
    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next(null);
      });
    } else {
      this.dtTrigger.next(null);
    }
  }

  saveService() {
    console.log('✅ create form submitted');
    this.submitted = true;
    if (!this.addService.valid) {
      return;
    }
    this.spinLoader = true;
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    const url = 'api/accounting/create_service';
    const body = {
      "id": 0,
      "company_Id": companyId,
      "group_Id": this.addService.get('group_id')?.value,
      "ledger_Name": this.addService.get('ledgerName')?.value,
      "need_Approval": true,
      "need_Id": true,
      "opening_Balance": this.addService.get('prise')?.value,
      "txn_Start_Date": new Date(),
      "created_At": new Date(),
      "status": true,

    };
    this.api.post(url, body).subscribe(
      (res: any) => {
        this.addService.reset();
        this.submitted = false;
        this.errors = [];
        this.spinLoader = false;
        this.toast.success('SubService Saved successfully', 'Success');
        $('#newModal').modal('hide');
        window.location.reload();
        this.getServices();
      },
      (error: any) => {
        this.submitted = false;
        this.spinLoader = false;
        const errorMessage = error?.error?.message || 'SubService not added successfully';
        this.errors = [errorMessage];
      }
    );
  }
  updateById(id: number, group_Id: number) {
    this.action = 'update';
    this.cateId = id;
    this.groupId = group_Id;

    this.api.get(`api/accounting/service/${id}?groupId=${group_Id}`).subscribe(
      (res: any) => {
        if (res && Array.isArray(res.data) && res.data.length > 0 && res.succeeded) {
          const service = res.data[0]; // ✅ get the first record
          this.addService.patchValue({
            group_id: service.group_Id,
            ledgerName: service.ledger_Name,
            prise: service.opening_Balance
          });
          this.submitted = false;
          this.errors = [];
        }
        this.spinLoader = false;
      },
      (error: any) => {
        console.error(error);
        this.submitted = false;
        this.errors = [error.error.Message];
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
    const url = 'api/accounting/update_service';
    const body = {
      "id": this.cateId,
      "company_Id": companyId,
      "group_Id": this.addService.get("group_id").value,
      "ledger_Name": this.addService.get("ledgerName").value,
      "created_At": new Date(),
      "status": true,
      "need_Approval": true,
      "need_Id": true,
      "opening_Balance": this.addService.get("prise").value,
      "txn_Start_Date": new Date(),
    };
    this.api.put(url, body).subscribe(
      (res: any) => {
        this.addService.reset();
        this.submitted = false;
        this.errors = [];
        this.toast.success('SubService Updated successfully', 'Success');
        $('#newModal').modal('hide');
        window.location.reload();
        this.spinLoader = false;
        this.getServices();
      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.Message];
        this.toast.error(this.errors[0], 'SubService Not Updated successfully');
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
        this.api.delete(`api/accounting/delete_service/${id}`).subscribe({
          next: (res: any) => {
            Swal.fire('Deleted!', 'The SubService has been deleted.', 'success');
            this.getServices(); // refresh list without reloading the page
            window.location.reload();
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
