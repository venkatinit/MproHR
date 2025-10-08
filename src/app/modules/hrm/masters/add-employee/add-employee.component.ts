import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ApiService } from 'src/app/api.client';
// import { PayslipPopupComponent } from '../payslip-popup/payslip-popup.component';
import { DatePipe } from '@angular/common';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
class Product {
  name: string;
  price: number;
  qty: number;
}
class Invoice {
  customerName: string;
  address: string;
  contactNo: number;
  email: string;
  products: Product[] = [];
  additionalDetails: string;
  constructor( ) {
    // Initially one empty product row we will show 
    this.products.push(new Product());
  }
}
@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  invoice = new Invoice();
  addEmployee!: FormGroup;
  submitted: boolean = false;
  spinLoader = false;
  // selectedEmpType: any;
  // selectedDepartment: any;
  // selectedDesignation: any;
  // selectedEmpGrade: any;
  // Employee_details: any;
  // selectedDate: Date;
  // message: string;
  companyList:any;
  errors: string[] = [];
  messages: string[] = [];
  companyCode: string = '';
  minDate: Date = new Date();
  form: FormGroup;
  Students = {
    dob: ''
  }
  ngOnInit(): void {
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    this.addEmployee = this.formBuilder.group({
      company: ['', Validators.required], //required
      employee_Id: ['', Validators.required],
      full_name: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      gender: ['', Validators.required],
      father_Name: ['', Validators.required],
      mother_Name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mbl_no: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      employee_type: ['', Validators.required],
      present_address: ['', Validators.required],
      permanent_address: ['', Validators.required],
      department: ['', Validators.required],
      technology: ['', Validators.required],
      offer_date: ['', Validators.required],
      join_date: ['', Validators.required],
      offer_designation: ['', Validators.required],
      offer_ctc: ['', Validators.required],
      current_designation: ['', Validators.required],
      // current_ctc: ['', Validators.required],
      uan_no: ['', Validators.pattern('^[0-9]{12}$')],
      pf_no: [''],
      adhar_no: ['', Validators.required],
      pan_no: ['', Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)],
      ref_name: ['', Validators.required],
      ref_contact_no: ['', Validators.required],
      bank_name: ['', Validators.required],
      account_no: ['', Validators.required],
      ifsc: ['', Validators.required],
    });
    this.getCompanyList();
  }
  constructor(private formBuilder: FormBuilder, private router: Router, private util: UtilsServiceService, private api: ApiService, private modalService: NgbModal, private userService: UsersService,
    public toast: ToastrService) { }
  // getEmployeedetails() {
  //   this.api.get('').subscribe((response: any) => {
  //     this.Employee_details = response.data;
  //     this.addEmployee.controls['full_name'].setValue(this.Employee_details['doj']);
  //     this.addEmployee.controls['date_of_birth'].setValue(this.Employee_details['']);
  //     this.addEmployee.controls['email'].setValue(this.Employee_details['member_Name']);
  //     this.addEmployee.controls['mbl_no'].setValue(this.Employee_details['mobileNo']);
  //     this.addEmployee.controls['permanent_address'].setValue(this.Employee_details['email_ID']);
  //     this.addEmployee.controls['employee_type'].setValue(this.Employee_details['age']);
  //     this.addEmployee.controls['department'].setValue(this.Employee_details['gender']);
  //     this.addEmployee.controls['technology'].setValue(this.Employee_details['occoupation']);
  //     this.addEmployee.controls['offer_date'].setValue(this.Employee_details['offer_date']);
  //     this.addEmployee.controls['join_date'].setValue(this.Employee_details['join_date']);
  //     this.addEmployee.controls['offer_designation'].setValue(this.Employee_details['father_Name']);
  //     this.addEmployee.controls['offer_ctc'].setValue(this.Employee_details['res_Address']);
  //     this.addEmployee.controls['hike'].setValue(this.Employee_details['']);
  //     this.addEmployee.controls['current_designation'].setValue(this.Employee_details['']);
  //     this.addEmployee.controls['current_ctc'].setValue(this.Employee_details['branch']);
  //     this.addEmployee.controls['resignation_date'].setValue(this.Employee_details['share_Cert_No']);
  //     this.addEmployee.controls['reliving_date'].setValue(this.Employee_details['no_of_Shares']);
  //     this.addEmployee.controls['adhar_no'].setValue(this.Employee_details['bank_Ac_No']);
  //     this.addEmployee.controls['pan_no'].setValue(this.Employee_details['bank_Name']);
  //     this.addEmployee.controls['ref_no'].setValue(this.Employee_details['ifsC_Code']);
  //     this.addEmployee.controls['ref_contact_no'].setValue(this.Employee_details['branch']);
  //     this.addEmployee.controls['bank_name'].setValue(this.Employee_details['pan_No']);
  //     this.addEmployee.controls['account_no'].setValue(this.Employee_details['passport_No']);
  //     this.addEmployee.controls['ifsc'].setValue(this.Employee_details['ratation_Card_No']);
  //   }, (error) => {
  //     console.log(error);
  //   })
  // }
  checkDate() {
    const dateSendingToServer = new DatePipe('en-US').transform(this.Students.dob, 'dd/MM/yyyy')
    console.log(dateSendingToServer);
  }
  convertToUppercase(controlName: string) {
    const currentValue = this.addEmployee.get(controlName)?.value || '';
    this.addEmployee.get(controlName)?.setValue(currentValue.toUpperCase(), { emitEvent: false });
  }
  get f() {
    return this.addEmployee.controls;
  }
  // get items(): FormArray {
  //   return this.addEmployee.get('items') as FormArray;
  // }
  // get experience(): FormArray {
  //   return this.addEmployee.get('experience') as FormArray;
  // }
  // createItem(): FormGroup {
  //   return this.formBuilder.group({
  //     class: ['', Validators.required],
  //     institute_name: ['', Validators.required],
  //     board: ['', Validators.required],
  //     passing_year: ['', Validators.required],
  //     marks: ['', Validators.required],
  //     memo: ['', Validators.required],
  //   });
  // }
  // createExp(): FormGroup {
  //   return this.formBuilder.group({
  //     company: ['', Validators.required],
  //     experience: ['', Validators.required],
  //     position: ['', Validators.required],
  //     department: ['', Validators.required],
  //     doj: ['', Validators.required],
  //     dor: ['', Validators.required],
  //     offerLetter: ['', Validators.required],
  //     relievingLetter: ['', Validators.required],
  //     Payslips: ['', Validators.required],
  //     hikeLetter: ['', Validators.required],

  //   });
  // }
  // showMemoField: boolean[] = [];
  // toggleMemoField(i: number) {
  //   this.showMemoField[i] = !this.showMemoField[i];
  // }
  // showExpField: boolean[] = [];
  // toggleExpField(i: number) {
  //   this.showExpField[i] = !this.showExpField[i];
  // }
  // addRow() {
  //   this.items.push(this.createItem());
  // }
  // removeRow(index: number) {
  //   if (this.items.length > 1) {
  //     this.items.removeAt(index);
  //   }
  // }
  // addExp() {
  //   this.experience.push(this.createItem());
  // }
  // removeexp(index: number) {
  //   if (this.experience.length > 1) {
  //     this.experience.removeAt(index);
  //   }
  // }
  getCompanyList() {
    this.api.get('api/company/all').subscribe((res: any) => {
      this.companyList = res?.data?.data || [];
    });
  }
  saveNewEmpolyee() {
    this.submitted = true;

    if (!this.addEmployee.valid) {
      return;
    }

    this.spinLoader = true;

    const company_Code = this.util.decrypt_Text(localStorage.getItem('company_code'));
    const url = 'register';

    const body = {
      "id": 0,
      "company_Id": this.addEmployee.get("company")?.value,
      "employee_Code": this.addEmployee.get("employee_Id")?.value,
      "full_Name": this.addEmployee.get("full_name")?.value,
      "date_Of_Birth": this.addEmployee.get("date_of_birth")?.value,
      "gender": this.addEmployee.get("gender")?.value,
      "father_Name": this.addEmployee.get("father_Name")?.value,
      "mother_Name": this.addEmployee.get("mother_Name")?.value,
      "email": this.addEmployee.get("email")?.value,
      "mobile_No": this.addEmployee.get("mbl_no")?.value,
      "employee_Type": this.addEmployee.get("employee_type")?.value,
      "present_Address": this.addEmployee.get("present_address")?.value,
      "permanent_Address": this.addEmployee.get("permanent_address")?.value,
      "department": this.addEmployee.get("department")?.value,
      "technology": this.addEmployee.get("technology")?.value,
      "offer_Date": this.addEmployee.get("offer_date")?.value,
      "joining_Date": this.addEmployee.get("join_date")?.value,
      "offer_Designation": this.addEmployee.get("offer_designation")?.value,
      "offer_CTC": this.addEmployee.get("offer_ctc")?.value,
      "designation": this.addEmployee.get("current_designation")?.value,
      // "current_ctc": this.addEmployee.get("current_ctc")?.value,
      "uaN_Number": this.addEmployee.get("uan_no")?.value,
      "pF_Number": this.addEmployee.get("pf_no")?.value,
      "aadhar_Number": this.addEmployee.get("adhar_no")?.value,
      "paN_Number": this.addEmployee.get("pan_no")?.value,
      "referee_Name": this.addEmployee.get("ref_name")?.value,
      "referee_Contact": this.addEmployee.get("ref_contact_no")?.value,
      "bank_Name": this.addEmployee.get("bank_name")?.value,
      "account_number": this.addEmployee.get("account_no")?.value,
      "ifsC_Code": this.addEmployee.get("ifsc")?.value,
      // Add extra fields here if your form includes them
    };

    this.api.addEmployee(url, body).subscribe(
      (res: any) => {
        this.submitted = false;
        this.spinLoader = false;
        this.toast.success("Employee added successfully", "Success");
        // $('#newModal').modal('hide');
        this.addEmployee.reset();
      },
      (error: any) => {
        this.spinLoader = false;
        this.submitted = false;
        this.errors = [error.error?.Message || 'An error occurred'];
        this.toast.error(this.errors[0], "Validation Failed");
      }
    );
  }
  // sendFileToserver(event) {
  //   console.log(event.target.files[0]);
  //   const formData = new FormData();
  //   formData.append('file', event.target.files[0]);
  //   console.log(formData);
  //   const company_Code = this.util.decrypt_Text(localStorage.getItem('company_code'));
  //   const url = `company/add-emp/${company_Code}`;
  //   this.api.addEmployee(url, formData).subscribe((res: any) => {
  //     if (res) {
  //       alert('File uploaded successfully');
  //     }
  //   })
  // }
  // addProduct() {
  //   this.invoice.products.push(new Product());
  // }

  // async Experience_generatePDF(action = 'open') {
  //   let docDefinition = {
  //     pageSize: 'A4',
  //     pageMargins: [40, 120, 40, 120],

  //     background: [
  //       {
  //         image: await this.getBase64ImageFromURL(
  //           "assets/img/SRNR-pdf-bg.jpg"
  //         ), fit: [595, 852]



  //       }
  //     ],
  //     content: [
  //       {
  //         text: '',
  //         style: 'sectionHeader'
  //       },
  //       {

  //         columns: [

  //           [
  //             {
  //               text: `Date:27/04/2023`,
  //               alignment: 'right'
  //             },
  //             {
  //               text: `Place:Hyderabad`,
  //               alignment: 'right'
  //             }
  //           ]
  //         ]
  //       },
  //       {
  //         text: '',
  //         style: 'sectionHeader'
  //       },
  //       {
  //         text: 'To Whom It May Concern',
  //         fontSize: 20,
  //         bold: true,
  //         alignment: 'center',
  //         decoration: 'underline',
  //         color: 'black'
  //       },
  //       {
  //         text: ['It is hereby certified that Mr/Ms.', this.addEmployee?.get("full_name")?.value, 'worked as a Manager in our ',
  //           'company from' + this.addEmployee?.get("join_date")?.value + 'to' + this.addEmployee?.get("reliving_date")?.value],
  //         style: 'text1',
  //       },
  //       {
  //         text: ['During his/her tenure,we found him/her sincere,hard working, and efficient. We wish all',
  //           'the success in his/her future endeavours.',
  //         ],
  //         style: 'text1',
  //       },



  //       {
  //         text: '',
  //         style: 'text'
  //       },
  //       {
  //         columns: [

  //           [
  //             {
  //               image: await this.getBase64ImageFromURL(
  //                 "assets/img/ng-stamp.png"
  //               ), height: 64, width: 64,
  //               alignment: 'right'
  //             },
  //             {
  //               text: `NG Info Solutions Pvt Ltd`,
  //               alignment: 'right'
  //             },
  //             {
  //               text: `Authorized Signatory`,
  //               alignment: 'right'
  //             }
  //           ]
  //         ]
  //       },

  //     ],
  //     styles: {

  //       sectionHeader: {
  //         bold: true,
  //         decoration: 'underline',
  //         fontSize: 14,
  //         margin: [15, 15, 15, 15],


  //       },
  //       text: {


  //         fontSize: 14,
  //         margin: [15, 15, 15, 15],

  //       },
  //       text1: {


  //         fontSize: 14,
  //         margin: [15, 15, 15, 15],


  //       }

  //     },
  //     defaultStyle: {
  //       alignment: 'justify'
  //     }

  //   };

  //   if (action === 'download') {
  //     pdfMake.createPdf(docDefinition).download();
  //   } else if (action === 'print') {
  //     pdfMake.createPdf(docDefinition).print();
  //   } else {
  //     pdfMake.createPdf(docDefinition).open();
  //   }

  // }
  // getBase64ImageFromURL(url) {
  //   return new Promise((resolve, reject) => {
  //     var img = new Image();
  //     img.setAttribute("crossOrigin", "anonymous");

  //     img.onload = () => {
  //       var canvas = document.createElement("canvas");
  //       canvas.width = img.width;
  //       canvas.height = img.height;

  //       var ctx = canvas.getContext("2d");
  //       ctx.drawImage(img, 0, 0);

  //       var dataURL = canvas.toDataURL("image/png");

  //       resolve(dataURL);
  //     };

  //     img.onerror = error => {
  //       reject(error);
  //     };

  //     img.src = url;
  //   });
  // }
  // async Payslip_generatePDF(action = 'open') {
  //   let docDefinition = {
  //     content: [


  //       {
  //         columns: [
  //           [
  //             {
  //               text: this.invoice.customerName,
  //               bold: true
  //             },
  //             { text: this.invoice.address },
  //             { text: this.invoice.email },
  //             { text: this.invoice.contactNo }
  //           ],

  //         ]
  //       },


  //       {
  //         style: 'tableExample',
  //         table: {
  //           widths: [100, '*', 100, '*'],
  //           body: [
  //             [
  //               {
  //                 image: await this.getBase64ImageFromURL(
  //                   'assets/img/logo1.png'
  //                 ),
  //                 height: 64,
  //                 width: 84,
  //                 alignment: 'center',
  //                 colSpan: 2

  //               }, '',
  //               {

  //                 text: ['1-68/4 & 5,Plot No 80 & 81, Survey No 76,4th floor, Jainhind Enclave, Madhapur, Hyderabad Telangana-500081 ',
  //                   ' Ph : 040 40057908, 8977005865'],




  //                 colSpan: 2
  //               }, ''

  //             ],
  //             [{
  //               text: 'Salary slip for the month of Oct - 2022', colSpan: 4,
  //               alignment: 'center',
  //               color: 'blue'
  //             }, ''],

  //             ['Name', { text: this.addEmployee?.get('full_name')?.value, bold: true }, 'Pan No', { text: this.addEmployee?.get('pan_no')?.value, bold: true }],
  //             ['Designation', { text: this.addEmployee?.get('offer_designation')?.value, bold: true }, 'Employment', { text: this.addEmployee?.get('employee_type')?.value, bold: true }],
  //             ['Emp No', 'NGE009', '	Working Days', ' 31'],
  //             ['Location', 'Hyderabad', '	Paid Days', ' 31'],
  //             ['Bank Name', { text: this.addEmployee?.get('bank_name')?.value, bold: true }, 'Account Number', { text: this.addEmployee?.get('account_no')?.value, bold: true }],
  //             [
  //               {
  //                 text: '',
  //                 colSpan: 2

  //               },
  //               '',

  //               {

  //                 text: '',



  //                 colSpan: 2
  //               }, ''

  //             ],
  //             [{ text: 'Earnings', bold: true }, { text: 'Amount(Rs)', bold: true }, { text: 'Deductions', bold: true }, { text: 'Amount(Rs)', bold: true }],
  //             [{ text: 'Basic Salary', bold: true }, '7,180', { text: 'Provident Fund', bold: true }, ' 1,800'],
  //             [{ text: 'HRA', bold: true }, '3,59', { text: '	Professional Tax', bold: true }, ' 200'],
  //             [{ text: 'Conveyance', bold: true }, '800', { text: '	Other Deductions', bold: true }, ' 0.00'],
  //             [{ text: 'Medical Allowance', bold: true }, '1250', '	', ' '],
  //             [{ text: 'Other Allowance', bold: true }, '7,180', '', ''],
  //             [{ text: 'Total Earnings', bold: true }, '20,000', { text: '	Total Deductions', bold: true }, ' 2000'],
  //             [{ text: 'Net Pay:', bold: true }, '18,000', '	', ' '],

  //             [{
  //               text: 'Computer generated document. Signature & Seal not required.Please Contact Accounts Department within 3 days of receipt for any discrepancy in salary or mail to info@ninformationtechnologies.com',
  //               colSpan: 4,
  //               backgroundcolor: 'red',
  //               alignment: 'center',


  //             }, '',],



  //           ],
  //         },
  //         fontSize: 12,
  //       },


  //     ],
  //     styles: {
  //       sectionHeader: {
  //         bold: true,
  //         decoration: 'underline',
  //         fontSize: 14,
  //         margin: [0, 15, 0, 15],
  //       }
  //     }
  //   };

  //   if (action === 'download') {
  //     pdfMake.createPdf(docDefinition).download();
  //   } else if (action === 'print') {
  //     pdfMake.createPdf(docDefinition).print();
  //   } else {
  //     pdfMake.createPdf(docDefinition).open();
  //   }
  // }
  // async Offer_generatePDF(action = 'open') {
  //   let docDefinition = {
  //     pageMargins: [40, 160, 40, 160],
  //     pageSize: 'A4',
  //     background: [
  //       {
  //         image: await this.getBase64ImageFromURL(
  //           "assets/img/SRNR-pdf-bg.jpg"
  //         ), fit: [595, 852]
  //       }
  //     ],
  //     content: [
  //       // {
  //       //   text: 'ELECTRONIC SHOP',
  //       //   fontSize: 16,
  //       //   alignment: 'center',
  //       //   color: '#047886'
  //       // },
  //       {
  //         text: 'OFFER LETTER',
  //         fontSize: 20,
  //         bold: true,
  //         margin: 10,
  //         alignment: 'center',
  //         decoration: 'underline',
  //         color: 'black'
  //       },
  //       // {
  //       //   text: 'EMPID:SRNRE-001',
  //       //   style: 'sectionHeader'
  //       // },
  //       {
  //         columns: [
  //           [
  //             // {
  //             //   text: this.addEmployee?.get('full_name')?.value,
  //             //   bold: true
  //             // },
  //             {
  //               text: this.addEmployee?.get('permanent_address')?.value
  //             },
  //             // styles: {
  //             //   margin: [15, 0, 15, 0],
  //             // }
  //           ],
  //           [
  //             {
  //               // text:{ text: this.addEmployee?.get('offer_date')?.value },
  //               text: '14-12-2024',
  //               alignment: 'right'
  //             },
  //           ]
  //         ]
  //       },
  //       {
  //         margin: 0,
  //         text: ['Dear', { text: ' ', fontSize: 10 }, { text: this.addEmployee?.get('full_name')?.value, bold: true, fontSize: 14 }, { text: ', ', fontSize: 10 }]
  //       },
  //       {
  //         // margin: [0, 0, 5, 0],
  //         text: [,
  //           'We are pleased to extend an offer of employment to you for the position of', { text: ' ', fontSize: 10 }, { text: this.addEmployee?.get('offer_designation')?.value, bold: true }, { text: ' ', fontSize: 10 }, 'at SRNR IT SOLUTIONS PVT LTD.',
  //           'We believe that your skills and experience will be a valuable addition to our team. Please read through this letter and indicate your acceptance by signing this offer letter.'
  //         ],
  //       },
  //       {
  //         text: '',
  //         style: 'sectionHeader',
  //       },
  //       {
  //         style: 'tableExample',
  //         table: {
  //           widths: [200, '*'],
  //           body: [
  //             [{ text: '1.Employment Details:', bold: true, fontSize: 14 }, ''],
  //             [{ text: 'a) Designation' }, { text: this.addEmployee?.get('offer_designation')?.value, bold: true }],
  //             [' b) Reporting To', { text: ' MANASA KANCHARLA', bold: true }],
  //             [' c) Place of Posting', { text: ' Hyderabad', bold: true }],
  //             [' d) Date of Joining', '25-12-2024'],
  //             // [' d) Date of Joining', { text: this.addEmployee?.get('join_date')?.value, bold: true }],
  //             [' e) Working Hours', { text: ' 08 Hrs : 30 Mins', bold: true }],
  //             [{ text: '2.Salary:', bold: true, fontSize: 14 }, 'Your salary will be ' + this.addEmployee?.get('offer_ctc')?.value + '/- PA and will be Structured as per the attached Annexure- A Compensation Structure, Other Perquisites & Benefits'],
  //           ],
  //         },
  //         fontSize: 12,
  //         layout: 'noBorders'

  //       },
  //       {
  //         margin: 10,
  //         text:
  //           'The above-mentioned salary is the total cost to the company and includes all payments made and benefits provided by the company directly or indirectly to or on your behalf, whether as salary or otherwise.',

  //       },

  //       {
  //         text: 'TERMS AND CONDITIONS OF APPOINTMENT',
  //         style: 'sectionHeader'
  //       },
  //       {

  //         ol: [
  //           'The employment is at-will, which means that either the company or the employee can terminate the employment relationship at any time, with or without cause and with or without notice. ',
  //           'This offer of employment does not constitute a contract or guarantee of continued employment.It is not intended to create an employment relationship between you and SRNR IT SOLUTIONS PVT LTD until you have signed the necessary employment agreement and any other required documents.During the probationary period of 50 days, your performance will be evaluated to determine your suitability for the role.',
  //           'You will be required to sign Confidentiality/Non-Compete Agreement after accepting this offer letter to protect our company`s interests.',
  //         ],
  //       },
  //       {
  //         text: 'Acceptance',
  //         style: 'sectionHeader',

  //       },

  //       {
  //         ol: [
  //           'This Letter of Offer contains the proposed Terms and Conditions of your employment with the Employer and is subject to the preparation and execution of a formal Contract of Employment.',
  //           'We look forward to your positive response and the opportunity to welcome you to  SRNR IT SOLUTIONS PVT LTD. If you have any questions or require further information, please feel free to contact  MANASA KANCHARLA at srnritsolutions1292@gmail.com.'

  //         ]
  //       },
  //       {
  //         text: 'Please note that the terms of employment detailed in this document and annexure are confidential. These contents should not be disclosed to third parties without prior approval from the Company.'
  //       },
  //       {
  //         text: 'Compensation',
  //         style: 'sectionHeader',
  //       },
  //       {
  //         // text: ['Your CTC will be INR'  + this.addEmployee?.get('offer_ctc')?.value + ' / -'],
  //         text: ['Your CTC will be INR ' + this.addEmployee?.get('offer_ctc')?.value + '/- PA'],

  //       },

  //       {
  //         text: 'Salary/Benifits:',
  //         style: 'sectionHeader'
  //       },
  //       {

  //         text: [
  //           'Your monthly gross salary will be INR 39533/-. Break-up of salary is attached in Annexure - A. During the term of your employment, you will be entitled to the benefits provided by the applicable Indian labor and employment laws and you will be eligible to participate in all of the Company’s employee benefits plans as such are adopted by the SRNR IT SOLUTIONS PVT LTD.The Company shall reserve the right to modify, amend or terminate any employee benefits at any time for any reason, without compensation for any such change or discontinuance.'
  //         ],
  //       },
  //       {
  //         text: 'Terms and Conditions of Employment',
  //         style: 'sectionHeader'
  //       },
  //       {
  //         text: [
  //           'Your employment with us will be governed by the specific terms and conditions referred to in Annexure -B.'
  //         ],
  //       },
  //       {
  //         text: 'Commencement of Employment',
  //         style: 'sectionHeader'
  //       },
  //       {

  //         text: [
  //           'You are required to commence employment on 25-12-2024 This offer is not valid beyond the said date unless the date is extended by the Company and communicated to you in writing.'
  //         ],
  //       },
  //       {
  //         text: 'Probation period',
  //         style: 'sectionHeader'
  //       },
  //       {
  //         text: [
  //           ' The employee has to undergo a probation evaluation for three months from the day of joining. Once the employee successfully completes the probation period the employee status is confirmed to a full - time employee of the Company.The salary structure during the probation period is mentioned in the Annexure – A.'
  //         ],
  //       },

  //       {
  //         text: 'Document Submission Requirements',
  //         style: 'sectionHeader'
  //       },
  //       {
  //         text: [
  //           ' You are requested to report on your date of commencement of employment (as mentioned in clause 3 above) to complete the joining formalities.At the time of joining, you are requested to submit the documents as per Annexure - C. '
  //         ],
  //       },
  //       {
  //         text: 'Employment Invention Assignment Agreement',
  //         style: 'sectionHeader'
  //       },
  //       {
  //         text: [
  //           'You will be required to execute and be bound by an Employment Invention Assignment Agreement given to you as in Annexure - D.The Employment Invention Assignment Agreement shall coexist with this Employment Agreement. '
  //         ],
  //       },
  //       {
  //         text: 'Entire Agreement',
  //         style: 'sectionHeader'
  //       },
  //       {
  //         text: [
  //           'This letter agreement (together with the agreements and annexures referred to herein) supersedes any',
  //           'prior agreements, representations or promises of any kind, whether written, oral, express or implied',
  //           'between you and the Company with respect to the subject matters herein.This letter(together with the',
  //           'agreements and annexures referred to herein) may not be modified or amended except by a written',
  //           ' agreement, signed by the Company and by you.'
  //         ]

  //       },
  //       {
  //         text: [
  //           'To indicate your agreement with all terms and your acceptance of this offer, please sign the duplicate',
  //           'copy of the offer on all sheets at the bottom on the right corner and return the same to SRNR IT SOLUTIONS PVT LTD',
  //           '.Also, please provide the date you will commence employment with SRNR IT SOLUTIONS PVT LTD.Once you accept',
  //           'this offer and join the Company, this letter will serve as your formal Appointment Order.',
  //         ]
  //       },
  //       {
  //         text: [{ text: 'We welcome you to SRNR IT SOLUTIONS PVT LTD and look forward to a mutually rewarding association.For SRNR IT SOLUTIONS PVT LTD', bold: true }]
  //       },
  //       // {
  //       //   margin: 5,
  //       //   text: [
  //       //     'If this offer of employment is acceptable to you as per Terms and Conditions mentioned above, you are requested to return the duplicate copy of the offer duly signed by you on all pages including the Annexure 1, 2, & 3 as a token of your acceptance latest by 02-Feb-2023, failing which it will be presumed that you are not interested in this offer and the offer will stand withdrawn. ',
  //       //   ],
  //       // },
  //       // {
  //       //   margin: 10,
  //       //   text: [
  //       //     'Please note, by signing this letter, you confirm with the Company that you are under no contractual or other ',
  //       //     'legal obligations that would prohibit you from taking this position or performing your duties with the ',
  //       //     'Company. ',
  //       //   ],
  //       // },
  //       // {
  //       //   margin: 10,
  //       //   text: [
  //       //     'We welcome you to NG Info Solutions Pvt Ltd. and look forward to your contribution for mutual ',
  //       //     ' growth. In the meantime, please do not hesitate to call Mr. PL Narayana, should you have any queries or ',
  //       //     'concerns you would like to discuss. ',
  //       //   ],
  //       // },
  //       {
  //         columns: [
  //           [
  //             {
  //               text: `Yours faithfully,`,
  //               alignment: 'left',
  //               margin: 10
  //             },
  //             {
  //               text: `For SRNR IT Solutions Pvt Ltd.,`,
  //               alignment: 'left',

  //             },
  //             {
  //               image: await this.getBase64ImageFromURL(
  //                 "assets/img/srnrroundstamp.png"
  //               ), height: 100, width: 150,
  //               alignment: 'left'
  //             },
  //             // {
  //             //   image: await this.getBase64ImageFromURL("assets/img/sign.png"),
  //             //   height: 64,
  //             //   width: 64,
  //             //   alignment: 'left',
  //             //   absolutePosition: { x: 65, y: 250 } 
  //             // },
  //             {
  //               text: `JAYA RAMA REDDY`,
  //               alignment: 'left'
  //             },
  //             {
  //               text: `MANAGING DIRECTOR`,
  //               alignment: 'left'
  //             },
  //             {
  //               text: `I accept the above terms and conditions of Employment.`,
  //               alignment: 'left'
  //             },
  //             {
  //               text: `(Signature and Date)`,
  //               alignment: 'left',
  //               horizontal: true,
  //               margin: 10
  //             }
  //           ]
  //         ]
  //       },
  //       {
  //         text: 'Annexure A',
  //         fontSize: 20,
  //         bold: true,
  //         alignment: 'center',
  //         decoration: 'underline',
  //         color: 'black',
  //         margin: 10
  //       },

  //       {
  //         style: 'tableExample',

  //         table: {
  //           widths: [200, '*'],

  //           body: [
  //             [{ text: 'Components', bold: true }, { text: 'Annual', bold: true, alignment: 'center' },],
  //             ['Basic Pay', { text: '384400.00', alignment: 'right' }],
  //             ['HRA', { text: '36000.00', alignment: 'right' }],
  //             ['Engagement Bonus', { text: '24000.00', alignment: 'right' }],
  //             ['Other Allowance', { text: '30000.00', alignment: 'right' }],
  //             ['Medical Allowance', { text: 'As Per Company Norms', alignment: 'right' }],
  //             ['Total Take Home', { text: '474400.00', alignment: 'right' }],
  //             ['PF', { text: '43,200.00', alignment: 'right' }],
  //             // ['ESI', { text: '9480.00', alignment: 'right' }],
  //             ['Professional Tax', { text: '2400.00', alignment: 'right' }],
  //             ['Cost of Company', { text: '5,20,000.00', alignment: 'right' }]
  //           ],
  //         },
  //         fontSize: 12,
  //       },
  //       {

  //         margin: 10,
  //         text: [
  //           '** Your Salary is strictly confidential. The above Break-up excludes Statutory Deductions such as Tax Deduction at Source  ',
  //           '(TDS) that would be deducted at Applicable Rates.'
  //         ],
  //       },
  //       {
  //         text: 'Annexure B',
  //         fontSize: 20,
  //         bold: true,
  //         alignment: 'center',
  //         decoration: 'underline',
  //         color: 'black',
  //         margin: [10, 100, 10, 10],
  //       },
  //       {
  //         text: 'TERMS AND CONDITIONS OF EMPLOYMENT',
  //         fontSize: 17,
  //         bold: true,
  //         alignment: 'center',
  //         decoration: 'underline',
  //         color: 'black',
  //         margin: 10
  //       },
  //       {
  //         text: '1. Term of Employment',
  //         style: 'sectionHeader'
  //       },
  //       {
  //         text: ['Subject to Clauses 3 and 4 below, the term of your employment with SRNR IT SOLUTIONS PVT LTD is intended to be for',
  //           'indefinite period subject to termination pursuant to the terms of this Agreement and the requirements of',
  //           'applicable Indian laws.']
  //       },
  //       {
  //         text: '2. Outside activities/Conflicts',
  //         style: 'sectionHeader'
  //       },
  //       {
  //         text: ['This position is for a full-time employment with SRNR IT SOLUTIONS PVT LTD and you shall exclusively devote',
  //           'yourself to the business of the company.You shall not take on any other work for remuneration(part - time',
  //           'or otherwise) or work in an advisory capacity, or be interested directly or indirectly(except as',
  //           'shareholders or debenture holders) in any other trade or business, during your term of employment with',
  //           'SRNR IT SOLUTIONS PVT LTD, without written permission from SRNR IT SOLUTIONS PVT LTD .Similarly, you agree not to bring',
  //           'any third party confidential information to SRNR IT SOLUTIONS PVT LTD, including that of your former employer, and',
  //           'that in performing your duties for the SRNR IT SOLUTIONS PVT LTD, you will not in any way utilize any such',
  //           'information, other than in the manner that may be directed by SRNR IT SOLUTIONS PVT LTD while releasing such',
  //           'information.']
  //       },
  //       {
  //         text: ['You will be liable to be transferred in such capacity that the Company may determine, to any other',
  //           'department, branch, manufacturing unit or establishment under the same management or same',
  //           'principals, whether existing or to be set up in future.In addition, the Company reserves the right to assign',
  //           'you to other such units or companies as may be determined from time to time.']
  //       },
  //       {
  //         text: '3. Termination',
  //         style: 'sectionHeader'
  //       },
  //       {
  //         ul: [
  //           'During the term of your employment, should you desire to leave the services of SRNR IT SOLUTIONS PVT LTD , you shall be required to give 30 days’ notice or salary in lieu thereof.The company may, at its discretion, relieve you before the expiry of notice period without compensating for the remaining notice period.',
  //           'SRNR IT SOLUTIONS PVT LTD shall be entitled to terminate your employment without cause at any time by giving you 55 days notice or salary in lieu thereof.',
  //           'Notwithstanding anything mentioned in this Agreement, SRNR IT SOLUTIONS PVT LTD may terminate your employment, with immediate effect by a notice in writing(without salary in lieu of notice), in the event of your misconduct, including but not limited to, fraudulent, dishonest or undisciplined conduct of, or breach of integrity, or embezzlement, or misappropriation or misuse by you of SRNR IT SOLUTIONS PVT LTD ’s property, or insubordination or failure to comply with the directions given to you by persons so authorized, or your insolvency or conviction for any offence involving moral turpitude, or breach by you of any terms of this Agreement or SRNR IT SOLUTIONS PVT LTD Policy or other documents or directions of SRNR IT SOLUTIONS PVT LTD, or irregularity in attendance, or your unauthorized absence from the place of work(or remote check in in case of work from home) for more than five(5) working days, or closure of the business of SRNR IT SOLUTIONS PVT LTD, or redundancy of your post in SRNR IT SOLUTIONS PVT LTD, or upon you conducting yourself in a manner which is regarded by SRNR IT SOLUTIONS PVT LTD as prejudicial to its own interests or to the interests of its clients and/ or customers.',
  //           'Notwithstanding anything aforesaid, termination by you shall be subject to the satisfactory completion of all your existing duties, obligations and projects etc.',
  //           'During the notice period, Company will continue to pay its share of insurance premiums, if applicable.',
  //           'On acceptance of the resignation notice, you will be required to immediately give up to the company all correspondences, specifications, formulae, books, documents, market data, literature, drawings, effects or records, et al belonging to the company or relating to its business and shall not make or retain any copies of these items. '
  //         ]
  //       },
  //       {
  //         text: '4. Holidays / Leave',
  //         style: 'sectionHeader'
  //       },
  //       {
  //         text: 'General Holidays will be declared at the beginning of the Calendar year and all full-time employees are entitled to this benefit.You may be called upon to attend duties as and when required on holidays,  may be scheduled in accordance with the needs of the Company.You will be entitled to vacation and sick leave as per the company`s Paid Leave policy. Casual leave without notice will be considered as Leave against Loss- of - pay.Additional leave will be against Loss - of - Pay.Medical Leave has to be authenticated with Medical Report and is at the discretion of the Management. '
  //       },
  //       {
  //         text: '5. Disclosure of Information',
  //         style: 'sectionHeader'
  //       },
  //       {
  //         text: ['During the term of your employment with SRNR IT SOLUTIONS PVT LTD, you are required to disclose all material and',
  //           'relevant information, which may either affect your employment with SRNR IT SOLUTIONS PVT LTD currently or in the',
  //           'future or may be in conflict with the terms of your employment with SRNR IT SOLUTIONS PVT LTD, either directly or',
  //           'indirectly', 'including but not limited to any and all agreements relating to your current or prior',
  //           'employment that may affect your eligibility to be employed by SRNR IT SOLUTIONS PVT LTD or limit the manner in',
  //           'which you may be employed.It is SRNR IT SOLUTIONS PVT LTD ’s understanding that any such agreements or',
  //           'information will not prevent you from performing the duties of your position and you represent that such',
  //           'is the case.If at any time during your employment, SRNR IT SOLUTIONS PVT LTD becomes aware that you have',
  //           'suppressed any material or relevant information required to be disclosed by you, SRNR IT SOLUTIONS PVT LTD',
  //           'reserves the right to forthwith terminate your employment without any notice and without any obligation',
  //           'or liability to pay any remuneration or other dues to you irrespective of the period that you may have',
  //           'been employed by SRNR IT SOLUTIONS PVT LTD.'],
  //       },
  //       {
  //         text: ['Any change in your personal information including residential address, marital status and educational',
  //           'qualification should be notified to SRNR IT SOLUTIONS PVT LTD in writing within three(3) days from the start of such',
  //           'change. Any notice required to be given to you shall be deemed to have been duly and properly given if delivered',
  //           'to you personally or sent by post to you at your address as recorded in SRNR IT SOLUTIONS PVT LTD ’s records.']
  //       },
  //       {
  //         text: '6. Adherence to Company Policy',
  //         style: 'sectionHeader'
  //       },
  //       {
  //         text: 'You agree to conform to and comply with SRNR IT SOLUTIONS PVT LTD Policies and such directions and orders as may from time to time be given by SRNR IT SOLUTIONS PVT LTD .'
  //       },
  //       {
  //         text: '7. Travel',
  //         style: 'sectionHeader'
  //       },
  //       {
  //         text: 'You will be posted in HYDERABAD . But, you may be required to make visits and travel both within India and overseas, as necessary for the proper discharge of your duties.'
  //       },
  //       {
  //         text: '8.Non-Solicitation',
  //         style: "sectionHeader"
  //       },
  //       {
  //         text: ['You agree that during and upon termination of your employment and for one year thereafter, you shall',
  //           'not in any manner either directly or indirectly solicit or entice the other employees or customers of SN IT',
  //           'SOLUTIONS to join or enter into transactions, as the case may be with either you directly or indirectly or',
  //           'with other entities which are in direct or indirect competition with SRNR IT SOLUTIONS PVT LTD .']
  //       },
  //       {
  //         text: '9. Assignment',
  //         style: 'sectionHeader'
  //       },
  //       {
  //         text: ['This Agreement is personal to you and will not be assigned by you. SRNR IT SOLUTIONS PVT LTD will have the right to',
  //           'assign this letter of offer to its parent, subsidiaries, subdivisions, affiliates, successors and assigns, and all',
  //           'covenants and agreements herein will inure to the benefit of and be enforceable as such.']
  //       },
  //       {
  //         text: '10. Arbitration',
  //         style: "sectionHeader"
  //       },
  //       {
  //         text: ['You agree that the interpretation and enforcement of this Agreement shall be governed by the laws of',
  //           'India and all disputes under this Agreement shall be governed by the provisions of the Indian Arbitration',
  //           'and Conciliation Act, 1996. The venue for arbitration will be .']
  //       },
  //       {
  //         text: ['This is to certify that I have read this Agreement and all Annexure and understood all the terms and',
  //           'conditions mentioned therein and I hereby accept and agree to abide by them.']
  //       },
  //       {
  //         text: 'Annexure C',
  //         fontSize: 20,
  //         bold: true,
  //         alignment: 'center',
  //         decoration: 'underline',
  //         color: 'black',
  //         margin: 10
  //       },
  //       {
  //         text: 'List of Documents to be submitted by you before the day of joining.',
  //         fontSize: 12,
  //         bold: true,
  //         alignment: 'center',
  //         decoration: 'underline',
  //         color: 'black',
  //         margin: 10
  //       },
  //       {

  //         ol: [
  //           ' Certificates supporting your educational qualifications along with mark sheets (10+12+ Graduation+ Post Graduation + Course Certifications) ',
  //           'Your latest salary slip from last employer and salary certificate',
  //           'Your relieving letter from your last employer',
  //           'Experience Certificates from all previous employers',
  //           'Updated resume',
  //           'Form 16 or Taxable Income Statement duly certified by previous employer (Statement showing deductions & Taxable Income with break-up) ',
  //           '4 Passport size photographs (White Background)',
  //           'Passport copy and Work Permit in case of foreign citizens',
  //           'Proof of Age',
  //           'Proof of Address',
  //           'Copy of PAN Card'


  //         ],
  //         text: 'Please carry all the originals for validation.'
  //       },
  //       {
  //         text: 'Annexure D',
  //         // margin: [10, 100, 10, 10],
  //         fontSize: 20,
  //         bold: true,
  //         alignment: 'center',
  //         decoration: 'underline',
  //         color: 'black',
  //       },
  //       {
  //         text: 'Declaration',
  //         fontSize: 20,
  //         bold: true,
  //         alignment: 'center',
  //         decoration: 'underline',
  //         color: 'black',
  //         margin: 10
  //       },
  //       {

  //         margin: 10,
  //         text: [
  //           'I hereby represent and warrants, and undertakes, affirms, and agrees that as of the Date of Joining with SRNR IT Solutions Pvt Ltd.'
  //         ],
  //       },
  //       {

  //         ol: [
  //           'I will have terminated my employment with all my previous employers',


  //           'I have not entered into any agreement or arrangement which may restrict, prohibit, or debar or conflict or be inconsistent with my acceptance of the offer here under.',
  //           'I am in good standing and that I have full capacity and authority to accept this offer letter, Non-Disclosure Agreement and Employment Agreement and to perform its obligations here under according to the terms hereof.',
  //           'Neither the acceptance of this offer letter nor the execution and delivery of the agreement contemplated here under, or the fulfillment of or compliance with the terms and conditions thereof, conflict with or result in a breach of or a default under any of the terms, conditions or provisions of any legal restriction (including, without limitation, any judgment, order, injunction, decree or ruling of any court or governmental authority, or any federal, state, local or other law, statute, rule or regulation) or any covenant or agreement or instrument to which I am a party, or by which I am bound, nor does such execution, delivery, consummation or compliance violate or result in the violation any documents',



  //         ],
  //       },
  //       {
  //         columns: [


  //           [


  //             {
  //               text: `(Signature and Date)`,
  //               alignment: 'left',
  //               horizontal: true,
  //               margin: 18
  //             }
  //           ]
  //         ]
  //       },

  //       // {
  //       //   table: {
  //       //     headerRows: 1,
  //       //     widths: ['*', 'auto', 'auto', 'auto'],
  //       //     body: [
  //       //       ['Product', 'Price', 'Quantity', 'Amount'],
  //       //       ...this.invoice.products.map(p => ([p.name, p.price, p.qty, (p.price*p.qty).toFixed(2)])),
  //       //       [{text: 'Total Amount', colSpan: 3}, {}, {}, this.invoice.products.reduce((sum, p)=> sum + (p.qty * p.price), 0).toFixed(2)]
  //       //     ]
  //       //   }
  //       // },
  //       // {
  //       //   text: 'Additional Details',
  //       //   style: 'sectionHeader'
  //       // },
  //       // {
  //       //     text: this.invoice.additionalDetails,
  //       //     margin: [0, 0 ,0, 15]          
  //       // },
  //       // {
  //       //   columns: [
  //       //     [{ qr: `${this.invoice.customerName}`, fit: '50' }],
  //       //     [{ text: 'Signature', alignment: 'right', italics: true}],
  //       //   ]
  //       // },
  //       // {
  //       //   text: 'Terms and Conditions',
  //       //   style: 'sectionHeader'
  //       // },
  //       // {
  //       //     ul: [
  //       //       'Order can be return in max 10 days.',
  //       //       'Warrenty of the product will be subject to the manufacturer terms and conditions.',
  //       //       'This is system generated invoice.',
  //       //     ],
  //       // }
  //     ],
  //     styles: {
  //       sectionHeader: {
  //         bold: true,
  //         // decoration: 'underline',
  //         fontSize: 14,
  //         margin: [0, 15, 0, 15]
  //       }
  //     },
  //     //   defaultStyle: {
  //     //     alignment: 'justify'
  //     // }
  //   };

  //   if (action === 'download') {
  //     pdfMake.createPdf(docDefinition).download();
  //   } else if (action === 'print') {
  //     pdfMake.createPdf(docDefinition).print();
  //   } else {
  //     pdfMake.createPdf(docDefinition).open();
  //   }

  // }
  // async Reliving_generatePDF(action = 'open') {
  //   let docDefinition = {
  //     pageMargins: [40, 160, 40, 140],
  //     pageSize: 'A4',
  //     background: [
  //       {
  //         image: await this.getBase64ImageFromURL(
  //           "assets/img/SRNR-pdf-bg.jpg"
  //         ), fit: [595, 852]



  //       }
  //     ],
  //     content: [

  //       {
  //         text: 'RELIEVING LETTER',
  //         fontSize: 20,
  //         bold: true,
  //         alignment: 'center',
  //         decoration: 'underline',
  //         color: 'black'
  //       },



  //       {
  //         margin: 10,
  //         text: ['Dear', { text: this.addEmployee?.get('full_name')?.value, bold: true, fontSize: 14 }]

  //       },
  //       {
  //         text: [,
  //           'This has reference to your resignation letter, we hereby inform you that it has been accepted and',
  //           'you are being relieved of your duties from the closing hours of 15th November, 2022.'
  //         ],



  //       },
  //       {
  //         text: 'As per the services records here are your details:',
  //         style: 'sectionHeader',
  //         margin: 10

  //       },

  //       {
  //         style: 'tableExample',

  //         table: {
  //           widths: [200, '*',],

  //           body: [


  //             [' Date of Joining', { text: this.addEmployee?.get('join_date')?.value, bold: true }],
  //             [' Current Designation ', { text: this.addEmployee?.get('offer_designation')?.value, bold: true }],
  //             [' Emp ID', { text: ': NGE009', bold: true }],
  //             [' Last Working Date', { text: this.addEmployee?.get('reliving_date')?.value, bold: true }],


  //           ],
  //         },
  //         fontSize: 12,
  //         layout: 'noBorders',
  //         margin: [20, 0, 0, 0]
  //       },
  //       {
  //         margin: 10,
  //         text: ['You have been an integral part of our growth and we appreciate your contribution during this journey.'],



  //       },
  //       {
  //         margin: 10,
  //         text: ['While we wish that this association could have been longer, we hope you achieve every success in your future endeavors. We also draw your attention to your continuing obligation of confidentiality with respect to any proprietary and confidential information of NG Info Solutions Pvt Ltd. that you may have had access to during your employment.'],




  //       },
  //       {
  //         margin: 10,
  //         text: [' If You have any questions regarding the contents, please do not hesitate contact us on hr@ninformationtechnologies.com. You can also contact on 8977005865'],



  //       },


  //       {
  //         columns: [


  //           [
  //             {
  //               text: `Yours faithfully,`,
  //               alignment: 'left',
  //               margin: 10
  //             },
  //             {
  //               text: `For NG Info Solutions Pvt Ltd.,`,
  //               alignment: 'left',

  //             },
  //             {
  //               image: await this.getBase64ImageFromURL(
  //                 "assets/img/ng-stamp.png"
  //               ), height: 64, width: 64,
  //               alignment: 'left'
  //             },
  //             {
  //               text: `PL Narayana`,
  //               alignment: 'left'
  //             },
  //             {
  //               text: `HR Manager`,
  //               alignment: 'left'
  //             },


  //           ]
  //         ]
  //       },


  //     ],
  //     styles: {
  //       sectionHeader: {
  //         bold: true,
  //         // decoration: 'underline',
  //         fontSize: 10,

  //         margin: [0, 15, 0, 15]
  //       }
  //     }

  //   };

  //   if (action === 'download') {
  //     pdfMake.createPdf(docDefinition).download();
  //   } else if (action === 'print') {
  //     pdfMake.createPdf(docDefinition).print();
  //   } else {
  //     pdfMake.createPdf(docDefinition).open();
  //   }

  // }
  // async Hike_generatePDF(action = 'open') {
  //   let docDefinition = {
  //     pageSize: 'A4',
  //     pageMargins: [40, 160, 40, 150],
  //     background: [
  //       {
  //         image: await this.getBase64ImageFromURL(
  //           "assets/img/SRNR-pdf-bg.jpg"
  //         ), fit: [595, 852]



  //       }
  //     ],

  //     content: [
  //       {

  //         columns: [
  //           [
  //             {
  //               // text: this.addEmployee?.get('full_name')?.value,
  //               text: { text: this.addEmployee?.get('full_name')?.value, bold: true },
  //               bold: true
  //             },
  //             {
  //               text: { text: 'EMP-001', bold: true },

  //             },
  //             {
  //               text: { text: this.addEmployee?.get('offer_designation')?.value, bold: true },

  //             }
  //             // { text: this.addEmployee?.get('permanent_address')?.value, },
  //             // { text: this.invoice.email },
  //             // { text: this.invoice.contactNo }
  //           ],
  //           [
  //             {
  //               text: `27th Jan 2023`,
  //               alignment: 'right'
  //             },
  //             // { 
  //             //   text: `Bill No : ${((Math.random() *1000).toFixed(0))}`,
  //             //   alignment: 'right'
  //             // }
  //           ]
  //         ]
  //       },


  //       {
  //         text: 'Subject: Letter of Increment',
  //         fontSize: 14,
  //         bold: true,
  //         alignment: 'center',
  //         decoration: 'underline',
  //         color: 'black',
  //         margin: 15
  //       },

  //       {
  //         text: ['Dear', { text: this.addEmployee?.get('full_name')?.value, bold: true }]


  //       },
  //       {
  //         text: { text: 'Congratulations!', bold: true },

  //       },

  //       {
  //         margin: 15,
  //         text: [,
  //           'We take this opportunity to place on record our appreciation of your contribution during the past financial year, NG Info Solutions Pvt Ltd, recognizing your effort and performance, is pleased to inform you that your per annum gross salary has been revised and a detailed salary break-up is given bellow, with effect from the coming month.	',

  //         ],



  //       },
  //       {
  //         margin: 10,
  //         text: 'In recognition of your previous performance, we are glad to inform you that the company has decided to give you an increment of Rs 1LPA, and your restructured salary shall be Rs 4.4LPA. The Complete Detail of your revised salary is highlighted Below.',


  //       },


  //       {
  //         margin: 10,
  //         text: ['These details are purely private and confidential and not discussed or disclose to anyone.'],



  //       },
  //       {
  //         margin: 10,
  //         text: ['The remaining terms and conditions are remaining the same as mentioned in the offer letter. '],




  //       },
  //       {
  //         margin: 10,
  //         text: ['You are requested to return the enclosed copy duly signed as part of the acceptance.'],



  //       },

  //       {

  //         text: 'Salary Breakup',
  //         fontSize: 14,
  //         bold: true,
  //         alignment: 'center',
  //         decoration: 'underline',
  //         color: 'black'
  //       },
  //       {
  //         style: 'tableExample',

  //         table: {
  //           widths: ['*', '*', '*',],

  //           body: [




  //             [{ text: 'Particulars', bold: true }, { text: 'Per month', bold: true, alignment: 'center' }, { text: 'Per Annum', bold: true, alignment: 'center' },],
  //             [' Basic & Allowance', '', ''],
  //             [' Basic', '17180', '206160'],
  //             [' HRA ID', '8590', '103080'],
  //             [' Conveyance Allowance', '800', '9600'],
  //             [' Medical Allowance', '1250', '15000'],
  //             [' Special Allowance', '9949', '113388'],
  //             [' Gross Salary', '37769', '447,228'],










  //           ],
  //         },
  //         fontSize: 12,
  //         margin: 10



  //       },
  //       {
  //         margin: 15,
  //         text: ['We Would like to take this opportunity to express our appreciation for your contribution to the organization and hope that you will continue to strive for better results. We hope you will shoulder your new responsibility with full dedication and sincerity. With Best Wishes,'],



  //       },


  //       {
  //         columns: [


  //           [
  //             {
  //               margin: 15,
  //               text: { text: 'Sincerely,', bold: true },
  //               alignment: 'left',

  //             },
  //             {
  //               text: { text: 'NG Info Solutions Pvt Ltd', bold: true },
  //               alignment: 'left',

  //             },





  //           ]
  //         ],


  //       },


  //     ],
  //     styles: {
  //       sectionHeader: {
  //         bold: true,
  //         // decoration: 'underline',
  //         fontSize: 14,
  //         margin: [5, 15, 0, 15]
  //       }
  //     },
  //     defaultStyle: {
  //       alignment: 'justify'
  //     }
  //   };

  //   if (action === 'download') {
  //     pdfMake.createPdf(docDefinition).download();
  //   } else if (action === 'print') {
  //     pdfMake.createPdf(docDefinition).print();
  //   } else {
  //     pdfMake.createPdf(docDefinition).open();
  //   }

  // }
  // open_payslip() {
  //   const options = { windowClass: 'custom-ngb-modal-window', backdropClass: 'custom-ngb-modal-backdrop' };

  //   const modalRef = this.modalService.open(PayslipPopupComponent, options);
  //   // modalRef.componentInstance.selected_agent_id = agent_Id;

  //   modalRef.result.then((data) => {

  //   },
  //     (error) => {
  //       if (error == "Success") {
  //         // this.LoadBrands();
  //       }
  //     });

  // }

}
