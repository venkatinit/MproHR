import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.client';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { ApiResponse } from 'src/app/models/api-response';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
import { Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-org-tickets',
  templateUrl: './org-tickets.component.html',
  styleUrls: ['./org-tickets.component.scss']
})
export class OrgTicketsComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  action: 'create' | 'update' = 'create';
  addreply: FormGroup;
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
  editor!: Editor;   // ngx-editor instance
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4'] }],
    ['link', 'image'],
    ['align_left', 'align_center', 'align_right'],
  ];
  showReplyForm = false;
  toggleReplyForm() {
    this.showReplyForm = !this.showReplyForm;
  }
  constructor(
    private modalService: NgbModal,
    private toast: ToastrService,
    private util: UtilsServiceService,
    private formBuilder: FormBuilder,
    private api: ApiService
  ) {
    this.addreply = this.formBuilder.group({
      // company: ['', [Validators.required]],
      bank_name: ['', [Validators.required]],
      branch_name: ['', [Validators.required]],
      bank_address: ['', [Validators.required]],
      account_number: ['', [Validators.required]],
      account_type: ['', [Validators.required]],
      bm_name: ['', [Validators.required]],
      bm_contact_no: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      txn_Start_Date: ['', [Validators.required]],
      opening_Balance: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.editor = new Editor();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50],
      destroy: true,
      processing: true
    };
    this.getBanks();
    this.getCompanyList();

  }
  // Search Filter starts
  searchTerm = '';
  documents = [
    {
      id: 'E1M1P1R1O',
      name: 'Venkatesh',
      profileImage: 'assets/img/profile-img.jpg',
      timeAgo: '2 mins ago',
      subject: 'Help needed for payment failure',
      message: 'Hi, I faced an issue with payment processing. Please look into it urgently.',
      status: 'Open',
      priority: 'High',
      team: 'Development Team'
    },
    {
      id: 'E1M1P1R2O',
      name: 'Priya',
      profileImage: 'assets/img/profile-img.jpg',
      timeAgo: '10 mins ago',
      subject: 'Request for access to HR portal',
      message: 'I am unable to log in to the HR portal, kindly help me reset my credentials.',
      status: 'Pending',
      priority: 'Medium',
      team: 'HR Department'
    },
    {
      id: 'E1M1P1R3O',
      name: 'Rahul',
      profileImage: 'assets/img/profile-img.jpg',
      timeAgo: '30 mins ago',
      subject: 'Bug in employee registration form',
      message: 'There is a validation issue in the registration form when entering mobile numbers.',
      status: 'In Progress',
      priority: 'High',
      team: 'Frontend Team'
    }
  ]

  filteredDocuments = [...this.documents];
  selectedDoc: any = null;

  filterDocuments() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredDocuments = this.documents.filter(doc =>
      doc.id.toLowerCase().includes(term)
    );
  }
  selectDocument(doc: any) {
    this.selectedDoc = doc;
  }
  get f() {
    return this.addreply.controls;
  }
  getCompanyList() {
    this.api.get('api/company/all').subscribe((res: any) => {
      this.companyList = res?.data?.data || [];
    });
  }
  getBanks() {
    if (this.addreply.invalid) return;
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    const queryParams = new URLSearchParams({
      companyId: companyId,
    }).toString();
    this.api.get(`api/accounting/banks/all?${queryParams}`).subscribe((res: ApiResponse<any>) => {
      this.banks_list = Array.isArray(res.data) ? res.data : [res.data];
      this.dtTrigger.next(null);
      if (($.fn.DataTable as any).isDataTable('#bankTable')) {
      }
      this.dtTrigger.next(null); // initialize new
    });
  }
  submit() {
    console.log('✅ create form submitted');
    this.submitted = true;
    if (!this.addreply.valid) {
      return;
    }
    this.spinLoader = true;
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    const url = 'api/accounting/create_bank';
    const body = {
      id: 0,
      company_Id: companyId,
      bank_Name: this.addreply.get('bank_name')?.value,
      branch: this.addreply.get('branch_name')?.value,
      address: this.addreply.get('bank_address')?.value,
      account_Number: this.addreply.get('account_number')?.value,
      account_Type: this.addreply.get('account_type')?.value,
      bM_Name: this.addreply.get('bm_name')?.value,
      bM_Contact_No: this.addreply.get('bm_contact_no')?.value,
      branch_Contact_No: '',
      opening_Balance: this.addreply.get('opening_Balance')?.value,
      txn_Start_Date: new Date(),
      created_At: new Date(),
      status: true,
    };
    this.api.post(url, body).subscribe(
      (res: any) => {
        this.addreply.reset();
        this.submitted = false;
        this.errors = [];
        this.spinLoader = false;
        this.toast.success('Bank Saved successfully', 'Success');
        $('#newModal').modal('hide');
        this.getBanks();
        window.location.reload();
      },
      (error: any) => {
        this.submitted = false;
        this.spinLoader = false;
        const errorMessage = error?.error?.message || 'Bank not added successfully';
        this.errors = [errorMessage];
      }
    );
  }
  updateById(id: number) {
    this.action = 'update';
    this.cateId = id;

    this.api.get(`api/accounting/bank/${id}`).subscribe(
      (res: any) => {
        if (res && res.data && res.succeeded && res.data.status) {
          this.addreply.controls['bank_name'].setValue(res.data.bank_Name);
          this.addreply.controls['branch_name'].setValue(res.data.branch);
          this.addreply.controls['bank_address'].setValue(res.data.address);
          this.addreply.controls['account_number'].setValue(res.data.account_Number);
          this.addreply.controls['account_type'].setValue(res.data.account_Type);
          this.addreply.controls['bm_name'].setValue(res.data.bM_Name);
          this.addreply.controls['bm_contact_no'].setValue(res.data.bM_Contact_No);
          this.addreply.controls['opening_Balance'].setValue(res.data.opening_Balance);
          this.submitted = false;
          this.errors = [];
        }
        this.spinLoader = false;
      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.Message];
        this.toast.error(this.errors[0], 'Bank Not added successfully');
        this.spinLoader = false;
      }
    );
  }
  updateBank() {
    console.log('✅ Update form submitted');
    this.submitted = true;
    if (!this.addreply.valid) {
      return;
    }
    this.spinLoader = true;
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    const url = "api/accounting/update_bank";
    const body = {
      "id": this.cateId,
      "company_Id": companyId,
      "bank_Name": this.addreply.get("bank_name").value,
      "branch": this.addreply.get("branch_name").value,
      "address": this.addreply.get("bank_address").value,
      "account_Number": this.addreply.get("account_number").value,
      "account_Type": this.addreply.get("account_type").value,
      "bM_Name": this.addreply.get("bm_name").value,
      "bM_Contact_No": this.addreply.get("bm_contact_no").value,
      "branch_Contact_No": " ",
      "opening_Balance": this.addreply.get("opening_Balance").value,
      "txn_Start_Date": new Date(),
      "created_At": new Date(),
      "status": true
    };
    this.api.put(url, body).subscribe(
      (res: any) => {
        this.addreply.reset();
        this.submitted = false;
        this.errors = [];
        this.toast.success('Bank Updated successfully', 'Success');
        this.spinLoader = false;
        // window.location.reload();
        $('#newModal').modal('hide');
        this.getBanks();
      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.Message];
        this.toast.error(this.errors[0], 'Bank Not Updated successfully');
        this.spinLoader = false;
      }
    );
  }
  deleteBank(id: number) {
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
        this.api.delete(`api/accounting/bank/delete/${id}`).subscribe({
          next: (res: any) => {
            Swal.fire('Deleted!', 'The bank has been deleted.', 'success');
            window.location.reload();
            this.getBanks(); // refresh list without reloading the page
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
