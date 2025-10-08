import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.client';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { ApiResponse } from 'src/app/models/api-response';
// import * as $ from 'jquery';
declare var $: any;
@Component({
  selector: 'app-leave-balance',
  templateUrl: './leave-balance.component.html',
  styleUrls: ['./leave-balance.component.scss']
})
export class LeaveBalanceComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  action: 'create' | 'update' = 'create';
  addBank: FormGroup;
  form: FormGroup;
  submitted: boolean = false;
  errors: string[] = [];
  spinLoader = false;
  leave_list: any;
  cateId: any;
  employee_List: any[] = [];
  companyFilter: string = '';
  originalBankList: any[] = [];
  filteredBankList: any[] = [];
  employeeId: number = 1;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private util: UtilsServiceService,
    private formBuilder: FormBuilder,
    private api: ApiService
  ) { }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      employee: ['', [Validators.required]],
    });
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50],
      destroy: true,
      processing: true
    };
    this.balanceLeaves();
    this.getemployee_List();

  }
  isStudentFilterVisible: boolean = false;

  toggleCompanyFilter() {
    this.isStudentFilterVisible = !this.isStudentFilterVisible;

    const companyControl = this.form.get('employee');

    if (this.isStudentFilterVisible) {
      companyControl?.enable();
    } else {
      companyControl?.disable();
      companyControl?.setValue('');
    }
  }
  get f() {
    return this.addBank.controls;
  }
  getemployee_List() {
    this.api.get('2').subscribe((res: any) => {
      this.employee_List = res?.data?.data || [];
    });
  }
  balanceLeaves() {
    if (this.form.invalid) return;
    const queryParams = new URLSearchParams({
      employeeId: this.form.get('employee')?.value || '',
    }).toString();
    const statusQuery = this.employeeId; // Get the current selected status
    this.api.get(`api/admin/leave/balance/${statusQuery}`).subscribe((res: ApiResponse<any>) => {
      this.leave_list = res;
      this.dtTrigger.next(null);
      if (($.fn.DataTable as any).isDataTable('#bankTable')) {
      }
      this.dtTrigger.next(null); // initialize new
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
