import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.client';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-bulk-attendance',
  templateUrl: './bulk-attendance.component.html',
  styleUrls: ['./bulk-attendance.component.scss']
})
export class BulkAttendanceComponent implements OnInit, AfterViewInit {
  BulkAttendance!: FormGroup;
  submitted = false;
  attendanceData: any[] = [];
  modalInstance: any;
  years: number[] = [];
  wagesPeriodFrom = '';
  wagesPeriodTo = '';
  establishmentName = 'MPROHR Pvt Ltd';
  directorName = 'John Doe';
  linNo = 'LIN123456';

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

  constructor(
    private fb: FormBuilder,
    private el: ElementRef,
    private api: ApiService,
    private util: UtilsServiceService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.BulkAttendance = this.fb.group({
      year: ['', Validators.required],
      month: ['', Validators.required]
    });

    // Populate year list (5 years back and ahead)
    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 5; y <= currentYear + 5; y++) {
      this.years.push(y);
    }
  }

  ngAfterViewInit(): void {
    const modalElement = this.el.nativeElement.querySelector('#bulkAttendance');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });
      // Auto-show modal
      this.modalInstance.show();
      // Clear backdrop on modal close
      modalElement.addEventListener('hidden.bs.modal', () => {
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(b => b.remove());
        document.body.classList.remove('modal-open');
        document.body.style.overflow = ''; // Restore scroll
      });
    }
  }

  // 🟢 Update wages period when user selects month/year
  updateWagesPeriod(): void {
    const { month, year } = this.BulkAttendance.value;
    if (month && year) {
      const fromDate = new Date(year, month - 1, 1);
      const toDate = new Date(year, month, 0);
      // ✅ Format as dd/mm/yyyy
      const formatDate = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };
      this.wagesPeriodFrom = formatDate(fromDate);
      this.wagesPeriodTo = formatDate(toDate);
    } else {
      this.wagesPeriodFrom = '';
      this.wagesPeriodTo = '';
    }
  }

  get g() {
    return this.BulkAttendance.controls;
  }

  getMonthName(month: number): string {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month - 1];
  }

  // 🟢 Submit and load attendance data
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
          this.updateWagesPeriod();
          this.toast.success('Attendance data fetched successfully!');
          if (this.modalInstance) this.modalInstance.hide();
        },
        error: (err) => {
          console.error(err);
          this.toast.error('Failed to fetch attendance data');
        }
      });
  }

  // 🟢 Export to Excel
  exportToExcel() {
    if (this.attendanceData.length === 0) {
      this.toast.warning('No attendance data to export.');
      return;
    }

    const { month, year } = this.BulkAttendance.value;
    const monthName = this.getMonthName(month);

    const ws_data: any[][] = [];

    // Row 1 - Form D
    ws_data.push(['Form D']);

    // Row 2 - Attendance Register with Month/Year
    ws_data.push([`Attendance Register - ${monthName} ${year}`]);

    // Row 3 - Establishment Details
    ws_data.push([
      `Establishment Name: ${this.establishmentName}`,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      `Director Name: ${this.directorName}`,
      '',
      '',
      '',
      '',
      '',
      '',
      `LIN No: ${this.linNo}`,
      '',
      '',
      '',
      '',
      '',
      '',
      `Wages Period From: ${this.wagesPeriodFrom}`,
      '',
      '',
      '',
      '',
      '',
      '',
      `Wages Period To: ${this.wagesPeriodTo}`,
      '',
      '',
      '',
      '',
    ]);

    // Row 4 - Table headers
    const header = ['Employee Code', 'Employee Name', 'Department'];
    for (let i = 1; i <= 31; i++) {
      header.push(`${i}`);
    }
    ws_data.push(header);

    // Employee rows
    this.attendanceData.forEach((emp) => {
      const row = [emp.employeeCode, emp.employeeName, emp.department, ...emp.days];
      ws_data.push(row);
    });

    // Create worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(ws_data);

    // Merge headers
    ws['!merges'] = [
      // Form D
      { s: { r: 0, c: 0 }, e: { r: 0, c: 36 } },
      // Attendance Register
      { s: { r: 1, c: 0 }, e: { r: 1, c: 36 } },
      // Establishment details
      { s: { r: 2, c: 0 }, e: { r: 2, c: 8 } },
      { s: { r: 2, c: 9 }, e: { r: 2, c: 15 } },
      { s: { r: 2, c: 16 }, e: { r: 2, c: 22 } },
      { s: { r: 2, c: 23 }, e: { r: 2, c: 29 } },
      { s: { r: 2, c: 30 }, e: { r: 2, c: 36 } },
    ];
    // Column width adjustment
    ws['!cols'] = Array(37).fill({ wch: 12 });

    // Create workbook and download
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');

    const fileName = `Attendance_${monthName}_${year}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }
  employees = [
    {
      name: 'John Doe',
      basic: 25000,
      hra: 10000,
      da: 5000,
      conveyance: 2000,
      otherAllow: 1500,
      pf: 1800,
      esi: 600,
      tds: 1000,
      loan: 0
    },
    {
      name: 'Mary Smith',
      basic: 28000,
      hra: 12000,
      da: 7000,
      conveyance: 2500,
      otherAllow: 2000,
      pf: 2100,
      esi: 800,
      tds: 1200,
      loan: 500
    },
    {
      name: 'Raj Kumar',
      basic: 30000,
      hra: 11000,
      da: 8000,
      conveyance: 3000,
      otherAllow: 2500,
      pf: 2200,
      esi: 900,
      tds: 1500,
      loan: 1000
    }
  ];

  getTotalEarnings(emp: any) {
    return emp.basic + emp.hra + emp.da + emp.conveyance + emp.otherAllow;
  }

  getTotalDeductions(emp: any) {
    return emp.pf + emp.esi + emp.tds + emp.loan;
  }

  getNetPay(emp: any) {
    return this.getTotalEarnings(emp) - this.getTotalDeductions(emp);
  }

  getGrandTotal(type: 'earnings' | 'deductions' | 'net') {
    if (type === 'earnings') {
      return this.employees.reduce((sum, e) => sum + this.getTotalEarnings(e), 0);
    } else if (type === 'deductions') {
      return this.employees.reduce((sum, e) => sum + this.getTotalDeductions(e), 0);
    } else {
      return this.employees.reduce((sum, e) => sum + this.getNetPay(e), 0);
    }
  }
}