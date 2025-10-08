import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-quotation',
  templateUrl: './add-quotation.component.html',
  styleUrls: ['./add-quotation.component.scss']
})
export class AddQuotationComponent implements OnInit {
  addQuotation!: FormGroup;
  submitted = false;
  spinLoader:any;
  action:any;
  grandTotal = 0;
  finalTotal = 0;
  discountedAmount = 0;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.addQuotation = this.fb.group({
      items: this.fb.array([this.createItem()]),
      discount: [0, [Validators.min(0), Validators.max(100)]],
      message:[''],
      termsConditions:[''],
      terms:[''],
      attachment: [''],

    });

    // Recalculate total when discount changes
    this.addQuotation.get('discount')?.valueChanges.subscribe(() => {
      this.calculateGrandTotal();
    });
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

    console.log('Submitted Items:', this.addQuotation.value.items);
    console.log('Subtotal:', this.grandTotal);
    console.log('Discounted Amount:', this.discountedAmount);
    console.log('Final Total:', this.finalTotal);
  }
  updateQuote(){}
}
