import { AfterViewInit, Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
interface Idata {
  month: number;
  year: number;
}
@Component({
  selector: 'app-payslip-popup',
  templateUrl: './payslip-popup.component.html',
  styleUrls: ['./payslip-popup.component.scss'],
})
export class PayslipPopupComponent  {
  selectedDate: Date = new Date();
  Payslip: FormGroup;
  message: string | undefined;
  errors: string[] = [];
  messages: string[] = [];
  isSelected: any;
  submitted: boolean = false;
  minDate: Date = new Date();
  spinLoader = false;
  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder) { }
  ngOnInit() {
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    this.Payslip = this.formBuilder.group({

      valid_upto: ['', [Validators.required]],
      count: ['', [Validators.required]]
    });

  }


  get f() {
    return this.Payslip?.controls;
  }
  closeModal() {
    this.activeModal.dismiss();
  }
  saveaddPayslip() {
    this.submitted = true;
    if (!this.Payslip.valid) {
      return;
    }
    this.spinLoader = true;
  }
  }


