
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from 'src/app/api.client';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';
import { ApiResponse } from 'src/app/models/api-response';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent {
  spinLoader: boolean;
  cateId: number;
  delete_customer: any;
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private api: ApiService,
    private util: UtilsServiceService,
    private toast: ToastrService
  ) { }
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  customer_list: any[] = [];
  persons: any[] = [];
  submitted: any;
  action: 'create' | 'update' = 'create';
  addCustomer: FormGroup;
  form: FormGroup;
  errors: any[] = [];
  companyList: any[] = [];
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      company: [{ value: '', disabled: true }, Validators.required],
      // other controls...
    });
    this.addCustomer = this.formBuilder.group({

      customer_name: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required]],
      gst: [''],
    });
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50],
      destroy: true,
      processing: true
    };
    this.getCustomers();
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
  getCompanyList() {
    this.api.get('api/company/all').subscribe((res: any) => {
      this.companyList = res?.data?.data || [];
    });
  }
  get f() {
    return this.addCustomer.controls;
  }
  getCustomers() {
    if (this.form.invalid) return;
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    const queryParams = new URLSearchParams({
      companyId: companyId,
    }).toString();
    this.api.get(`api/accounting/get_all_customers?${queryParams}`).subscribe((res: ApiResponse<any>) => {
      this.customer_list = Array.isArray(res.data) ? res.data : [res.data];
      this.dtTrigger.next(null);
      if (($.fn.DataTable as any).isDataTable('#customerTable')) {
      }
      this.dtTrigger.next(null); // initialize new
    });
  }
  // open_fileUpload() {
  //   const options = {
  //     windowClass: 'custom-ngb-modal-window',
  //     backdropClass: 'custom-ngb-modal-backdrop',
  //     size: 'md'
  //   };
  //   const modalRef = this.modalService.open(FileUploadComponent, options);
  //   // Pass any additional data you need to display in the modal
  //   // modalRef.componentInstance.userAnswers = this.userAnswers; 
  //   modalRef.result.then(
  //     (data) => {
  //       // Handle modal result
  //     },
  //     (error) => {
  //       if (error === 'Success') {
  //         // Handle success
  //       }
  //     }
  //   );
  // }
  saveCustomer() {
    this.submitted = true;
    if (!this.addCustomer.valid) {
      return;
    }
    this.spinLoader = true;
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    const url = "api/accounting/create_customer";
    const body = {
      "id": 0,
      "company_Id": companyId,
      "customer_Name": this.addCustomer.get("customer_name")?.value,
      "contact_No": this.addCustomer.get("mobile")?.value,
      "Email_Id": this.addCustomer.get("email")?.value,
      "gsT_Number": this.addCustomer.get("gst")?.value,
      "created_At": new Date(),
      "created_By": 0,
      "status": true,
    };
    this.api.post(url, body).subscribe(
      (res: any) => {
        this.addCustomer.reset();
        this.submitted = false;
        this.errors = [];
        this.toast.success('Customer added successfully', 'Success');
        this.spinLoader = false;
        window.location.reload();
        // $('#newModal').modal('hide');
        this.getCustomers();
      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        // this.errors = [error.error.Message];
        this.toast.error(this.errors[0], 'Customer Not added  successfully');
        // const errorMessage = error?.error?.message || 'Customer not added successfully';
        // this.errors = [errorMessage];
        // this.toast.error(errorMessage, 'Error');
        this.spinLoader = false;
      }
    );
  }
  updateById(id: number) {
    this.action = 'update';
    this.cateId = id;
    this.api.get(`api/accounting/customer/${id}`).subscribe(
      (res: any) => {
        if (res && res.data && res.succeeded && res.data.status) {
          this.addCustomer.controls['customer_name'].setValue(res.data.customer_Name);
          this.addCustomer.controls['mobile'].setValue(res.data.contact_No);
          this.addCustomer.controls['email'].setValue(res.data.email_Id);
          this.addCustomer.controls['gst'].setValue(res.data.gsT_Number);
          this.submitted = false;
          this.errors = [];
        }
        this.spinLoader = false;
      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.Message];
        this.toast.error(this.errors[0], 'Customer Not added successfully');
        this.spinLoader = false;
      }
    );
  }
  updateCustomer() {
    this.submitted = true;
    if (!this.addCustomer.valid) {
      return;
    }
    this.spinLoader = true;
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    const url = "api/accounting/update_customer";
    const body = {
      "id": this.cateId,
      "company_Id": companyId,
      "customer_Name": this.addCustomer.get("customer_name")?.value,
      "contact_No": this.addCustomer.get("mobile")?.value,
      "email_Id": this.addCustomer.get("email")?.value,
      "gsT_Number": this.addCustomer.get("gst")?.value,
      "created_At": new Date(),
      "created_By": 0,
      "status": true,
    };
    this.api.put(url, body).subscribe(
      (res: any) => {
        this.addCustomer.reset();
        this.submitted = false;
        this.errors = [];
        this.toast.success('Customer Updated successfully', 'Success');
        this.spinLoader = false;
        // $('#newModal').modal('hide');
        window.location.reload();
        this.getCustomers();
      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.Message];
        this.toast.error(this.errors[0], 'Customer Not Updated successfully');
        this.spinLoader = false;
      }
    );
  }
  deleteCustomer(id: number) {
    Swal.fire({
      position: 'center',
      title: 'Are you sure?',
      text: 'You want to delete this Record.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think'
    }).then((result) => {
      if (result.value) {
        this.api.delete(`api/accounting/delete_customer/${id}`).subscribe(
          (res: any) => {
            this.delete_customer = res
            window.location.reload();
            Swal.fire(
              'Removed!',
              'Item removed successfully.',
              'success'
            )
          })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Item is safe',
          'error'
        )
      }
    })
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
