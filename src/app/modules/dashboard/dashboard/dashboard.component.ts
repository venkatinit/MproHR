import { Component, OnInit } from '@angular/core';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  async single_employee_form(action = 'open') {
    let docDefinition = {
      pageMargins: [40, 60, 40, 60],
      pageSize: 'A4',
      height: 'auto',

      content: [


        {
          style: 'tableExample',

          table: {
            widths: [200, '*'],

            body: [

              [{ text: 'Full Name', fillColor: '#C0D7EC' }, { text: '', alignment: 'right' }],
              [{ text: 'Date of Birth', fillColor: '#C0D7EC' }, { text: '', alignment: 'right' }],
              [{ text: 'Gender', fillColor: '#C0D7EC' }, { text: '', alignment: 'right' }],
              [{ text: 'Email Id', fillColor: '#C0D7EC' }, { text: '', alignment: 'right' }],
              [{ text: 'Mobile Number', fillColor: '#C0D7EC' }, { text: '', alignment: 'right' }],

              [{ text: 'Permanent Address', fillColor: '#C0D7EC' }, { text: '', alignment: 'right' }],
              [{ text: 'Employee Type', fillColor: '#C0D7EC' }, { text: '', alignment: 'right' }],
              [{ text: 'Department', fillColor: '#C0D7EC' }, { text: '', alignment: 'right' }],
              [{ text: 'Technology', fillColor: '#C0D7EC' }, { text: '', alignment: 'right' }],
              [{ text: 'Offer Date', fillColor: '#C0D7EC' }, { text: '', alignment: 'right' }],
              [{ text: 'Join Date', fillColor: '#C0D7EC' }, { text: '', alignment: 'right' }],
              [{ text: 'Offer Designation', fillColor: '#C0D7EC' }, { text: '', alignment: 'right' }],
              [{ text: 'Offer CTC', fillColor: '#C0D7EC' }, { text: '', alignment: 'right' }],

              [{ text: 'Hike date', fillColor: '#C0D7EC' }, { text: '', alignment: 'right' }],
              [{ text: 'Hike Designation', fillColor: '#C0D7EC' }, { text: '', alignment: 'right' }],
              [{ text: 'Hike CTC', fillColor: '#C0D7EC' }, { text: '', alignment: 'right' }],
              [{ text: 'Resignation Date', fillColor: '#C0D7EC' }, { text: '', alignment: 'right' }],
              [{ text: 'Reliving Date', fillColor: '#C0D7EC' }, { text: '', alignment: 'right' }],
              [{ text: 'UAN Number', fillColor: '#C0D7EC' }, { text: '', alignment: 'right' }],

              [{ text: 'PF Number', fillColor: '#C0D7EC' }, { text: '', alignment: 'right' }],
              [{ text: 'Adhar Number', fillColor: '#C0D7EC' }, { text: '', alignment: 'right' }],
              [{ text: 'PAN Number', fillColor: '#C0D7EC' }, { text: '', alignment: 'right' }],
              [{ text: 'Reference Person Name', fillColor: '#C0D7EC' }, { text: '', alignment: 'right' }],
              [{ text: 'Reference Person Contact No', fillColor: '#C0D7EC' }, { text: '', alignment: 'right' }],
              [{ text: 'Bank Name', fillColor: '#C0D7EC' }, { text: '', alignment: 'right' }],
              [{ text: 'Account Number', fillColor: '#C0D7EC' }, { text: '', alignment: 'right' }],
              [{ text: 'BSR Code/IFSC', fillColor: '#C0D7EC' }, { text: '', alignment: 'right' }],



            ],
           
          },
          fontSize: 12,

        },




      ],

      defaultStyle: {
        alignment: 'center',


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
