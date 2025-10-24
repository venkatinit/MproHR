import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';
import { ApiService } from 'src/app/api.client';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
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
  leaves_list: any[] = [];
  get f() {
    return this.addLeave.controls
  }
  constructor(private formBuilder: FormBuilder, private router: Router, private util: UtilsServiceService, private api: ApiService, private modalService: NgbModal, private userService: UsersService,
    public toast: ToastrService) { }
  ngOnInit() {
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    this.addLeave = this.formBuilder.group({
      emp_id: ['', [Validators.required]],
      emp_name: ['', [Validators.required]],
      leave_type: ['', [Validators.required]],
      description: ['', [Validators.required]],
      department: ['', [Validators.required]],
      mbl_no: ['', [Validators.required]],
      from_date: ['', [Validators.required]],
      to_date: ['', [Validators.required]],
    });
    this.generateCalendar();
  }

  jumpMonths(count: number) {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + count,
      1
    );
    this.generateCalendar();
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
  // Leaves Balance
  leaveBalances = [
    { leaveType: 'Casual Leave', available: 5 },
    { leaveType: 'Sick Leave', available: 3 },
    { leaveType: 'Earned Leave', available: 10 },
    { leaveType: 'Maternity Leave', available: 10 },
    { leaveType: 'Paternity Leave', available: 10 },
  ];

  leaveTypes = ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Maternity Leave', 'Paternity Leave'];

  isLeaveDate(date: Date): boolean {
    if (!this.fromDate || !this.toDate) return false;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);  // normalize
    return d >= this.fromDate && d <= this.toDate;
  }
}
