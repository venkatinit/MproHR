import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface EmployeePayslip {
  empId: string;
  empName: string;
  designation: string;
  department: string;
  payPeriod: string;
  basic: number;
  hra: number;
  conveyance: number;
  allowances: number;
  grossEarnings: number;
  pf: number;
  esic: number;
  tax: number;
  deductions: number;
  netPay: number;
}

@Component({
  selector: 'app-org-subscription',
  templateUrl: './org-subscription.component.html',
  styleUrls: ['./org-subscription.component.scss']
})
export class OrgSubscriptionComponent implements OnInit {
  payslipForm!: FormGroup;
  payslipData: EmployeePayslip | null = null;
  loading = false;
  apiUrl = 'https://your-backend-api.com/api/payslip'; // <-- Replace with your real API

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.payslipForm = this.fb.group({
      empId: ['', Validators.required]
    });
  }

  fetchPayslip() {
    if (this.payslipForm.invalid) return;
    const empId = this.payslipForm.value.empId;
    this.loading = true;

    this.http.get<EmployeePayslip>(`${this.apiUrl}/${empId}`).subscribe({
      next: (data) => {
        this.payslipData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching payslip:', err);
        this.loading = false;
      }
    });
  }

  printPayslip() {
    window.print();
  }
}
