import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { ApiService } from 'src/app/api.client';
import pdfMake from "pdfmake/build/pdfmake";
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ToastContainerModule, ToastrService } from 'ngx-toastr';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';
import { ApiResponse } from 'src/app/models/api-response';

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
  attendanceChart!: Chart;
  filterType: 'daily' | 'monthly' | 'yearly' = 'daily';
  employeeId!: number;
  employeeDetails: any;
  form: FormGroup;
  loading = true;
  generateOL: FormGroup;
  submitted: boolean = false;
  attendance: FormGroup;
  payslipForm: FormGroup;
  relievingForm: FormGroup;
  serviceForm: FormGroup;
  qualificationForm: FormGroup;
  leaveRequest: FormGroup;
  result: any;
  errors: string[] = [];
  LeaveTypeList: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private util: UtilsServiceService

  ) {
    Chart.register(...registerables);
  }
  ngOnInit() {
    this.generateOL = this.formBuilder.group({
      full_name: ['', [Validators.required]],
      permanent_address: ['', [Validators.required]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      department: ['', [Validators.required]],
      reportingTo: ['', [Validators.required]],
      location: ['', [Validators.required]],
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
      hr_email: ['', [Validators.required]],
      hr_number: ['', [Validators.required]],
      auth_name: ['', [Validators.required]],
      auth_designation: ['', [Validators.required]],
    });
    this.attendance = this.formBuilder.group({
      attendance_date: ['', Validators.required],
      // other controls...
    });
    this.qualificationForm = this.formBuilder.group({
      employeeId: [''],  // main field for employeeId
      qualifications: this.formBuilder.array([
        this.createQualification()
      ])
    });
    this.leaveRequest = this.formBuilder.group({
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]],
      leaveType: ['', [Validators.required]],
      reason: ['', [Validators.required]],
      remarks: ['', [Validators.required]],
    });
    this.addQualification();

    // Get ID from URL
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
    // Fetch Employee Details
    this.getEmployeeDetails();
    this.loadAttendanceChart();
    new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: ['Checked In', 'Not Checked In', 'On Leave', 'On Week off', 'Holiday', 'Checked Out'],
        datasets: [
          {
            data: [350, 50, 50, 20, 20, 10],
            // backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: '#333',       // Label color
              font: {
                size: 16,          // Label font size
                weight: 'bold'
              }
            },
            position: 'right'    // Legend position
          }
        }
      }
    });
    this.getLeaveTypes();
  }

  getLeaveTypes() {
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    this.api.get(`api/admin/leave/types?companyId=${companyId}`)
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
  // get f() {
  //   return this.leaveRequest.controls;
  // }
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
      leave_Type_Id: this.leaveRequest.get('leaveType')?.value,
      from_Date: this.leaveRequest.get('fromDate')?.value,
      to_Date: this.leaveRequest.get('toDate')?.value,
      status: this.leaveRequest.get('reason')?.value,
      remarks: this.leaveRequest.get('remarks')?.value
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
  get qualifications(): FormArray {
    return this.qualificationForm.get('qualifications') as FormArray;
  }

  createQualification(): FormGroup {
    return this.formBuilder.group({
      class: [''],
      institute: [''],
      board_University: [''],
      year_Of_Passing: [''],
      marks_Grade: [''],
      attachment: [null],
      document_Path: ['']
    });
  }

  addQualification() {
    this.qualifications.push(this.createQualification());
  }

  removeQualification(index: number) {
    this.qualifications.removeAt(index);
  }

  onFileChange(event: any, index: number) {
    const file = event.target.files?.[0];
    const control = this.qualifications?.at(index);

    if (file && control) {
      (control as FormGroup).patchValue({ attachment: file });
    } else {
      console.warn(`No qualification form found at index ${index}`);
    }
  }

  EducationUpdate() {
    if (this.qualificationForm.invalid) {
      this.qualificationForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('employeeId', this.qualificationForm.get('employeeId')?.value);

    this.qualifications.controls.forEach((control, i) => {
      Object.keys(control.value).forEach(key => {
        formData.append(`qualifications[${i}].${key}`, control.get(key)?.value);
      });
    });

    console.log('FormData prepared:', formData);

    // this.api.post('endpoint', formData).subscribe(res => console.log(res));
  }
  newQualification() {
    this.submitted = true;

    if (this.qualificationForm.invalid) {
      return;
    }

    const formData = new FormData();

    // append employeeId
    formData.append('employeeId', this.qualificationForm.get('employeeId')?.value);

    // append qualifications
    this.qualifications.controls.forEach((control, i) => {
      const qualification = control.value;

      formData.append(`qualifications[${i}].id`, qualification.id || 0);
      formData.append(`qualifications[${i}].class`, qualification.class);
      formData.append(`qualifications[${i}].institute`, qualification.institute);
      formData.append(`qualifications[${i}].board_University`, qualification.board_University);
      formData.append(`qualifications[${i}].year_Of_Passing`, qualification.year_Of_Passing);
      formData.append(`qualifications[${i}].marks_Grade`, qualification.marks_Grade);

      if (qualification.attachment) {
        formData.append(`qualifications[${i}].attachment`, qualification.attachment);
      }
      formData.append(`qualifications[${i}].document_Path`, qualification.document_Path || '');
    });

    console.log('Submitting FormData:', formData);

    this.api.post('your-api-endpoint', formData).subscribe({
      next: (res) => {
        this.toast.success("Qualification saved successfully", "Success");
        this.qualificationForm.reset();
        this.qualifications.clear();
        this.addQualification(); // reset with one row
      },
      error: (err) => {
        this.toast.error(err.error?.message || "Error saving qualification");
      }
    });
  }
  get f() {
    return this.generateOL.controls;
  }
  attendanceData = {
    daily: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      present: [90, 85, 88, 92, 87, 80, 70],
      absent: [10, 15, 12, 8, 13, 20, 30]
    },
    monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      present: [88, 90, 92, 87, 85, 89, 10],
      absent: [12, 10, 8, 13, 15, 11, 20]
    },
    yearly: {
      labels: ['2021', '2022', '2023', '2024'],
      present: [89, 91, 90, 88],
      absent: [11, 9, 10, 12]
    }
  };
  loadAttendanceChart() {
    const selectedData = this.attendanceData[this.filterType];

    if (this.attendanceChart) {
      this.attendanceChart.destroy(); // Destroy old chart before creating a new one
    }

    this.attendanceChart = new Chart('attendanceChart', {
      type: 'bar',
      data: {
        labels: selectedData.labels,
        datasets: [
          {
            label: 'Present %',
            data: selectedData.present,
            backgroundColor: '#4da3ff'
          },
          {
            label: 'Absent %',
            data: selectedData.absent,
            backgroundColor: '#f44336'
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function (value) {
                return value + '%';
              }
            }
          }
        }
      }
    });
  }

  changeFilter(type: 'daily' | 'monthly' | 'yearly') {
    this.filterType = type;
    this.loadAttendanceChart();
  }

  stats = {
    totalEmployees: 5000,
    checkedIn: 4500,
    notCheckedIn: 500,
    onLeave: 456,
    weeklyOff: 145,
    holiday: 12,
    checkedOut: 250
  };

  // =============================
  dateFormat(dateString: string | Date): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  showUpdates: boolean = false;

  toggleUpdates() {
    this.showUpdates = !this.showUpdates;
  }
  getEmployeeDetails(): void {
    this.api.get(`${this.employeeId}`).subscribe(
      (res: any) => {
        if (res || res.data) {
          this.employeeDetails = res.data || res;
          this.employeeId = this.employeeDetails.id;
          // patch values to form
          this.generateOL.patchValue({
            full_name: this.employeeDetails.full_Name,
            permanent_address: this.employeeDetails.permanent_Address,
            mobileNumber: this.employeeDetails.mobile_No,
            email: this.employeeDetails.email,
            designation: this.employeeDetails.designation,
            department: this.employeeDetails.department,
            reportingTo: '', // this is not in API, keep empty
            location: this.employeeDetails.present_Address, // or assign office location if available
            doj: this.employeeDetails.joining_Date ? this.employeeDetails.joining_Date.split('T')[0] : '',
            employmentType: this.employeeDetails.employee_Type,
            gross: this.employeeDetails.offer_CTC,
            probition: '',
            reportDate: this.employeeDetails.offer_Date ? this.employeeDetails.offer_Date.split('T')[0] : '',
            noticePeriod: '',
            issueDate: this.employeeDetails.offer_Date ? this.employeeDetails.offer_Date.split('T')[0] : '',
            authoriserName: ''
          });
          this.relievingForm.patchValue({
            employee_id: this.employeeDetails.employee_Code,
            full_name: this.employeeDetails.full_Name,
            doj: this.employeeDetails.joining_Date ? this.employeeDetails.joining_Date.split('T')[0] : '',
            doe: '',
            designation: this.employeeDetails.designation,
            hr_mail: '',
            hr_number: '',
            auth_name: '',
            auth_number: ''
          });
          this.serviceForm.patchValue({
            employee_id: this.employeeDetails.employee_Code,
            full_name: this.employeeDetails.full_Name,
            doj: this.employeeDetails.joining_Date ? this.employeeDetails.joining_Date.split('T')[0] : '',
            doe: '',
            designation: this.employeeDetails.designation,
            location: this.employeeDetails.designation,
          });
          this.qualificationForm.patchValue({
            employeeId: this.employeeDetails.employee_Code,
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
    let docDefinition = {
      pageMargins: [40, 160, 40, 160],
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
          text: 'OFFER LETTER',
          fontSize: 20,
          bold: true,
          margin: 10,
          alignment: 'center',
          decoration: 'underline',
          color: 'black'
        },
        {
          columns: [
            [
              {
                text: this.generateOL?.get('full_name')?.value,
                bold: true
              },
              {
                text: this.generateOL?.get('permanent_address')?.value
              }
            ],
            [
              {
                text: this.dateFormat(this.generateOL?.get('issueDate')?.value),
                alignment: 'right'
              },
            ]
          ]
        },
        {
          margin: 0,
          text: ['Dear', { text: ' ', fontSize: 10 }, { text: this.generateOL?.get('full_name')?.value, bold: true, fontSize: 14 }, { text: ', ', fontSize: 10 }]
        },
        {
          // margin: [0, 0, 5, 0],
          text: [,
            'We are pleased to extend an offer of employment to you for the position of', { text: this.generateOL?.get('designation')?.value, fontSize: 10 }, 'at NG Info SOLUTIONS PVT LTD.',
            'We believe that your skills and experience will be a valuable addition to our team. Please read through this letter and indicate your acceptance by signing this offer letter.'
          ],
        },
        {
          text: '',
          style: 'sectionHeader',
        },
        {
          style: 'tableExample',
          table: {
            widths: [200, '*'],
            body: [
              [{ text: '1.Employment Details:', bold: true, fontSize: 14 }, ''],
              [{ text: 'a) Designation' }, { text: this.generateOL?.get('designation')?.value, bold: true }],
              [' b) Reporting To', { text: this.generateOL?.get('reportingTo')?.value, bold: true }],
              [' c) Place of Posting', { text: this.generateOL?.get('location')?.value, bold: true }],
              // [' d) Date of Joining', this.generateOL?.get('designation')?.value],
              [' d) Date of Joining', { text: this.dateFormat(this.generateOL?.get('doj')?.value), bold: true }],
              [{ text: '2.Salary:', bold: true, fontSize: 14 }, 'Your salary will be ' + this.generateOL?.get('gross')?.value + '/- PA and will be Structured as per the attached Annexure- A Compensation Structure, Other Perquisites & Benefits'],
            ],
          },
          fontSize: 12,
          layout: 'noBorders'
        },
        {
          margin: 10,
          text:
            'The above-mentioned salary is the total cost to the company and includes all payments made and benefits provided by the company directly or indirectly to or on your behalf, whether as salary or otherwise.',
        },
        {
          text: 'TERMS AND CONDITIONS OF APPOINTMENT',
          style: 'sectionHeader'
        },
        {
          ol: [
            'The employment is at-will, which means that either the company or the employee can terminate the employment relationship at any time, with or without cause and with or without notice. ',
            'This offer of employment does not constitute a contract or guarantee of continued employment.It is not intended to create an employment relationship between you and NG Info SOLUTIONS PVT LTD until you have signed the necessary employment agreement and any other required documents.During the probationary period of', { text: this.generateOL?.get('probition')?.value }, 'days, your performance will be evaluated to determine your suitability for the role.',
            'You will be required to sign Confidentiality/Non-Compete Agreement after accepting this offer letter to protect our company`s interests.',
          ],
        },
        {
          text: 'Acceptance',
          style: 'sectionHeader',

        },

        {
          ol: [
            'This Letter of Offer contains the proposed Terms and Conditions of your employment with the Employer and is subject to the preparation and execution of a formal Contract of Employment.',
            'We look forward to your positive response and the opportunity to welcome you to  NG Info SOLUTIONS PVT LTD. If you have any questions or require further information, please feel free to contact', { text: this.generateOL?.get('reportingTo')?.value, fontSize: 10 }, 'at srnritsolutions1292@gmail.com.'

          ]
        },
        {
          text: 'Please note that the terms of employment detailed in this document and annexure are confidential. These contents should not be disclosed to third parties without prior approval from the Company.'
        },
        {
          text: 'Compensation',
          style: 'sectionHeader',
        },
        {
          text: ['Your CTC will be INR ' + this.generateOL?.get('gross')?.value + '/- PA'],

        },

        {
          text: 'Salary/Benifits:',
          style: 'sectionHeader'
        },
        {

          text: [
            'Your monthly gross salary will be INR 39533/-. Break-up of salary is attached in Annexure - A. During the term of your employment, you will be entitled to the benefits provided by the applicable Indian labor and employment laws and you will be eligible to participate in all of the Company’s employee benefits plans as such are adopted by the NG Info SOLUTIONS PVT LTD.The Company shall reserve the right to modify, amend or terminate any employee benefits at any time for any reason, without compensation for any such change or discontinuance.'
          ],
        },
        {
          text: 'Terms and Conditions of Employment',
          style: 'sectionHeader'
        },
        {
          text: [
            'Your employment with us will be governed by the specific terms and conditions referred to in Annexure -B.'
          ],
        },
        {
          text: 'Commencement of Employment',
          style: 'sectionHeader'
        },
        {
          text: [
            'You are required to commence employment on ', { text: this.dateFormat(this.generateOL?.get('reportDate')?.value) }, ' This offer is not valid beyond the said date unless the date is extended by the Company and communicated to you in writing.'
          ],
        },
        {
          text: 'Probation period',
          style: 'sectionHeader'
        },
        {
          text: [
            ' The employee has to undergo a probation evaluation for ', { text: this.generateOL?.get('probition')?.value }, ' months from the day of joining. Once the employee successfully completes the probation period the employee status is confirmed to a full - time employee of the Company.The salary structure during the probation period is mentioned in the Annexure – A.'
          ],
        },

        {
          text: 'Document Submission Requirements',
          style: 'sectionHeader'
        },
        {
          text: [
            ' You are requested to report on your date of commencement of employment (as mentioned in clause 3 above) to complete the joining formalities.At the time of joining, you are requested to submit the documents as per Annexure - C. '
          ],
        },
        {
          text: 'Employment Invention Assignment Agreement',
          style: 'sectionHeader'
        },
        {
          text: [
            'You will be required to execute and be bound by an Employment Invention Assignment Agreement given to you as in Annexure - D.The Employment Invention Assignment Agreement shall coexist with this Employment Agreement. '
          ],
        },
        {
          text: 'Entire Agreement',
          style: 'sectionHeader'
        },
        {
          text: [
            'This letter agreement (together with the agreements and annexures referred to herein) supersedes any',
            'prior agreements, representations or promises of any kind, whether written, oral, express or implied',
            'between you and the Company with respect to the subject matters herein.This letter(together with the',
            'agreements and annexures referred to herein) may not be modified or amended except by a written',
            ' agreement, signed by the Company and by you.'
          ]

        },
        {
          text: [
            'To indicate your agreement with all terms and your acceptance of this offer, please sign the duplicate',
            'copy of the offer on all sheets at the bottom on the right corner and return the same to NG Info SOLUTIONS PVT LTD',
            '.Also, please provide the date you will commence employment with NG Info SOLUTIONS PVT LTD.Once you accept',
            'this offer and join the Company, this letter will serve as your formal Appointment Order.',
          ]
        },
        {
          text: [{ text: 'We welcome you to NG Info SOLUTIONS PVT LTD and look forward to a mutually rewarding association.For NG Info SOLUTIONS PVT LTD', bold: true }]
        },
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
                ), height: 100, width: 150,
                alignment: 'left'
              },
              {
                text: { text: this.generateOL?.get('authoriserName')?.value },
                alignment: 'left'
              },
              {
                text: { text: this.generateOL?.get('authority')?.value },
                alignment: 'left'
              },
              {
                text: `I accept the above terms and conditions of Employment.`,
                alignment: 'left'
              },
              // {
              //   text: `(Signature and Date)`,
              //   alignment: 'left',
              //   horizontal: true,
              //   margin: 10
              // }
            ]
          ]
        },
        {
          text: 'Annexure A',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'black',
          margin: 10
        },

        {
          style: 'tableExample',

          table: {
            widths: [200, '*'],

            body: [
              [{ text: 'Components', bold: true }, { text: 'Annual', bold: true, alignment: 'center' },],
              ['Basic Pay', { text: '384400.00', alignment: 'right' }],
              ['HRA', { text: '36000.00', alignment: 'right' }],
              ['Engagement Bonus', { text: '24000.00', alignment: 'right' }],
              ['Other Allowance', { text: '30000.00', alignment: 'right' }],
              ['Medical Allowance', { text: 'As Per Company Norms', alignment: 'right' }],
              ['Total Take Home', { text: '474400.00', alignment: 'right' }],
              ['PF', { text: '43,200.00', alignment: 'right' }],
              // ['ESI', { text: '9480.00', alignment: 'right' }],
              ['Professional Tax', { text: '2400.00', alignment: 'right' }],
              ['Cost of Company', { text: '5,20,000.00', alignment: 'right' }]
            ],
          },
          fontSize: 12,
        },
        {

          margin: 10,
          text: [
            '** Your Salary is strictly confidential. The above Break-up excludes Statutory Deductions such as Tax Deduction at Source  ',
            '(TDS) that would be deducted at Applicable Rates.'
          ],
        },
        {
          text: 'Annexure B',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'black',
          margin: [10, 100, 10, 10],
        },
        {
          text: 'TERMS AND CONDITIONS OF EMPLOYMENT',
          fontSize: 17,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'black',
          margin: 10
        },
        {
          text: '1. Term of Employment',
          style: 'sectionHeader'
        },
        {
          text: ['Subject to Clauses 3 and 4 below, the term of your employment with NG Info SOLUTIONS PVT LTD is intended to be for',
            'indefinite period subject to termination pursuant to the terms of this Agreement and the requirements of',
            'applicable Indian laws.']
        },
        {
          text: '2. Outside activities/Conflicts',
          style: 'sectionHeader'
        },
        {
          text: ['This position is for a full-time employment with NG Info SOLUTIONS PVT LTD and you shall exclusively devote',
            'yourself to the business of the company.You shall not take on any other work for remuneration(part - time',
            'or otherwise) or work in an advisory capacity, or be interested directly or indirectly(except as',
            'shareholders or debenture holders) in any other trade or business, during your term of employment with',
            'NG Info SOLUTIONS PVT LTD, without written permission from NG Info SOLUTIONS PVT LTD .Similarly, you agree not to bring',
            'any third party confidential information to NG Info SOLUTIONS PVT LTD, including that of your former employer, and',
            'that in performing your duties for the NG Info SOLUTIONS PVT LTD, you will not in any way utilize any such',
            'information, other than in the manner that may be directed by NG Info SOLUTIONS PVT LTD while releasing such',
            'information.']
        },
        {
          text: ['You will be liable to be transferred in such capacity that the Company may determine, to any other',
            'department, branch, manufacturing unit or establishment under the same management or same',
            'principals, whether existing or to be set up in future.In addition, the Company reserves the right to assign',
            'you to other such units or companies as may be determined from time to time.']
        },
        {
          text: '3. Termination',
          style: 'sectionHeader'
        },
        {
          ul: [
            'During the term of your employment, should you desire to leave the services of NG Info SOLUTIONS PVT LTD , you shall be required to give ', { text: this.generateOL?.get('noticePeriod')?.value }, ' days’ notice or salary in lieu thereof.The company may, at its discretion, relieve you before the expiry of notice period without compensating for the remaining notice period.',
            'NG Info SOLUTIONS PVT LTD shall be entitled to terminate your employment without cause at any time by giving you ', { text: this.generateOL?.get('noticePeriod')?.value }, ' days notice or salary in lieu thereof.',
            'Notwithstanding anything mentioned in this Agreement, NG Info SOLUTIONS PVT LTD may terminate your employment, with immediate effect by a notice in writing(without salary in lieu of notice), in the event of your misconduct, including but not limited to, fraudulent, dishonest or undisciplined conduct of, or breach of integrity, or embezzlement, or misappropriation or misuse by you of NG Info SOLUTIONS PVT LTD ’s property, or insubordination or failure to comply with the directions given to you by persons so authorized, or your insolvency or conviction for any offence involving moral turpitude, or breach by you of any terms of this Agreement or NG Info SOLUTIONS PVT LTD Policy or other documents or directions of NG Info SOLUTIONS PVT LTD, or irregularity in attendance, or your unauthorized absence from the place of work(or remote check in in case of work from home) for more than five(5) working days, or closure of the business of NG Info SOLUTIONS PVT LTD, or redundancy of your post in NG Info SOLUTIONS PVT LTD, or upon you conducting yourself in a manner which is regarded by NG Info SOLUTIONS PVT LTD as prejudicial to its own interests or to the interests of its clients and/ or customers.',
            'Notwithstanding anything aforesaid, termination by you shall be subject to the satisfactory completion of all your existing duties, obligations and projects etc.',
            'During the notice period, Company will continue to pay its share of insurance premiums, if applicable.',
            'On acceptance of the resignation notice, you will be required to immediately give up to the company all correspondences, specifications, formulae, books, documents, market data, literature, drawings, effects or records, et al belonging to the company or relating to its business and shall not make or retain any copies of these items. '
          ]
        },
        {
          text: '4. Holidays / Leave',
          style: 'sectionHeader'
        },
        {
          text: 'General Holidays will be declared at the beginning of the Calendar year and all full-time employees are entitled to this benefit.You may be called upon to attend duties as and when required on holidays,  may be scheduled in accordance with the needs of the Company.You will be entitled to vacation and sick leave as per the company`s Paid Leave policy. Casual leave without notice will be considered as Leave against Loss- of - pay.Additional leave will be against Loss - of - Pay.Medical Leave has to be authenticated with Medical Report and is at the discretion of the Management. '
        },
        {
          text: '5. Disclosure of Information',
          style: 'sectionHeader'
        },
        {
          text: ['During the term of your employment with NG Info SOLUTIONS PVT LTD, you are required to disclose all material and',
            'relevant information, which may either affect your employment with NG Info SOLUTIONS PVT LTD currently or in the',
            'future or may be in conflict with the terms of your employment with NG Info SOLUTIONS PVT LTD, either directly or',
            'indirectly', 'including but not limited to any and all agreements relating to your current or prior',
            'employment that may affect your eligibility to be employed by NG Info SOLUTIONS PVT LTD or limit the manner in',
            'which you may be employed.It is NG Info SOLUTIONS PVT LTD ’s understanding that any such agreements or',
            'information will not prevent you from performing the duties of your position and you represent that such',
            'is the case.If at any time during your employment, NG Info SOLUTIONS PVT LTD becomes aware that you have',
            'suppressed any material or relevant information required to be disclosed by you, NG Info SOLUTIONS PVT LTD',
            'reserves the right to forthwith terminate your employment without any notice and without any obligation',
            'or liability to pay any remuneration or other dues to you irrespective of the period that you may have',
            'been employed by NG Info SOLUTIONS PVT LTD.'],
        },
        {
          text: ['Any change in your personal information including residential address, marital status and educational',
            'qualification should be notified to NG Info SOLUTIONS PVT LTD in writing within three(3) days from the start of such',
            'change. Any notice required to be given to you shall be deemed to have been duly and properly given if delivered',
            'to you personally or sent by post to you at your address as recorded in NG Info SOLUTIONS PVT LTD ’s records.']
        },
        {
          text: '6. Adherence to Company Policy',
          style: 'sectionHeader'
        },
        {
          text: 'You agree to conform to and comply with NG Info SOLUTIONS PVT LTD Policies and such directions and orders as may from time to time be given by NG Info SOLUTIONS PVT LTD .'
        },
        {
          text: '7. Travel',
          style: 'sectionHeader'
        },
        {
          text: 'You will be posted in HYDERABAD . But, you may be required to make visits and travel both within India and overseas, as necessary for the proper discharge of your duties.'
        },
        {
          text: '8.Non-Solicitation',
          style: "sectionHeader"
        },
        {
          text: ['You agree that during and upon termination of your employment and for one year thereafter, you shall',
            'not in any manner either directly or indirectly solicit or entice the other employees or customers of SN IT',
            'SOLUTIONS to join or enter into transactions, as the case may be with either you directly or indirectly or',
            'with other entities which are in direct or indirect competition with NG Info SOLUTIONS PVT LTD .']
        },
        {
          text: '9. Assignment',
          style: 'sectionHeader'
        },
        {
          text: ['This Agreement is personal to you and will not be assigned by you. NG Info SOLUTIONS PVT LTD will have the right to',
            'assign this letter of offer to its parent, subsidiaries, subdivisions, affiliates, successors and assigns, and all',
            'covenants and agreements herein will inure to the benefit of and be enforceable as such.']
        },
        {
          text: '10. Arbitration',
          style: "sectionHeader"
        },
        {
          text: ['You agree that the interpretation and enforcement of this Agreement shall be governed by the laws of',
            'India and all disputes under this Agreement shall be governed by the provisions of the Indian Arbitration',
            'and Conciliation Act, 1996. The venue for arbitration will be .']
        },
        {
          text: ['This is to certify that I have read this Agreement and all Annexure and understood all the terms and',
            'conditions mentioned therein and I hereby accept and agree to abide by them.']
        },
        {
          text: 'Annexure C',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'black',
          margin: 10
        },
        {
          text: 'List of Documents to be submitted by you before the day of joining.',
          fontSize: 12,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'black',
          margin: 10
        },
        {

          ol: [
            ' Certificates supporting your educational qualifications along with mark sheets (10+12+ Graduation+ Post Graduation + Course Certifications) ',
            'Your latest salary slip from last employer and salary certificate',
            'Your relieving letter from your last employer',
            'Experience Certificates from all previous employers',
            'Updated resume',
            'Form 16 or Taxable Income Statement duly certified by previous employer (Statement showing deductions & Taxable Income with break-up) ',
            '4 Passport size photographs (White Background)',
            'Passport copy and Work Permit in case of foreign citizens',
            'Proof of Age',
            'Proof of Address',
            'Copy of PAN Card'


          ],
          text: 'Please carry all the originals for validation.'
        },
        {
          text: 'Annexure D',
          // margin: [10, 100, 10, 10],
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'black',
        },
        {
          text: 'Declaration',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'black',
          margin: 10
        },
        {

          margin: 10,
          text: [
            'I hereby represent and warrants, and undertakes, affirms, and agrees that as of the Date of Joining with NG Info Solutions Pvt Ltd.'
          ],
        },
        {

          ol: [
            'I will have terminated my employment with all my previous employers',
            'I have not entered into any agreement or arrangement which may restrict, prohibit, or debar or conflict or be inconsistent with my acceptance of the offer here under.',
            'I am in good standing and that I have full capacity and authority to accept this offer letter, Non-Disclosure Agreement and Employment Agreement and to perform its obligations here under according to the terms hereof.',
            'Neither the acceptance of this offer letter nor the execution and delivery of the agreement contemplated here under, or the fulfillment of or compliance with the terms and conditions thereof, conflict with or result in a breach of or a default under any of the terms, conditions or provisions of any legal restriction (including, without limitation, any judgment, order, injunction, decree or ruling of any court or governmental authority, or any federal, state, local or other law, statute, rule or regulation) or any covenant or agreement or instrument to which I am a party, or by which I am bound, nor does such execution, delivery, consummation or compliance violate or result in the violation any documents',



          ],
        },
        {
          columns: [


            [


              {
                text: `(Signature and Date)`,
                alignment: 'left',
                horizontal: true,
                margin: 18
              }
            ]
          ]
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          // decoration: 'underline',
          fontSize: 14,
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

  // Payslip
  async Payslip_generatePDF(action = 'open') {
    const data = this.employeeDetails;
    // const logo = await this.getBase64ImageFromURL(data.company.logo);

    const earningsRows = data.payslip.earnings.map((e, i) => [
      e.label, e.amount,
      data.payslip.deductions[i]?.label || '', data.payslip.deductions[i]?.amount || ''
    ]);

    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [50, 150, 50, 60],
      content: [
        {
          style: 'tableExample',
          table: {
            widths: [100, '*', 100, '*'],
            body: [
              [
                // { image: logo, height: 64, width: 64, colSpan: 2, rowSpan: 2, alignment: 'center', margin: [0, 20] }, '',
                { text: data.company.name, fontSize: 16, bold: true, colSpan: 2, alignment: 'left', margin: [0, 5] }, ''
              ],
              ['', '', { text: data.company.address, colSpan: 2, alignment: 'left', margin: [0, 0, 0, 5] }, ''],
              [{ text: `Salary Slip for the month of ${data.payslip.month}`, colSpan: 4, alignment: 'center', color: 'blue', bold: true, margin: [0, 5] }, '', '', ''],

              ['Name', data.payslip.employee.name, 'Pan No', data.payslip.employee.pan],
              ['Date of Joining', data.payslip.employee.doj, 'Gender', data.payslip.employee.gender],
              ['Designation', data.payslip.employee.designation, 'Employment Type', data.payslip.employee.employmentType],
              ['Emp No', data.payslip.employee.empNo, 'Working Days', data.payslip.employee.workingDays],
              ['Location', data.payslip.employee.location, 'Paid Days', data.payslip.employee.paidDays],
              ['Bank Name', data.payslip.employee.bankName, 'Account No', data.payslip.employee.accountNo],
              ['EPF No', data.payslip.employee.epfNo, 'UAN No', data.payslip.employee.uanNo],

              [{ text: 'EARNINGS', colSpan: 2, bold: true, alignment: 'center', margin: [0, 5] }, '',
              { text: 'DEDUCTIONS', colSpan: 2, bold: true, alignment: 'center', margin: [0, 5] }, ''],

              ...earningsRows,

              [{ text: 'Total Earnings', bold: true }, data.payslip.totalEarnings,
              { text: 'Total Deductions', bold: true }, data.payslip.totalDeductions],

              ['', '', { text: 'Net Pay', bold: true }, { text: data.payslip.netPay, bold: true }],

              [{
                text: 'This is a computer generated document. Signature & seal not required. For any discrepancy contact accounts department within 3 days or email info@nginfosolutions.com',
                colSpan: 4,
                fillColor: '#eeeeee',
                fontSize: 9,
                alignment: 'center',
                margin: [0, 10, 0, 0]
              }, '', '', '']
            ]
          },
          fontSize: 12
        }
      ]
    };

    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download(`Payslip_${data.payslip.month.replace(/ /g, '_')}.pdf`);
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else {
      pdfMake.createPdf(docDefinition).open();
    }
  }

  async Reliving_generatePDF(action = 'open') {
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
        {
          margin: 10,
          text: [' If You have any questions regarding the contents, please do not hesitate contact us on', this.relievingForm?.get('hr_mail')?.value, '. You can also contact on ', this.relievingForm?.get('hr_number')?.value, ''],
        },
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
            'company from' + this.serviceForm?.get("doj")?.value + 'to' + this.serviceForm?.get("reliving_date")?.value],
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


}
