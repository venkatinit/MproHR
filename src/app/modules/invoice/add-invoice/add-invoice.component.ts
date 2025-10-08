import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.client';
@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.scss']
})
export class AddInvoiceComponent implements OnInit {
  addQuotation!: FormGroup;
  submitted = false;
  spinLoader: any;
  action: any;
  grandTotal = 0;
  finalTotal = 0;
  discountedAmount = 0;
  companyList: any[] = [];
  constructor(private fb: FormBuilder, private api: ApiService) { }
  ngOnInit() {
    this.addQuotation = this.fb.group({
      items: this.fb.array([this.createItem()]),
      company: ['', [Validators.required]],
      customer_name: ['', [Validators.required]],
      invoice_date: [this.getTodayDate(), [Validators.required]],
      terms: ['', [Validators.required]],
      due_date: ['', [Validators.required]],
      sales_person: [''],
      subject: [''],
      discount: [0, [Validators.min(0), Validators.max(100)]],
      message: [''],
      termsConditions: [''],
      term_check: [''],
      attachment: [''],
    });
    this.getCompanyList();

    this.addQuotation.get('terms')?.valueChanges.subscribe((termId: string) => {
      const invoiceDate = new Date(this.addQuotation.get('invoice_date')?.value);
      if (!invoiceDate || isNaN(invoiceDate.getTime())) return;

      let dueDate = new Date(invoiceDate); // clone

      switch (termId) {
        case '1': // Net 15
          dueDate.setDate(dueDate.getDate() + 15);
          break;
        case '2': // Net 30
          dueDate.setDate(dueDate.getDate() + 30);
          break;
        case '3': // Net 45
          dueDate.setDate(dueDate.getDate() + 45);
          break;
        case '4': // Net 60
          dueDate.setDate(dueDate.getDate() + 60);
          break;
        case '5': // Due on receipt
          dueDate = invoiceDate;
          break;
        case '6': // End of this month
          dueDate = new Date(invoiceDate.getFullYear(), invoiceDate.getMonth() + 1, 0);
          break;
        case '7': // End of next month
          dueDate = new Date(invoiceDate.getFullYear(), invoiceDate.getMonth() + 2, 0);
          break;
        case '8': // Custom - keep current due_date or let user pick
          return;
      }

      const formatted = dueDate.toISOString().substring(0, 10); // yyyy-MM-dd
      this.addQuotation.get('due_date')?.setValue(formatted);
    });

    // Recalculate total when discount changes
    this.addQuotation.get('discount')?.valueChanges.subscribe(() => {
      this.calculateGrandTotal();
    });
  }
  getCompanyList() {
    this.api.get('api/company/all').subscribe((res: any) => {
      this.companyList = res?.data?.data || [];
    });
  }
  Terms = [
    { 'id': '1', 'value': 'Net 15' },
    { 'id': '2', 'value': 'Net 30' },
    { 'id': '3', 'value': 'Net 45' },
    { 'id': '4', 'value': 'Net 60' },
    { 'id': '5', 'value': 'Due On Receipt' },
    { 'id': '6', 'value': 'Due End Of The Month' },
    { 'id': '7', 'value': 'Due End Of The Next Month' },
    { 'id': '8', 'value': 'Custom' },
  ]
  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Extract YYYY-MM-DD
  }
  get f() {
    return this.addQuotation.controls;
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

  removeRow(index: number) {
    if (this.items.length > 1) {
      this.items.removeAt(index);
      this.calculateGrandTotal();
    }
  }

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

  onSubmit() {
    this.submitted = true;

    if (this.addQuotation.invalid) return;
  }
  updateQuote() { }

}


