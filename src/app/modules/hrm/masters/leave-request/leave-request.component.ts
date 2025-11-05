import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';
import { ApiService } from 'src/app/api.client';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ApiResponse } from 'src/app/models/api-response';
declare var bootstrap: any;

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.scss']
})
export class LeaveRequestComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  action: 'create' | 'update' = 'create';
  currentMonth = new Date();
  selectedDate: Date | null = null;
  dates: { date: Date; isOtherMonth: boolean }[] = [];
  weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  showCalendar = false;
  submitted: boolean = false;
  addLeave: FormGroup;
  spinLoader: boolean;
  minDate: Date = new Date();
  fromDate: Date | null = null;
  toDate: Date | null = null;
  leaves_list: any;
  allotment_list: any
  leaveTypes: any;
  errors: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private util: UtilsServiceService,
    private api: ApiService,
    public toast: ToastrService,
  ) { }
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50],
      destroy: true,
      processing: true
    };
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    this.addLeave = this.formBuilder.group({
      emp_id: [''],
      leave_type: ['', [Validators.required]],
      description: ['', [Validators.required]],
      from_date: ['', [Validators.required]],
      to_date: ['', [Validators.required]],
    });
    this.generateCalendar();
    this.getAllotments();
    this.getLeaves();
    this.getPendingLeaves();
  }
  get f() {
    return this.addLeave.controls
  }
  getPendingLeaves() {
    this.api.get('leave/pending/8').subscribe((res: ApiResponse<any>) => {
      this.leaves_list = res;
      this.toast.success('Pending Requests Retrived successfully', 'Success');

    });
  }
  getAllotments() {
    this.api.get('api/admin/leave/allotments/8').subscribe((res: ApiResponse<any>) => {
      this.allotment_list = res;
    });
  }
  onSubmit() {
    console.log('✅ create form submitted');
    this.submitted = true;

    if (this.addLeave.invalid) {
      return;
    }
    this.spinLoader = true;
    const employeeId = this.util.decrypt_Text(localStorage.getItem('employeeId')) || '';

    const body = {
      id: 0,
      employee_Id: 8, // ✅ use decrypted ID dynamically
      leave_Type_Id: this.addLeave.get('leave_type')?.value,
      from_Date: this.addLeave.get('from_date')?.value,
      to_Date: this.addLeave.get('to_date')?.value,
      status: 'pending',
      remarks: this.addLeave.get('description')?.value
    };

    this.api.post('leave/request', body).subscribe({
      next: (res: any) => {
        this.toast.success('Request sent successfully', 'Success');
        // ✅ Reset form
        this.addLeave.reset();
        this.submitted = false;
        this.errors = [];
        this.spinLoader = false;

        // ✅ Close modal
        const modalElement = document.getElementById('LeavesTable');
        if (modalElement) {
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          modalInstance?.hide();
        }

        // ✅ Refresh leave list (no page reload)
        this.getLeaves();
      },
      error: (error: any) => {
        this.submitted = false;
        this.spinLoader = false;
        const errorMessage = error?.error?.message || 'Request not sent successfully';
        this.errors = [errorMessage];
      }
    });
  }
  getLeaves() {
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    const queryParams = new URLSearchParams({
      companyId: companyId,
    }).toString();
    this.api.get(`api/admin/leave/types?${queryParams}`).subscribe((res: ApiResponse<any>) => {
      this.leaveTypes = res;
    });
  }
  generateCalendar() {
    const start = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const end = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);

    const dates = [];
    const startDay = (start.getDay() + 6) % 7; // Make Monday first day
    const totalDays = startDay + end.getDate();

    const prevMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 0);
    const nextMonthStart = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);

    // Fill previous month's dates
    for (let i = startDay - 1; i >= 0; i--) {
      dates.push({
        date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonth.getDate() - i),
        isOtherMonth: true
      });
    }

    // Current month dates
    for (let i = 1; i <= end.getDate(); i++) {
      dates.push({
        date: new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), i),
        isOtherMonth: false
      });
    }

    // Next month dates to fill grid
    const nextDates = 42 - dates.length; // 6 weeks grid
    for (let i = 1; i <= nextDates; i++) {
      dates.push({
        date: new Date(nextMonthStart.getFullYear(), nextMonthStart.getMonth(), i),
        isOtherMonth: true
      });
    }

    this.dates = dates;
  }
  jumpMonths(count: number) {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + count,
      1
    );
    this.generateCalendar();
  }
  prevMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.generateCalendar();
  }

  selectDate(date: Date) {
    this.selectedDate = date;
  }

  isSelected(date: Date): boolean {
    return this.selectedDate?.toDateString() === date.toDateString();
  }

  isDisabled(date: Date): boolean {
    return false;
  }

  isLeaveDate(date: Date): boolean {
    if (!this.fromDate || !this.toDate) return false;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);  // normalize
    return d >= this.fromDate && d <= this.toDate;
  }
}
