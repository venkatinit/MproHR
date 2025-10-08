
import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
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
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  action: 'create' | 'update' = 'create';
  addAttendance: FormGroup;
  form!: FormGroup;
  submitted: boolean = false;
  errors: string[] = [];
  spinLoader = false;
  attendance_list: any[] = [];
  cateId: any;
  companyList: any[] = [];
  companyFilter: string = '';
  originalBankList: any[] = [];
  filteredBankList: any[] = [];
  companyId: number = 2;
  EmployeeList: any;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  uploadType: string = '';
  excelData: any[] = [];
  constructor(
    private modalService: NgbModal,
    private toast: ToastrService,
    private util: UtilsServiceService,
    private formBuilder: FormBuilder,
    private api: ApiService
  ) {
    this.addAttendance = this.formBuilder.group({
      employeeId: ['', [Validators.required]],
      date: ['', [Validators.required]],
      status: ['', [Validators.required]],
      remarks: ['', [Validators.required]],
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
    this.getAttendance();
    this.getCompanyList();
    this.getEmployeeList();

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
    return this.addAttendance.controls;
  }
  getCompanyList() {
    this.api.get('api/company/all').subscribe((res: any) => {
      this.companyList = res?.data?.data || [];
    });
  }
  getEmployeeList() {
    this.api.get('api/company/all').subscribe((res: any) => {
      this.EmployeeList = res?.data?.data || [];
    });
  }
  filterAttendance() {
    const search = this.companyFilter.trim().toLowerCase();
    this.filteredBankList = this.originalBankList.filter(bank =>
      bank.companyName?.toLowerCase().includes(search)
    );
  }
  getAttendance() {
    const statusQuery = this.companyId; // Get the current selected status
    this.api.get('attendance/1/08-19-2025').subscribe((res: ApiResponse<any>) => {
      this.attendance_list = Array.isArray(res.data) ? res.data : [res.data];
      this.dtTrigger.next(null);
      if (($.fn.DataTable as any).isDataTable('#attendanceTable')) {
      }
      this.dtTrigger.next(null); // initialize new
    });
  }
  saveAttendance() {
    console.log('✅ create form submitted');
    this.submitted = true;
    if (!this.addAttendance.valid) {
      return;
    }
    this.spinLoader = true;
    const decryptedUserId = this.util.decrypt_Text(localStorage.getItem('id') || '');
    const url = 'attendance';
    const body = {
      "id": 0,
      "employeeId": this.addAttendance.get('employeeId')?.value,
      "date": this.addAttendance.get('date')?.value,
      "status": this.addAttendance.get('status')?.value,
      "remarks": this.addAttendance.get('remarks')?.value,
    };
    this.api.post(url, body).subscribe(
      (res: any) => {
        this.addAttendance.reset();
        this.submitted = false;
        this.errors = [];
        this.spinLoader = false;
        this.toast.success('Attendance Saved successfully', 'Success');
        $('#newModal').modal('hide');
        this.getAttendance();
      },
      (error: any) => {
        this.submitted = false;
        this.spinLoader = false;
        const errorMessage = error?.error?.message || 'Attendance not added successfully';
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
          this.addAttendance.controls['company'].setValue(res.data.company_Id);
          this.addAttendance.controls['bank_name'].setValue(res.data.bank_Name);
          this.addAttendance.controls['branch_name'].setValue(res.data.branch);
          this.addAttendance.controls['bank_address'].setValue(res.data.address);
          this.addAttendance.controls['account_number'].setValue(res.data.account_Number);
          this.addAttendance.controls['account_type'].setValue(res.data.account_Type);
          this.addAttendance.controls['bm_name'].setValue(res.data.bM_Name);
          this.addAttendance.controls['bm_contact_no'].setValue(res.data.bM_Contact_No);
          this.addAttendance.controls['opening_Balance'].setValue(res.data.opening_Balance);
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
  updateAttendance() {
    console.log('✅ Update form submitted');
    this.submitted = true;
    if (!this.addAttendance.valid) {
      return;
    }
    this.spinLoader = true;
    const encryptedUserId = localStorage.getItem('id');
    const decryptedUserId = this.util.decrypt_Text(encryptedUserId);
    const url = "api/accounting/update_bank";
    const body = {
      "id": this.cateId,
      "company_Id": this.addAttendance.get("company").value,
      "bank_Name": this.addAttendance.get("bank_name").value,
      "branch": this.addAttendance.get("branch_name").value,
      "address": this.addAttendance.get("bank_address").value,
      "account_Number": this.addAttendance.get("account_number").value,
      "account_Type": this.addAttendance.get("account_type").value,
      "bM_Name": this.addAttendance.get("bm_name").value,
      "bM_Contact_No": this.addAttendance.get("bm_contact_no").value,
      "branch_Contact_No": " ",
      "opening_Balance": this.addAttendance.get("opening_Balance").value,
      "txn_Start_Date": new Date(),
      "created_At": new Date(),
      "status": true
    };
    this.api.put(url, body).subscribe(
      (res: any) => {
        this.addAttendance.reset();
        this.submitted = false;
        this.errors = [];
        this.toast.success('Bank Updated successfully', 'Success');
        this.spinLoader = false;
        $('#newModal').modal('hide');
        this.getAttendance();
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
  deleteAttendance(id: number) {
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
            this.getAttendance(); // refresh list without reloading the page
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
  triggerFileInput(type: string) {
    this.uploadType = type;
    this.fileInput.nativeElement.click();
  }
  onFileSelected(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    const url = "attendance/bulk";
    if (target.files.length !== 1) {
      console.error('Please upload only one file');
      return;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      // get first sheet
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      // convert to json
      this.excelData = XLSX.utils.sheet_to_json(ws, { header: 1 });

      // format data to API structure
      const formattedRecords = this.excelData.slice(1).map((row: any) => ({
        id: row[0] || 0,
        employeeId: row[1] || 0,
        date: row[2] || new Date().toISOString(),
        status: row[3] || 'Present',
        remarks: row[4] || ''
      }));
      const payload = {
        date: new Date().toISOString(),
        records: formattedRecords
      };

      console.log('Payload ready:', payload);

      // Call API directly here
      this.api.post(url, payload).subscribe({
        next: (res) => console.log('Upload success', res),
        error: (err) => console.error('Upload failed', err)
      });
    };
    reader.readAsBinaryString(target.files[0]);
  }
}
