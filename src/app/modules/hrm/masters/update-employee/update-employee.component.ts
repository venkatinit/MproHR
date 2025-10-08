
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ApiService } from 'src/app/api.client';
import { PayslipPopupComponent } from '../payslip-popup/payslip-popup.component';
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
  constructor() {
    // Initially one empty product row we will show 
    this.products.push(new Product());
  }
}

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.scss']
})
export class UpdateEmployeeComponent implements OnInit {
  invoice = new Invoice();
  addEmployee: FormGroup;
  submitted: boolean = false;
  spinLoader = false;
  selectedEmpType: any;
  selectedDepartment: any;
  selectedDesignation: any;
  selectedEmpGrade: any;
  Employee_details: any;
  selectedDate: Date;
  message: string | undefined;
  errors: string[] = [];
  messages: string[] = [];
  companyCode: string = '';
  minDate: Date = new Date();
  Students = {
    dob: ''
  }
  constructor(private formBuilder: FormBuilder, private router: Router, private util: UtilsServiceService, private api: ApiService, private modalService: NgbModal, private userService: UsersService,
    public toast: ToastrService) { }
  getEmployeedetails() {
    this.api.get('').subscribe((response: any) => {
      this.Employee_details = response.data;
      this.addEmployee.controls['full_name'].setValue(this.Employee_details['doj']);
      this.addEmployee.controls['date_of_birth'].setValue(this.Employee_details['']);
      this.addEmployee.controls['email'].setValue(this.Employee_details['member_Name']);
      this.addEmployee.controls['mbl_no'].setValue(this.Employee_details['mobileNo']);
      this.addEmployee.controls['permanent_address'].setValue(this.Employee_details['email_ID']);
      this.addEmployee.controls['employee_type'].setValue(this.Employee_details['age']);
      this.addEmployee.controls['department'].setValue(this.Employee_details['gender']);
      this.addEmployee.controls['technology'].setValue(this.Employee_details['occoupation']);
      this.addEmployee.controls['offer_date'].setValue(this.Employee_details['']);
      this.addEmployee.controls['join_date'].setValue(this.Employee_details['']);
      this.addEmployee.controls['offer_designation'].setValue(this.Employee_details['father_Name']);
      this.addEmployee.controls['offer_ctc'].setValue(this.Employee_details['res_Address']);
      this.addEmployee.controls['hike'].setValue(this.Employee_details['']);
      this.addEmployee.controls['current_designation'].setValue(this.Employee_details['']);
      this.addEmployee.controls['current_ctc'].setValue(this.Employee_details['branch']);
      this.addEmployee.controls['resignation_date'].setValue(this.Employee_details['share_Cert_No']);
      this.addEmployee.controls['reliving_date'].setValue(this.Employee_details['no_of_Shares']);
      this.addEmployee.controls['adhar_no'].setValue(this.Employee_details['bank_Ac_No']);
      this.addEmployee.controls['pan_no'].setValue(this.Employee_details['bank_Name']);
      this.addEmployee.controls['ref_no'].setValue(this.Employee_details['ifsC_Code']);
      this.addEmployee.controls['ref_contact_no'].setValue(this.Employee_details['branch']);
      this.addEmployee.controls['bank_name'].setValue(this.Employee_details['pan_No']);
      this.addEmployee.controls['account_no'].setValue(this.Employee_details['passport_No']);
      this.addEmployee.controls['ifsc'].setValue(this.Employee_details['ratation_Card_No']);
    }, (error) => {
      console.log(error);
    })
  }
  checkDate() {
    const dateSendingToServer = new DatePipe('en-US').transform(this.Students.dob, 'dd/MM/yyyy')
    console.log(dateSendingToServer);
  }
  ngOnInit(): void {
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    this.addEmployee = this.formBuilder.group({
      upload_form: [''],
      full_name: ['', [Validators.required]],
      date_of_birth: ['', [Validators.required]],
      email: ['', [Validators.required]],
      mbl_no: ['', [Validators.required]],
      permanent_address: ['', [Validators.required]],
      employee_type: ['', [Validators.required]],
      department: ['', [Validators.required]],
      technology: ['', [Validators.required]],
      offer_date: ['', [Validators.required]],
      join_date: ['', [Validators.required]],
      offer_designation: ['', [Validators.required]],
      offer_ctc: ['', [Validators.required]],
      hike: ['', [Validators.required]],
      current_designation: ['', [Validators.required]],
      current_ctc: ['', [Validators.required]],
      resignation_date: ['', [Validators.required]],
      reliving_date: ['', [Validators.required]],
      adhar_no: ['', [Validators.required]],
      pan_no: ['', [Validators.required]],
      ref_no: ['', [Validators.required]],
      ref_contact_no: ['', [Validators.required]],
      bank_name: ['', [Validators.required]],
      account_no: ['', [Validators.required]],
      ifsc: ['', [Validators.required]],
      adhar_card: ['', [Validators.required]],
      pan_card: ['', [Validators.required]],
    })
  }
  get f() {
    return this.addEmployee.controls
  }
  // saveaddEmpolyee() {
  //   this.submitted = true;
  //   if (!this.addEmployee.valid) {
  //     return;
  //   }
  //   this.spinLoader = true;
  //   const company_Code = this.util.decrypt_Text(localStorage.getItem('company_code'));


