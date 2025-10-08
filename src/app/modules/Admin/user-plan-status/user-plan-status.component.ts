
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.client';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { ApiResponse } from 'src/app/models/api-response';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
@Component({
  selector: 'app-user-plan-status',
  templateUrl: './user-plan-status.component.html',
  styleUrls: ['./user-plan-status.component.scss']
})
export class UserPlanStatusComponent implements OnInit, OnDestroy {
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
  companyList: any[] = [];
  bankList: any[] = [];
  planList: any[] = [];
  cateId: any;
  constructor(
    private util: UtilsServiceService,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private toast: ToastrService
  ) {
    this.addPlan = this.formBuilder.group({
      company: ['', [Validators.required]],
      mob_no: ['', [Validators.required]],
      plan_id: ['', [Validators.required]],
      plan_type: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      payment_ref_no: ['', [Validators.required]],
      payment_mode: ['', [Validators.required]],
      bank_name: ['', [Validators.required]],
      chquee_no: ['', [Validators.required]],
      chequee_date: ['', [Validators.required]],
      chequee_status: ['', [Validators.required]]
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
    this.getPlans();
    this.getCompanyList();
    this.getBankList();
    this.getPlansTypes();
  }

  get f() {
    return this.addPlan.controls;
  }
  getCompanyList() {
    this.api.get('api/company/all').subscribe((res: any) => {
      this.companyList = res?.data?.data || [];
    });
  }
  getBankList() {
    this.api.get('api/accounting/banks/all').subscribe((res: ApiResponse<any>) => {
      this.bankList = Array.isArray(res.data) ? res.data : [res.data];
      this.dtTrigger.next(null); // initialize new
    });
  }
  getPlansTypes() {
    this.api.get('api/plans').subscribe((res: any) => {
      this.planList = Array.isArray(res?.data?.data) ? res.data.data : [];
      this.dtTrigger.next(null);
    });
  }
  openNewModal() {
    this.action = 'create';
    this.addPlan.reset(); // reset the form so old values don't stick
  }
  getPlans() {
    this.api.get('api/userplans').subscribe((res: any) => {
      this.plan_list = Array.isArray(res?.data?.data) ? res.data.data : [];
      if (($.fn.DataTable as any).isDataTable('#plansTable')) {
        $('#plansTable').DataTable().clear().destroy();
        this.toast.success('UserPlans Retrived successfully', 'Success');

      }
      this.dtTrigger.next(null);
    });
  }
  savePlan() {
    this.action = 'create';
    console.log('✅ create form submitted');
    this.submitted = true;
    if (!this.addPlan.valid) {
      return;
    }
    this.spinLoader = true;
    const decryptedUserId = this.util.decrypt_Text(localStorage.getItem('id') || '');
    const url = 'api/userplans';
    const body = {
      "id": 0,
      "company_Id": this.addPlan.get('company')?.value,
      "companyName": this.addPlan.get('company')?.value,
      "mobileNumber": this.addPlan.get('mob_no')?.value,
      "plan_Id": this.addPlan.get('plan_id')?.value,
      "plan_Type": this.addPlan.get('plan_type')?.value,
      "start_Date": this.addPlan.get('start_date')?.value,
      "end_Date": this.addPlan.get('end_date')?.value,
      "payment_Ref_No": this.addPlan.get('payment_ref_no')?.value,
      "payment_Mode": this.addPlan.get('payment_mode')?.value,
      "bank_Name": this.addPlan.get('bank_name')?.value,
      "dD_Chq_No": this.addPlan.get('chquee_no')?.value,
      "chq_Date": this.addPlan.get('chequee_date')?.value,
      "chq_Status": this.addPlan.get('chequee_status')?.value,
      "created_By": 0
    };
    this.api.post(url, body).subscribe(
      (res: any) => {
        this.addPlan.reset();
        this.submitted = false;
        this.errors = [];
        this.spinLoader = false;
        this.toast.success('Plan Saved successfully', 'Success');
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
    this.spinLoader = true;

    this.api.get(`api/userplans/${id}`).subscribe(
      (res: any) => {
        if (res?.succeeded && res?.data) {
          const plan = res.data;

          // Convert "MM/dd/yyyy HH:mm:ss" -> "MM/dd/yyyy"
          const formatDate = (dateStr: string) => {
            if (!dateStr) return '';
            return dateStr.split(' ')[0]; // take only date part
          };

          this.addPlan.patchValue({
            company: plan.companyName || '',
            mob_no: plan.mobileNumber || '',
            plan_id: plan.plan_Id || '',
            plan_type: plan.plan_Type || '',
            start_date: formatDate(plan.start_Date),
            end_date: formatDate(plan.end_Date),
            payment_ref_no: plan.payment_Ref_No || '',
            payment_mode: plan.payment_Mode || '',
            bank_name: plan.bank_Name || '',
            chquee_no: plan.dD_Chq_No || '',
            chequee_date: formatDate(plan.chq_Date),
            chequee_status: plan.chq_Status || ''
          });
        } else {
          this.toast.error('Plan not found', 'Error');
        }
        this.spinLoader = false;
      },
      (error: any) => {
        console.error(error);
        this.submitted = false;
        this.errors = [error.error?.Message || 'Something went wrong'];
        this.toast.error(this.errors[0], 'Plan Not Retrieved successfully');
        this.spinLoader = false;
      }
    );
  }


  updatePlan() {
    console.log('✅ Update form submitted');
    this.submitted = true;
    if (!this.addPlan.valid) {
      return;
    }
    this.spinLoader = true;
    const encryptedUserId = localStorage.getItem('id');
    const decryptedUserId = this.util.decrypt_Text(encryptedUserId);
    const url = `api/userplans/${this.cateId}`;
    const body = {
      "id": this.cateId,
      "company_Id": this.addPlan.get('company')?.value,
      "companyName": this.addPlan.get('company')?.value,
      "mobileNumber": this.addPlan.get('mob_no')?.value,
      "plan_Id": this.addPlan.get('plan_id')?.value,
      "plan_Type": this.addPlan.get('plan_type')?.value,
      "start_Date": this.addPlan.get('start_date')?.value,
      "end_Date": this.addPlan.get('end_date')?.value,
      "payment_Ref_No": this.addPlan.get('payment_ref_no')?.value,
      "payment_Mode": this.addPlan.get('payment_mode')?.value,
      "bank_Name": this.addPlan.get('bank_name')?.value,
      "dD_Chq_No": this.addPlan.get('chquee_no')?.value,
      "chq_Date": this.addPlan.get('chequee_date')?.value,
      "chq_Status": this.addPlan.get('chequee_status')?.value,
      "created_By": 0
    };
    this.api.put(url, body).subscribe(
      (res: any) => {
        this.addPlan.reset();
        this.submitted = false;
        this.errors = [];
        this.spinLoader = false;
        this.toast.success('Plans Updated successfully', 'Success');
        $('#newModal').modal('hide');
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
        this.api.delete(`api/userplans/${id}`).subscribe({
          next: (res: any) => {
            Swal.fire('Deleted!', 'The Plan has been deleted.', 'success');
            this.getPlans(); // refresh list without reloading the page
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
