import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { ApiService } from 'src/app/api.client';
import pdfMake from "pdfmake/build/pdfmake";
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';

Chart.register(...registerables);
@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss'],
  animations: [
    trigger('slideToggle', [
      state('hidden', style({ height: '0', opacity: 0, overflow: 'hidden' })),
      state('visible', style({ height: '*', opacity: 1, overflow: 'hidden' })),
      transition('hidden <=> visible', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class EmployeeDashboardComponent implements OnInit {
  selectedSection: string = '';
  employeeId!: number;
  employeeDetails: any;
  educationDetails: any;
  kycDocuments: any;
  form: FormGroup;
  loading = true;
  generateOL: FormGroup;
  submitted: boolean = false;
  payslipView: FormGroup;
  payslipForm: FormGroup;
  relievingForm: FormGroup;
  serviceForm: FormGroup;
  qualificationForm: FormGroup;
  leaveRequest: FormGroup;
  kycForm: FormGroup;
  experienceForm: FormGroup;
  ctcForm: FormGroup;
  salaryForm: FormGroup;
  result: any;
  errors: string[] = [];
  LeaveTypeList: any[] = [];
  attendanceData: any[] = [];
  selectedFile: File | null = null;
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
  years: number[] = [];
  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private util: UtilsServiceService,
    private router: Router

  ) { }
  ngOnInit() {
    this.generateOL = this.formBuilder.group({
      full_name: ['', [Validators.required]],
      permanent_address: ['', [Validators.required]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      department: ['', [Validators.required]],
      reportingTo: ['', [Validators.required]],
      // location: ['', [Validators.required]],
      doj: ['', [Validators.required]],
      employmentType: ['', [Validators.required]],
      gross: ['', [Validators.required]],
      probition: ['', [Validators.required]],
      reportDate: ['', [Validators.required]],
      noticePeriod: ['', [Validators.required]],
      issueDate: ['', [Validators.required]],
      authoriserName: ['', [Validators.required]],
    });
    this.relievingForm = this.formBuilder.group({
      employee_id: ['', [Validators.required]],
      full_name: ['', [Validators.required]],
      doj: ['', [Validators.required]],
      doe: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      hr_mail: ['', [Validators.required]],
      hr_number: ['', [Validators.required]],
      auth_name: ['', [Validators.required]],
      auth_designation: ['', [Validators.required]],
    });
    this.payslipView = this.formBuilder.group({
      payslip_month: ['', Validators.required],
      payslip_year: ['', Validators.required]
      // other controls...
    });
    this.qualificationForm = this.formBuilder.group({
      class: ['', Validators.required],
      institute: ['', Validators.required],
      board_University: ['', Validators.required],
      year_Of_Passing: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      marks_Grade: ['', Validators.required],
      E_attachment: [null, Validators.required]
    });
    this.kycForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      doc_number: ['', Validators.required],
      attachment: [null, Validators.required]
    });
    this.experienceForm = this.formBuilder.group({
      companyName: ['', Validators.required],
      designation: ['', Validators.required],
      fromdate: ['', Validators.required],
      todate: ['', Validators.required],
      totalExperience: ['', Validators.required],
      attachment: [null, Validators.required]
    });
    this.salaryForm = this.formBuilder.group({
      employeeId: ['', Validators.required],
      ctc: [0, [Validators.required, Validators.min(1)]],
      basic: [0, [Validators.required, Validators.min(0)]],
      // allowances: this.formBuilder.array([this.createAllowance()]),
      // deductions: this.formBuilder.array([this.createDeduction()]),
      otherAllowance: [0],
      total_Allowances: [0],
      total_Deductions: [0],
      take_Home_Salary: [0]
    });
    this.payslipForm = this.formBuilder.group({
      employeeId: ['', Validators.required],
      ctc: [0, Validators.required],
      otherAllowance: [0],
      allowances: this.formBuilder.array([]),
      deductions: this.formBuilder.array([]),
      total_Allowances: [0],
      total_Deductions: [0],
      take_Home_Salary: [0],
    });

    // Get ID from URL
    this.employeeId = Number(this.route.snapshot.paramMap?.get('id'));
    // Fetch Employee Details
    this.getEmployeeDetails();

    this.getLeaveTypes();

    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 5; y <= currentYear + 5; y++) {
      this.years.push(y);
    }
  }
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.qualificationForm.patchValue({ E_attachment: file.name });
    }
  }
  newQualification(): void {
    this.submitted = true;

    if (this.qualificationForm.invalid) {
      return;
    }
    const employeeId = Number(this.route.snapshot.paramMap?.get('id'));
    const formData = new FormData();
    formData.append('ID', '');
    formData.append('EmployeeId', employeeId.toString());
    formData.append('Class', this.qualificationForm.value.class);
    formData.append('Institute', this.qualificationForm.value.institute);
    formData.append('Board_University', this.qualificationForm.value.board_University);
    formData.append('Year_Of_Passing', this.qualificationForm.value.year_Of_Passing);
    formData.append('Marks_Grade', this.qualificationForm.value.marks_Grade);
    formData.append('Document_Path', '');


    if (this.selectedFile) {
      formData.append('Attachment', this.selectedFile);
    }

    // ✅ Example API call
    this.api.post('education', formData).subscribe({
      next: (res) => {
        alert('Qualification submitted successfully!');
        console.log(res);
        this.qualificationForm.reset();
        this.submitted = false;
      },
      error: (err) => {
        console.error('Error submitting qualification', err);
      }
    });
  }
  newKyc(): void {
    this.submitted = true;

    if (this.kycForm.invalid) {
      return;
    }
    const employeeId = Number(this.route.snapshot.paramMap?.get('id'));
    const formData = new FormData();
    formData.append('Id', '');
    formData.append('employeeId', employeeId.toString());
    formData.append('Title', this.kycForm.value.name);
    formData.append('type', this.kycForm.value.type);
    formData.append('doc_number', this.kycForm.value.doc_number);
    formData.append('Path', '');
    if (this.selectedFile) {
      formData.append('Attachment', this.selectedFile);
    }

    // ✅ Example API call
    this.api.post('kyc', formData).subscribe({
      next: (res) => {
        alert('KYC Document submitted successfully!');
        console.log(res);
        this.kycForm.reset();
        this.submitted = false;
      },
      error: (err) => {
        console.error('Error submitting kyc', err);
      }
    });
  }
  newExperience() {
    this.submitted = true;
    if (this.experienceForm.invalid) {
      return;
    }
    const employeeId = Number(this.route.snapshot.paramMap?.get('id'));
    const formData = new FormData();
    formData.append('Id', '');
    formData.append('employeeId', employeeId.toString());
    formData.append('companyName', this.experienceForm.value.companyName);
    formData.append('designation', this.experienceForm.value.designation);
    formData.append('formDate', this.experienceForm.value.fromDate);
    formData.append('toDate', this.experienceForm.value.toDate);
    formData.append('totalExperience', this.experienceForm.value.totelExperience);
    formData.append('Path', '');
    if (this.selectedFile) {
      formData.append('Attachment', this.selectedFile);
    }
    // ✅ Example API call
    this.api.post('kyc', formData).subscribe({
      next: (res) => {
        alert('KYC Document submitted successfully!');
        console.log(res);
        this.experienceForm.reset();
        this.submitted = false;
      },
      error: (err) => {
        console.error('Error submitting kyc', err);
      }
    });
  }
  // Salary Form 

  // get allowances(): FormArray {
  //   return this.salaryForm.get('allowances') as FormArray;
  // }

  // get deductions(): FormArray {
  //   return this.salaryForm.get('deductions') as FormArray;
  // }

  // createAllowance(): FormGroup {
  //   return this.formBuilder.group({
  //     name: ['', Validators.required],
  //     type: ['', Validators.required],
  //     amount: [0, [Validators.required, Validators.min(0)]]
  //   });
  // }

  // createDeduction(): FormGroup {
  //   return this.formBuilder.group({
  //     name: ['', Validators.required],
  //     type: ['', Validators.required],
  //     amount: [0, [Validators.required, Validators.min(0)]]
  //   });
  // }

  // addAllowance() {
  //   this.allowances.push(this.createAllowance());
  // }

  // removeAllowance(i: number) {
  //   this.allowances.removeAt(i);
  //   this.updateTotals();
  // }

  // addDeduction() {
  //   this.deductions.push(this.createDeduction());
  // }

  // removeDeduction(i: number) {
  //   this.deductions.removeAt(i);
  //   this.updateTotals();
  // }

  // // ✅ Compute allowance value
  // getAllowanceValue(index: number): number {
  //   const ctc = this.salaryForm.value.ctc || 0;
  //   const basic = this.salaryForm.value.basic || 0;
  //   const allowance = this.allowances.at(index).value;
  //   if (!allowance) return 0;

  //   if (allowance.type === 'flat') return allowance.amount;
  //   if (allowance.type === '% of CTC') return (ctc * allowance.amount) / 100;
  //   if (allowance.type === '% of Basic') return (basic * allowance.amount) / 100;
  //   return 0;
  // }

  // // ✅ Compute deduction value
  // getDeductionValue(index: number): number {
  //   const ctc = this.salaryForm.value.ctc || 0;
  //   const basic = this.salaryForm.value.basic || 0;
  //   const deduction = this.deductions.at(index).value;
  //   if (!deduction) return 0;

  //   if (deduction.type === 'flat') return deduction.amount;
  //   if (deduction.type === '% of CTC') return (ctc * deduction.amount) / 100;
  //   if (deduction.type === '% of Basic') return (basic * deduction.amount) / 100;
  //   return 0;
  // }

  // updateTotals(): void {
  //   const ctc = this.salaryForm.value.ctc || 0;

  //   const totalAllowances =
  //     this.allowances.controls.reduce((sum, _, i) => sum + this.getAllowanceValue(i), 0) +
  //     Number(this.salaryForm.value.otherAllowance || 0);

  //   const totalDeductions = this.deductions.controls.reduce((sum, _, i) => sum + this.getDeductionValue(i), 0);

  //   // Prevent exceeding CTC
  //   if (totalAllowances > ctc) {
  //     alert('Total allowances cannot exceed CTC!');
  //     return;
  //   }
  //   if (totalDeductions > ctc) {
  //     alert('Total deductions cannot exceed CTC!');
  //     return;
  //   }

  //   const takeHome = ctc + totalAllowances - totalDeductions;

  //   this.salaryForm.patchValue(
  //     {
  //       total_Allowances: totalAllowances,
  //       total_Deductions: totalDeductions,
  //       take_Home_Salary: takeHome
  //     },
  //     { emitEvent: false }
  //   );
  // }

  // onSubmit(): void {
  //   this.submitted = true;
  //   if (this.salaryForm.invalid) return;

  //   const payload = this.salaryForm.value;
  //   console.log('Submitting payload:', payload);

  //   this.api.post('api/payroll/calculate-ctc', payload).subscribe({
  //     next: (res) => {
  //       alert('Salary structure submitted successfully!');
  //       console.log(res);
  //     },
  //     error: (err) => {
  //       console.error('Error submitting salary structure', err);
  //     }
  //   });
  // }

  // Leave Form
  getLeaveTypes() {
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    this.api?.get(`api/admin/leave/types?companyId=${companyId}`)
      .subscribe({
        next: (res: any) => {
          this.LeaveTypeList = res;   // API already returns array
          console.log("Leave types:", this.LeaveTypeList);
        },
        error: (err) => {
          console.error("Error fetching leave types:", err);
        }
      });
  }
  saveRequest() {
    console.log('✅ create form submitted');
    this.submitted = true;
    if (!this.leaveRequest.valid) {
      return;
    }
    // const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    // const url = 'leave/request';
    const body = {
      id: 0,
      employee_Id: this.employeeId,
      leave_Type_Id: this.leaveRequest?.get('leaveType')?.value,
      from_Date: this.leaveRequest?.get('fromDate')?.value,
      to_Date: this.leaveRequest?.get('toDate')?.value,
      status: this.leaveRequest?.get('reason')?.value,
      remarks: this.leaveRequest?.get('remarks')?.value
    };
    this.api.post('leave/request', body).subscribe({
      next: (res) => {
        console.log("Leave request submitted", res);
      },
      error: (err) => {
        console.error("Error submitting leave request:", err);
      }
    });
  }
  get f() {
    return this.generateOL.controls;
  }
  dateFormat(dateString: string | Date): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  activeSection: string | null = null;
  toggleSection(section: string) {
    this.activeSection = this.activeSection === section ? null : section;
  }
  getEmployeeDetails(): void {
    this.api?.get(`${this.employeeId}`).subscribe(
      (res: any) => {
        if (res || res.data) {
          this.employeeDetails = res.data || res;
          this.employeeId = this.employeeDetails?.id;
          this.educationDetails = this.employeeDetails?.educationDetails;
          this.experienceDetails = this.employeeDetails?.experienceDetails;
          this.kycDocuments = this.employeeDetails?.kycDocuments;
          // patch values to form
          this.generateOL?.patchValue({
            full_name: this.employeeDetails?.full_Name,
            permanent_address: this.employeeDetails?.permanent_Address,
            mobileNumber: this.employeeDetails?.mobile_No,
            email: this.employeeDetails?.email,
            designation: this.employeeDetails?.designation,
            department: this.employeeDetails?.department,
            reportingTo: '', // this is not in API, keep empty
            location: this.employeeDetails?.present_Address, // or assign office location if available
            doj: this.employeeDetails?.joining_Date ? this.employeeDetails?.joining_Date.split('T')[0] : '',
            employmentType: this.employeeDetails?.employee_Type,
            gross: this.employeeDetails?.offer_CTC,
            probition: '',
            reportDate: this.employeeDetails?.offer_Date ? this.employeeDetails?.offer_Date.split('T')[0] : '',
            noticePeriod: '',
            issueDate: this.employeeDetails?.offer_Date ? this.employeeDetails?.offer_Date.split('T')[0] : '',
            authoriserName: ''
          });
          this.relievingForm?.patchValue({
            employee_id: this.employeeDetails?.employee_Code,
            full_name: this.employeeDetails?.full_Name,
            doj: this.employeeDetails?.joining_Date ? this.employeeDetails?.joining_Date.split('T')[0] : '',
            doe: '',
            designation: this.employeeDetails?.designation,
            hr_mail: '',
            hr_number: '',
            auth_name: '',
            auth_number: ''
          });
          this.serviceForm?.patchValue({
            employee_id: this.employeeDetails?.employee_Code,
            full_name: this.employeeDetails?.full_Name,
            doj: this.employeeDetails?.joining_Date ? this.employeeDetails?.joining_Date.split('T')[0] : '',
            doe: '',
            designation: this.employeeDetails?.designation,
            location: this.employeeDetails?.designation,
          });
          this.qualificationForm?.patchValue({
            employeeId: this.employeeDetails?.id,
          });
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching employee details', error);
        this.loading = false;
      }
    );
  }
  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }
  // Offer Letter 
  async Offer_generatePDF(action = 'open') {
    const docDefinition: any = {
      pageMargins: [40, 140, 40, 60],
      pageSize: 'A4',
      background: [
        {
          image: await this.getBase64ImageFromURL('assets/img/ng.jpg'),
          fit: [595, 842],
        },
      ],
      content: [
        {
          text: 'OFFER LETTER',
          fontSize: 20,
          bold: true,
          margin: [0, 10, 0, 20],
          alignment: 'center',
          decoration: 'underline',
          color: 'black',
        },

        // Employee Name + Address + Date
        {
          columns: [
            [
              {
                fontSize: 11,
                text: 'TO,',
                bold: true,
              },
              {
                fontSize: 11,
                text: this.generateOL?.get('full_name')?.value,
                bold: true,
              },
              {
                text: this.generateOL?.get('permanent_address')?.value,
                fontSize: 10,
              },
            ],
            [
              {
                text: this.dateFormat(this.generateOL?.get('issueDate')?.value),
                alignment: 'right',
              },
            ],
          ],
        },

        {
          margin: [0, 10, 0, 5],
          text: [
            'Dear ',
            { text: this.generateOL?.get('full_name')?.value, bold: true },
            ',',
          ],
        },
        {
          margin: [0, 0, 0, 10],
          text: 'Congratulations on your success!',
        },
        {
          text: [
            'This is with reference to the interview you had with us. We are pleased to offer you an appointment in our organization as ',
            { text: `"${this.generateOL?.get('designation')?.value}"`, bold: true },
            ' with effect from ',
            { text: this.generateOL?.get('doj')?.value, bold: true },
            '. Your gross remuneration will be INR ',
            { text: this.generateOL?.get('gross')?.value, bold: true },
            '/- per Annum. You will be on a probation Period of ',
            { text: this.generateOL?.get('probation')?.value, bold: true },
            ' months from the date of commencement of work.'
          ],
          fontSize: 11,
          margin: [0, 0, 0, 20],
        },
        {
          text: [
            'Your offer has been made based on information furnished by you. Offer stands cancelled in case of any',
            'deviations in information provided by you orif you failto report on or before the pre-decided joining date. ',
          ],
          fontSize: 11,
          margin: [0, 0, 0, 20],
        },

        // ANNEXURE TITLE
        {
          text: 'ANNEXURE - SALARY STRUCTURE',
          style: 'sectionHeader',
          // pageBreak: 'before',
        },

        // SALARY ANNEXURE (Combined Table)
        // {
        //   text: '\nAnnexure - I : Salary Structure',
        //   fontSize: 13,
        //   bold: true,
        //   margin: [0, 15, 0, 10],
        //   decoration: 'underline'
        // },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', '*', 'auto'], // Earnings column + amount + Deductions column + amount
            body: [
              [
                { text: 'EARNINGS', fillColor: '#000000', color: 'white', bold: true, alignment: 'center' },
                { text: 'AMOUNT (₹)', fillColor: '#000000', color: 'white', bold: true, alignment: 'center' },
                { text: 'DEDUCTIONS', fillColor: '#000000', color: 'white', bold: true, alignment: 'center' },
                { text: 'AMOUNT (₹)', fillColor: '#000000', color: 'white', bold: true, alignment: 'center' },
              ],

              // Row 1
              ['Basic Pay', '25,000', 'Provident Fund (PF)', '1,800'],

              // Row 2
              ['House Rent Allowance (HRA)', '10,000', 'ESI', '500'],

              // Row 3
              ['Conveyance Allowance', '2,000', 'Professional Tax', '200'],

              // Row 4
              ['Medical Allowance', '1,000', '', ''],

              // Row 5
              ['Other Allowances', '2,000', '', ''],

              // Totals
              [
                { text: 'Total Earnings', bold: true },
                { text: '40,000', bold: true },
                { text: 'Total Deductions', bold: true },
                { text: '2,500', bold: true }
              ],

              // Final Net Pay
              [
                { text: 'Net Pay (CTC)', colSpan: 3, alignment: 'right', bold: true }, {}, {},
                { text: '₹37,500', bold: true }
              ]
            ]
          },
          layout: {
            fillColor: (rowIndex: number) => {
              return rowIndex % 2 === 0 ? '#f5f5f5' : null;
            },
            hLineColor: () => '#bfbfbf',
            vLineColor: () => '#bfbfbf'
          },
          margin: [0, 10, 0, 20]
        },
        {
          text: 'This structure is subject to statutory deductions and company policies.',
          fontSize: 10,
          italics: true,
          margin: [0, 0, 0, 10],
        },

        // FOOTER NOTE
        {
          text: '\n\nPlease bring original and photocopies of the following documents at the time of joining:',
          margin: [0, 20, 0, 10],
        },
        {
          ul: [
            '1 Passport Size Photographs',
            'Educational Certificates',
            'Experience Certificates',
            'ID Proof (Aadhaar / PAN)',
            'Passport-size Photographs',
            'Bank Account Details',
            'Vaccine Certificate',
            'Two Professional References',
            'Experience Letter, Pay Slips, Relieving Letter from past Two(2) employers. (If applicable)'
          ],
          fontSize: 11,
        },
        // Final Section: Closing & Signatures
        {
          text: '\nOffice Timings: ',
          bold: true,
          fontSize: 11,
          margin: [0, 5, 0, 0],
          continued: true
        },
        { text: '10:00 AM To 07:00 PM.', fontSize: 11 },

        {
          text: '\n\nWe congratulate you and wish you a long and successful career with us. We are confident that your contribution will take us further on our journey towards becoming world leaders. We are excited about the potential that you will bring to our organization and assure you of our support for your professional development and growth. Please feel free to reach us if you have any queries or concerns.',
          fontSize: 11,
          margin: [0, 10, 0, 10],
          alignment: 'justify'
        },

        {
          text: '\nWith Best Wishes,',
          fontSize: 11,
          margin: [0, 10, 0, 5]
        },
        {
          text: 'From venkat Software Services Private Limited',
          bold: true,
          fontSize: 11,
          margin: [0, 0, 0, 30]
        },

        // Signatures Row
        {
          columns: [
            [
              // {
              //   // image: 'assets/img/company-seal.png', // replace with your base64 or path
              //   width: 80,
              //   margin: [0, 0, 0, 10]
              // },
              { text: 'Venkatesh', bold: true, fontSize: 11 },
              { text: 'Human Resources - Manager', fontSize: 11, margin: [0, 2, 0, 0] }
            ],
            [
              { text: 'Accepted By', alignment: 'right', bold: true, fontSize: 11, margin: [0, 0, 0, 40] },
              { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 0.5 }] },
              { text: 'Venkatesh Samithikota', alignment: 'right', bold: true, fontSize: 11, margin: [0, 2, 0, 0] }
            ]
          ]
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          alignment: 'center',
          margin: [0, 15, 0, 15],
        },
      },
    };

    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download('Offer_Letter.pdf');
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else {
      pdfMake.createPdf(docDefinition).open();
    }
  }
  // Payslip
  get allowances(): FormArray {
    return this.payslipForm?.get('allowances') as FormArray;
  }
  get deductions(): FormArray {
    return this.payslipForm?.get('deductions') as FormArray;
  }
  addAllowance() {
    this.allowances.push(this.formBuilder.group({
      name: ['', Validators.required],
      type: ['string', Validators.required],
      amount: [0, Validators.required]
    }));
  }

  addDeduction() {
    this.deductions.push(this.formBuilder.group({
      name: ['', Validators.required],
      type: ['string', Validators.required],
      amount: [0, Validators.required]
    }));
  }
  // payslip.component.ts
  removeAllowance(index: number) {
    this.allowances.removeAt(index);
    this.calculateTotals();
  }

  removeDeduction(index: number) {
    this.deductions.removeAt(index);
    this.calculateTotals();
  }
  calculateTotals() {
    const allowanceTotal = this.allowances.controls.reduce((sum, ctrl) => sum + Number(ctrl.value.amount || 0), 0);
    const deductionTotal = this.deductions.controls.reduce((sum, ctrl) => sum + Number(ctrl.value.amount || 0), 0);

    this.payslipForm.patchValue({
      total_Allowances: allowanceTotal,
      total_Deductions: deductionTotal,
      take_Home_Salary: allowanceTotal - deductionTotal
    }, { emitEvent: false });
  }

  onSubmit() {
    if (this.payslipForm.invalid) return;

    const payload = this.payslipForm.value;
    this.api.post('api/payroll/calculate-ctc', payload).subscribe({
      next: (res: any) => {
        // this.result = res.data || res;
      },
      error: (err) => console.error('Error calling calculate-ctc API', err)
    });
    console.log('✅ create form submitted');
    // this.submitted = true;
    if (!this.payslipForm.valid) {
      return;
    }
    // this.spinLoader = true;
    // const decryptedUserId = this.util.decrypt_Text(localStorage.getItem('id') || '');
    const url = 'api/payroll/calculate-ctc';
    const body = {
      employeeId: this.payslipForm?.get('employeeId')?.value,
      ctc: this.payslipForm?.get('ctc')?.value,
      otherAllowance: this.payslipForm?.get('otherAllowance')?.value,

      allowances: this.payslipForm?.get('allowances')?.value || [],
      deductions: this.payslipForm?.get('deductions')?.value || [],
      total_Allowances: 0, // let backend calculate if not needed
      total_Deductions: 0,
      take_Home_Salary: 0
    };
  }
  Payslip_generatePDF(action = 'open') {
    const emp = this.employeeDetails;

    if (!emp) {
      console.error('Employee details not loaded yet!');
      return;
    }

    // 🔹 Static or sample company + pay data
    const data = {
      company: {
        name: 'EmproHR Pvt Ltd',
        address: 'Hyderabad, Telangana, India',
        // logo: 'assets/img/DEMO.png'
      },
      employee: {
        id: emp.employee_Code || '',
        name: emp.full_Name || '',
        designation: emp.designation || '',
        department: emp.department || '',
        joiningDate: emp.joining_Date ? emp.joining_Date.split('T')[0] : '',
        pan: emp.paN_Number || '',
        uan: emp.uaN_Number || '',
        bankName: emp.bank_Name || '',
        accountNo: emp.account_Number || '',
        location: emp.present_Address || '',
        workingDays: 26,
        paidDays: 25
      },
      month: 'October 2025',

      // You can replace these with dynamic data if you fetch salary structure from API

      allowances: [
        { name: 'Basic Pay', amount: emp.offer_CTC / 12 * 0.50 },
        { name: 'HRA', amount: emp.offer_CTC / 12 * 0.20 },
        { name: 'Conveyance', amount: 2500 },
        { name: 'Medical Allowance', amount: 1250 }
      ],
      deductions: [
        { name: 'PF', amount: (emp.offer_CTC / 12) * 0.12 },
        { name: 'ESIC', amount: 500 },
        { name: 'TDS', amount: 1000 }
      ]
    };
    // 🔹 Totals
    const totalAllowances = data.allowances.reduce((a, b) => a + b.amount, 0);
    const totalDeductions = data.deductions.reduce((a, b) => a + b.amount, 0);
    const takeHome = totalAllowances - totalDeductions;
    // 🔹 Merge earnings & deductions into rows
    const rows = [];
    const maxRows = Math.max(data.allowances.length, data.deductions.length);
    for (let i = 0; i < maxRows; i++) {
      rows.push([
        data.allowances[i]?.name || '',
        data.allowances[i]?.amount || '',
        data.deductions[i]?.name || '',
        data.deductions[i]?.amount || ''
      ]);
    }

    // 🔹 PDF Definition
    const docDefinition: any = {
      content: [
        {
          columns: [
            // {
            //   image: data.company.logo,
            //   width: 60
            // },
            [
              { text: data.company.name, fontSize: 16, bold: true, alignment: 'center' },
              { text: data.company.address, fontSize: 10, alignment: 'center' }
            ]
          ]
        },
        { text: `\nSalary Slip for the month of ${data.month}`, style: 'title' },
        { text: '\n' },

        {
          style: 'detailsTable',
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              ['Employee ID', data.employee.id, 'Employee Name', data.employee.name],
              ['Designation', data.employee.designation, 'Department', data.employee.department],
              ['Joining Date', data.employee.joiningDate, 'Account No', data.employee.accountNo],
              ['PAN No', data.employee.pan, 'UAN No', data.employee.uan],
              ['Working Days', data.employee.workingDays, 'Paid Days', data.employee.paidDays]
            ]
          },
          layout: {
            // remove all lines (no borders)
            hLineWidth: () => 0,
            vLineWidth: () => 0,
            paddingLeft: () => 2,
            paddingRight: () => 2,
            paddingTop: () => 3,
            paddingBottom: () => 3
          },
          margin: [0, 10, 0, 10]
        },

        // { text: '\n' },

        {
          style: 'salaryTable',
          table: {
            headerRows: 1,
            widths: ['*', 'auto', '*', 'auto'],
            body: [
              [
                { text: 'Earnings', bold: true },
                { text: 'Amount', bold: true },
                { text: 'Deductions', bold: true },
                { text: 'Amount', bold: true }
              ],
              ...rows,
              [
                { text: 'Total Earnings', bold: true },
                totalAllowances,
                { text: 'Total Deductions', bold: true },
                totalDeductions
              ],
              ['', '', { text: 'Net Pay', bold: true }, { text: takeHome, bold: true }]
            ]
          },
          layout: {
            fillColor: function (rowIndex: number) {
              return rowIndex % 2 === 0 ? null : '#f9f9f9'; // alternate row color
            },
            hLineColor: () => '#cccccc',
            vLineColor: () => '#cccccc',
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            paddingLeft: () => 6,
            paddingRight: () => 6,
            paddingTop: () => 4,
            paddingBottom: () => 4
          },
          margin: [0, 10, 0, 15]
        },

        { text: '\n' },
        {
          text: 'This is a computer-generated payslip and does not require a signature.',
          alignment: 'center',
          fontSize: 9,
          italics: true
        }
      ],
      styles: {
        title: { fontSize: 14, bold: true, alignment: 'center', color: '#1e40af' },
        detailsTable: { margin: [0, 5, 0, 15] },
        salaryTable: { margin: [0, 10, 0, 15] }
      }
    };

    // 🔹 Generate or download
    const pdfDoc = pdfMake.createPdf(docDefinition);
    if (action === 'download') {
      pdfDoc.download(`Payslip_${data.employee.name}.pdf`);
    } else {
      pdfDoc.open();
    }
  }
  async Relieving_generatePDF(action = 'open') {
    let docDefinition = {
      pageMargins: [40, 160, 40, 140],
      pageSize: 'A4',
      background: [
        {
          image: await this.getBase64ImageFromURL(
            "assets/img/ng.jpg"
          ), fit: [595, 852]
        }
      ],
      content: [
        {
          text: 'RELIEVING LETTER',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'black'
        },
        {
          margin: 10,
          text: ['Dear', ' ', { text: this.relievingForm?.get('full_name')?.value, bold: true, fontSize: 14 }, ',']
        },
        {
          text: [,
            'This has reference to your resignation letter, we hereby inform you that it has been accepted and', ' ',
            'you are being relieved of your duties from the closing hours of ', this.dateFormat(this.relievingForm?.get('doe')?.value), '.'
          ],
        },
        {
          text: 'As per the services records here are your details:',
          style: 'sectionHeader',
          margin: 10

        },
        {
          style: 'tableExample',
          table: {
            widths: [200, '*',],
            body: [
              [' Emp ID', { text: this.relievingForm?.get('employee_id')?.value, bold: true }],
              [' Date of Joining', { text: this.dateFormat(this.relievingForm?.get('doj')?.value), bold: true }],
              [' Current Designation ', { text: this.relievingForm?.get('designation')?.value, bold: true }],
              [' Last Working Date', { text: this.dateFormat(this.relievingForm?.get('doe')?.value), bold: true }],
            ]
          },
          fontSize: 12,
          layout: 'noBorders',
          margin: [20, 0, 0, 0]
        },
        {
          margin: 10,
          text: ['You have been an integral part of our growth and we appreciate your contribution during this journey.'],
        },
        {
          margin: 10,
          text: ['While we wish that this association could have been longer, we hope you achieve every success in your future endeavors. We also draw your attention to your continuing obligation of confidentiality with respect to any proprietary and confidential information of NG Info Solutions Pvt Ltd. that you may have had access to during your employment.'],
        },
        // {
        //   margin: 10,
        //   text: [' If You have any questions regarding the contents, please do not hesitate contact us on', this.relievingForm?.get('hr_mail')?.value, '. You can also contact on ', this.relievingForm?.get('hr_number')?.value, ''],
        // },
        {
          columns: [
            [
              {
                text: `Yours faithfully,`,
                alignment: 'left',
                margin: 10
              },
              {
                text: `For NG Info Solutions Pvt Ltd.,`,
                alignment: 'left',
              },
              {
                image: await this.getBase64ImageFromURL(
                  "assets/img/ng-stamp.png"
                ), height: 64, width: 64,
                alignment: 'left'
              },
              {
                text: this.relievingForm?.get('auth_name')?.value,
                alignment: 'left'
              },
              {
                text: this.relievingForm?.get('auth_designation')?.value,
                alignment: 'left'
              },
            ]
          ]
        },
      ],
      styles: {
        sectionHeader: {
          bold: true,
          // decoration: 'underline',
          fontSize: 10,
          margin: [0, 15, 0, 15]
        }
      }

    };

    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download();
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else {
      pdfMake.createPdf(docDefinition).open();
    }
  }
  async Experience_generatePDF(action = 'open') {
    let docDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 120, 40, 120],

      background: [
        {
          image: await this.getBase64ImageFromURL(
            "assets/img/ng.jpg"
          ), fit: [595, 852]
        }
      ],
      content: [
        {
          text: '',
          style: 'sectionHeader'
        },
        {

          columns: [

            [
              {
                text: this.dateFormat(this.generateOL?.get('issueDate')?.value),
                alignment: 'right'
              },
              {
                text: `Place:Hyderabad`,
                alignment: 'right'
              }
            ]
          ]
        },
        {
          text: '',
          style: 'sectionHeader'
        },
        {
          text: 'To Whom It May Concern',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'black'
        },
        {
          text: ['It is hereby certified that Mr/Ms.', this.serviceForm?.get("full_name")?.value, 'worked as a Manager in our ',
            'company from' + this.serviceForm?.get("doj")?.value + 'to' + this.serviceForm?.get("relieving_date")?.value],
          style: 'text1',
        },
        {
          text: ['During his/her tenure,we found him/her sincere,hard working, and efficient. We wish all',
            'the success in his/her future endeavours.',
          ],
          style: 'text1',
        },
        {
          text: '',
          style: 'text'
        },
        {
          columns: [
            [
              {
                image: await this.getBase64ImageFromURL(
                  "assets/img/ng-stamp.png"
                ), height: 64, width: 64,
                alignment: 'right'
              },
              {
                text: `NG Info Solutions Pvt Ltd`,
                alignment: 'right'
              },
              {
                text: `Authorized Signatory`,
                alignment: 'right'
              }
            ]
          ]
        },
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [15, 15, 15, 15],
        },
        text: {
          fontSize: 14,
          margin: [15, 15, 15, 15],
        },
        text1: {
          fontSize: 14,
          margin: [15, 15, 15, 15],
        }
      },
      defaultStyle: {
        alignment: 'justify'
      }

    };

    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download();
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else {
      pdfMake.createPdf(docDefinition).open();
    }
  }
  goToAttendance(id: number) {
    this.router.navigate(['/hrm/employee-attendance', id]).then(() => {
      window.location.reload();
    });
  }
  getMonthName(value: number): string {
    const month = this.months.find(m => m.value === value);
    return month ? month.name : '';
  }
  // Example form data (can be replaced with formGroup values)
  employeeData = {
    name: "Mr. Venkatesh Samithikota",
    firstName: "Venkatesh",
    designation: "Software Engineer",
    joiningDate: "14th October 2024",
    ctc: "8,13,013",
    probation: "3",
    ctcInWords: "Eight Lakhs Thirteen Thousand Thirteen Rupees ",
    address: "13-9, Valasaguttapalli, Badikayalapalli, Chittoor, Andhra Pradesh - 517370",
    email: "venkatesh.samithikota@example.com",
    phone: "+91-9876543210",
    department: "Development",
    employeeCode: "EMP2024-032",
    salaryBreakup: {
      basicPay: 240000,
      hra: 96000,
      conveyance: 19200,
      medicalAllowance: 15000,
      specialAllowance: 408200,
      epfEmployee: 21600,
      professionalTax: 2400,
      staffWelfare: 1200,
      healthInsurance: 6000,
      grossSalary: 778400,
      totalDeductions: 31200,
      netSalary: 747200,
      epfEmployer: 21600,
      fixedPayCtc: 800000,
      variablePay: 0,
      gratuity: 11538,
      lifeInsurance: 1475,
      totalCtc: 813013
    },
    reportingLocation: "AmpleLogic, Melange Tower, Wing-C, 2nd Floor, Patrika Nagar, Hitech City, Madhapur, Hyderabad - 500081, India",
    officeTimings: "10:00 AM to 07:00 PM",
    documentsRequired: [
      "1 Passport Size Photograph",
      "Photocopies of all Academic Certificates & Mark-sheets (10th, 12th, Graduation, Post-Graduation)",
      "Passport Copy / Aadhar Card",
      "PAN Card Copy",
      "Two Professional References",
      "Vaccine Certificate",
      "Experience Letter, Pay Slips, Relieving Letter from past Two (2) employers"
    ]
  };
  generateOfferPDF(employee: any) {
    const doc = new jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    let y = 80;

    const safe = (val: any) => (val ? String(val) : '');

    // ====== HEADER ======
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Offer Letter', pageWidth / 2, y, { align: 'center' });
    y += 30;

    // ====== ADDRESS ======
    doc.setFont('helvetica', 'bold');

    doc.setFontSize(11);
    doc.text(`To,`, margin, y);
    y += 20;
    doc.text(`${safe(employee.name)}`, margin, y);
    y += 15;
    doc.setFont('helvetica', 'normal');
    doc.text(`${safe(employee.address)}`, margin, y, { maxWidth: 500 });
    y += 30;

    // ====== GREETING ======
    doc.setFont('helvetica', 'bold');

    doc.text(`Dear ${safe(employee.firstName) || 'Employee'},`, margin, y);
    y += 20;
    doc.setFont('helvetica', 'normal');

    doc.text(`Congratulations on your success!`, margin, y);
    y += 30;

    // ====== BODY ======
    const bodyText = [
      `This is with reference to the interview you had with us; we are pleased to offer you an appointment in our organization as "${safe(employee.designation)}" with effect from ${safe(employee.joiningDate)}.`,
      `In this position your remuneration will be INR ${safe(employee.ctc)}/- per annum (${safe(employee.ctcInWords)} only).`,
      `You will be on a probation period of Three (${safe(employee.probation)}) months from the date of commencement of work.`,
      `Your offer has been made based on information furnished by you. Offer stands cancelled in case of any deviation in information or failure to report on or before the pre-decided joining date.`
    ];
    doc.text(bodyText, margin, y, { maxWidth: 520, lineHeightFactor: 1.5 });
    y += 120;

    // ====== ANNEXURE HEADING ======
    doc.setFont('helvetica', 'bold');
    doc.text('ANNEXURE', pageWidth / 2, y, { align: 'center' });
    y += 15;

    // ====== SALARY TABLE ======
    autoTable(doc, {
      startY: y + 10,
      head: [['CTC Components', 'Rs. (Annual)', 'Deductions', 'Rs. (Annual)']],
      body: [
        ['Basic Pay', '240000', 'EPF - Employee Contribution', '21600'],
        ['House Rent Allowance', '96000', 'Professional Tax', '2400'],
        ['Conveyance Allowance', '19200', 'Staff Welfare', '1200'],
        ['Medical Allowance', '15000', 'Health Insurance', '6000'],
        ['Special Allowance', '408200', 'Total Deductions (B)', '31200'],
        ['Gross Salary (A)', '778400', 'Net Salary Payment (A-B)', '747200'],
        ['EPF - Employer Contribution', '21600', '', ''],
        ['Fixed Pay CTC', '800000', '', ''],
        ['Variable Pay per Annum', '0', '', ''],
        ['Gratuity', '11538', '', ''],
        ['Life Insurance', '1475', '', ''],
        ['Total Cost to Company (CTC)', '813013', '', '']
      ],
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [230, 230, 230] },
    });

    // Move Y position after table
    const finalY = (doc as any).lastAutoTable.finalY + 25;

    // ====== REPORTING LOCATION ======
    doc.setFont('helvetica', 'bold');
    doc.text('Reporting Location:', margin, finalY);
    doc.setFont('helvetica', 'normal');
    doc.text('AmpleLogic, Melange Tower, Wing-C, 2nd Floor, Patrika Nagar,', margin, finalY + 15);
    doc.text('Hitech City, Madhapur, Hyderabad - 500081, India', margin, finalY + 30);

    // ====== DOCUMENTS REQUIRED ======
    let docY = finalY + 55;
    doc.setFont('helvetica', 'bold');
    doc.text('Documents required at the time of joining (Originals with photocopy):', margin, docY);
    docY += 15;

    doc.setFont('helvetica', 'normal');
    const docsList = [
      '1 Passport Size Photograph',
      'Photocopies of all Academic Certificates & Mark-sheets (10th, 12th, Graduation, Post-Graduation)',
      'Passport Copy / Aadhar Card',
      'PAN Card Copy',
      'Two Professional References',
      'Vaccine Certificate',
      'Experience Letter, Pay Slips, Relieving Letter from past Two (2) employers'
    ];
    docsList.forEach((item, idx) => {
      doc.text(`• ${item}`, margin + 10, docY + idx * 15);
    });

    // ====== OFFICE TIMINGS ======
    const officeY = docY + docsList.length * 15 + 25;
    doc.setFont('helvetica', 'bold');
    doc.text('Office Timings:', margin, officeY);
    doc.setFont('helvetica', 'normal');
    doc.text('10:00 AM to 07:00 PM', margin + 90, officeY);

    // ====== CLOSING PARAGRAPH ======
    const closeText = [
      `We congratulate you and wish you a long and successful career with us.`,
      `We are confident that your contribution will take us further on our journey towards becoming world leaders.`,
      `We are excited about the potential you bring and assure you of our full support for your professional development and growth.`,
      `Please feel free to reach out if you have any queries or concerns.`
    ];
    doc.text(closeText, margin, officeY + 30, { maxWidth: 520, lineHeightFactor: 1.5 });

    // ====== SIGNATURES ======
    const signY = officeY + 130;
    doc.text('With Best Wishes,', margin, signY);
    doc.text('From Venkanna Software Services Private Limited', margin, signY + 15);

    doc.text('_____________________________', margin, signY + 60);
    doc.text('Preethi Gadila', margin, signY + 75);
    doc.text('Human Resources - Manager', margin, signY + 90);

    doc.text('Accepted By', pageWidth - 200, signY + 15);
    doc.text('_____________________________', pageWidth - 200, signY + 60);
    doc.text(`${safe(employee.name)}`, pageWidth - 200, signY + 75);

    // ====== SAVE PDF ======
    doc.save(`${safe(employee.name)}_OfferLetter.pdf`);
  }
  // raw data
  experienceDetails = [
    {
      companyName: 'TechSoft Solutions Pvt Ltd',
      designation: 'Software Developer',
      fromDate: '01-Jan-2021',
      toDate: '31-Dec-2023',
      totalExperience: '3 Years',
      certificateUrl: 'assets/certificates/experience_letter_techsoft.pdf'
    },
    {
      companyName: 'Innova Technologies',
      designation: 'Frontend Engineer',
      fromDate: '15-Feb-2019',
      toDate: '31-Dec-2020',
      totalExperience: '1 Year 10 Months',
      certificateUrl: 'assets/certificates/experience_letter_innova.pdf'
    }
  ];
  viewCertificate(url: string) {
    window.open(url, '_blank');
  }
  employeeCtc = {
    employeeId: 1001,
    ctc: 600000,
    otherAllowance: 5000,
    total_Allowances: 40000,
    total_Deductions: 5000,
    take_Home_Salary: 35500,
    allowances: [
      { name: 'Basic Pay', type: 'Earning', amount: 25000, enabled: true },
      { name: 'HRA', type: 'Earning', amount: 10000, enabled: true },
      { name: 'Conveyance', type: 'Earning', amount: 3000, enabled: true },
      { name: 'Medical Allowance', type: 'Earning', amount: 2000, enabled: true }
    ],
    deductions: [
      { name: 'Provident Fund', type: 'Deduction', amount: 1800, enabled: true },
      { name: 'ESI', type: 'Deduction', amount: 500, enabled: true },
      { name: 'Professional Tax', type: 'Deduction', amount: 200, enabled: true },
      { name: 'TDS', type: 'Deduction', amount: 2500, enabled: true }

    ]
  };
  toggleAllowance(index: number) {
    this.employeeCtc.allowances[index].enabled = !this.employeeCtc.allowances[index].enabled;
    this.calculateTotals();
  }
  toggleDeduction(index: number) {
    this.employeeCtc.deductions[index].enabled = !this.employeeCtc.deductions[index].enabled;
    this.calculateTotals();
  }
  calculateTotalss() {
    const totalAllowances = this.employeeCtc.allowances
      .filter(a => a.enabled)
      .reduce((sum, a) => sum + a.amount, 0);

    const totalDeductions = this.employeeCtc.deductions
      .filter(d => d.enabled)
      .reduce((sum, d) => sum + d.amount, 0);

    this.employeeCtc.total_Allowances = totalAllowances + this.employeeCtc.otherAllowance;
    this.employeeCtc.total_Deductions = totalDeductions;
    this.employeeCtc.take_Home_Salary = this.employeeCtc.total_Allowances - this.employeeCtc.total_Deductions;
  }
}