  //   const url = `company/add-emp/${company_Code}`;
  //   var body = {
  //     'Full Name': this.addEmployee?.get("full_name")?.value,
  //     'Date of Birth': this.addEmployee?.get("date_of_birth")?.value,
  //     'Gender': this.addEmployee?.get("")?.value,
  //     'Email Id': this.addEmployee?.get("email")?.value,
  //     'Mobile Number': this.addEmployee?.get("mbl_no")?.value,
  //     'Permanent Address': this.addEmployee?.get("permanent_address")?.value,
  //     'Employee Type': this.addEmployee?.get("employee_type")?.value,
  //     'Department': this.addEmployee?.get("department")?.value,
  //     'Technology': this.addEmployee?.get("technology")?.value,
  //     'Offer Date': this.addEmployee?.get("offer_date")?.value,
  //     'Join Date': this.addEmployee?.get("join_date")?.value,
  //     'Offer Designation': this.addEmployee?.get("offer_designation")?.value,
  //     'Offer CTC': this.addEmployee?.get("offer_ctc")?.value,
  //     'Hike date': this.addEmployee?.get("hike")?.value,
  //     'Hike Designation': this.addEmployee?.get("")?.value,
  //     'Hike CTC': this.addEmployee?.get("")?.value,
  //     'Resignation Date': this.addEmployee?.get("resignation_date")?.value,
  //     'Reliving Date': this.addEmployee?.get("reliving_date")?.value,
  //     'UAN Number': this.addEmployee?.get("")?.value,
  //     'PF Number': this.addEmployee?.get("")?.value,
  //     'Adhar Number': this.addEmployee?.get("adhar_no")?.value,
  //     'PAN Number': this.addEmployee?.get("pan_no")?.value,
  //     'Reference Person Name': this.addEmployee?.get("ref_no")?.value,
  //     'Reference Person Contact No': this.addEmployee?.get("ref_contact_no")?.value,
  //     'Bank Name': this.addEmployee?.get("bank_name")?.value,
  //     'Account Number': this.addEmployee?.get("account_no")?.value,
  //     'BSR Code/IFSC': this.addEmployee?.get("ifsc")?.value,
  //     'field28': this.addEmployee?.get("")?.value,
  //     'Employee Prefix': this.addEmployee?.get("")?.value,
  //     'Employee Start No': this.addEmployee?.get("")?.value,
  //     'Employee Digit Count': this.addEmployee?.get("")?.value,
  //   }

  //   this.api.addEmployee(url, body).subscribe((res: any) => {

  //     this.submitted = false;
  //   },
  //     (error: any) => {

  //       console.log(error);
  //       // this.loaded=false;        
  //       // this.SpinnerService.hide();

  //       // console.log("====================")
  //       this.submitted = false;
  //       this.errors = [error.error.Message];
  //       this.toast.error(this.errors[0], "Validation Failed");
  //       // this.loaded=false;
  //     }

  //   );
  // }
  sendFileToserver(event) {
    console.log(event.target.files[0]);
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    console.log(formData);
    const company_Code = this.util.decrypt_Text(localStorage.getItem('company_code'));


    const url = `company/add-emp/${company_Code}`;
    this.api.addEmployee(url, formData).subscribe((res: any) => {
      if (res) {
        alert('File uploaded successfully');
      }
    })

  }
  async Experience_generatePDF(action = 'open') {
    let docDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 120, 40, 120],

