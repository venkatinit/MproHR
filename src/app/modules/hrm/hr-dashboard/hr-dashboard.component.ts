import { Component, ElementRef, OnInit } from '@angular/core';
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ChartData, ChartOptions } from 'chart.js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/api.client';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';

@Component({
  selector: 'app-hr-dashboard',
  templateUrl: './hr-dashboard.component.html',
  styleUrls: ['./hr-dashboard.component.scss']
})
export class HrDashboardComponent implements OnInit {
  employees: any[] = [];
  attendanceData: any[] = [];
  selectedEmployee: string | null = null;
  wagesPeriodFrom = '';
  wagesPeriodTo = '';
  years: number[] = [];

  months = [
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'November', value: 11 },
    { name: 'December', value: 12 }
  ];

  BulkAttendance!: FormGroup;
  viewDate = new Date();
  calendarDays: any[] = [];
  submitted = false;

  barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };

  constructor(
    private fb: FormBuilder,
    private el: ElementRef,
    private api: ApiService,
    private util: UtilsServiceService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    // Default to current month/year
    const currentYear = this.viewDate.getFullYear();
    const currentMonth = this.viewDate.getMonth() + 1;

    this.BulkAttendance = this.fb.group({
      year: [currentYear, Validators.required],
      month: [currentMonth, Validators.required]
    });

    this.generateCalendarDays();
    this.onSubmitBulkAttendance(); // 🔹 Load current month attendance initially
  }

  /** 📅 Build calendar grid for the selected month */
  generateCalendarDays() {
    const start = startOfMonth(this.viewDate);
    const end = endOfMonth(this.viewDate);
    const days = eachDayOfInterval({ start, end });

    const firstDay = days[0].getDay();
    const lastDay = days[days.length - 1].getDay();
    const prepend = Array.from({ length: firstDay }, (_, i) => ({
      date: new Date(start.getFullYear(), start.getMonth(), start.getDate() - (firstDay - i))
    }));
    const append = Array.from({ length: 6 - lastDay }, (_, i) => ({
      date: new Date(end.getFullYear(), end.getMonth(), end.getDate() + (i + 1))
    }));

    this.calendarDays = [...prepend, ...days.map(d => ({ date: d })), ...append];
  }

  /** 🔁 Fetch Attendance Data from API */
  onSubmitBulkAttendance(): void {
    this.submitted = true;
    if (this.BulkAttendance.invalid) return;

    const { year, month } = this.BulkAttendance.value;
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';

    this.api
      .get(`attendance/monthly-summary?month=${month}&year=${year}&companyId=${companyId}`)
      .subscribe({
        next: (res: any) => {
          this.attendanceData = res || [];

          this.employees = this.attendanceData.map(emp => ({
            id: emp.employeeCode,
            name: emp.employeeName,
            department: emp.department
          }));

          this.selectedEmployee = this.selectedEmployee || this.employees[0]?.id || null;

          this.updateWagesPeriod();
          this.updateBarChart();
          this.toast.success('Attendance data fetched successfully!');
        },
        error: (err) => {
          console.error(err);
          this.toast.error('Failed to fetch attendance data');
        }
      });
  }

  /** 🧮 Update wages period display */
  updateWagesPeriod(): void {
    const { month, year } = this.BulkAttendance.value;
    const fromDate = new Date(year, month - 1, 1);
    const toDate = new Date(year, month, 0);

    const formatDate = (d: Date) =>
      `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

    this.wagesPeriodFrom = formatDate(fromDate);
    this.wagesPeriodTo = formatDate(toDate);
  }

  /** 🧠 Map short code (P/A/L/D) to readable */
  mapStatus(code: string): string {
    switch (code) {
      case 'P': return 'Present';
      case 'A': return 'Absent';
      case 'L': return 'Leave';
      case 'D': return 'Delayed';
      default: return '-';
    }
  }

  getEmployeeStatus(empCode: string, date: Date): string {
    const emp = this.attendanceData.find(e => e.employeeCode === empCode);
    if (!emp) return '';
    const dayIndex = date.getDate() - 1;
    const code = emp.days[dayIndex] || '-';
    return this.mapStatus(code);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Present': return '#28a745';
      case 'Absent': return '#fd7400';
      case 'Leave': return '#0d6efd';
      case 'Delayed': return '#fd7e14';
      default: return '#f8f9fa';
    }
  }

  /** ⏪ Previous Month */
  prevMonth() {
    this.viewDate = subMonths(this.viewDate, 1);
    this.updateMonthYearAndFetch();
  }

  /** ⏩ Next Month */
  nextMonth() {
    this.viewDate = addMonths(this.viewDate, 1);
    this.updateMonthYearAndFetch();
  }

  /** 📅 Today (current month) */
  today() {
    this.viewDate = new Date();
    this.updateMonthYearAndFetch();
  }

  /** 🧭 Update form month/year and re-fetch API */
  updateMonthYearAndFetch() {
    const newYear = this.viewDate.getFullYear();
    const newMonth = this.viewDate.getMonth() + 1;
    this.BulkAttendance.patchValue({ year: newYear, month: newMonth });
    this.generateCalendarDays();
    this.onSubmitBulkAttendance();
  }

  /** 📊 Bar chart refresh */
  updateBarChart() {
    if (!this.selectedEmployee) return;

    const emp = this.attendanceData.find(e => e.employeeCode === this.selectedEmployee);
    if (!emp) return;

    const statusCounts = { Present: 0, Absent: 0, Leave: 0, Delayed: 0 };
    emp.days.forEach(code => {
      const status = this.mapStatus(code);
      if (status in statusCounts) statusCounts[status]++;
    });

    this.barChartData = {
      labels: ['Present', 'Absent', 'Leave', 'Delayed'],
      datasets: [
        {
          data: [
            statusCounts.Present,
            statusCounts.Absent,
            statusCounts.Leave,
            statusCounts.Delayed
          ],
          backgroundColor: ['#28a745', '#fd7400', '#0d6efd', '#fd7e14'],
          borderRadius: 6
        }
      ]
    };
  }

  onEmployeeChange() {
    this.updateBarChart();
  }
}
