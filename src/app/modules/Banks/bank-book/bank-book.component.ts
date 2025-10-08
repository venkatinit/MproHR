import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/api.client';
import { ApiResponse } from 'src/app/models/api-response';
// import { UtilsService } from 'src/app/utils/utilities-service';

@Component({
  selector: 'app-bank-book',
  templateUrl: './bank-book.component.html',
  styleUrls: ['./bank-book.component.scss']
})
export class BankBookComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  cashBook: any[] = [];
  filterForm: FormGroup;
  submitted = false;
  banks: any[] = [];
  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    // private util: UtilsService
  ) { }

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      from_date: ['2025-09-01', Validators.required], // Fixed date
      to_date: [this.getTodayDate(), Validators.required], // Dynamic today's date
      bank_id: ['', Validators.required]
    });

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      destroy: true, // Ensures proper reinitialization
      responsive: true,
      scrollX: true,
    };
    this.getDayBook();
    this.getBanks();
  }
  isCompanyFilterVisible: boolean = false;
  toggleCompanyFilter() {
    this.isCompanyFilterVisible = !this.isCompanyFilterVisible;
    const companyControl = this.filterForm.get('company');
    if (this.isCompanyFilterVisible) {
      companyControl?.enable();
    } else {
      companyControl?.disable();
      companyControl?.setValue('');
    }
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
    const bankId = this.filterForm.get('bank_id')?.value || '';

    const queryParams = `FromDate=${fromDate}&ToDate=${toDate}&bank_id=${bankId}`;
    this.api.get(`api/accounting/GetBankBook?${queryParams}`).subscribe(
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
  getBanks() {
    this.api.get('api/accounting/banks/all').subscribe((res: ApiResponse<any>) => {
      this.banks = res.data;
      this.dtTrigger.next(0);

    }, (error) => {
      console.log(error);
    })
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
