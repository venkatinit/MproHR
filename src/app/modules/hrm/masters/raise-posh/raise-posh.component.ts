import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.client';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { ApiResponse } from 'src/app/models/api-response';
import { ToastrService } from 'ngx-toastr';
import jsPDF from 'jspdf';
declare var $: any;
@Component({
  selector: 'app-raise-posh',
  templateUrl: './raise-posh.component.html',
  styleUrls: ['./raise-posh.component.scss']
})
export class RaisePoshComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  action: 'create' | 'update' = 'create';
  poshForm: FormGroup;
  form: FormGroup;
  submitted: boolean = false;
  errors: string[] = [];
  spinLoader = false;
  posh_list: any[] = [];
  cateId: any;
  companyList: any[] = [];
  companyId: number = 2;
  constructor(
    private toast: ToastrService,
    private util: UtilsServiceService,
    private formBuilder: FormBuilder,
    private api: ApiService
  ) {
    this.poshForm = this.formBuilder.group({
      respondentName: ['', [Validators.required]],
      incidentDate: ['', [Validators.required]],
      time: ['', [Validators.required]],
      incident_place: ['', [Validators.required]],
      description: ['', [Validators.required]],
      witness: ['', [Validators.required]],
      evidense: ['', [Validators.required]],
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
    this.getPosh();
  }
  get f() {
    return this.poshForm.controls;
  }
  getCompanyList() {
    this.api.get('api/company/all').subscribe((res: any) => {
      this.companyList = res?.data?.data || [];
    });
  }
  getPosh() {
    if (this.form.invalid) return;
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    const queryParams = new URLSearchParams({
      companyId: companyId,
    }).toString();
    this.api.get(`api/accounting/banks/all?${queryParams}`).subscribe((res: ApiResponse<any>) => {
      this.posh_list = Array.isArray(res.data) ? res.data : [res.data];
      this.dtTrigger.next(null);
      if (($.fn.DataTable as any).isDataTable('#bankTable')) {
      }
      this.dtTrigger.next(null);
    });
  }
  savePosh() {
    if (this.poshForm.invalid) {
      alert('Please fill all required fields');
      return;
    }

    const formData = this.poshForm.value;
    this.generatePoshComplaintPDF(formData);
  }
  // savePosh() {
  //   console.log('✅ create form submitted');
  //   this.submitted = true;
  //   if (!this.poshForm.valid) {
  //     return;
  //   }
  //   this.spinLoader = true;
  //   const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
  //   const url = 'api/accounting/create_bank';
  //   const body = {
  //     id: 0,
  //     employee_Id: companyId,
  //     employee_name: this.poshForm.get('employee_name')?.value,
  //     employee_department: this.poshForm.get('employee_department')?.value,
  //     respondentName: this.poshForm.get('respondentName')?.value,
  //     incidentDate: this.poshForm.get('incidentDate')?.value,
  //     time: this.poshForm.get('time')?.value,
  //     incident_place: this.poshForm.get('incident_place')?.value,
  //     description: this.poshForm.get('description')?.value,
  //     evidense: this.poshForm.get('description')?.value,
  //     witness: this.poshForm.get('witness')?.value,
  //   };
  //   this.api.post(url, body).subscribe(
  //     (res: any) => {
  //       this.poshForm.reset();
  //       this.submitted = false;
  //       this.errors = [];
  //       this.spinLoader = false;
  //       this.toast.success('Bank Saved successfully', 'Success');
  //       $('#newModal').modal('hide');
  //       this.getPosh();
  //       window.location.reload();
  //     },
  //     (error: any) => {
  //       this.submitted = false;
  //       this.spinLoader = false;
  //       const errorMessage = error?.error?.message || 'Bank not added successfully';
  //       this.errors = [errorMessage];
  //     }
  //   );
  // }
  updateById(id: number) {
    this.action = 'update';
    this.cateId = id;

    this.api.get(`api/accounting/bank/${id}`).subscribe(
      (res: any) => {
        if (res && res.data && res.succeeded && res.data.status) {
          this.poshForm.controls['bank_name'].setValue(res.data.bank_Name);
          this.poshForm.controls['branch_name'].setValue(res.data.branch);
          this.poshForm.controls['bank_address'].setValue(res.data.address);
          this.poshForm.controls['account_number'].setValue(res.data.account_Number);
          this.poshForm.controls['account_type'].setValue(res.data.account_Type);
          this.poshForm.controls['bm_name'].setValue(res.data.bM_Name);
          this.poshForm.controls['bm_contact_no'].setValue(res.data.bM_Contact_No);
          this.poshForm.controls['opening_Balance'].setValue(res.data.opening_Balance);
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
  updatePosh() {
    console.log('✅ Update form submitted');
    this.submitted = true;
    if (!this.poshForm.valid) {
      return;
    }
    this.spinLoader = true;
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    const url = "api/accounting/update_bank";
    const body = {
      "id": this.cateId,
      "company_Id": companyId,
      "bank_Name": this.poshForm.get("bank_name").value,
      "branch": this.poshForm.get("branch_name").value,
      "address": this.poshForm.get("bank_address").value,
      "account_Number": this.poshForm.get("account_number").value,
      "account_Type": this.poshForm.get("account_type").value,
      "bM_Name": this.poshForm.get("bm_name").value,
      "bM_Contact_No": this.poshForm.get("bm_contact_no").value,
      "branch_Contact_No": " ",
      "opening_Balance": this.poshForm.get("opening_Balance").value,
      "txn_Start_Date": new Date(),
      "created_At": new Date(),
      "status": true
    };
    this.api.put(url, body).subscribe(
      (res: any) => {
        this.poshForm.reset();
        this.submitted = false;
        this.errors = [];
        this.toast.success('Bank Updated successfully', 'Success');
        this.spinLoader = false;
        // window.location.reload();
        $('#newModal').modal('hide');
        this.getPosh();
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
  deletePosh(id: number) {
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
            this.getPosh(); // refresh list without reloading the page
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

  generatePoshComplaintPDF(formData: any) {
    const doc = new jsPDF();
    const content = `
    To,
    The Internal Committee (POSH)
    ${formData.companyName}
    Subject: Formal Complaint under the POSH Policy
    Dear Members,
    I, ${formData.complainantName}, working as ${formData.designation} in the ${formData.department} department, wish to formally lodge a complaint under the POSH Act, 2013.
    Details of the incident:
    Respondent’s Name: ${formData.respondentName}
    Respondent’s Designation: ${formData.department}
    Date of Incident: ${formData.incidentDate}
    Time of Incident: ${formData.time}
    Place: ${formData.incidentPlace}

    Description of Incident:
    ${formData.description}

    Witnesses: ${formData.witness || 'None'}
    Evidence: ${formData.evidense || 'None'}

    Preferred Action: ${formData.preferredAction || 'As per POSH policy'}

    Sincerely,
    ${formData.complainantName}
    Date: ${new Date().toLocaleDateString()}
        `;
    const splitText = doc.splitTextToSize(content, 180);
    doc.text(splitText, 15, 20);
    doc.save(`POSH_Complaint_${formData.complainantName}.pdf`);
  }
}
