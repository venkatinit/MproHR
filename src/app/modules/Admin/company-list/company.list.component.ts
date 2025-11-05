import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.client';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { FileUploadComponent } from '../../hrm/masters/file-upload/file-upload.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  company_list: any[] = [];
  page: number = 1;
  RegisterForm: FormGroup;
  limit: number = 10;
  total: number = 0;
  loading = false;
  password: any;
  show = false;
  company_remove: any;
  message: string | undefined;
  errors: string[] = [];
  messages: string[] = [];
  // user: User | undefined;
  submitted: boolean = false;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private api: ApiService,
    private toast: ToastrService,
    private formBuilder: FormBuilder,
    private util: UtilsServiceService,
    private userService: UsersService,
  ) { }
  get f() {
    return this.RegisterForm.controls;
  }
  ngOnInit(): void {
    this.RegisterForm = this.formBuilder.group({
      company_name: ['', [Validators.required]],
      contact_person: ['', [Validators.required]],
      established_date: ['', [Validators.required]],
      mobile_no: ['', [Validators.required]],
      office_mail: ['', [Validators.required]],
      password: ['', [Validators.required]],
      gst: ['', [Validators.required]],
      // ofc_contact_no: [''],
      website: ['', [Validators.required]],
      // address: ['', [Validators.required]],
      // username: ['', [Validators.required]],
    });
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50],
      destroy: true,
      processing: true
    };
    this.getCompanyList();
  }

  getCompanyList() {
    this.api.get(`api/company/all?page=${this.page}&limit=${this.limit}`).subscribe({
      next: (res: any) => {
        this.company_list = res?.data?.data || [];
        this.total = res?.data?.total || 0;
        this.dtTrigger.next(null);
        this.toast.success('Companies Data Retrieved successfully', 'Success');

      },
      error: (err) => {
        console.error('Error fetching companies:', err);
      }
    });
  }

  onClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }

  }
  SaveRegisterForm() {
    this.submitted = true;
    this.errors = [];
    this.messages = [];
    if (!this.RegisterForm.valid) {
      return;
    }
    const url = "api/company/register";
    var body = {
      "id": 0,
      "companyName": this.RegisterForm?.get("company_name")?.value,
      "contactPerson": this.RegisterForm?.get("contact_person")?.value,
      "establishedDate": this.RegisterForm?.get("established_date")?.value,
      "mobileNumber": this.RegisterForm?.get("mobile_no")?.value,
      "email": this.RegisterForm?.get("office_mail")?.value,
      "password": this.RegisterForm.get("password")?.value,
      "website": this.RegisterForm.get("website")?.value,
      "gstNumber": this.RegisterForm.get("gst")?.value,
      // "business_type": this.RegisterForm?.get("business_type")?.value,
      // "ceo": this.RegisterForm?.get("ceo")?.value,
      // "office_contatc_no": this.RegisterForm?.get("ofc_contact_no")?.value,
      // "address": this.RegisterForm?.get("address")?.value,
      // "user_name": this.RegisterForm.get("username")?.value,
      "address": " ",
      "city": " ",
      "stateId": 0,
      "districtId": 0,
      "pincode": " ",
      "logoUrl": " ",
      "location": " ",
      "stampUrl": " ",
      "password_Changed": true
    }
    this.api.register(url, body).subscribe((res: any) => {
      // localStorage.setItem('access_token', this.util.encrypt_Text(res.data?.jwToken) || "")
      // this.userService.current_user = res.data;
      // localStorage.setItem('user_data', this.util.encrypt_Text(res.Data.Email));
      // localStorage.setItem('user_id', this.util.encrypt_Text(res.response.id) || "");
      // localStorage.setItem('currentUser', this.util.encrypt_Text(JSON.stringify(res.response)) || "");
      this.toast.success('Registration Completed successfully', 'Success');
      this.submitted = false;
    },
      (error: any) => {
        console.log(error);
        // this.loaded=false;        
        // this.SpinnerService.hide();
        // console.log("====================")
        this.submitted = false;
        this.errors = [error.error.Message];
        this.toast.error(this.errors[0], "Validation Failed");
        // this.loaded=false;
      }

    );
  }
  // onPageChange(pageNum: number) {
  //   this.page = pageNum;
  //   this.getCompanyList();
  // }
  open_fileUpload(): void {
    const modalRef = this.modalService.open(FileUploadComponent, {
      windowClass: 'custom-ngb-modal-window',
      backdropClass: 'custom-ngb-modal-backdrop',
      size: 'md'
    });

    modalRef.result.then(
      (result) => {
        if (result === 'Success') {
          this.getCompanyList();
        }
      },
      () => {
      }
    );
  }

  updateCompany(i: number): void {
    const Company = this.company_list[i];
    this.router.navigate(['/update-Company'], { state: { Company } });
  }

  deleteCompany(Id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this company record.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {

      if (result.isConfirmed) {
        this.api.delete(`api/company/${Id}`).subscribe({
          next: (res: any) => {
            Swal.fire('Deleted!', 'Company has been deleted.', 'success');
            this.getCompanyList(); // ✅ Reload list without refreshing page
          },
          error: (err) => {
            Swal.fire('Error!', 'Something went wrong.', 'error');
            console.error(err);
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Company is safe.', 'info');
      }
    });
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
