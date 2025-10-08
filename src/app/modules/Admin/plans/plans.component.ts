import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.client';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  action: 'create' | 'update' = 'create';
  addPlan: FormGroup;
  form!: FormGroup;
  submitted: boolean = false;
  errors: string[] = [];
  spinLoader = false;
  plan_list: any[] = [];
  cateId: any;
  id: any;
  constructor(
    private util: UtilsServiceService,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private toast: ToastrService
  ) {
    this.addPlan = this.formBuilder.group({
      plan_name: ['', [Validators.required]],
      monthly: ['', [Validators.required]],
      quarterly: ['', [Validators.required]],
      halfyearly: ['', [Validators.required]],
      annaully: ['', [Validators.required]],
    });
  }
  openNewModal() {
    this.action = 'create';
    this.addPlan.reset(); // reset the form so old values don't stick
  }
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50],
      destroy: true,
      processing: true
    };
    this.getPlans();
  }
  get f() {
    return this.addPlan.controls;
  }
  getPlans() {
    this.api.get('api/plans').subscribe((res: any) => {
      this.plan_list = Array.isArray(res?.data?.data) ? res.data.data : [];
      if (($.fn.DataTable as any).isDataTable('#plansTable')) {
        $('#plansTable').DataTable().clear().destroy();
        this.toast.success('Plans Retrieved successfully', 'Success');

      }
      this.dtTrigger.next(null);
    });
  }
  savePlan() {
    console.log('✅ create form submitted');
    this.submitted = true;
    if (!this.addPlan.valid) {
      return;
    }
    this.spinLoader = true;
    const decryptedUserId = this.util.decrypt_Text(localStorage.getItem('id') || '');
    const url = 'api/plans';
    const body = {
      "id": 0,
      "planName": this.addPlan.get('plan_name')?.value,
      "monthly": this.addPlan.get('monthly')?.value,
      "quarterly": this.addPlan.get('quarterly')?.value,
      "halfYearly": this.addPlan.get('halfyearly')?.value,
      "yearly": this.addPlan.get('annaully')?.value,
      "createdBy": 0,
      "status": true
    };
    this.api.post(url, body).subscribe(
      (res: any) => {
        this.addPlan.reset();
        this.submitted = false;
        this.errors = [];
        this.spinLoader = false;
        this.toast.success('Plans Saved successfully', 'Success');
        $('#newModal').modal('hide');
        this.getPlans();

      },
      (error: any) => {
        this.submitted = false;
        this.spinLoader = false;
        const errorMessage = error?.error?.message || 'Plan not added successfully';
        this.errors = [errorMessage];
      }
    );
  }
  updateById(id: number) {
    this.action = 'update';
    this.cateId = id;
    this.api.get(`api/plans/${id}`).subscribe(
      (res: any) => {
        if (res && res.data && res.succeeded && res.data.status) {
          this.addPlan.controls['plan_name'].setValue(res.data.planName);
          this.addPlan.controls['monthly'].setValue(res.data.monthly);
          this.addPlan.controls['quarterly'].setValue(res.data.quarterly);
          this.addPlan.controls['halfyearly'].setValue(res.data.halfYearly);
          this.addPlan.controls['annaully'].setValue(res.data.yearly);
        }
        this.spinLoader = false;
      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.Message];
        this.toast.error(this.errors[0], 'Plan Not added successfully');
        this.spinLoader = false;
      }
    );
  }
  updatePlan() {
    const id=this.cateId;
    console.log('✅ Update form submitted');
    this.submitted = true;
    if (!this.addPlan.valid) {
      return;
    }
    this.spinLoader = true;
    const encryptedUserId = localStorage.getItem('id');
    const decryptedUserId = this.util.decrypt_Text(encryptedUserId);
    const url = `api/plans/${id}`;
    const body = {
      "id": 0,
      "planName": this.addPlan.get('plan_name')?.value,
      "monthly": this.addPlan.get('monthly')?.value,
      "quarterly": this.addPlan.get('quarterly')?.value,
      "halfYearly": this.addPlan.get('halfyearly')?.value,
      "yearly": this.addPlan.get('annaully')?.value,
      "createdBy": 0,
      "status": true
    };
    this.api.put(url, body).subscribe(
      (res: any) => {
        this.addPlan.reset();
        this.submitted = false;
        this.errors = [];
        this.toast.success('Plan Updated successfully', 'Success');
        this.spinLoader = false;
        this.getPlans();

      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.Message];
        this.toast.error(this.errors[0], 'Plan Not Updated successfully');
        this.spinLoader = false;
      }
    );
  }
  deletePlan(id: number) {
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
        this.api.delete(`api/plans/${id}`).subscribe({
          next: (res: any) => {
            Swal.fire('Deleted!', 'The Plan has been deleted.', 'success');
            this.toast.error(this.errors[0], 'Plan Deleted successfully');
            this.getPlans(); // refresh list without reloading the page
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