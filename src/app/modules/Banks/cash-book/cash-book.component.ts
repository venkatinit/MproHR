 
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/api.client';
import { ApiResponse } from 'src/app/models/api-response';
// import { UtilsService } from 'src/app/utils/utilities-service';


@Component({
  selector: 'app-cash-book',
  templateUrl: './cash-book.component.html',
  styleUrls: ['./cash-book.component.scss']
})
export class CashBookComponent implements OnInit, OnDestroy {
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
      from_date: ['2025-06-01', Validators.required],
      to_date: [this.getTodayDate(), Validators.required],
    });

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      destroy: true, // Ensures proper reinitialization
      responsive: true,
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
    const queryParams = `FromDate=${fromDate}&ToDate=${toDate}`;
    this.api.get(`api/accounting/GetCashBook?${queryParams}`).subscribe(
      (res: ApiResponse<any>) => {
        this.cashBook = res.data.map((item) => ({
          ...item,
          maxRows: Math.max(item.receipts.length, item.payments.length), // Compute max rows
        }));
      },
      (error) => {
        console.error("Error fetching tracking:", error);
      }
    );
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
