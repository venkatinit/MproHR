import { Component } from '@angular/core';

@Component({
  selector: 'app-payslip',
  templateUrl: './payslip.component.html',
  styleUrls: ['./payslip.component.scss']
})
export class PayslipComponent {
  payslip = {
    company: {
      name: 'Venkanna Software Services Pvt. Ltd',
      address: `Melange Tower, 2nd Floor, Wing-C, Patrika Nagar, Madhapur, Hyderabad, India - 500081`
    },
    employee: {
      name: 'VENKATESH SAMITHIKOTA',
      doj: '14-10-2024',
      id: '25929',
      designation: 'Associate',
      office: 'Hyderabad',
      gender: 'MALE',
      pan: 'BRBPV5154R',
      uan: '101735611271',
      epf: 'APHYD00812580000010754',
      bank: 'ICICI Bank Ltd.',
      accNo: '59801580243',
      paymentMode: 'Bank Transfer',
    },
    date: '01-02-2025',
    month: 'JANUARY 2025',
    days: {
      standard: 31,
      accounted: 31
    },
    earnings: {
      basic: 20000,
      hra: 8000,
      medical: 1250,
      conveyance: 1600,
      special: 34017,
      arrears: 0
    },
    deductions: {
      professionalTax: 200,
      incomeTax: 0,
      epf: 1800,
      healthInsurance: 500,
      esi: 0,
      advance: 0,
      welfare: 100
    }
  };

  get grossEarnings(): number {
    const e = this.payslip.earnings;
    return e.basic + e.hra + e.medical + e.conveyance + e.special + e.arrears;
  }

  get grossDeductions(): number {
    const d = this.payslip.deductions;
    return d.professionalTax + d.incomeTax + d.epf + d.healthInsurance + d.esi + d.advance + d.welfare;
  }

  get netPay(): number {
    return this.grossEarnings - this.grossDeductions;
  }
}
