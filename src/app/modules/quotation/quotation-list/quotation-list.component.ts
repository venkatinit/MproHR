import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { FileUploadComponent } from '../../hrm/masters/file-upload/file-upload.component';
import Swal from 'sweetalert2';
import { ApiService } from 'src/app/api.client';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'jspdf';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}
@Component({
  selector: 'app-quotation-list',
  templateUrl: './quotation-list.component.html',
  styleUrls: ['./quotation-list.component.scss']
})
export class QuotationListComponent implements OnInit {
  submitted: boolean;
  constructor(private modalService: NgbModal, private router: Router, private api: ApiService, private fb: FormBuilder) { }
  dtOptions: DataTables.Settings = {};
  persons: any[] = [];
  delete_quote: any;
  action = 'create';
  addQuotation!: FormGroup;
  spinLoader: any;
  grandTotal = 0;
  finalTotal = 0;
  discountedAmount = 0;

  dtTrigger: Subject<any> = new Subject<any>();
  employee_list = [
    { 'emp_code': 'NG0001', 'emp_name': 'Venkat', 'email': 'Venkat@gmail.com', 'mbl_no': '7987578478', 'dept': 'IT', 'designation': 'Angular Developer' },
    { 'emp_code': 'NG0002', 'emp_name': ' Siva', 'email': ' Siva@gmail.com', 'mbl_no': '7987578478', 'dept': 'IT', 'designation': 'Angular Developer' },
    { 'emp_code': 'NG0001', 'emp_name': 'Venkat', 'email': 'Venkat@gmail.com', 'mbl_no': '7987578478', 'dept': 'IT', 'designation': 'Angular Developer' },
    { 'emp_code': 'NG0002', 'emp_name': ' Siva', 'email': ' Siva@gmail.com', 'mbl_no': '7987578478', 'dept': 'IT', 'designation': 'Angular Developer' }

  ]
  open_fileUpload() {
    const options = {
      windowClass: 'custom-ngb-modal-window',
      backdropClass: 'custom-ngb-modal-backdrop',
      size: 'md'
    };
    const modalRef = this.modalService.open(FileUploadComponent, options);

    modalRef.result.then(
      (data) => {
        // Handle modal result
      },
      (error) => {
        if (error === 'Success') {
          // Handle success
        }
      }
    );
  }
  updateEmployee(index: number) {
    this.router.navigate(['/update-employee']);
  }
  onModalClose(): void {
    // this.quotationForm.reset();
    // this.items.clear();
    // this.items.push(this.createItem());  // add one blank row
    this.action = 'create';
    this.submitted = false;
  }
  ngOnInit(): void {
    this.dtOptions = { pagingType: 'full_numbers', pageLength: 10 };

    this.addQuotation = this.fb.group({
      items: this.fb.array([this.createItem()]),
      discount: [0, [Validators.min(0), Validators.max(100)]],
      message: [''],
      termsConditions: [''],
      terms: [''],
      attachment: ['']
    });

    this.addQuotation.get('discount')?.valueChanges.subscribe(() => {
      this.calculateGrandTotal();
    });
  }
  get items(): FormArray {
    return this.addQuotation.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      item: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      tax: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      amount: [{ value: 0, disabled: true }]
    });
  }

  addRow() {
    this.items.push(this.createItem());
  }

  removeRow(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
      this.calculateGrandTotal();
    } else {
      Swal.fire('Notice', 'At least one item must remain in the quotation.', 'info');
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.addQuotation.invalid) return;

    const data = this.addQuotation.getRawValue();
    console.log('Quotation Data:', data);

    // Example API call
    this.api.post('api/Quotation', data).subscribe({
      next: (res) => {
        Swal.fire('Success', 'Quotation added successfully', 'success');
        this.onModalClose();
      },
      error: (err) => {
        Swal.fire('Error', 'Failed to add quotation', 'error');
      }
    });
  }

  updateQuote() { }
  calculateRowAmount(index: number): void {
    const row = this.items.at(index);
    const qty = Number(row.get('quantity')?.value) || 0;
    const price = Number(row.get('price')?.value) || 0;
    const tax = Number(row.get('tax')?.value) || 0;
    const base = qty * price;
    const taxAmt = base * (tax / 100);
    const total = base + taxAmt;

    row.get('amount')?.setValue(total.toFixed(2), { emitEvent: false });

    this.calculateGrandTotal();
  }

  calculateGrandTotal(): void {
    let total = 0;
    this.items.controls.forEach(row => {
      const amt = parseFloat(row.get('amount')?.value) || 0;
      total += amt;
    });
    this.grandTotal = total;

    const discount = this.addQuotation.get('discount')?.value || 0;
    this.discountedAmount = (this.grandTotal * discount) / 100;
    this.finalTotal = this.grandTotal - this.discountedAmount;
  }

  deleteQuote(id: number) {
    Swal.fire({
      position: 'center',
      title: 'Are you sure?',
      text: 'You want to delete this Record.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think'
    }).then((result) => {
      if (result.value) {
        this.api.delete(`api/Quotation/${id}`).subscribe(
          (res: any) => {
            this.delete_quote = res;
            window.location.reload();
            Swal.fire(
              'Removed!',
              'Item removed successfully.',
              'success'
            )
          })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Item is safe',
          'error'
        )
      }
    })
  }
  generateQuotationPDF() {
    const id = 1;
    this.api.get(`api/Quotation/${id}`).subscribe((res: any) => {
      const hdr = res.hdr;
      const item = res.items;

      const bgImage = new Image();
      bgImage.src = 'assets/img/ng.jpg';

      const logoImage = new Image(); // <-- NEW logo image
      logoImage.src = 'assets/img/health.png';

      let imagesLoaded = 0;

      const tryRender = () => {
        imagesLoaded++;
        if (imagesLoaded < 2) return; // Wait for both images

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const addHeaderAndBg = () => {
          doc.addImage(bgImage, 'JPEG', 0, 0, pageWidth, pageHeight);
          doc.addImage(logoImage, 'PNG', pageWidth - 40, 6, 25, 25);


          doc.setFontSize(12);
          doc.setTextColor(255, 170, 0);
          doc.setFont('helvetica', 'bold');
          doc.text('NARAYANA GAYATHRI', 180, 34, { align: 'center' });

          doc.setFontSize(8);
          doc.setTextColor(66, 133, 244);
          doc.setFont('helvetica', 'bold');
          doc.text('INFO SOLUTIONS PRIVATE LIMITED', 180, 37, { align: 'center' });

          doc.setFontSize(11);
          doc.setTextColor(52, 168, 83);
          doc.setFont('helvetica', 'bold');
          doc.text('GST IN: 36AAJCN1320J1ZL', 180, 41, { align: 'center' });

          doc.setDrawColor(0, 128, 0);
          doc.rect(150, 45, 50, 25);
          doc.setFontSize(14);
          doc.setTextColor(66, 133, 244);
          doc.setFont('helvetica', 'bold');
          doc.text('QUOTE', 175, 50, { align: 'center' });

          doc.setFontSize(10);
          doc.setTextColor(0);
          doc.setFont('helvetica', 'normal');
          doc.text('DATE', 152, 55);
          doc.text('QUOTE #', 152, 60);

          doc.text('VALID UNTIL', 152, 65);
          doc.text(this.formatDate(hdr.quoteDate), 195, 55, { align: 'right' });
          doc.text(hdr.quoteNo, 195, 60, { align: 'right' });
          doc.text(this.formatDate(hdr.validUntil), 195, 65, { align: 'right' });
        };

        addHeaderAndBg();

        // From Address
        doc.setFontSize(14);
        doc.setTextColor(255, 170, 0);
        doc.setFont('helvetica', 'bold');
        doc.text('NG INFO SOLUTIONS PVT. LTD.', 14, 50);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0);
        doc.text(
          `D.No: 1-1-189/19/1, Vivek Nagar,\nNear Pendekanti Law College, Chikkadapalli,\nHyderabad, Telangana - 500020\nEmail: nginfosolutions2024@gmail.com\nPhone: 70753 23265`,
          14, 55
        );

        // To Address
        doc.setTextColor(66, 133, 244);
        doc.setFont('helvetica', 'bold');
        doc.text('Quote To:', 14, 85);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text([
          hdr.customerName,
          hdr.customerAddress,
          `Email: ${hdr.customerEmail}`,
          `Phone: ${hdr.customerPhone}`,
        ], 14, 90);

        // Services Section
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('Scope of Services', 14, 115);

        // Build table from ledger names in items array
        const serviceTableBody = item.map((item, index) => [
          (index + 1).toString(),
          item.ledgerName
        ]);
        autoTable(doc, {
          startY: 120,
          head: [['S.No', 'Service Description']],
          body: serviceTableBody,
          styles: { fontSize: 9 },
          headStyles: { fillColor: [0, 102, 204] },
          didDrawPage: (data) => {
            if (data.pageNumber > 1) addHeaderAndBg();
          }
        });


        let afterServicesY = (doc as any).lastAutoTable.finalY + 6;
        if (afterServicesY + 30 > pageHeight) {
          doc.addPage();
          addHeaderAndBg();
          afterServicesY = 20;
        }
        // Pricing table
        autoTable(doc, {
          startY: afterServicesY,
          head: [['Employee Count Range', 'Service Charges (INR)', 'TAX (18%)', 'Grand Total']],
          body: [
            ['0 to 15 Employees', 'RS. 4,999.00/-', 'RS. 899.00/-', 'RS. 5,898.00/-'],
            ['16 to 50 Employees', 'RS. 5,999.00/-', 'RS. 1,079.82/-', 'RS. 7,078.82/-'],
            ['51 to 100 Employees', 'RS. 6,999.00/-', 'RS. 1,259.82/-', 'RS. 8,258.82/-'],
            ['101 to 500 Employees', 'RS. 9,999.00/-', 'RS. 1,799.82/-', 'RS. 11,798.82/-']
          ],
          styles: { fontSize: 10 },
          didDrawPage: (data) => {
            if (data.pageNumber > 1) addHeaderAndBg();
          }
        });
        // Note
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text(
          'Note: All Govt. fees, Department Charges, Consultancy services not added in this Quotation',
          14, afterServicesY + 45
        );
        // Terms & Conditions
        let termsY = (doc as any).lastAutoTable.finalY + 10;
        if (termsY + 30 > pageHeight) {
          doc.addPage();
          addHeaderAndBg();
          termsY = 80;
        }

        doc.setTextColor(0);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Terms & Conditions:', 14, termsY + 5);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const termsText = [
          'Payment terms: Advance 50% upfront, 50% after service delivery',
          'Should you require any clarification or customization, please feel free to contact us.',
          'We look forward to working with your esteemed organization and contributing to your employee welfare initiatives.'
        ];
        let ty = termsY + 10;
        termsText.forEach(line => {
          if (ty > pageHeight - 20) {
            doc.addPage();
            addHeaderAndBg();
            ty = 20;
          }
          doc.text(line, 14, ty);
          ty += 6;
        });

        // Open in new tab
        const pdfBlobUrl = doc.output('bloburl');
        window.open(pdfBlobUrl, '_blank');
      };
      bgImage.onload = tryRender;
      logoImage.onload = tryRender;
    });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN');
  }

  generateQuotationPDF1() {
    const id = 2;
    this.api.get(`api/Quotation/${id}`).subscribe((res: any) => {
      const quote = res.hdr;
      const quoteItem = res.items;

      const bgImage = new Image();
      bgImage.src = 'assets/img/ng.jpg';

      const logoImage = new Image();
      logoImage.src = 'assets/img/health.png';
      let imagesLoaded = 0;
      const tryRender = () => {
        imagesLoaded++;
        if (imagesLoaded < 2) return;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const addHeaderAndBg = () => {
          doc.addImage(bgImage, 'JPEG', 0, 0, pageWidth, pageHeight);

          // Top-right images
          doc.addImage(logoImage, 'PNG', pageWidth - 40, 6, 25, 25);
          doc.setFontSize(12);
          doc.setTextColor(255, 170, 0);
          doc.setFont('helvetica', 'bold');
          doc.text('NARAYANA GAYATHRI', 180, 34, { align: 'center' });

          doc.setFontSize(8);
          doc.setTextColor(66, 133, 244);
          doc.setFont('helvetica', 'bold');
          doc.text('INFO SOLUTIONS PRIVATE LIMITED', 180, 37, { align: 'center' });

          doc.setFontSize(11);
          doc.setTextColor(52, 168, 83);
          doc.setFont('helvetica', 'bold');
          doc.text('GST IN: 36AAJCN1320J1ZL', 180, 41, { align: 'center' });
          // Quote box
          doc.setDrawColor(0, 128, 0);
          doc.rect(150, 45, 50, 25);
          doc.setFontSize(14);
          doc.setTextColor(66, 133, 244);
          doc.setFont('helvetica', 'bold');
          doc.text('QUOTE', 175, 50, { align: 'center' });

          // Quote info
          doc.setFontSize(10);
          doc.setTextColor(0);
          doc.setFont('helvetica', 'normal');
          doc.text('DATE', 152, 55);
          doc.text('QUOTE #', 152, 60);
          doc.text('VALID UNTIL', 152, 65);
          doc.text(formatDateOnly(quote.quoteDate), 195, 55, { align: 'right' });
          doc.text(quote.quoteNo, 195, 60, { align: 'right' });
          doc.text(formatDateOnly(quote.validUntil), 195, 65, { align: 'right' });
        };
        const formatDateOnly = (dateString: string): string => {
          return new Date(dateString).toLocaleDateString('en-GB'); // Output: "18/06/2025"
        };
        // First page
        addHeaderAndBg();
        // Company Info
        const topMargin = 50;
        doc.setFontSize(14);
        doc.setTextColor(255, 170, 0);
        doc.setFont('helvetica', 'bold');
        doc.text('NG INFO SOLUTIONS PVT. LTD.', 15, topMargin);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.text('1-1-189/19/1, Viveka Nagar, Chikkadapally, Hyderabad - 500020', 15, topMargin + 5);
        doc.text('Phone: 70753 23265 | Email: nginfosolutions2024@gmail.com', 15, topMargin + 10);
        doc.text('GSTIN: 36AAFCN1234Q1Z9', 15, topMargin + 15);

        // Customer Info
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 255);
        doc.text('Quote To:', 15, topMargin + 35);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`${quote.customerName}`, 15, topMargin + 40);
        doc.text(`Address: ${quote.customerAddress}`, 15, topMargin + 55);
        doc.text(`Phone: ${quote.customerPhone}`, 15, topMargin + 45);
        doc.text(`Email: ${quote.customerEmail}`, 15, topMargin + 50);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('Scope of Services', 14, 115);
        // Service Table
        autoTable(doc, {
          startY: topMargin + 70,
          head: [['Description', 'Qty', 'Rate', 'Total']],
          body: [
            ...quoteItem.map((item: any) => [
              item.ledgerName || item.service_Name || '',
              item.qty?.toString() || '',
              `RS.${item.rate?.toFixed(2) || '0.00'}`,
              `RS.${item.total?.toFixed(2) || '0.00'}`
            ]),
            [{ content: '', colSpan: 4 }],
            ['Subtotal', '', '', ` ${quote.subtotal.toFixed(2)}`],
            ['CGST (9%)', '', '', ` ${quote.cgst}`],
            ['SGST (9%)', '', '', ` ${quote.sgst}`],
            ['Grand Total', '', '', ` ${quote.grandTotal}`]
          ],
          styles: { fontSize: 10 },
          headStyles: { fillColor: [41, 128, 185] },
          didDrawPage: (data) => {
            if (data.pageNumber > 1) addHeaderAndBg();
          }
        });

        // Note
        let afterTableY = (doc as any).lastAutoTable.finalY + 6;
        if (afterTableY + 20 > pageHeight) {
          doc.addPage();
          addHeaderAndBg();
          afterTableY = 50;
        }

        // doc.setTextColor(200, 0, 0);
        // doc.setFontSize(10);
        // doc.text(
        //   'Note: All Govt. fees, Department Charges, Consultancy services not added in this Quotation',
        //   14, afterTableY
        // );

        // Terms
        let termsY = afterTableY + 15;
        if (termsY + 30 > pageHeight) {
          doc.addPage();
          addHeaderAndBg();
          termsY = 80;
        }

        doc.setTextColor(0);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        // doc.text('Terms & Conditions:', 14, termsY);
        doc.text('Declaration:', 14, termsY);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const termsText = [
          // 'Payment terms: Advance 50% upfront, 50% after service delivery',
          'Should you require any clarification or customization, please feel free to contact us.',
          'We look forward to working with your esteemed organization and contributing to your employee welfare initiatives.'
        ];
        let ty = termsY + 6;
        termsText.forEach(line => {
          if (ty > pageHeight - 20) {
            doc.addPage();
            addHeaderAndBg();
            ty = 20;
          }
          doc.text(line, 14, ty);
          ty += 6;
        });
        const pdfUrl = doc.output('bloburl');
        window.open(doc.output('bloburl'), '_blank');
      };

      // Wait for all images to load
      bgImage.onload = tryRender;
      logoImage.onload = tryRender;
    }
    );
  }
}
