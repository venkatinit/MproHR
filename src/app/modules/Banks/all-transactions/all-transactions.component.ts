import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/api.client';
import { ApiResponse } from 'src/app/models/api-response';
// import { UtilsService } from 'src/app/utils/utilities-service';
// import * as XLSX from 'xlsx';
@Component({
  selector: 'app-all-transactions',
  templateUrl: './all-transactions.component.html',
  styleUrls: ['./all-transactions.component.scss']
})
export class AllTransactionsComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  cashBook: any[] = [];
  filterForm: FormGroup;
  submitted = false;
  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    // private util: UtilsService
  ) { }

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      from_date: ['2025-03-13', Validators.required],
      to_date: [this.getTodayDate(), Validators.required],// Dynamic today's date
      transType: [''],
      service: [''],
      empCode: [''],
      cash_bank: [''],
    });

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      destroy: true, // Ensures proper reinitialization
      responsive: true,
      // scrollX: true,
    };
    this.getDayBook();
  }
  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Extract YYYY-MM-DD
  }
  get f() {
    return this.filterForm.controls;
  }

  getDayBook() {
    if (this.filterForm.invalid) {
      return;
    }
    const fromDate = this.filterForm.get('from_date')?.value || '';
    const toDate = this.filterForm.get('to_date')?.value || '';
    const txnType = this.filterForm.get('transType')?.value || '';
    const serviceId = this.filterForm.get('service')?.value || '';
    const empCode = this.filterForm.get('empCode')?.value || '';
    const cash_bank_Flag = this.filterForm.get('cash_bank')?.value || '';
    const bank_id = this.filterForm.get('bank_id')?.value || '';

    const queryParams = `fromDate=${fromDate}&toDate=${toDate}&txnType=${txnType}&serviceId=${serviceId}&empCode=${empCode}&cash_bank_Flag=${cash_bank_Flag}&bank_id=${bank_id}`;
    this.api.get(`api/accounting/get-transactions?${queryParams}`).subscribe(
      (res: ApiResponse<any>) => {
        if (res.succeeded) {
          this.cashBook = res.data;

          this.dtTrigger.next(null);  // Ensure DataTable initializes
        } else {
          console.warn("No data found:", res.message);
          this.cashBook = [];
        }
      },
      (error) => {
        console.error("Error fetching tracking:", error);
      }
    );
  }
  // exportToExcel(): void {
  //   const dataToExport = this.cashBook.map((statement) => ({
  //     'Date': statement.txn_Date,
  //     'Receipt Number': statement.receipt_No,
  //     'Transaction Type': statement.txn_type,
  //     'Service Type': statement.headOfAccount, // Concatenate first name and last name
  //     'Receipts': statement.receipts,
  //     'Payments': statement.payments,
  //     // Add more fields as needed
  //   }));
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Investors');
  //   const fileName = 'NG statement' + new Date().getTime() + '.xlsx';
  //   XLSX.writeFile(wb, fileName);
  // }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