      background: [
        {
          image: await this.getBase64ImageFromURL(
            "assets/img/SRNR-pdf-bg.jpg"
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
                text: `Date:27/04/2023`,
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
          text: ['It is hereby certified that Mr/Ms.', this.addEmployee?.get("full_name")?.value, 'worked as a Manager in our ',
            'company from' + this.addEmployee?.get("join_date")?.value + 'to' + this.addEmployee?.get("reliving_date")?.value],
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

  async Payslip_generatePDF(action = 'open') {
    let docDefinition = {
      content: [


        {
          columns: [
            [
              {
                text: this.invoice.customerName,
                bold: true
              },
              { text: this.invoice.address },
              { text: this.invoice.email },
              { text: this.invoice.contactNo }
            ],

          ]
        },


        {
          style: 'tableExample',
          table: {
            widths: [100, '*', 100, '*'],
            body: [
              [
                {
                  image: await this.getBase64ImageFromURL(
                    'assets/img/logo1.png'
                  ),
                  height: 64,
                  width: 84,
                  alignment: 'center',
                  colSpan: 2

                }, '',
                {

                  text: ['1-68/4 & 5,Plot No 80 & 81, Survey No 76,4th floor, Jainhind Enclave, Madhapur, Hyderabad Telangana-500081 ',
                    ' Ph : 040 40057908, 8977005865'],




                  colSpan: 2
                }, ''

              ],
              [{
                text: 'Salary slip for the month of Oct - 2022', colSpan: 4,
                alignment: 'center',
                color: 'blue'
              }, ''],

              ['Name', { text: this.addEmployee?.get('full_name')?.value, bold: true }, 'Pan No', { text: this.addEmployee?.get('pan_no')?.value, bold: true }],
              ['Designation', { text: this.addEmployee?.get('offer_designation')?.value, bold: true }, 'Employment', { text: this.addEmployee?.get('employee_type')?.value, bold: true }],
              ['Emp No', 'NGE009', '	Working Days', ' 31'],
              ['Location', 'Hyderabad', '	Paid Days', ' 31'],
              ['Bank Name', { text: this.addEmployee?.get('bank_name')?.value, bold: true }, 'Account Number', { text: this.addEmployee?.get('account_no')?.value, bold: true }],
              [
                {
                  text: '',
                  colSpan: 2

                },
                '',

                {

                  text: '',



                  colSpan: 2
                }, ''

              ],
              [{ text: 'Earnings', bold: true }, { text: 'Amount(Rs)', bold: true }, { text: 'Deductions', bold: true }, { text: 'Amount(Rs)', bold: true }],
              [{ text: 'Basic Salary', bold: true }, '7,180', { text: 'Provident Fund', bold: true }, ' 1,800'],
              [{ text: 'HRA', bold: true }, '3,59', { text: '	Professional Tax', bold: true }, ' 200'],
              [{ text: 'Conveyance', bold: true }, '800', { text: '	Other Deductions', bold: true }, ' 0.00'],
              [{ text: 'Medical Allowance', bold: true }, '1250', '	', ' '],
              [{ text: 'Other Allowance', bold: true }, '7,180', '', ''],
              [{ text: 'Total Earnings', bold: true }, '20,000', { text: '	Total Deductions', bold: true }, ' 2000'],
              [{ text: 'Net Pay:', bold: true }, '18,000', '	', ' '],

              [{
                text: 'Computer generated document. Signature & Seal not required.Please Contact Accounts Department within 3 days of receipt for any discrepancy in salary or mail to info@ninformationtechnologies.com',
                colSpan: 4,
                backgroundcolor: 'red',
                alignment: 'center',


              }, '',],



            ],
          },
          fontSize: 12,
        },


      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 15],
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
  async Offer_generatePDF(action = 'open') {
    let docDefinition = {
      pageMargins: [40, 160, 40, 160],
      pageSize: 'A4',

      background: [
        {
          image: await this.getBase64ImageFromURL(
            "assets/img/SRNR-pdf-bg.jpg"
          ), fit: [595, 852]



        }
      ],
      content: [
        // {
        //   text: 'ELECTRONIC SHOP',
        //   fontSize: 16,
        //   alignment: 'center',
        //   color: '#047886'
        // },
        {
          text: 'OFFER LETTER',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'black'
        },
        {
          text: 'Ref: EMP/NGE009',
          style: 'sectionHeader'
        },
        {
          columns: [
            [
              {
                text: this.addEmployee?.get('full_name')?.value,
                // text:'Mr. Sathi Sabari Maniknta',
                bold: true
              },
              //     {
              //       text:['8-39 Vadisaleru, ',
              //     'Rangampeta Mandal,',
              //   'Vadisaleru, East Godavari ',
              //   'Andhra Pradesh-533294'
              // ]}
              { text: this.addEmployee?.get('permanent_address')?.value, }
              // { text: this.invoice.email },
              // { text: this.invoice.contactNo }
            ],
            [
              {
                text: `27th Jan 2023`,
                alignment: 'right'
              },
              // { 
              //   text: `Bill No : ${((Math.random() *1000).toFixed(0))}`,
              //   alignment: 'right'
              // }
            ]
          ]
        },

        {
          margin: 10,
          text: ['Dear', { text: this.addEmployee?.get('full_name')?.value, bold: true, fontSize: 14 }]


        },
        {
          text: [,
            'With reference to your application and the subsequent interview you had with NG Info Solutions Pvt Ltd., we',
            ' have great pleasure in offering you employment with effect from 02nd Feb 2023 under the following terms and conditions:'
          ],



        },
        {
          text: 'TERMS AND CONDITIONS OF APPOINTMENT',
          style: 'sectionHeader',
          // margin:10

        },

        {
          style: 'tableExample',

          table: {
            widths: [200, '*'],

            body: [

              [{ text: '1.Employment Details:', bold: true, fontSize: 14 }, ''],
              [{ text: 'a)Designation' }, { text: this.addEmployee?.get('offer_designation')?.value, bold: true }],
              [' b)Place of Posting', { text: ' Hyderabad', bold: true }],
              [' c)Date of Joining', { text: this.addEmployee?.get('join_date')?.value, bold: true }],
              [{ text: '2.Salary:', bold: true, fontSize: 14 }, 'Your salary will be ' + this.addEmployee?.get('offer_ctc')?.value + '/- PA and will be Structured as per the attached Annexure 1-Compensation Structure, Other Perquisites & Benefits'],

            ],
          },
          fontSize: 12,
          layout: 'noBorders'

        },
        {
          margin: 10,


          ol: [
            'You will be covered under Provident Fund Scheme as per “rule of the land”.',

            'Personal Health Insurance Coverage for a sum of Rs. 1 Lakh (Rupees One Lakh Annual Coverage through Star Health Insurance).',
            'The Company’s leave policies shall apply to your employment and may be modified by the Company at any time its absolute discretion.'



          ],

        },

        {
          text: '3.	Employment C',


          style: 'sectionHeader'
        },
        {

          ol: [
            'This offer letter and your employment with the Company are subject to:',
            'Satisfactory results of a complete background and reference check carried out by the Company.',
            'You are required to sign of Employment Agreement, Non-Disclosure & Non-Compete Agreement and the annexure annexed herewith (If applicable). Please note that in the event it is found that you have not complied with these conditions, your employment can be terminated forthwith by the Company without any notice period or compensation and without any reasons thereof.'


          ],
        },
        {
          text: '4.	Probation/Confirmation',


          style: 'sectionHeader'
        },
        {
          text: '5.	Transferability:',
          style: 'sectionHeader'
        },
        {

          text: [
            ' You acknowledge and agree that you may be assigned, transferred, or deputed to any of the establishments of the ',
            'Company (Client) and your service will be subject to interdepartmental or inter-establishment or inter location transfers,',
            '  temporarily or permanently.'
          ],
        },
        {
          text: '6.	Verification of Particulars',
          style: 'sectionHeader'
        },
        {

          text: [
            ' You acknowledge and agree that the Company has offered you employment based on the specific information and  ',
            'records furnished by you. All particulars furnished by you vide your application are taken to be true and correct. In ',
            'case any of these particulars turn out to be false or incorrect on verification, the Company may at its absolute ',
            'discretion elect to terminate or suspend your services without any notice or assigning any reason thereof.'
          ],
        },
        {
          text: '7.	Termination of Permanent Service',
          style: 'sectionHeader'
        },
        {

          ol: [
            'You will automatically retire from service of the Company on attaining the age of 58 years. ',
            'If the Company terminates your employment for any misconduct or breach of the Company’s code of conduct or other disciplinary grounds then (i) the Company’s obligations under this letter shall immediately cease, and (ii) you shall not be entitled to receive any payment due from the Company,and the Company shall have no obligation to pay, compensation attributable to such termination.'


          ],
        },
        {
          text: '8.	Resignation',
          style: 'sectionHeader'
        },
        {

          ol: [
            ' In the event of you deciding to resign from the services of Company, you will have to give two-month prior written notice to the Company.',
            'On or before the date of resignation you shall completely be signed off from all projects or works assigned till date and you shall support to the Company in all the relieving process as stated by the Company. ',

            '	The date of relieving from the Company will be at the sole discretion of the Company & Client Company.'


          ],
        },

        {
          text: '9.	Code of Conduct:',
          style: 'sectionHeader'
        },
        {

          ol: [
            ' 	Your individual remuneration is purely a matter between yourself and the company and has been arrived at .based on your job, skills, specific background, and professional merit. Accordingly, your salary and any changes made to it are strictly confidential. You shall treat such matters accordingly, and any breach thereof would be viewed very seriously.',
            '	You shall maintain proper discipline and dignity of your office and shall deal with all matters with sobriety.',
            '	You shall inform the company of any changes in your personal data within 3 days of the occurrence of such change. ',
            '	Any notice required to be given to you shall be deemed to have been duly and properly given if delivered to you ',
            'personally or sent by post to you at your address, as recorded in the company.'


          ],
        },
        {
          text: '10.	Other Conditions',
          style: 'sectionHeader'
        },
        {

          ol: [
            ' 	The Company expects you to work with a high standard of initiative, efficiency, and economy.',
            '	You will devote your entire time to the work of the Company and will not directly/ indirectly undertake any business or work for any company or entity or person other than NG Info Solutions Pvt Ltd.,',
            '	You will be responsible for the safekeeping and return in good condition and order all the property of the  Company which is in your possession, use, custody, or charge. You shall make good of any loss or damage that occurs to any Company property which is in your possession/ custody.',
            '		You will abide by all the provisions of law that are applicable or will be made applicable to the employees of the Company.',
            '	You agree that any proprietary rights whatsoever, including but not limited to, patents, copyright and design rights as a result of the development of and/or the application of all work produced by you during or as a consequence of your employment, whether alone or in conjunction with others and whether during normal working hours or not, including but not limited to any invention, design, discovery or improvement, computer program, documentation, confidential information, copyright work or other material which you conceive, discover or create during or in consequence of this employment with the Company shall belong to the Company absolutely.',
            '	Upon the termination of your services for any reason, you shall immediately cease to use the Company’s marks and/ or intellectual property rights vested in any manner whatsoever. You shall keep confidential all information and material provided to you by the Company and will execute a Non-disclosure & Non-Compete Agreement and an Employment Agreement with the Company in the prescribed format.',
            'You will not at any time hereafter, without the consent in writing of the Company or except under any legal process, divulge or make public any matters relating to the Company’s transactions or dealings, which are of a confidential character.',
            '	You will be true and faithful to the Company in all your accounts, dealings and transactions relating to the business of the Company and if called upon, shall render a true and just account thereof to the Company or to such persons as shall be authorized to receive the same.',
            '	You agree to indemnify the Company for any losses or damages sustained by the Company which is caused by you or related to your breach of any of the provisions or obligations set out in this letter.'
          ],
        },
        {
          margin: 10,

          text: [
            'You will have to submit the photocopies of your testimonials i.e. Relieving Letter, Degree Certificates, Experience Certificates etc. on the date of joining and other document as set out in detail in the Annexure 2.',
            'written notice to the Company.',
          ],
        },
        {
          margin: 5,

          text: [
            'You are required to join duty at our office located at Hyderabad on 02-Feb-2023 , failing which this offer will stand withdrawn.',
            'written notice to the Company.',
          ],
        },
        {
          margin: 5,

          text: [


            'If this offer of employment is acceptable to you as per Terms and Conditions mentioned above, you are requested to return the duplicate copy of the offer duly signed by you on all pages including the Annexure 1, 2, & 3 as a token of your acceptance latest by 02-Feb-2023, failing which it will be presumed that you are not interested in this offer and the offer will stand withdrawn. ',


          ],
        },
        {
          margin: 10,

          text: [
            'Please note, by signing this letter, you confirm with the Company that you are under no contractual or other ',
            'legal obligations that would prohibit you from taking this position or performing your duties with the ',
            'Company. ',
          ],
        },
        {
          margin: 10,

          text: [
            'We welcome you to NG Info Solutions Pvt Ltd. and look forward to your contribution for mutual ',
            ' growth. In the meantime, please do not hesitate to call Mr. PL Narayana, should you have any queries or ',
            'concerns you would like to discuss. ',


          ],
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
                text: `PL Narayana`,
                alignment: 'left'
              },
              {
                text: `HR`,
                alignment: 'left'
              },
              {
                text: `I accept the above terms and conditions of Employment.`,
                alignment: 'left'
              },
              {
                text: `(Signature and Date)`,
                alignment: 'left',
                horizontal: true,
                margin: 10
              }
            ]
          ]
        },
        {
          text: 'Annexure 1',
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
              [{ text: 'Components', bold: true }, { text: 'Monthly', bold: true, alignment: 'center' },],
              ['Basic', { text: '38160.00', alignment: 'right' }],
              ['HRA', { text: '19080.00', alignment: 'right' }],
              ['Conveyance Allowance', { text: '9600.00', alignment: 'right' }],
              ['Medical Allowance', { text: '15000.00', alignment: 'right' }],
              ['FBP', { text: '25572.00', alignment: 'right' }],

              ['Special Allowance', { text: '12588.00', alignment: 'right' }],
              ['Total Take Home', { text: '1,20,000.00', alignment: 'right' }],
              ['Professional Tax', { text: '2400.00', alignment: 'right' }],
              ['Cost of Company', { text: '1,17,600.00', alignment: 'right' }]

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
          text: 'Annexure 2',
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
            ' All academic Certificates and mark lists (including X, XII for verification) –one photocopies each.',
            '	Certificates of Professional and other qualifications',
            'Relieving letters, and Experience Letters from all previous employers',
            'Form 16 for the current financial year',
            'Details of the proposed investments for the current year for income tax calculation.',
            '4 Passport size photographs (White Background)',
            'Passport copy',
            'Proof of residential address',
            'Copy of PAN Card'


          ],
        },
        {
          text: 'Annexure 3',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'black',
          margin: 10
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
            'I hereby represent and warrants, and undertakes, affirms, and agrees that as of the Date of Joining with N Information ',
            'Technologies Pvt Ltd.'



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
        },

        // {
        //   table: {
        //     headerRows: 1,
        //     widths: ['*', 'auto', 'auto', 'auto'],
        //     body: [
        //       ['Product', 'Price', 'Quantity', 'Amount'],
        //       ...this.invoice.products.map(p => ([p.name, p.price, p.qty, (p.price*p.qty).toFixed(2)])),
        //       [{text: 'Total Amount', colSpan: 3}, {}, {}, this.invoice.products.reduce((sum, p)=> sum + (p.qty * p.price), 0).toFixed(2)]
        //     ]
        //   }
        // },
        // {
        //   text: 'Additional Details',
        //   style: 'sectionHeader'
        // },
        // {
        //     text: this.invoice.additionalDetails,
        //     margin: [0, 0 ,0, 15]          
        // },
        // {
        //   columns: [
        //     [{ qr: `${this.invoice.customerName}`, fit: '50' }],
        //     [{ text: 'Signature', alignment: 'right', italics: true}],
        //   ]
        // },
        // {
        //   text: 'Terms and Conditions',
        //   style: 'sectionHeader'
        // },
        // {
        //     ul: [
        //       'Order can be return in max 10 days.',
        //       'Warrenty of the product will be subject to the manufacturer terms and conditions.',
        //       'This is system generated invoice.',
        //     ],
        // }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          // decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 15]
        }
      },
      //   defaultStyle: {
      //     alignment: 'justify'
      // }
    };

    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download();
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
            "assets/img/SRNR-pdf-bg.jpg"
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
          text: ['Dear', { text: this.addEmployee?.get('full_name')?.value, bold: true, fontSize: 14 }]

        },
        {
          text: [,
            'This has reference to your resignation letter, we hereby inform you that it has been accepted and',
            'you are being relieved of your duties from the closing hours of 15th November, 2022.'
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


              [' Date of Joining', { text: this.addEmployee?.get('join_date')?.value, bold: true }],
              [' Current Designation ', { text: this.addEmployee?.get('offer_designation')?.value, bold: true }],
              [' Emp ID', { text: ': NGE009', bold: true }],
              [' Last Working Date', { text: this.addEmployee?.get('reliving_date')?.value, bold: true }],


            ],
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
          text: [' If You have any questions regarding the contents, please do not hesitate contact us on hr@ninformationtechnologies.com. You can also contact on 8977005865'],



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
                text: `PL Narayana`,
                alignment: 'left'
              },
              {
                text: `HR Manager`,
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
  async Hike_generatePDF(action = 'open') {
    let docDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 160, 40, 150],
      background: [
        {
          image: await this.getBase64ImageFromURL(
            "assets/img/SRNR-pdf-bg.jpg"
          ), fit: [595, 852]



        }
      ],

      content: [
        {

          columns: [
            [
              {
                // text: this.addEmployee?.get('full_name')?.value,
                text: { text: this.addEmployee?.get('full_name')?.value, bold: true },
                bold: true
              },
              {
                text: { text: 'EMP-001', bold: true },

              },
              {
                text: { text: this.addEmployee?.get('offer_designation')?.value, bold: true },

              }
              // { text: this.addEmployee?.get('permanent_address')?.value, },
              // { text: this.invoice.email },
              // { text: this.invoice.contactNo }
            ],
            [
              {
                text: `27th Jan 2023`,
                alignment: 'right'
              },
              // { 
              //   text: `Bill No : ${((Math.random() *1000).toFixed(0))}`,
              //   alignment: 'right'
              // }
            ]
          ]
        },


        {
          text: 'Subject: Letter of Increment',
          fontSize: 14,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'black',
          margin: 15
        },

        {
          text: ['Dear', { text: this.addEmployee?.get('full_name')?.value, bold: true }]


        },
        {
          text: { text: 'Congratulations!', bold: true },

        },

        {
          margin: 15,
          text: [,
            'We take this opportunity to place on record our appreciation of your contribution during the past financial year, NG Info Solutions Pvt Ltd, recognizing your effort and performance, is pleased to inform you that your per annum gross salary has been revised and a detailed salary break-up is given bellow, with effect from the coming month.	',

          ],



        },
        {
          margin: 10,
          text: 'In recognition of your previous performance, we are glad to inform you that the company has decided to give you an increment of Rs 1LPA, and your restructured salary shall be Rs 4.4LPA. The Complete Detail of your revised salary is highlighted Below.',


        },


        {
          margin: 10,
          text: ['These details are purely private and confidential and not discussed or disclose to anyone.'],



        },
        {
          margin: 10,
          text: ['The remaining terms and conditions are remaining the same as mentioned in the offer letter. '],




        },
        {
          margin: 10,
          text: ['You are requested to return the enclosed copy duly signed as part of the acceptance.'],



        },

        {

          text: 'Salary Breakup',
          fontSize: 14,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'black'
        },
        {
          style: 'tableExample',

          table: {
            widths: ['*', '*', '*',],

            body: [




              [{ text: 'Particulars', bold: true }, { text: 'Per month', bold: true, alignment: 'center' }, { text: 'Per Annum', bold: true, alignment: 'center' },],
              [' Basic & Allowance', '', ''],
              [' Basic', '17180', '206160'],
              [' HRA ID', '8590', '103080'],
              [' Conveyance Allowance', '800', '9600'],
              [' Medical Allowance', '1250', '15000'],
              [' Special Allowance', '9949', '113388'],
              [' Gross Salary', '37769', '447,228'],










            ],
          },
          fontSize: 12,
          margin: 10



        },
        {
          margin: 15,
          text: ['We Would like to take this opportunity to express our appreciation for your contribution to the organization and hope that you will continue to strive for better results. We hope you will shoulder your new responsibility with full dedication and sincerity. With Best Wishes,'],



        },


        {
          columns: [


            [
              {
                margin: 15,
                text: { text: 'Sincerely,', bold: true },
                alignment: 'left',

              },
              {
                text: { text: 'NG Info Solutions Pvt Ltd', bold: true },
                alignment: 'left',

              },





            ]
          ],


        },


      ],
      styles: {
        sectionHeader: {
          bold: true,
          // decoration: 'underline',
          fontSize: 14,
          margin: [5, 15, 0, 15]
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

  addProduct() {
    this.invoice.products.push(new Product());
  }

  open_payslip() {
    const options = { windowClass: 'custom-ngb-modal-window', backdropClass: 'custom-ngb-modal-backdrop' };

    const modalRef = this.modalService.open(PayslipPopupComponent, options);
    // modalRef.componentInstance.selected_agent_id = agent_Id;

    modalRef.result.then((data) => {

    },
      (error) => {
        if (error == "Success") {
          // this.LoadBrands();
        }
      });

  }
}
